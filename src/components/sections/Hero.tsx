import { ChevronDown } from 'lucide-react';
import { HERO_VIDEO_URL, HERO_POSTER } from '@/lib/constants';

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={HERO_POSTER}
      >
        <source src={HERO_VIDEO_URL} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-overlay" />

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <p className="section-label text-cream/70 mb-6 animate-fade-down animate-delay-100">
          <span className="w-8 h-px bg-cream/40 inline-block" />
          Willow Creek Yoga Studio
          <span className="w-8 h-px bg-cream/40 inline-block" />
        </p>
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-cream font-light leading-[1.05] mb-8 text-balance animate-fade-up animate-delay-300">
          Find your breath,
          <br />
          <span className="italic font-medium text-sage-200">find your balance</span>
        </h1>
        <p className="text-lg md:text-xl text-cream/70 max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-up animate-delay-500">
          A sanctuary where ancient wisdom meets modern practice. Move with intention,
          breathe with purpose, and discover the stillness within.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up animate-delay-700">
          <button
            onClick={() => document.getElementById('classes')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            Explore Classes
          </button>
          <button
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-secondary"
          >
            View Pricing
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-gentle-pulse">
        <ChevronDown className="text-cream/50" size={28} />
      </div>
    </section>
  );
}
