import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export type ToastTone = 'success' | 'error' | 'info';

type AppToastProps = {
  message: string;
  tone?: ToastTone;
  className?: string;
};

export default function AppToast({ message, tone = 'info', className = '' }: AppToastProps) {
  const toneClass =
    tone === 'success'
      ? 'border-emerald-500/50 bg-emerald-900/20 text-emerald-300'
      : tone === 'error'
        ? 'border-red-500/50 bg-red-900/20 text-red-300'
        : 'border-primary/50 bg-card/90 text-foreground';

  return (
    <div
      className={`pointer-events-none fixed bottom-4 right-4 z-[90] flex items-center gap-2 rounded-lg border px-4 py-3 text-sm backdrop-blur-xl ${toneClass} ${className}`}
    >
      {tone === 'success' ? (
        <CheckCircle2 className="h-4 w-4 shrink-0" />
      ) : tone === 'error' ? (
        <AlertTriangle className="h-4 w-4 shrink-0" />
      ) : (
        <Info className="h-4 w-4 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
}
