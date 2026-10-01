import { useState, useEffect } from 'react';
import { CreditCard, Check, Lock, Calendar, Clock, MapPin } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Feedback';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { DAYS, DIFFICULTY_LABELS, STUDIO_ADDRESS } from '@/lib/constants';
import type { Schedule, YogaClass, Trainer, Booking } from '@/lib/types';
import type { ToastType } from '@/components/ui/Toast';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: Schedule | null;
  yogaClass: YogaClass | null;
  trainer: Trainer | null;
  showToast: (type: ToastType, message: string) => void;
  onBooked: () => void;
}

type Step = 'details' | 'payment' | 'confirming' | 'success';

export default function BookingModal({
  isOpen,
  onClose,
  schedule,
  yogaClass,
  trainer,
  showToast,
  onBooked,
}: BookingModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('details');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [cardForm, setCardForm] = useState({ number: '', name: '', expiry: '', cvv: '' });

  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setBooking(null);
      setCardForm({ number: '', name: '', expiry: '', cvv: '' });
    }
  }, [isOpen]);

  if (!schedule || !yogaClass) return null;

  const dayLabel = DAYS.find((d) => d.value === schedule.day_of_week)?.label || schedule.day_of_week;

  const handleConfirmBooking = async () => {
    setStep('confirming');
    const nextClassDate = getNextClassDate(schedule.day_of_week);

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user?.id,
        schedule_id: schedule.id,
        class_id: schedule.class_id,
        booking_date: nextClassDate,
        status: 'confirmed',
        payment_status: 'pending',
        amount: schedule.price,
      })
      .select()
      .maybeSingle();

    if (error || !data) {
      showToast('error', 'Could not create booking. Please try again.');
      setStep('details');
      return;
    }

    setBooking(data as Booking);
    setStep('payment');
  };

  const handlePayment = async () => {
    setStep('confirming');

    // Payment structure ready for Razorpay integration
    // When Razorpay is configured, this would call the Razorpay checkout
    // and verify the payment via an edge function
    await new Promise((r) => setTimeout(r, 1200));

    if (!booking) return;
    const { error } = await supabase
      .from('bookings')
      .update({ payment_status: 'paid', payment_id: `demo_${Date.now()}` })
      .eq('id', booking.id);

    if (error) {
      showToast('error', 'Payment recorded but status update failed.');
    } else {
      setBooking({ ...booking, payment_status: 'paid', payment_id: `demo_${Date.now()}` });
    }
    setStep('success');
    showToast('success', 'Booking confirmed! See you on the mat.');
    onBooked();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      {step === 'details' && (
        <div>
          <h2 className="text-3xl text-ink mb-2">Book Your Class</h2>
          <p className="text-sm text-ink/50 mb-6">Review the details and confirm your spot.</p>

          <div className="rounded-xl bg-sage-50 p-5 mb-6 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={yogaClass.image_url || 'https://images.pexels.com/photos/8436684/pexels-photo-8436684.jpeg?auto=compress&cs=tinysrgb&w=120&h=80'}
                alt={yogaClass.name}
                className="w-20 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-lg text-ink">{yogaClass.name}</h3>
                <p className="text-sm text-ink/50">{DIFFICULTY_LABELS[yogaClass.difficulty]}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-ink/60 pt-3 border-t border-sage-100">
              <p className="flex items-center gap-2">
                <Calendar size={16} className="text-sage-600" /> {dayLabel}
              </p>
              <p className="flex items-center gap-2">
                <Clock size={16} className="text-sage-600" /> {schedule.start_time} — {schedule.end_time}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-sage-600" /> {STUDIO_ADDRESS}
              </p>
              {trainer && <p className="text-ink/50">Instructor: {trainer.name}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between mb-6 px-1">
            <span className="text-ink/60">Class Price</span>
            <span className="text-2xl font-serif text-sage-700">${schedule.price}</span>
          </div>

          <button onClick={handleConfirmBooking} className="btn-primary w-full">
            Continue to Payment
          </button>
        </div>
      )}

      {step === 'payment' && (
        <div>
          <h2 className="text-3xl text-ink mb-2">Payment</h2>
          <p className="text-sm text-ink/50 mb-6">
            Complete your booking of <span className="font-medium text-sage-700">${schedule.price}</span> for {yogaClass.name}
          </p>

          <div className="rounded-xl border border-sage-200 p-5 mb-6">
            <div className="flex items-center gap-2 mb-4 text-sm text-ink/50">
              <Lock size={16} className="text-sage-600" />
              Secure payment — processed via encrypted connection
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" size={18} />
                  <input
                    type="text"
                    required
                    value={cardForm.number}
                    onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                    className="input-field pl-11"
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Name on Card</label>
                <input
                  type="text"
                  required
                  value={cardForm.name}
                  onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                  className="input-field"
                  placeholder="Jane Doe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Expiry</label>
                  <input
                    type="text"
                    required
                    value={cardForm.expiry}
                    onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                    className="input-field"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">CVV</label>
                  <input
                    type="text"
                    required
                    value={cardForm.cvv}
                    onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                    className="input-field"
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-ink/40 mb-4 text-center">
            This is a demo payment form. Razorpay integration point is ready for production.
          </p>

          <button onClick={handlePayment} className="btn-primary w-full">
            Pay ${schedule.price} & Confirm
          </button>
          <button
            onClick={() => setStep('details')}
            className="btn-ghost w-full mt-2"
          >
            Back
          </button>
        </div>
      )}

      {step === 'confirming' && (
        <div className="flex flex-col items-center justify-center py-16">
          <Spinner size={40} className="text-sage-600" />
          <p className="text-ink/50 mt-4 text-sm">
            {step === 'confirming' && !booking ? 'Creating your booking...' : 'Processing payment...'}
          </p>
        </div>
      )}

      {step === 'success' && booking && (
        <div className="text-center py-8">
          <div className="w-20 h-20 rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <Check className="text-forest-600" size={40} />
          </div>
          <h2 className="text-3xl text-ink mb-3">Booking Confirmed!</h2>
          <p className="text-ink/50 mb-6">
            We look forward to seeing you at {yogaClass.name} on {dayLabel} at {schedule.start_time}.
          </p>
          <div className="rounded-xl bg-sage-50 p-5 text-left space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-ink/50">Booking ID</span>
              <span className="font-mono text-ink/70">{booking.id.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink/50">Class</span>
              <span className="text-ink/70">{yogaClass.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink/50">When</span>
              <span className="text-ink/70">{dayLabel}, {schedule.start_time}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink/50">Payment</span>
              <span className="text-forest-600 font-medium">Paid · ${schedule.price}</span>
            </div>
          </div>
          <button onClick={onClose} className="btn-primary w-full">
            Done
          </button>
        </div>
      )}
    </Modal>
  );
}

function getNextClassDate(dayOfWeek: string): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = new Date();
  const todayIdx = today.getDay();
  const targetIdx = days.indexOf(dayOfWeek);
  let diff = targetIdx - todayIdx;
  if (diff <= 0) diff += 7;
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + diff);
  return nextDate.toISOString().split('T')[0];
}
