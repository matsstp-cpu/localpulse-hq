import type { ReactNode } from 'react';

type AppModalProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  maxWidthClassName?: string;
  zIndexClassName?: string;
};

export default function AppModal({
  open,
  title,
  subtitle,
  onClose,
  children,
  maxWidthClassName = 'max-w-lg',
  zIndexClassName = 'z-[80]',
}: AppModalProps) {
  if (!open) return null;

  return (
    <div className={`fixed inset-0 ${zIndexClassName} flex items-center justify-center bg-black/65 px-4 backdrop-blur-md`}>
      <div className={`glass-card w-full ${maxWidthClassName} animate-slide-in rounded-2xl border border-primary/40 p-6 shadow-[0_12px_45px_rgba(15,23,42,0.65)]`}>
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-primary/20 px-2 py-1 text-xs text-muted-foreground transition hover:text-foreground"
          >
            Закрыть
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
