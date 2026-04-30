import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // АВТО-РЕДИРЕКТ: Если пользователь уже залогинен, уходим со страницы авторизации
  useEffect(() => {
    if (user) {
      console.log("Пользователь найден, перенаправляем на главную...");
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password, fullName);

      if (authError) throw authError;
      // После успеха useEffect выше сработает автоматически
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Фоновая сетка */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 cyber-glow mb-4">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter text-foreground">LOCALPULSE</h1>
          <p className="text-primary text-xs uppercase tracking-[0.3em] font-medium">BDM Management System</p>
        </div>

        <div className="glass-card border border-primary/20 p-8 rounded-2xl shadow-2xl">
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-2 text-sm font-medium transition-all ${isLogin ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
            >
              ВХОД
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-2 text-sm font-medium transition-all ${!isLogin ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
            >
              РЕГИСТРАЦИЯ
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-muted-foreground ml-1">Ваше Имя</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                    className="w-full bg-secondary/30 border border-primary/10 rounded-xl py-3 pl-10 pr-4 focus:border-primary/50 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-muted-foreground ml-1">Рабочая почта</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-secondary/30 border border-primary/10 rounded-xl py-3 pl-10 pr-4 focus:border-primary/50 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-muted-foreground ml-1">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-secondary/30 border border-primary/10 rounded-xl py-3 pl-10 pr-4 focus:border-primary/50 outline-none transition-all"
                />
              </div>
            </div>

            {error && <div className="text-destructive text-xs bg-destructive/10 p-3 rounded-lg border border-destructive/20">{error}</div>}

            <button 
              disabled={loading}
              className="w-full cyber-glow bg-primary text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? 'СИНХРОНИЗАЦИЯ...' : (isLogin ? 'ВОЙТИ В СИСТЕМУ' : 'СОЗДАТЬ АККАУНТ')}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
