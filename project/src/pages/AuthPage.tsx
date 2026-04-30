import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap, Eye, EyeOff } from 'lucide-react';
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
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        notify('Вход выполнен. Загружаем ваш TEAM HUB...', 'success');
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        setIsWelcomeModalOpen(true);
        notify('Аккаунт успешно создан', 'success');
        setMode('login');
      }
    } catch (error) {
      const technical = error instanceof Error ? error.message : '';
      const friendlyMessage =
        technical.toLowerCase().includes('invalid login credentials')
          ? 'Почта или пароль не совпадают. Проверьте данные и попробуйте снова.'
          : technical.toLowerCase().includes('already registered')
            ? 'Этот email уже зарегистрирован. Попробуйте войти в существующий аккаунт.'
            : 'Не получилось завершить авторизацию. Попробуйте еще раз через минуту.';
      notify(friendlyMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 scanline">
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 border border-blue-500 flex items-center justify-center glow-blue">
              <Zap size={20} className="text-blue-400" fill="currentColor" />
            </div>
            <span className="text-xl font-semibold tracking-[0.2em] text-white uppercase" style={{ fontFamily: 'Space Grotesk' }}>
              Cyber<span className="text-blue-400">Chic</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 tracking-widest uppercase">Панель команды LocalTrans</p>
        </div>

        <div className="glass rounded-sm p-8" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex mb-8 border border-white/8" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 text-xs tracking-widest uppercase font-medium transition-all ${
                mode === 'login'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 text-xs tracking-widest uppercase font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs text-slate-500 tracking-widest uppercase mb-2">Имя</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Анастасия"
                  required
                  className="w-full px-4 py-3 rounded-sm text-sm"
                />
              </div>
            )}
            <div>
              <label className="block text-xs text-slate-500 tracking-widest uppercase mb-2">Почта</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.io"
                required
                className="w-full px-4 py-3 rounded-sm text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 tracking-widest uppercase mb-2">Пароль</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-sm text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs tracking-widest uppercase font-semibold rounded-sm transition-all mt-2 glow-blue disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Обработка...' : mode === 'login' ? 'Войти в систему' : 'Создать аккаунт'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-700 mt-6 tracking-wider">
          LOCALPULSE CYBER-CHIC v1.0
        </p>
      </div>

      <AppModal
        open={isWelcomeModalOpen}
        title="Регистрация завершена"
        subtitle="Мы рады видеть вас в LocalPulse TEAM HUB"
        onClose={() => setIsWelcomeModalOpen(false)}
        maxWidthClassName="max-w-md"
        zIndexClassName="z-[85]"
      >
        {/* Fixed: unified design-system modal for onboarding feedback */}
        <p className="text-sm text-muted-foreground">
          Аккаунт создан. Теперь войдите с почтой и паролем, чтобы открыть рабочее пространство команды.
        </p>
        <button
          type="button"
          onClick={() => setIsWelcomeModalOpen(false)}
          className="mt-5 w-full rounded-lg border border-primary/40 bg-primary/20 px-3 py-2 text-sm text-primary transition hover:cyber-glow"
        >
          Перейти ко входу
        </button>
      </AppModal>

      {toast && <AppToast message={toast.message} tone={toast.tone} />}
    </div>
  );
}
