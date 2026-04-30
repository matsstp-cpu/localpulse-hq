import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap, Eye, EyeOff, Loader2 } from 'lucide-react';
import AppToast, { type ToastTone } from '../components/ui/AppToast';
import AppModal from '../components/ui/AppModal';

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: ToastTone } | null>(null);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  const notify = (message: string, tone: ToastTone = 'info') => setToast({ message, tone });

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация: проверяем, что поля не пустые (фикс бага "Название не заполнено")
    if (mode === 'signup' && !fullName.trim()) {
      notify('Как нам к тебе обращаться? Введи имя!', 'error');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        notify('Рады видеть! Загружаем твой дашборд...', 'success');
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        setIsWelcomeModalOpen(true);
        notify('Добро пожаловать в команду!', 'success');
        setMode('login');
      }
    } catch (error: any) {
      // Человечный UX для ошибок
      const techMsg = error.message?.toLowerCase() || '';
      let friendlyMessage = 'Ой, что-то пошло не так. Давай попробуем еще раз?';
      
      if (techMsg.includes('invalid login')) {
        friendlyMessage = 'Похоже, пароль или почта не те. Проверь еще разок!';
      } else if (techMsg.includes('already registered')) {
        friendlyMessage = 'Этот email уже с нами! Попробуй просто войти.';
      } else if (techMsg.includes('password should be')) {
        friendlyMessage = 'Пароль слишком короткий. Нужно хотя бы 6 символов для безопасности.';
      }
      
      notify(friendlyMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Сетка фона с повышенным контрастом */}
      <div 
        className="fixed inset-0 opacity-[0.07]" 
        style={{ 
          backgroundImage: 'linear-gradient(var(--cyber-blue) 1px, transparent 1px), linear-gradient(90deg, var(--cyber-blue) 1px, transparent 1px)',
          backgroundSize: '40px 40px' 
        }} 
      />

      <div className="relative w-full max-w-sm animate-slide-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 border-2 border-blue-500 rounded-xl flex items-center justify-center cyber-glow">
              <Zap size={24} className="text-blue-400" fill="currentColor" />
            </div>
            <div className="text-left">
              <span className="block text-2xl font-bold tracking-tighter text-white uppercase leading-none">
                LOCAL<span className="text-blue-500">PULSE</span>
              </span>
              <span className="text-[10px] text-blue-400/80 tracking-[0.3em] uppercase font-medium">Bdm Management</span>
            </div>
          </div>
        </div>

        {/* Основная карточка входа */}
        <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="flex p-1 bg-black/40 rounded-2xl mb-8 border border-white/5">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                mode === 'login' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                mode === 'signup' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="block text-[10px] text-blue-400/70 tracking-widest uppercase font-bold ml-1">Твое Имя</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Анастасия"
                  className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:border-blue-500 outline-none transition-all"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-[10px] text-blue-400/70 tracking-widest uppercase font-bold ml-1">Рабочая Почта</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="office@localtrans.ru"
                className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] text-blue-400/70 tracking-widest uppercase font-bold ml-1">Пароль</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:border-blue-500 outline-none transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-xs tracking-[0.2em] uppercase font-black rounded-xl transition-all mt-4 shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Обработка...
                </>
              ) : mode === 'login' ? 'Войти в Hub' : 'Стать частью команды'}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-slate-600 mt-8 tracking-[0.4em] font-bold">
          CORE INTERFACE v2.0 // EST. 2026
        </p>
      </div>

      <AppModal
        open={isWelcomeModalOpen}
        title="Ура, ты в деле!"
        subtitle="Регистрация в LocalPulse прошла успешно"
        onClose={() => setIsWelcomeModalOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            Анастасия, аккаунт готов. Остался последний шаг — войди под своими данными, чтобы оживить систему.
          </p>
          <button
            type="button"
            onClick={() => setIsWelcomeModalOpen(false)}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-500 shadow-blue-500/20 shadow-lg transition-all"
          >
            К авторизации
          </button>
        </div>
      </AppModal>

      {toast && <AppToast message={toast.message} tone={toast.tone} />}
    </div>
  );
}
