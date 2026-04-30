import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import {
  Activity,
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Command,
  Crown,
  Heart,
  LayoutDashboard,
  MessageCircle,
  Moon,
  Newspaper,
  Search,
  Settings,
  Share2,
  Sparkles,
  Star,
  TrendingUp,
  UserPlus,
  UserCircle2,
  Users,
  Zap,
  LogOut,
} from 'lucide-react';
import AuthPage from './pages/AuthPage';
import BookingPage from './pages/BookingPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase, type Profile } from './lib/supabase';
import AppToast, { type ToastTone } from './components/ui/AppToast';
import AppModal from './components/ui/AppModal';

type DashboardTab = 'Команда' | 'Лента' | 'Календарь';
type TeamMember = Profile & { status?: string | null };
type CalendarEvent = { id: number; title: string; time: string };
type ToastState = { message: string; tone: ToastTone } | null;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

// --- Protected Route ---
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center bg-background text-primary">Инициализация систем...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

// --- Components ---

function Sidebar({ activeTab, onTabChange }: { activeTab: DashboardTab; onTabChange: (tab: DashboardTab) => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const items = [
    { icon: LayoutDashboard, label: 'Команда' as const },
    { icon: Newspaper, label: 'Лента' as const },
    { icon: Calendar, label: 'Календарь' as const },
  ];

  return (
    <aside className={cx('fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-primary/30 glass-card transition-all duration-300', collapsed ? 'w-16' : 'w-64')}>
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
              {!collapsed && <span className={cx('animate-slide-in text-sm font-medium', isActive && 'text-glow')}>{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={() => setCollapsed((prev) => !prev)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-primary/40 bg-card text-muted-foreground transition-all hover:border-primary hover:text-primary"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}

function DashboardContent() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('Команда');
  const [toast, setToast] = useState<ToastState>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Состояние для редактирования профиля
  const [editName, setEditName] = useState(profile?.full_name || '');
  const [editRole, setEditRole] = useState(profile?.role || '');
  const [loading, setLoading] = useState(false);

  const showNotify = (message: string, tone: ToastTone = 'info') => setToast({ message, tone });

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: editName, role: editRole })
      .eq('id', user.id);
    
    if (error) {
      showNotify('Ошибка обновления', 'error');
    } else {
      await refreshProfile();
      showNotify('Профиль обновлен', 'success');
      setIsSettingsOpen(false);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="pl-64 transition-all duration-300">
        <header className="glass-card sticky top-0 z-40 flex h-16 items-center justify-between border-b border-primary/20 px-6">
           <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold tracking-tight">{activeTab}</h2>
           </div>
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-secondary/40 text-muted-foreground hover:text-primary"
              >
                <Settings className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3 border-l border-primary/20 pl-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{profile?.full_name || 'Загрузка...'}</p>
                  <p className="text-[10px] uppercase text-primary">{profile?.role || 'User'}</p>
                </div>
                <div className="h-10 w-10 rounded-lg border border-primary/50 bg-primary/20 flex items-center justify-center font-bold">
                  {(profile?.full_name?.[0] || 'U').toUpperCase()}
                </div>
              </div>
           </div>
        </header>

        <div className="p-8 space-y-8">
          <StatsWidget teamCount={12} />
          
          {activeTab === 'Команда' && (
             <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                   <TeamCarousel team={[]} loading={false} error={null} onNotify={showNotify} />
                </div>
                <TeamCalendar currentUserId={user?.id || null} onNotify={showNotify} />
             </div>
          )}

          {activeTab === 'Лента' && <CyberFeed onCharge={() => showNotify('Импульс отправлен', 'success')} />}
        </div>
      </main>

      {/* Настройки профиля */}
      <AppModal 
        open={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        title="Настройки профиля"
        subtitle="Персонализируйте свой кибер-аватар"
      >
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Имя в системе</label>
            <input 
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-secondary/50 border border-primary/20 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Специализация (Role)</label>
            <input 
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
              className="w-full bg-secondary/50 border border-primary/20 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="pt-4 flex flex-col gap-2">
            <button 
              onClick={handleUpdateProfile}
              disabled={loading}
              className="w-full cyber-glow bg-primary/20 border border-primary/50 py-2 rounded-lg text-primary hover:bg-primary/30 transition-all"
            >
              {loading ? 'Синхронизация...' : 'Сохранить изменения'}
            </button>
            <button 
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-2 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all"
            >
              <LogOut className="h-4 w-4" /> Выйти из системы
            </button>
          </div>
        </div>
      </AppModal>

      {toast && <AppToast message={toast.message} tone={toast.tone} onClose={() => setToast(null)} />}
    </div>
  );
}

// --- Main App ---
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <DashboardContent />
              </ProtectedRoute>
            } 
          />
          <Route path="/book/:username" element={<BookingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Вспомогательные виджеты (оставил структуру для краткости)
function StatsWidget({ teamCount }: { teamCount: number }) { /* ... как в твоем коде ... */ return null; }
function TeamCarousel({ team, loading, error, onNotify }: any) { /* ... */ return null; }
function TeamCalendar({ currentUserId, onNotify }: any) { /* ... */ return null; }
function CyberFeed({ onCharge }: any) { /* ... */ return null; }
