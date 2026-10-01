import { useEffect, useState } from 'react';
import { Clock, BarChart3, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { CardSkeleton } from '@/components/ui/Feedback';
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '@/lib/constants';
import type { YogaClass, Trainer } from '@/lib/types';

interface ClassesProps {
  onBookClass: (cls: YogaClass) => void;
}

export default function Classes({ onBookClass }: ClassesProps) {
  const [classes, setClasses] = useState<YogaClass[]>([]);
  const [trainers, setTrainers] = useState<Record<string, Trainer>>({});
  const [loading, setLoading] = useState(true);
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    async function loadData() {
      const [classRes, trainerRes] = await Promise.all([
        supabase.from('classes').select('*').order('name'),
        supabase.from('trainers').select('*'),
      ]);
      const trainerMap: Record<string, Trainer> = {};
      (trainerRes.data || []).forEach((t: Trainer) => {
        trainerMap[t.id] = t;
      });
      setTrainers(trainerMap);
      setClasses((classRes.data || []) as YogaClass[]);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <section id="classes" className="py-24 md:py-32 bg-sage-50/50">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-6 ${visible ? 'visible' : ''} reveal`}
      >
        <div className="text-center mb-16">
          <p className="section-label mb-4 justify-center">
            <span className="w-8 h-px bg-sage-400 inline-block" />
            Our Classes
            <span className="w-8 h-px bg-sage-400 inline-block" />
          </p>
          <h2 className="text-4xl md:text-5xl text-ink mb-4">
            Practices for every <span className="italic text-sage-600">journey</span>
          </h2>
          <p className="text-ink/50 max-w-2xl mx-auto">
            From gentle restorative sessions to dynamic power flows, find the practice
            that meets you where you are.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((cls, i) => {
              const trainer = cls.trainer_id ? trainers[cls.trainer_id] : null;
              return (
                <div
                  key={cls.id}
                  className="card overflow-hidden group hover:-translate-y-2"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={cls.image_url || 'https://images.pexels.com/photos/8436684/pexels-photo-8436684.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'}
                      alt={cls.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                    <span
                      className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[cls.difficulty]}`}
                    >
                      {DIFFICULTY_LABELS[cls.difficulty]}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl text-ink mb-2">{cls.name}</h3>
                    {trainer && (
                      <p className="text-sm text-sage-600 mb-3">with {trainer.name}</p>
                    )}
                    <p className="text-sm text-ink/55 leading-relaxed mb-5 line-clamp-3">
                      {cls.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-ink/50 mb-5">
                      <span className="flex items-center gap-1.5">
                        <Clock size={16} className="text-sage-500" />
                        {cls.duration_min} min
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BarChart3 size={16} className="text-sage-500" />
                        {DIFFICULTY_LABELS[cls.difficulty]}
                      </span>
                    </div>
                    <button
                      onClick={() => onBookClass(cls)}
                      className="flex items-center gap-2 text-sage-700 font-medium text-sm group/btn"
                    >
                      Book this class
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover/btn:translate-x-1"
                      />
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
