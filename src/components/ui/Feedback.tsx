import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 24, className = '' }: SpinnerProps) {
  return <Loader2 size={size} className={`animate-spin ${className}`} />;
}

export function FullPageSpinner({ message }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-cream">
      <Spinner size={40} className="text-sage-600" />
      {message && <p className="text-ink/50 text-sm tracking-wide">{message}</p>}
    </div>
  );
}

export function SectionSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <Spinner size={32} className="text-sage-600" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="h-48 bg-sage-100 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-1/3 bg-sage-100 rounded animate-pulse" />
        <div className="h-6 w-3/4 bg-sage-100 rounded animate-pulse" />
        <div className="h-4 w-full bg-sage-100 rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-sage-100 rounded animate-pulse" />
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, message, action }: { icon?: ReactNode; title: string; message?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-sage-300">{icon}</div>}
      <h3 className="text-xl text-ink mb-2">{title}</h3>
      {message && <p className="text-ink/50 max-w-sm">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
