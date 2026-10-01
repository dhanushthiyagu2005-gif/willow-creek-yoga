export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  created_at: string;
}

export interface Trainer {
  id: string;
  name: string;
  bio: string;
  specialty: string;
  image_url: string;
  experience: number;
  created_at: string;
}

export type ClassDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'all';

export interface YogaClass {
  id: string;
  name: string;
  description: string;
  difficulty: ClassDifficulty;
  duration_min: number;
  image_url: string;
  trainer_id: string | null;
  created_at: string;
  trainer?: Trainer | null;
}

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface Schedule {
  id: string;
  class_id: string;
  trainer_id: string | null;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  capacity: number;
  price: number;
  created_at: string;
  yoga_class?: YogaClass | null;
  trainer?: Trainer | null;
  booking_count?: number;
}

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Booking {
  id: string;
  user_id: string;
  schedule_id: string;
  class_id: string;
  booking_date: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  amount: number;
  payment_id: string | null;
  created_at: string;
  schedule?: Schedule | null;
  yoga_class?: YogaClass | null;
  trainer?: Trainer | null;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
}
