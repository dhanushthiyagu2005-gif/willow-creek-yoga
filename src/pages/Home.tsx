import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Schedule, YogaClass, Trainer } from '@/lib/types';
import type { ToastType } from '@/components/ui/Toast';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Classes from '@/components/sections/Classes';
import ScheduleSection from '@/components/sections/ScheduleSection';
import Trainers from '@/components/sections/Trainers';
import Pricing from '@/components/sections/Pricing';
import Contact from '@/components/sections/Contact';
import BookingModal from '@/components/BookingModal';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  showToast: (type: ToastType, message: string) => void;
}

export default function Home({ showToast }: HomeProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedClass, setSelectedClass] = useState<YogaClass | null>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [classes, setClasses] = useState<YogaClass[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from('classes').select('*'),
      supabase.from('trainers').select('*'),
    ]).then(([c, t]) => {
      setClasses((c.data || []) as YogaClass[]);
      setTrainers((t.data || []) as Trainer[]);
    });
  }, []);

  const classMap: Record<string, YogaClass> = {};
  classes.forEach((c) => (classMap[c.id] = c));
  const trainerMap: Record<string, Trainer> = {};
  trainers.forEach((t) => (trainerMap[t.id] = t));

  const handleBookClass = (cls: YogaClass) => {
    if (!user) {
      showToast('info', 'Please sign in to book a class.');
      navigate('/login');
      return;
    }
    // Find the first schedule for this class
    supabase
      .from('schedules')
      .select('*')
      .eq('class_id', cls.id)
      .order('day_of_week')
      .then(({ data }) => {
        if (data && data.length > 0) {
          const sched = data[0] as Schedule;
          setSelectedSchedule(sched);
          setSelectedClass(cls);
          setSelectedTrainer(sched.trainer_id ? trainerMap[sched.trainer_id] || null : null);
          setBookingModalOpen(true);
        } else {
          showToast('info', 'No scheduled sessions for this class yet. Check the schedule tab.');
          document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' });
        }
      });
  };

  const handleBookSchedule = (sched: Schedule) => {
    if (!user) {
      showToast('info', 'Please sign in to book a class.');
      navigate('/login');
      return;
    }
    setSelectedSchedule(sched);
    setSelectedClass(classMap[sched.class_id] || null);
    setSelectedTrainer(sched.trainer_id ? trainerMap[sched.trainer_id] || null : null);
    setBookingModalOpen(true);
  };

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      showToast('info', 'Please sign in to get started.');
      navigate('/signup');
      return;
    }
    navigate('/dashboard');
  };

  return (
    <>
      <Hero />
      <About />
      <Classes onBookClass={handleBookClass} />
      <ScheduleSection onBookSchedule={handleBookSchedule} />
      <Trainers />
      <Pricing onSelectPlan={handleSelectPlan} />
      <Contact showToast={showToast} />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        schedule={selectedSchedule}
        yogaClass={selectedClass}
        trainer={selectedTrainer}
        showToast={showToast}
        onBooked={() => {}}
      />
    </>
  );
}
