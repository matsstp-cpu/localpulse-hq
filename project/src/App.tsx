import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Newspaper,
  Calendar as CalendarIcon,
  Settings,
  Zap,
  LogOut,
} from 'lucide-react';
import AuthPage from './pages/AuthPage';
import BookingPage from './pages/BookingPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';
import AppToast, { type ToastTone } from './components/ui/AppToast';
import AppModal from './components/ui/AppModal';

// КРИТИЧЕСКИЙ МОМЕНТ: Импортируй свои реальные компоненты здесь!
// import StatsWidget from './components/StatsWidget';
// import TeamCarousel from './components/TeamCarousel';
// import TeamCalendar from './components/TeamCalendar';
// import CyberFeed from './components/CyberFeed';

type DashboardTab = 'Команда' | 'Лента' | 'Календарь';
type ToastState = { message: string; tone: ToastTone } | null;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

// --- Защищенный роут ---
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background text-primary gap-4">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="animate-pulse tracking-widest uppercase text-[10px] font-bold">Инициализация систем...</p>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

// --- Боковая панель ---
function Sidebar({ activeTab, onTabChange }: { activeTab: DashboardTab; onTabChange: (tab: DashboardTab) => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const items = [
    { icon: LayoutDashboard, label: 'Команда' as const },
    { icon: Newspaper, label: 'Лента' as const },
    { icon: CalendarIcon, label: 'Календарь' as const },
  ];

  return (
    <aside className={cx(
      'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-primary/30 glass-card transition-all duration-300', 
      collapsed ? 'w-16' : 'w-64'
    )}>
      <div className="border-b border-primary/20 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/40 bg-primary/20 cyber-glow">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          {!collapsed && (
            <div className="animate-slide-in">
              <h1 className="text-lg font-bold tracking-tight text-foreground">LocalPulse</h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">TEAM HUB</p>
            </div>
          )}
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.label === activeTab;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onTabChange(item.label)}
              className={cx(
                'group flex w-full items-center gap-3 rounded-md border px-3 py-2.5 transition-all duration-200',
                isActive ? 'border-primary/40 bg-primary/15 text-primary' : 'border-transparent text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
              )}
            >
              <Icon className={cx('h-5 w-5 transition-all', isActive && 'text-glow')} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-primary/40 bg-card text-muted-foreground"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}

// --- Основной контент дашборда ---
function DashboardContent() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('Команда');
  const [toast, setToast] = useState<ToastState>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [editName, setEditName] = useState(profile?.full_name || '');
  const [editRole, setEditRole] = useState(profile?.role || '');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (profile) {
      setEditName(profile.full_name || '');
      setEditRole(profile.role || '');
    }
  }, [profile]);

  const showNotify = (message: string, tone: ToastTone = 'info') => setToast({ message, tone });

  const handleUpdateProfile = async () => {
    if (!user) return;
    setUpdating(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: editName, role: editRole })
      .eq('id', user.id);
    
    if (error) showNotify('Ошибка обновления', 'error');
    else {
      await refreshProfile();
      showNotify('Профиль обновлен', 'success');
      setIsSettingsOpen(false);
    }
    setUpdating(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="pl-64 transition-all duration-300">
        <header className="glass-card sticky top-0 z-40 flex h-16 items-center justify-between border-b border-primary/20 px-6">
           <h2 className="text-xl font-bold tracking-tight">{activeTab}</h2>
           <div className="flex items-center gap-4">
              <button onClick={() => setIsSettingsOpen(true)} className="p-2 border border-primary/20 rounded-lg hover:text-primary">
                <Settings className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3 border-l border-primary/20 pl-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{profile?.full_name || 'Загрузка...'}</p>
                  <p className="text-[10px] uppercase text-primary font-bold">{profile?.role || 'User'}</p>
                </div>
                <div className="h-10 w-10 rounded-lg border border-primary/50 bg-primary/20 flex items-center justify-center font-bold">
                  {(profile?.full_name?.[0] || 'U').toUpperCase()}
                </div>
              </div>
           </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Если компоненты ниже возвращают null, ты увидишь пустой экран */}
          {/* <StatsWidget teamCount={12} /> */}
          
          {activeTab === 'Команда' && (
             <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                   {/* <TeamCarousel team={[]} loading={false} error={null} onNotify={showNotify} /> */}
                   <div className="p-20 border-2 border-dashed border-primary/20 rounded-3xl text-center text-muted-foreground">
                      Здесь будет карусель (проверь импорт)
                   </div>
                </div>
                {/* <TeamCalendar currentUserId={user?.id || null} onNotify={showNotify} /> */}
             </div>
          )}
        </div>
      </main>

      <AppModal open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Настройки">
        <div className="space-y-4 py-4">
          <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Имя" className="w-full bg-secondary/30 border border-primary/20 rounded-xl px-4 py-3" />
          <input value={editRole} onChange={e => setEditRole(e.target.value)} placeholder="Роль" className="w-full bg-secondary/30 border border-primary/20 rounded-xl px-4 py-3" />
          <button onClick={handleUpdateProfile} disabled={updating} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold">
            {updating ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ'}
          </button>
          <button onClick={() => signOut()} className="w-full py-3 text-destructive font-medium flex items-center justify-center gap-2">
            <LogOut className="h-4 w-4" /> Выход
          </button>
        </div>
      </AppModal>

      {toast && <AppToast message={toast.message} tone={toast.tone} onClose={() => setToast(null)} />}
    </div>
  );
}

// --- Точка входа ---
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<ProtectedRoute><DashboardContent /></ProtectedRoute>} />
          <Route path="/book/:username" element={<BookingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
