import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Leaf, Heart, Sun } from 'lucide-react';

export default function About() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  const values = [
    {
      icon: Leaf,
      title: 'Mindful Movement',
      text: 'Every posture is an opportunity to listen deeply. We move not to achieve, but to arrive.',
    },
    {
      icon: Heart,
      title: 'Inclusive Community',
      text: 'Every body is a yoga body. We hold space for all ages, abilities, and backgrounds.',
    },
    {
      icon: Sun,
      title: 'Holistic Wellness',
      text: 'Yoga extends beyond the mat. We nurture body, breath, mind, and spirit as one.',
    },
  ];

  return (
    <section id="about" className="py-24 md:py-32 bg-cream">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-6 ${visible ? 'visible' : ''} reveal`}
      >
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl shadow-sage-900/10">
              <img
                src="https://images.pexels.com/photos/39031139/pexels-photo-39031139.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000"
                alt="Woman meditating in lush nature"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-4 md:-right-8 w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-8 border-cream hidden sm:block">
              <img
                src="https://images.pexels.com/photos/14203457/pexels-photo-14203457.jpeg?auto=compress&cs=tinysrgb&w=400&h=400"
                alt="Yoga among trees"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-6 -left-4 md:-left-6 bg-sage-600 text-cream rounded-2xl px-6 py-4 shadow-xl">
              <p className="text-3xl font-serif font-semibold">12+</p>
              <p className="text-sm text-cream/70">Years of teaching</p>
            </div>
          </div>

          <div>
            <p className="section-label mb-5">
              <span className="w-8 h-px bg-sage-400 inline-block" />
              Our Story
            </p>
            <h2 className="text-4xl md:text-5xl text-ink mb-6 leading-tight">
              A sanctuary rooted in
              <span className="italic text-sage-600"> nature and practice</span>
            </h2>
            <p className="text-ink/60 leading-relaxed mb-6">
              Willow Creek was born from a simple vision: to create a space where people
              could step away from the noise of daily life and reconnect with themselves.
              Nestled in the heart of Asheville, our studio blends natural light, warm wood,
              and the gentle sound of a nearby creek to create an atmosphere of immediate calm.
            </p>
            <p className="text-ink/60 leading-relaxed mb-8">
              Our certified teachers bring decades of combined experience across Hatha, Vinyasa,
              Yin, Ashtanga, and Kundalini traditions. Whether you are taking your first steps
              onto the mat or deepening a lifelong practice, you will find guidance, community,
              and acceptance here.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-serif text-sage-600 font-semibold">500+</p>
                <p className="text-xs text-ink/50 mt-1">Happy Students</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-serif text-sage-600 font-semibold">30+</p>
                <p className="text-xs text-ink/50 mt-1">Weekly Classes</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-serif text-sage-600 font-semibold">8</p>
                <p className="text-xs text-ink/50 mt-1">Expert Teachers</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, i) => (
            <div
              key={value.title}
              className="card p-8 text-center hover:-translate-y-1"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-14 h-14 rounded-full bg-sage-50 flex items-center justify-center mx-auto mb-5">
                <value.icon className="text-sage-600" size={26} />
              </div>
              <h3 className="text-xl text-ink mb-3">{value.title}</h3>
              <p className="text-sm text-ink/55 leading-relaxed">{value.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
