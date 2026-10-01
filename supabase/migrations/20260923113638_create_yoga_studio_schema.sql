/*
# Yoga Studio Schema - Initial Setup

1. New Tables
- `profiles` - extends auth.users with full_name, phone, role (user/admin), created_at
- `trainers` - yoga instructors with name, bio, specialty, image_url, experience
- `classes` - yoga class types (name, description, difficulty, duration, image_url, trainer_id)
- `schedules` - specific class sessions (class_id, trainer_id, day_of_week, start_time, end_time, capacity, price)
- `bookings` - user bookings (user_id, schedule_id, class_id, booking_date, status, payment_status, amount, payment_id, created_at)

2. Security
- RLS enabled on all tables
- profiles: users read/update own profile; admins read all
- trainers: public read; admin write
- classes: public read; admin write
- schedules: public read; admin write
- bookings: users CRUD own bookings; admins read all
- Admin role determined by profiles.role = 'admin' check via security definer function

3. Notes
- Profiles auto-created on signup via trigger
- Admin role assigned manually by SQL for first admin
- Bookings support payment_status field for future Razorpay integration
*/

-- Profiles table (must exist before is_admin function)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now()
);

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Trainers table
CREATE TABLE IF NOT EXISTS public.trainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  bio text NOT NULL DEFAULT '',
  specialty text NOT NULL DEFAULT '',
  image_url text DEFAULT '',
  experience integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Classes table
CREATE TABLE IF NOT EXISTS public.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  difficulty text NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'all')),
  duration_min integer NOT NULL DEFAULT 60,
  image_url text DEFAULT '',
  trainer_id uuid REFERENCES public.trainers(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Schedules table
CREATE TABLE IF NOT EXISTS public.schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  trainer_id uuid REFERENCES public.trainers(id) ON DELETE SET NULL,
  day_of_week text NOT NULL CHECK (day_of_week IN ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')),
  start_time text NOT NULL,
  end_time text NOT NULL,
  capacity integer NOT NULL DEFAULT 15,
  price numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  schedule_id uuid NOT NULL REFERENCES public.schedules(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  booking_date date NOT NULL,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  amount numeric(10,2) NOT NULL DEFAULT 0,
  payment_id text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT
  TO authenticated USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Trainers policies
DROP POLICY IF EXISTS "trainers_select_public" ON public.trainers;
CREATE POLICY "trainers_select_public" ON public.trainers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "trainers_insert_admin" ON public.trainers;
CREATE POLICY "trainers_insert_admin" ON public.trainers FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "trainers_update_admin" ON public.trainers;
CREATE POLICY "trainers_update_admin" ON public.trainers FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "trainers_delete_admin" ON public.trainers;
CREATE POLICY "trainers_delete_admin" ON public.trainers FOR DELETE
  TO authenticated USING (public.is_admin());

-- Classes policies
DROP POLICY IF EXISTS "classes_select_public" ON public.classes;
CREATE POLICY "classes_select_public" ON public.classes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "classes_insert_admin" ON public.classes;
CREATE POLICY "classes_insert_admin" ON public.classes FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "classes_update_admin" ON public.classes;
CREATE POLICY "classes_update_admin" ON public.classes FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "classes_delete_admin" ON public.classes;
CREATE POLICY "classes_delete_admin" ON public.classes FOR DELETE
  TO authenticated USING (public.is_admin());

-- Schedules policies
DROP POLICY IF EXISTS "schedules_select_public" ON public.schedules;
CREATE POLICY "schedules_select_public" ON public.schedules FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "schedules_insert_admin" ON public.schedules;
CREATE POLICY "schedules_insert_admin" ON public.schedules FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "schedules_update_admin" ON public.schedules;
CREATE POLICY "schedules_update_admin" ON public.schedules FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "schedules_delete_admin" ON public.schedules;
CREATE POLICY "schedules_delete_admin" ON public.schedules FOR DELETE
  TO authenticated USING (public.is_admin());

-- Bookings policies
DROP POLICY IF EXISTS "bookings_select_own" ON public.bookings;
CREATE POLICY "bookings_select_own" ON public.bookings FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "bookings_insert_own" ON public.bookings;
CREATE POLICY "bookings_insert_own" ON public.bookings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "bookings_update_own" ON public.bookings;
CREATE POLICY "bookings_update_own" ON public.bookings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id OR public.is_admin()) WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "bookings_delete_own" ON public.bookings;
CREATE POLICY "bookings_delete_own" ON public.bookings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_classes_trainer ON public.classes(trainer_id);
CREATE INDEX IF NOT EXISTS idx_schedules_class ON public.schedules(class_id);
CREATE INDEX IF NOT EXISTS idx_schedules_trainer ON public.schedules(trainer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_schedule ON public.bookings(schedule_id);
CREATE INDEX IF NOT EXISTS idx_bookings_class ON public.bookings(class_id);
