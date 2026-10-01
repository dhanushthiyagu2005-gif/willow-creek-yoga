import { useState } from 'react';
import { MapPin, Phone, Mail, Send, Clock } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import {
  STUDIO_ADDRESS,
  STUDIO_PHONE,
  STUDIO_EMAIL,
  STUDIO_HOURS,
} from '@/lib/constants';
import type { ToastType } from '@/components/ui/Toast';

interface ContactProps {
  showToast: (type: ToastType, message: string) => void;
}

export default function Contact({ showToast }: ContactProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    showToast('success', 'Thank you! We will be in touch soon.');
    setForm({ name: '', email: '', message: '' });
    setSending(false);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-cream">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-6 ${visible ? 'visible' : ''} reveal`}
      >
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <p className="section-label mb-4">
              <span className="w-8 h-px bg-sage-400 inline-block" />
              Get in Touch
            </p>
            <h2 className="text-4xl md:text-5xl text-ink mb-6 leading-tight">
              Begin your journey
              <span className="italic text-sage-600"> with us</span>
            </h2>
            <p className="text-ink/55 leading-relaxed mb-10">
              Have a question about classes, scheduling, or membership? We would love to
              hear from you. Reach out and we will respond within 24 hours.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-sage-600" size={22} />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink mb-1">Studio Location</p>
                  <p className="text-sm text-ink/50">{STUDIO_ADDRESS}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-sage-600" size={22} />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink mb-1">Phone</p>
                  <p className="text-sm text-ink/50">{STUDIO_PHONE}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-sage-600" size={22} />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink mb-1">Email</p>
                  <p className="text-sm text-ink/50">{STUDIO_EMAIL}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center flex-shrink-0">
                  <Clock className="text-sage-600" size={22} />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink mb-1">Studio Hours</p>
                  {STUDIO_HOURS.map((h) => (
                    <p key={h.day} className="text-sm text-ink/50">
                      {h.day}: {h.hours}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input-field resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-60">
                {sending ? 'Sending...' : 'Send Message'}
                {!sending && <Send size={18} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
