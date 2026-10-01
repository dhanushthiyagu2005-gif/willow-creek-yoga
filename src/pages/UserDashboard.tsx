import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, CheckCircle2, XCircle, CreditCard,
  LayoutDashboard, CalendarDays, Sparkles, TrendingUp
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Spinner, EmptyState } from '@/components/ui/Feedback';
import { DAYS, DIFFICULTY_LABELS, STUDIO_ADDRESS } from '@/lib/constants';
import type { Booking, Schedule, YogaClass, Trainer } from '@/lib/types';
import type { ToastType } from '@/components/ui/Toast';
import BookingModal from '@/components/BookingModal';

interface UserDashboardProps {
  showToast: (type: ToastType, message: string) => void;
}

export default function UserDashboard({ showToast }: UserDashboardProps) {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [classes, setClasses] = useState<YogaClass[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedClass, setSelectedClass] = useState<YogaClass | null>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'browse'>('overview');

  const loadData = useCallback(async () => {
    if (!user) return;
    const [bookingRes, schedRes, classRes, trainerRes] = await Promise.all([
      supabase.from('bookings').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('schedules').select('*'),
      supabase.from('classes').select('*'),
      supabase.from('trainers').select('*'),
    ]);
    setBookings((bookingRes.data || []) as Booking[]);
    setSchedules((schedRes.data || []) as Schedule[]);
    setClasses((classRes.data || []) as YogaClass[]);
    setTrainers((trainerRes.data || []) as Trainer[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const classMap: Record<string, YogaClass> = {};
  classes.forEach((c) => (classMap[c.id] = c));
  const scheduleMap: Record<string, Schedule> = {};
  schedules.forEach((s) => (scheduleMap[s.id] = s));
  const trainerMap: Record<string, Trainer> = {};
  trainers.forEach((t) => (trainerMap[t.id] = t));

  const handleCancelBooking = async (id: string) => {
    const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id);
    if (error) {
      showToast('error', 'Could not cancel booking.');
    } else {
      showToast('success', 'Booking cancelled.');
      loadData();
    }
  };

  const openBookingModal = (sched: Schedule) => {
    const cls = classMap[sched.class_id];
    const trainer = sched.trainer_id ? trainerMap[sched.trainer_id] : null;
    setSelectedSchedule(sched);
    setSelectedClass(cls || null);
    setSelectedTrainer(trainer || null);
    setBookingModalOpen(true);
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' && new Date(b.booking_date) >= new Date(new Date().toDateString())
  );
  const pastBookings = bookings.filter(
    (b) => b.status !== 'confirmed' || new Date(b.booking_date) < new Date(new Date().toDateString())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream pt-20">
        <Spinner size={40} className="text-sage-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-50/30 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="section-label mb-3">
            <span className="w-8 h-px bg-sage-400 inline-block" />
            Dashboard
          </p>
          <h1 className="text-4xl text-ink mb-2">
            Welcome, <span className="italic text-sage-600">{profile?.full_name || 'friend'}</span>
          </h1>
          <p className="text-ink/50">Manage your bookings and discover new classes.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-ink/50">Total Bookings</span>
              <CalendarDays className="text-sage-500" size={20} />
            </div>
            <p className="text-3xl font-serif text-sage-700">{bookings.length}</p>
          </div>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-ink/50">Upcoming</span>
              <Sparkles className="text-sage-500" size={20} />
            </div>
            <p className="text-3xl font-serif text-sage-700">{upcomingBookings.length}</p>
          </div>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-ink/50">Total Spent</span>
              <TrendingUp className="text-sage-500" size={20} />
            </div>
            <p className="text-3xl font-serif text-sage-700">
              ${bookings.filter((b) => b.payment_status === 'paid').reduce((sum, b) => sum + Number(b.amount), 0).toFixed(0)}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-sage-100">
          {[
            { key: 'overview', label: 'Overview', icon: LayoutDashboard },
            { key: 'bookings', label: 'My Bookings', icon: Calendar },
            { key: 'browse', label: 'Browse Classes', icon: Sparkles },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium tracking-wide border-b-2 transition-all ${
                activeTab === tab.key
                  ? 'border-sage-600 text-sage-700'
                  : 'border-transparent text-ink/50 hover:text-ink/70'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl text-ink mb-4">Upcoming Sessions</h2>
              {upcomingBookings.length === 0 ? (
                <EmptyState
                  icon={<Calendar size={40} />}
                  title="No upcoming sessions"
                  message="Browse our classes and book your next practice."
                  action={
                    <button onClick={() => setActiveTab('browse')} className="btn-primary">
                      Browse Classes
                    </button>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {upcomingBookings.map((booking) => {
                    const sched = scheduleMap[booking.schedule_id];
                    const cls = classMap[booking.class_id];
                    const dayLabel = sched ? DAYS.find((d) => d.value === sched.day_of_week)?.label : '';
                    return (
                      <div key={booking.id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-sage-50 flex flex-col items-center justify-center flex-shrink-0">
                          <span className="text-xs text-sage-600 uppercase">{new Date(booking.booking_date).toLocaleDateString('en-US', { month: 'short' })}</span>
                          <span className="text-lg font-serif text-sage-700">{new Date(booking.booking_date).getDate()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg text-ink">{cls?.name || 'Yoga Class'}</h4>
                          <p className="text-sm text-ink/50">
                            {dayLabel} · {sched?.start_time} · {sched?.end_time}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              booking.payment_status === 'paid'
                                ? 'bg-forest-100 text-forest-700'
                                : 'bg-sand-100 text-sand-700'
                            }`}>
                              {booking.payment_status === 'paid' ? 'Paid' : 'Payment Pending'}
                            </span>
                            <span className="text-xs text-ink/40">${booking.amount}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="text-sm text-clay-600 hover:text-clay-700 font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bookings */}
        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-2xl text-ink mb-4">Booking History</h2>
            {bookings.length === 0 ? (
              <EmptyState
                icon={<Calendar size={40} />}
                title="No bookings yet"
                message="Your booking history will appear here."
                action={<Link to="/" className="btn-primary">Explore Classes</Link>}
              />
            ) : (
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-sage-100 text-left text-ink/50">
                        <th className="px-5 py-3 font-medium">Class</th>
                        <th className="px-5 py-3 font-medium">Date</th>
                        <th className="px-5 py-3 font-medium">Time</th>
                        <th className="px-5 py-3 font-medium">Amount</th>
                        <th className="px-5 py-3 font-medium">Payment</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => {
                        const sched = scheduleMap[booking.schedule_id];
                        const cls = classMap[booking.class_id];
                        return (
                          <tr key={booking.id} className="border-b border-sage-50 hover:bg-sage-50/40">
                            <td className="px-5 py-4 text-ink/70">{cls?.name || '—'}</td>
                            <td className="px-5 py-4 text-ink/50">
                              {new Date(booking.booking_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </td>
                            <td className="px-5 py-4 text-ink/50">{sched?.start_time || '—'}</td>
                            <td className="px-5 py-4 text-ink/50">${booking.amount}</td>
                            <td className="px-5 py-4">
                              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                booking.payment_status === 'paid'
                                  ? 'bg-forest-100 text-forest-700'
                                  : booking.payment_status === 'failed'
                                  ? 'bg-clay-100 text-clay-700'
                                  : 'bg-sand-100 text-sand-700'
                              }`}>
                                {booking.payment_status}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                booking.status === 'confirmed'
                                  ? 'bg-sage-100 text-sage-700'
                                  : booking.status === 'cancelled'
                                  ? 'bg-clay-100 text-clay-700'
                                  : 'bg-forest-100 text-forest-700'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Browse */}
        {activeTab === 'browse' && (
          <div>
            <h2 className="text-2xl text-ink mb-4">Available Classes</h2>
            {schedules.length === 0 ? (
              <EmptyState icon={<Sparkles size={40} />} title="No classes available" />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schedules.map((sched) => {
                  const cls = classMap[sched.class_id];
                  if (!cls) return null;
                  const trainer = sched.trainer_id ? trainerMap[sched.trainer_id] : null;
                  const dayLabel = DAYS.find((d) => d.value === sched.day_of_week)?.short;
                  return (
                    <div key={sched.id} className="card overflow-hidden hover:-translate-y-1">
                      <div className="relative h-40">
                        <img src={cls.image_url} alt={cls.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                        <span className="absolute top-3 right-3 bg-cream/90 text-ink text-xs px-3 py-1 rounded-full font-medium">
                          ${sched.price}
                        </span>
                      </div>
                      <div className="p-5">
                        <h4 className="text-lg text-ink mb-1">{cls.name}</h4>
                        <p className="text-sm text-ink/50 mb-3">
                          {dayLabel} · {sched.start_time}
                        </p>
                        <p className="text-xs text-ink/40 mb-4 line-clamp-2">{cls.description}</p>
                        <button onClick={() => openBookingModal(sched)} className="btn-primary w-full !py-2.5 text-sm">
                          Book This Class
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        schedule={selectedSchedule}
        yogaClass={selectedClass}
        trainer={selectedTrainer}
        showToast={showToast}
        onBooked={loadData}
      />
    </div>
  );
}
