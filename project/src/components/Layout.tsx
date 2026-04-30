import { ReactNode } from 'react';
import BottomNav from './BottomNav';

type Props = {
  children: ReactNode;
  title?: string;
  headerRight?: ReactNode;
};

export default function Layout({ children, title, headerRight }: Props) {
  return (
    <div className="min-h-screen bg-black flex flex-col max-w-2xl mx-auto">
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {title && (
        <header
          className="sticky top-0 z-40 px-4 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(16px)' }}
        >
          <h1 className="text-sm font-semibold tracking-[0.25em] uppercase text-white">
            {title}
          </h1>
          {headerRight && <div>{headerRight}</div>}
        </header>
      )}

      <main className="flex-1 overflow-y-auto pb-24 page-enter">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
