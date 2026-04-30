import { User, Briefcase, MapPin, ExternalLink } from 'lucide-react';

interface ProfileCardProps {
  name?: string;
  role?: string;
  company?: string;
  location?: string;
}

export default function ProfileCard({ 
  name = "Анастасия", 
  role = "Business Development Manager",
  company = "LocalTrans & Custom.MT",
  location = "Saint Petersburg"
}: ProfileCardProps) {
  return (
    <div className="glass-card rounded-3xl p-6 border border-white/10 relative overflow-hidden group">
      {/* Декоративный эффект свечения на фоне */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-all duration-700" />
      
      <div className="relative z-10 space-y-6">
        {/* Аватар-заглушка в кибер-стиле */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/20">
            <User size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight leading-tight">{name}</h2>
            <div className="flex items-center gap-1.5 text-blue-400 text-[11px] uppercase font-black tracking-widest mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Online System
            </div>
          </div>
        </div>

        {/* Инфо-блок */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3 text-slate-400">
            <Briefcase size={16} className="text-blue-500/70" />
            <span className="text-sm font-medium">{role}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-4 flex justify-center">
              <span className="text-[10px] font-bold text-blue-500">@</span>
            </div>
            <span className="text-sm font-medium">{company}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <MapPin size={16} className="text-blue-500/70" />
            <span className="text-sm font-medium">{location}</span>
          </div>
        </div>

        {/* Кнопка действия */}
        <button className="w-full py-3 mt-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-blue-600 hover:border-blue-500 transition-all active:scale-95 flex items-center justify-center gap-2 group/btn">
          Редактировать профиль
          <ExternalLink size={14} className="opacity-50 group-hover/btn:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );
}
