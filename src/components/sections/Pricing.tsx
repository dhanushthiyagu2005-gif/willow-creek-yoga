import { Check, Sparkles } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { PRICING_PLANS } from '@/lib/constants';

interface PricingProps {
  onSelectPlan: (planId: string) => void;
}

export default function Pricing({ onSelectPlan }: PricingProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="pricing" className="py-24 md:py-32 bg-sage-50/50">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-6 ${visible ? 'visible' : ''} reveal`}
      >
        <div className="text-center mb-16">
          <p className="section-label mb-4 justify-center">
            <span className="w-8 h-px bg-sage-400 inline-block" />
            Pricing & Plans
            <span className="w-8 h-px bg-sage-400 inline-block" />
          </p>
          <h2 className="text-4xl md:text-5xl text-ink mb-4">
            Invest in your <span className="italic text-sage-600">wellbeing</span>
          </h2>
          <p className="text-ink/50 max-w-2xl mx-auto">
            Flexible options for every practice. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan, i) => (
            <div
              key={plan.id}
              className={`relative card p-8 flex flex-col ${
                plan.popular ? 'ring-2 ring-sage-500 lg:scale-105 shadow-2xl shadow-sage-900/10' : ''
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sage-600 text-cream px-4 py-1.5 rounded-full text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-lg">
                  <Sparkles size={14} />
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl text-ink mb-2">{plan.name}</h3>
              <p className="text-sm text-ink/50 mb-6">{plan.description}</p>
              <div className="mb-8">
                <span className="text-5xl font-serif text-sage-700">${plan.price}</span>
                <span className="text-sm text-ink/40 ml-2">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-ink/60">
                    <Check size={18} className="text-sage-600 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onSelectPlan(plan.id)}
                className={`w-full ${
                  plan.popular ? 'btn-primary' : 'btn-outline'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-ink/40 mt-10">
          All plans include mats, props, and complimentary tea after class.
        </p>
      </div>
    </section>
  );
}
