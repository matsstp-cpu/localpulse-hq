import { useLocation, useNavigate } from 'react-router-dom';
import { Radio, CalendarDays, Users } from 'lucide-react';

const tabs = [
  { path: '/pulse', label: 'Pulse', Icon: Radio },
  { path: '/focus', label: 'Focus', Icon: CalendarDays },
  { path: '/team', label: 'Team', Icon: Users },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50"
      style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)' }}
    >
      <div className="flex">
        {tabs.map(({ path, label, Icon }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex-1 flex flex-col items-center gap-1 py-4 nav-item transition-all ${
                active ? 'text-blue-400' : 'text-slate-600 hover:text-slate-400'
              }`}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={active ? 2 : 1.5} />
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400 pulse-dot" />
                )}
              </div>
              <span className="text-[10px] tracking-widest uppercase font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
