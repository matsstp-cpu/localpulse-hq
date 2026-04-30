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

// ИМПОРТЫ СТРАНИЦ И КОНТЕКСТА
import AuthPage from './pages/AuthPage';
import BookingPage from './pages/BookingPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';

// ИМПОРТЫ КОМПОНЕНТОВ (Убедись, что пути верные!)
import AppToast, { type ToastTone } from './components/ui/AppToast';
import AppModal from './components/ui/AppModal';

// --- Если эти файлы у тебя есть в проекте, раскомментируй их: ---
// import TeamCarousel from './components/TeamCarousel';
// import TeamCalendar from './components/TeamCalendar';
// import StatsWidget from './components/StatsWidget';

type DashboardTab = 'Команда' | 'Лента' | 'Календарь';
type ToastState = { message: string; tone: ToastTone } | null;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

// --- Protected Route ---
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background text-primary gap-4">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="animate-pulse tracking-widest uppercase text-[10px] font-bold">Синхронизация...</p>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

// --- Sidebar ---
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
      <div className="border-b border-primary/20 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <Zap className="h-6 w-6 text-primary shrink-0" />
          {!collapsed && <span className="font-bold text-lg tracking-tight">LocalPulse</span>}
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-2">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => onTabChange(item.label)}
            className={cx(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
              activeTab === item.label ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:bg-secondary/50'
            )}
          >
            <item.icon className="h-5 w-5" />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="p-4 text-muted-foreground hover:text-primary flex justify-center"
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </aside>
  );
}

// --- Dashboard Content ---
function DashboardContent() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('Команда');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  // Данные для редактирования профиля
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');

  useEffect(() => {
    if (profile) {
      setEditName(profile.full_name || '');
      setEditRole(profile.role || '');
    }
  }, [profile]);

  const handleUpdate = async () => {
    if (!user) return;
    const { error } = await supabase.from('profiles').update({ full_name: editName, role: editRole }).eq('id', user.id);
    if (!error) {
      await refreshProfile();
      setIsSettingsOpen(false);
      setToast({ message: 'Данные обновлены', tone: 'success' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="pl-64 transition-all duration-300">
        <header className="h-16 border-b border-primary/20 glass-card sticky top-0 z-40 flex items-center justify-between px-8">
          <h2 className="text-xl font-bold uppercase tracking-widest text-primary/80">{activeTab}</h2>
          
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSettingsOpen(true)} className="p-2 border border-primary/20 rounded-full hover:bg-primary/10 transition-colors">
              <Settings size={18} className="text-muted-foreground" />
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-primary/20">
              <div className="text-right">
                <p className="text-sm font-bold">{profile?.full_name || 'Пользователь'}</p>
                <p className="text-[10px] text-primary uppercase font-black tracking-tighter">{profile?.role || 'BDM'}</p>
              </div>
              <div className="h-10 w-10 bg-primary/20 border border-primary/40 rounded-xl flex items-center justify-center font-bold text-primary">
                {(profile?.full_name?.[0] || 'A').toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
           {activeTab === 'Команда' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="p-12 border-2 border-dashed border-primary/10 rounded-[2rem] flex flex-col items-center justify-center text-center bg-secondary/5">
                   <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Zap className="text-primary animate-pulse" size={40} />
                   </div>
                   <h3 className="text-2xl font-bold mb-2">Система готова к работе</h3>
                   <p className="text-muted-foreground max-w-sm">
                      Чтобы увидеть список команды, убедись, что компоненты <b>TeamCarousel</b> и <b>TeamCalendar</b> подключены в коде.
                   </p>
                </div>
             </div>
           )}
        </div>
      </main>

      <AppModal open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Настройки профиля">
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Имя</label>
            <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-secondary/50 border border-primary/20 rounded-xl p-3 outline-none focus:border-primary" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Роль</label>
            <input value={editRole} onChange={e => setEditRole(e.target.value)} className="w-full bg-secondary/50 border border-primary/20 rounded-xl p-3 outline-none focus:border-primary" />
          </div>
          <button onClick={handleUpdate} className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-black mt-4 hover:opacity-90 transition-opacity">СОХРАНИТЬ</button>
          <button onClick={() => signOut()} className="w-full py-3 text-destructive font-bold flex items-center justify-center gap-2 mt-2"><LogOut size={16}/> ВЫЙТИ</button>
        </div>
      </AppModal>

      {toast && <AppToast message={toast.message} tone={toast.tone} onClose={() => setToast(null)} />}
    </div>
  );
}

// --- APP ENTRY ---
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
