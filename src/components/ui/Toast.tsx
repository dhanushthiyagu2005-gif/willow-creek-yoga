import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: ToastType, message: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, showToast, dismiss };
}

export function ToastContainer({ toasts, onDismiss }: { toasts: ToastMessage[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function Toast({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const config = {
    success: { icon: CheckCircle2, bg: 'bg-forest-600', text: 'text-white' },
    error: { icon: XCircle, bg: 'bg-clay-600', text: 'text-white' },
    info: { icon: Info, bg: 'bg-sage-700', text: 'text-white' },
  };
  const { icon: Icon, bg, text } = config[toast.type];

  return (
    <div className={`${bg} ${text} rounded-xl shadow-lg px-5 py-4 flex items-center gap-3 animate-slide-in-right`}>
      <Icon size={20} className="flex-shrink-0" />
      <span className="text-sm font-medium tracking-wide">{toast.message}</span>
    </div>
  );
}
