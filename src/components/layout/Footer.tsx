import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube, Flower2 } from 'lucide-react';
import { STUDIO_ADDRESS, STUDIO_PHONE, STUDIO_EMAIL, STUDIO_HOURS } from '@/lib/constants';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-forest-950 text-cream/80 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Flower2 className="text-sage-300" size={28} />
              <span className="text-2xl font-serif font-semibold text-cream">Willow Creek</span>
            </div>
            <p className="text-sm leading-relaxed text-cream/60 mb-6">
              A sanctuary for mindful movement and inner stillness. Join our community
              and discover the transformative power of yoga.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-sage-600 transition-colors"
                  aria-label="Social link"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg text-cream mb-5">Explore</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'About Us', path: '/#about' },
                { label: 'Classes', path: '/#classes' },
                { label: 'Schedule', path: '/#schedule' },
                { label: 'Pricing', path: '/#pricing' },
                { label: 'Contact', path: '/#contact' },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => onNavigate(link.path)}
                    className="text-cream/60 hover:text-sage-300 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg text-cream mb-5">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-sage-300 mt-0.5 flex-shrink-0" />
                <span className="text-cream/60">{STUDIO_ADDRESS}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-sage-300 flex-shrink-0" />
                <span className="text-cream/60">{STUDIO_PHONE}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-sage-300 flex-shrink-0" />
                <span className="text-cream/60">{STUDIO_EMAIL}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg text-cream mb-5">Studio Hours</h4>
            <ul className="space-y-3 text-sm">
              {STUDIO_HOURS.map((item) => (
                <li key={item.day} className="flex items-start gap-3">
                  <Clock size={18} className="text-sage-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-cream/80">{item.day}</p>
                    <p className="text-cream/50 text-xs">{item.hours}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/40">
            © {new Date().getFullYear()} Willow Creek Yoga Studio. All rights reserved.
          </p>
          <p className="text-xs text-cream/40">
            Crafted with intention and breath.
          </p>
        </div>
      </div>
    </footer>
  );
}
