import { useEffect, useState } from 'react';
import { Clock, Calendar as CalIcon, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { DAYS } from '@/lib/constants';
import type { Schedule, YogaClass, Trainer } from '@/lib/types';

interface ScheduleSectionProps {
  onBookSchedule: (schedule: Schedule) => void;
}

export default function ScheduleSection({ onBookSchedule }: ScheduleSectionProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [classes, setClasses] = useState<Record<string, YogaClass>>({});
  const [trainers, setTrainers] = useState<Record<string, Trainer>>({});
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('monday');
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    async function loadData() {
      const [schedRes, classRes, trainerRes, bookingRes] = await Promise.all([
        supabase.from('schedules').select('*'),
        supabase.from('classes').select('*'),
        supabase.from('trainers').select('*'),
        supabase.from('bookings').select('schedule_id, status').eq('status', 'confirmed'),
      ]);

      const classMap: Record<string, YogaClass> = {};
      (classRes.data || []).forEach((c: YogaClass) => {
        classMap[c.id] = c;
      });
      const trainerMap: Record<string, Trainer> = {};
      (trainerRes.data || []).forEach((t: Trainer) => {
        trainerMap[t.id] = t;
      });
      const counts: Record<string, number> = {};
      (bookingRes.data || []).forEach((b: { schedule_id: string }) => {
        counts[b.schedule_id] = (counts[b.schedule_id] || 0) + 1;
      });

      setClasses(classMap);
      setTrainers(trainerMap);
      setBookingCounts(counts);
      setSchedules((schedRes.data || []) as Schedule[]);
      setLoading(false);
    }
    loadData();
  }, []);

  const daySchedules = schedules
    .filter((s) => s.day_of_week === activeDay)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const availableDays = DAYS.filter((d) =>
    schedules.some((s) => s.day_of_week === d.value)
  );

  return (
    <section id="schedule" className="py-24 md:py-32 bg-cream">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-6 ${visible ? 'visible' : ''} reveal`}
      >
        <div className="text-center mb-12">
          <p className="section-label mb-4 justify-center">
            <span className="w-8 h-px bg-sage-400 inline-block" />
            Weekly Schedule
            <span className="w-8 h-px bg-sage-400 inline-block" />
          </p>
          <h2 className="text-4xl md:text-5xl text-ink mb-4">
            Find your <span className="italic text-sage-600">time to practice</span>
          </h2>
          <p className="text-ink/50 max-w-2xl mx-auto">
            Browse our weekly calendar and reserve your spot in any session.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {availableDays.map((day) => (
            <button
              key={day.value}
              onClick={() => setActiveDay(day.value)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
                activeDay === day.value
                  ? 'bg-sage-600 text-cream shadow-lg shadow-sage-900/15'
                  : 'bg-sage-50 text-ink/60 hover:bg-sage-100'
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-sage-50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : daySchedules.length === 0 ? (
          <p className="text-center text-ink/40 py-12">No classes scheduled for this day.</p>
        ) : (
          <div className="space-y-3 max-w-4xl mx-auto">
            {daySchedules.map((sched, i) => {
              const cls = classes[sched.class_id];
              const trainer = sched.trainer_id ? trainers[sched.trainer_id] : null;
              const booked = bookingCounts[sched.id] || 0;
              const spotsLeft = sched.capacity - booked;
              return (
                <div
                  key={sched.id}
                  className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-xl transition-all duration-300"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-center gap-4 sm:w-40 flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center flex-shrink-0">
                      <CalIcon className="text-sage-600" size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{sched.start_time}</p>
                      <p className="text-xs text-ink/40">{sched.end_time}</p>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg text-ink truncate">
                      {cls?.name || 'Unknown Class'}
                    </h4>
                    <p className="text-sm text-ink/50 truncate">
                      {trainer?.name || 'TBA'} · {cls?.duration_min || 60} min
                    </p>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-sage-700">
                        ${sched.price}
                      </p>
                      <p className="text-xs text-ink/40 flex items-center gap-1 justify-end">
                        <Users size={12} />
                        {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}
                      </p>
                    </div>
                    <button
                      onClick={() => onBookSchedule(sched)}
                      disabled={spotsLeft <= 0}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                        spotsLeft > 0
                          ? 'bg-sage-600 text-cream hover:bg-sage-700 hover:shadow-lg'
                          : 'bg-sage-100 text-ink/30 cursor-not-allowed'
                      }`}
                    >
                      {spotsLeft > 0 ? 'Book' : 'Full'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
