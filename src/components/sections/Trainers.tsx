import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Sparkles } from 'lucide-react';
import type { Trainer } from '@/lib/types';

export default function Trainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    supabase
      .from('trainers')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setTrainers((data || []) as Trainer[]);
        setLoading(false);
      });
  }, []);

  return (
    <section id="trainers" className="py-24 md:py-32 bg-forest-950 text-cream relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-sage-900/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sage-800/20 rounded-full blur-3xl" />

      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-6 relative ${visible ? 'visible' : ''} reveal`}
      >
        <div className="text-center mb-16">
          <p className="section-label mb-4 justify-center !text-sage-300">
            <span className="w-8 h-px bg-sage-400/50 inline-block" />
            Meet Our Teachers
            <span className="w-8 h-px bg-sage-400/50 inline-block" />
          </p>
          <h2 className="text-4xl md:text-5xl text-cream mb-4">
            Guides on your <span className="italic text-sage-300">path</span>
          </h2>
          <p className="text-cream/50 max-w-2xl mx-auto">
            Our certified instructors bring warmth, wisdom, and decades of combined experience
            to every session.
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-cream/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trainers.map((trainer, i) => (
              <div
                key={trainer.id}
                className="group"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] mb-5">
                  <img
                    src={trainer.image_url || 'https://images.pexels.com/photos/6739125/pexels-photo-6739125.jpeg?auto=compress&cs=tinysrgb&w=400&h=533'}
                    alt={trainer.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-xs text-sage-300 uppercase tracking-wider mb-1">
                      {trainer.specialty}
                    </p>
                    <h3 className="text-xl text-cream">{trainer.name}</h3>
                  </div>
                  {trainer.experience > 0 && (
                    <div className="absolute top-4 right-4 bg-cream/10 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-cream/80">
                      {trainer.experience} yrs
                    </div>
                  )}
                </div>
                <p className="text-sm text-cream/50 leading-relaxed line-clamp-3">
                  {trainer.bio}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
