import { useEffect, useMemo, useState, type ReactNode } from 'react';
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
              {isActive && !collapsed && <div className="ml-auto h-1.5 w-1.5 animate-pulse-glow rounded-full bg-primary" />}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-primary/20 p-4">
        {!collapsed && (
          <div className="glass-card animate-slide-in rounded-lg border border-primary/20 p-3">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">Система в сети</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: '96%' }} />
              </div>
              <span className="text-xs font-mono text-primary">96%</span>
            </div>
          </div>
        )}
      </div>
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

function Header({ name, onProfileOpen }: { name: string; onProfileOpen: () => void }) {
  const [searchFocused, setSearchFocused] = useState(false);
  return (
    <header className="glass-card flex h-16 items-center justify-between border-b border-primary/20 px-6">
      <div className={cx('flex w-80 items-center gap-3 rounded-lg border px-4 py-2 transition-all duration-300', searchFocused ? 'border-primary/50 bg-secondary/80 cyber-glow' : 'border-primary/20 bg-secondary/40')}>
        <Search className={cx('h-4 w-4 transition-colors', searchFocused ? 'text-primary' : 'text-muted-foreground')} />
        <input
          type="text"
          placeholder="Поиск по хабу..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Command className="h-3 w-3" />
          <span>K</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-lg border border-primary/20 bg-secondary/40 px-3 py-1.5 lg:flex">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          <span className="text-xs text-muted-foreground">Все системы работают стабильно</span>
        </div>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-secondary/40 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">3</span>
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-secondary/40 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary">
          <Moon className="h-4 w-4" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-secondary/40 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary">
          <Settings className="h-4 w-4" />
        </button>
        <button type="button" onClick={onProfileOpen} className="flex items-center gap-3 border-l border-primary/20 pl-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">Команда</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/50 bg-gradient-to-br from-primary/40 to-accent/40 text-sm font-bold text-foreground cyber-glow">
            {(name[0] ?? 'U').toUpperCase()}
          </div>
        </button>
      </div>
    </header>
  );
}

function StatsWidget({ teamCount }: { teamCount: number }) {
  const stats = [
    { label: 'Энергия команды', value: '847', change: '+12%', icon: Zap, color: 'text-primary' },
    { label: 'Активные участники', value: `${teamCount}`, change: 'ОНЛАЙН', icon: Users, color: 'text-green-400' },
    { label: 'Постов сегодня', value: '12', change: '+8', icon: Activity, color: 'text-accent' },
    { label: 'Продуктивность', value: '94%', change: '+5%', icon: TrendingUp, color: 'text-yellow-400' },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="glass-card rounded-xl border border-primary/30 p-4 transition-all duration-300 hover:cyber-glow">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
              <stat.icon className={cx('h-5 w-5', stat.color)} />
            </div>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-mono text-green-400">{stat.change}</span>
          </div>
          <p className="font-mono text-2xl font-bold text-foreground">{stat.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

function TeamCarousel({
  team,
  loading,
  error,
  onNotify,
}: {
  team: TeamMember[];
  loading: boolean;
  error: string | null;
  onNotify: (message: string, tone?: 'success' | 'error' | 'info') => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [chargedIds, setChargedIds] = useState<Record<string, boolean>>({});
  const safeIndex = Math.min(activeIndex, Math.max(team.length - 1, 0));
  const nextMember = () => {
    if (team.length > 0) setActiveIndex((prev) => (prev + 1) % team.length);
  };
  const prevMember = () => {
    if (team.length > 0) setActiveIndex((prev) => (prev - 1 + team.length) % team.length);
  };
  const statusClass = (status?: string | null) => {
    const normalized = status?.toLowerCase();
    if (normalized?.includes('busy') || normalized?.includes('занят')) return 'bg-accent';
    if (normalized?.includes('away') || normalized?.includes('нет')) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="glass-card rounded-xl border border-primary/30 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Star className="h-4 w-4 text-primary" />
            Команда
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">Активных профилей: {team.length}</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={prevMember} className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-secondary/50 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={nextMember} className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-secondary/50 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      {loading && <p className="text-sm text-muted-foreground">Загрузка профилей...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!loading && !error && team.length === 0 && <p className="text-sm text-muted-foreground">Профили не найдены.</p>}
      {!loading && !error && team.length > 0 && (
        <>
          <div className="relative h-56 overflow-hidden">
            <div className="flex gap-4 transition-transform duration-500 ease-out" style={{ transform: `translateX(-${safeIndex * 220}px)` }}>
              {team.map((member, index) => {
                const name = member.full_name || member.username || 'Без имени';
                const status = member.status || member.role || 'в сети';
                const isCharged = !!chargedIds[member.id];
                return (
                  <div
                    key={member.id}
                    className={cx('w-52 shrink-0 cursor-pointer rounded-xl border p-4 transition-all duration-300', index === safeIndex ? 'scale-105 border-primary/50 bg-primary/10 cyber-glow' : 'border-primary/20 bg-secondary/30 hover:border-primary/40')}
                    onClick={() => setActiveIndex(index)}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="relative">
                        <div className={cx('flex h-14 w-14 items-center justify-center rounded-xl border text-xl font-bold transition-all', index === safeIndex ? 'border-primary/50 bg-gradient-to-br from-primary/30 to-accent/30 text-foreground' : 'border-primary/20 bg-secondary text-muted-foreground')}>
                          {(name[0] ?? 'U').toUpperCase()}
                        </div>
                        <div className={cx('absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-card', statusClass(status))} />
                      </div>
                      {member.role === 'admin' && <Crown className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <div className="mb-3">
                      <h3 className="flex items-center gap-2 font-semibold text-foreground">
                        {name}
                        {member.role === 'admin' && <Users className="h-3 w-3 text-primary" />}
                      </h3>
                      <p className="text-xs text-muted-foreground">{member.role || 'Участник'}</p>
                    </div>
                    <div className="mb-3 flex items-center gap-2">
                      <div className={cx('h-2 w-2 rounded-full', statusClass(status))} />
                      <span className="text-xs text-muted-foreground">{status}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-md bg-secondary/50 p-2 text-center">
                        <p className="text-muted-foreground">Задачи</p>
                        <p className="font-mono font-bold text-primary">{(member.id.length % 17) + 4}</p>
                      </div>
                      <div className="rounded-md bg-secondary/50 p-2 text-center">
                        <p className="text-muted-foreground">Энергия</p>
                        <p className="font-mono font-bold text-accent">{70 + (member.id.length % 27)}%</p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onNotify(`Чат с ${name} открыт`, 'info');
                        }}
                        className="rounded-md border border-primary/30 px-2 py-1 text-xs text-primary transition hover:border-primary/60 hover:cyber-glow"
                      >
                        Написать
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setChargedIds((prev) => ({ ...prev, [member.id]: !prev[member.id] }));
                          onNotify(`Импульс для ${name} отправлен`, 'success');
                        }}
                        className={cx(
                          'rounded-md border px-2 py-1 text-xs transition',
                          isCharged
                            ? 'border-accent/60 bg-accent/20 text-accent'
                            : 'border-primary/30 text-primary hover:border-primary/60 hover:cyber-glow',
                        )}
                      >
                        {isCharged ? 'Заряжено' : 'Зарядить'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-2">
            {team.map((member, index) => (
              <button key={member.id} type="button" onClick={() => setActiveIndex(index)} className={cx('h-2 w-2 rounded-full transition-all', index === safeIndex ? 'w-6 bg-primary' : 'bg-secondary hover:bg-primary/50')} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TeamCalendar({
  currentUserId,
  onNotify,
}: {
  currentUserId: string | null;
  onNotify: (message: string, tone?: 'success' | 'error' | 'info') => void;
}) {
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: 1, title: 'Демо с клиентом', time: '13:00' },
    { id: 2, title: 'Внутренний синк команды', time: '15:30' },
    { id: 3, title: 'Подготовка к презентации', time: '17:00' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const formattedDay = useMemo(
    () =>
      new Date().toLocaleDateString('ru-RU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }),
    [],
  );

  const createMeeting = async () => {
    if (!meetingTitle.trim() || !meetingTime.trim()) {
      onNotify('Заполните название и время встречи', 'error');
      return;
    }
    if (!currentUserId) {
      onNotify('Требуется авторизация для создания встречи', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const now = new Date();
      const [hours, minutes] = meetingTime.split(':').map(Number);
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
      const end = new Date(start.getTime() + 30 * 60 * 1000);
      const payload = {
        user_id: currentUserId,
        title: meetingTitle.trim(),
        description: 'Встреча из TEAM HUB',
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        is_demo_slot: false,
        is_booked: false,
      };
      const { data, error } = await supabase.from('events').insert(payload).select('id, title, start_time').single();
      if (error) throw error;

      const created = data as { id: string; title: string; start_time: string };
      const time = new Date(created.start_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      setEvents((prev) => [...prev, { id: Number(created.id.replace(/\D/g, '').slice(0, 9)) || Date.now(), title: created.title, time }].sort((a, b) => a.time.localeCompare(b.time)));
      setMeetingTitle('');
      setMeetingTime('');
      setIsModalOpen(false);
      onNotify('Встреча запланирована', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка создания встречи';
      onNotify(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="glass-card rounded-xl border border-primary/30 p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Clock className="h-4 w-4 text-primary" />
              Календарь команды
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">Доступные слоты и встречи</p>
            <p className="mt-2 text-xs font-mono uppercase tracking-wide text-primary">{formattedDay}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/40 bg-primary/15 text-primary transition hover:cyber-glow"
          >
            <UserPlus className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-2">
          {events.map((event) => (
            <div key={event.id} className="rounded-lg border border-primary/20 bg-secondary/30 p-3 text-sm text-foreground">
              {event.time} - {event.title}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="mt-4 w-full rounded-lg border border-primary/40 bg-primary/15 px-4 py-2 text-sm text-primary transition hover:cyber-glow"
        >
          Добавить встречу
        </button>
      </div>

      {isModalOpen && (
        <AppModal
          open={isModalOpen}
          title="Новая встреча"
          subtitle="Заполните название и время"
          onClose={() => setIsModalOpen(false)}
          maxWidthClassName="max-w-md"
          zIndexClassName="z-[70]"
        >
          {/* Fixed: Dashboard calendar uses shared UI-kit modal */}
          <div className="mt-2 space-y-3">
            <input
              type="text"
              placeholder="Название встречи"
              value={meetingTitle}
              onChange={(event) => setMeetingTitle(event.target.value)}
              className="w-full rounded-lg border border-primary/30 bg-secondary/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
            />
            <input
              type="time"
              value={meetingTime}
              onChange={(event) => setMeetingTime(event.target.value)}
              className="w-full rounded-lg border border-primary/30 bg-secondary/40 px-3 py-2 text-sm text-foreground focus:border-primary/60 focus:outline-none"
            />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-lg border border-primary/30 px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={createMeeting}
              disabled={submitting}
              className="rounded-lg border border-primary/50 bg-primary/20 px-3 py-2 text-sm text-primary transition hover:cyber-glow"
            >
              {submitting ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </AppModal>
      )}
    </>
  );
}

type FeedItem = {
  id: number;
  author: string;
  avatar: string;
  content: string;
  category: 'кибер-настрой' | 'обновление' | 'достижение';
  timestamp: string;
  likes: number;
  comments: number;
  charged: boolean;
};

function CyberFeed({ onCharge }: { onCharge: () => void }) {
  const { user } = useAuth();
  const [items, setItems] = useState<FeedItem[]>([
    {
      id: 1,
      author: 'Анастасия',
      avatar: 'A',
      content: 'Запустила новый модуль интерфейса. Эффективность системы выросла на 34%.',
      category: 'достижение',
      timestamp: '2 мин назад',
      likes: 24,
      comments: 8,
      charged: true,
    },
    {
      id: 2,
      author: 'Система',
      avatar: '⚡',
      content: 'Энергия команды на пике. Текущий командный импульс: 847 единиц продуктивности.',
      category: 'кибер-настрой',
      timestamp: '15 мин назад',
      likes: 42,
      comments: 12,
      charged: false,
    },
    {
      id: 3,
      author: 'Катя',
      avatar: 'K',
      content: 'Подготовила обновленные концепты интерфейса. Glassmorphism смотрится очень мощно.',
      category: 'обновление',
      timestamp: '1 час назад',
      likes: 18,
      comments: 5,
      charged: false,
    },
  ]);
  const categoryStyles: Record<FeedItem['category'], { bg: string; border: string; text: string; label: string }> = {
    'кибер-настрой': { bg: 'bg-accent/10', border: 'border-accent/40', text: 'text-accent', label: 'Кибер-настрой' },
    обновление: { bg: 'bg-primary/10', border: 'border-primary/40', text: 'text-primary', label: 'Обновление' },
    достижение: { bg: 'bg-green-500/10', border: 'border-green-500/40', text: 'text-green-400', label: 'Достижение' },
  };
  const [newPostText, setNewPostText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('feed_posts')
          .select('id, content, category, charge_count, created_at, profiles(full_name)')
          .order('created_at', { ascending: false })
          .limit(20);
        if (error) throw error;
        if (!data) return;
        const parsed: FeedItem[] = data.map((post: any, idx: number) => {
          const rawCategory = String(post.category ?? 'life');
          const category: FeedItem['category'] =
            rawCategory === 'motivation' ? 'кибер-настрой' : rawCategory === 'tech' ? 'обновление' : 'достижение';
          const fullName = Array.isArray(post.profiles) ? post.profiles[0]?.full_name : post.profiles?.full_name;
          return {
            id: Number(String(post.id).replace(/\D/g, '').slice(0, 9)) || idx + 1,
            author: fullName || 'Участник',
            avatar: (fullName?.[0] || 'U').toUpperCase(),
            content: String(post.content ?? ''),
            category,
            timestamp: new Date(String(post.created_at)).toLocaleString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }),
            likes: Number(post.charge_count ?? 0),
            comments: 0,
            charged: false,
          };
        });
        if (parsed.length > 0) setItems(parsed);
      } catch {
        // Fixed: fallback stays interactive even if DB fetch fails.
      }
    };
    void loadPosts();
  }, []);
  const handleCharge = (id: number) => {
    setItems((prev) => prev.map((item) => (item.id !== id ? item : { ...item, charged: !item.charged, likes: item.charged ? item.likes - 1 : item.likes + 1 })));
    onCharge();
  };
  return (
    <div className="glass-card flex h-full flex-col rounded-xl border border-primary/30 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <TrendingUp className="h-4 w-4 text-primary" />
          Лента команды
        </h2>
        <button className="cyber-glow-pink rounded-lg border border-accent/40 bg-accent/20 px-3 py-1.5 text-xs font-medium text-accent transition-all hover:bg-accent/30">
          <Sparkles className="mr-1 inline h-3 w-3" />
          Кибер-настрой
        </button>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Живая активность команды</p>
      <div className="mt-4 flex-1 space-y-4 overflow-y-auto pr-2">
        {items.map((item) => {
          const style = categoryStyles[item.category];
          return (
            <article key={item.id} className={cx('rounded-xl border p-4 transition-all duration-300 hover:scale-[1.02]', style.bg, style.border, item.category === 'кибер-настрой' && 'cyber-glow-pink')}>
              <div className="mb-3 flex items-center gap-3">
                <div className={cx('flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold', style.bg, style.border, style.text)}>{item.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{item.author}</span>
                    <span className={cx('rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider', style.bg, style.text)}>{style.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                </div>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-foreground/90">{item.content}</p>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => handleCharge(item.id)} className={cx('group flex items-center gap-1.5 text-xs transition-all', item.charged ? 'text-primary' : 'text-muted-foreground hover:text-primary')}>
                  <Zap className={cx('h-4 w-4 transition-all', item.charged && 'fill-primary text-glow')} />
                  <span className="font-mono">{item.likes}</span>
                  <span className="opacity-0 transition-opacity group-hover:opacity-100">Заряд</span>
                </button>
                <button type="button" onClick={() => alert('Открыть комментарии')} className="flex items-center gap-1.5 text-xs text-muted-foreground transition-all hover:text-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <span className="font-mono">{item.comments}</span>
                </button>
                <button type="button" onClick={() => alert('Ссылка скопирована')} className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground transition-all hover:text-foreground">
                  <Share2 className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => alert('Реакция добавлена')} className="flex items-center gap-1.5 text-xs text-muted-foreground transition-all hover:text-accent">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-3 border-t border-primary/20 pt-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/40 bg-primary/20 text-sm font-bold text-primary">+</div>
        <input type="text" placeholder="Поделиться импульсом..." className="flex-1 rounded-lg border border-primary/20 bg-secondary/50 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30" />
        <button
          type="button"
          onClick={async () => {
            if (!newPostText.trim()) {
              onCharge();
              return;
            }
            if (!user) {
              onCharge();
              return;
            }
            setSubmitting(true);
            try {
              const { error } = await supabase.from('feed_posts').insert({
                user_id: user.id,
                content: newPostText.trim(),
                category: 'life',
                charge_count: 0,
              });
              if (error) throw error;
              const optimistic: FeedItem = {
                id: Date.now(),
                author: 'Вы',
                avatar: 'Я',
                content: newPostText.trim(),
                category: 'достижение',
                timestamp: 'только что',
                likes: 0,
                comments: 0,
                charged: false,
              };
              setItems((prev) => [optimistic, ...prev]);
              setNewPostText('');
              onCharge();
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Не удалось опубликовать пост';
              onCharge();
              console.error(message);
            } finally {
              setSubmitting(false);
            }
          }}
          disabled={submitting}
          className="cyber-glow rounded-lg border border-primary/40 bg-primary/20 px-4 py-2 text-sm font-medium text-primary transition-all hover:border-primary/60 hover:bg-primary/30 disabled:opacity-60"
        >
          <Zap className="mr-1 inline h-4 w-4" />
          {submitting ? 'Публикация...' : 'Опубликовать'}
        </button>
      </div>
    </div>
  );
}

function Dashboard() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>('Команда');
  useEffect(() => {
    const loadProfiles = async () => {
      setLoading(true);
      const { data, error: profilesError } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (profilesError) {
        setError('Не удалось загрузить команду из базы данных.');
        setTeam([]);
        setLoading(false);
        return;
      }
      setTeam((data as TeamMember[]) ?? []);
      setError(null);
      setLoading(false);
    };
    void loadProfiles();
    const channel = supabase
      .channel('profiles-live-carousel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        void loadProfiles();
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);
  const notify = (message: string, tone: 'success' | 'error' | 'info' = 'info') => setToast({ message, tone });
  const handleCharge = () => notify('Импульс отправлен! ⚡️', 'success');
  useEffect(() => {
    if (!toast?.message) return;
    const timeoutId = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);
  const formattedDate = useMemo(
    () =>
      new Date().toLocaleDateString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    [],
  );
  const displayName = profile?.full_name || profile?.username || 'Участник';
  let mainSection: ReactNode;
  if (activeTab === 'Лента') {
    mainSection = <CyberFeed onCharge={handleCharge} />;
  } else if (activeTab === 'Календарь') {
    mainSection = (
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TeamCalendar currentUserId={user?.id ?? null} onNotify={notify} />
        </div>
        <div className="xl:col-span-1">
          <TeamCarousel team={team} loading={loading} error={error} onNotify={notify} />
        </div>
      </div>
    );
  } else {
    mainSection = (
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-1">
          <TeamCarousel team={team} loading={loading} error={error} onNotify={notify} />
          <TeamCalendar currentUserId={user?.id ?? null} onNotify={notify} />
        </div>
        <div className="xl:col-span-2">
          <CyberFeed onCharge={handleCharge} />
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/3 blur-3xl" />
      </div>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="relative ml-64 min-h-screen">
        <Header name={displayName} onProfileOpen={() => navigate('/profile')} />
        <div className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                С возвращением, <span className="text-glow text-primary">{displayName}</span>
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">LocalPulse TEAM HUB работает на пике эффективности</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-mono text-muted-foreground">{formattedDate}</p>
              <p className="mt-1 text-xs font-mono text-primary">СТАТУС ИМПУЛЬСА: АКТИВЕН</p>
            </div>
          </div>
          <StatsWidget teamCount={team.length} />
          {mainSection}
        </div>
      </main>
      {toast && <AppToast message={toast.message} tone={toast.tone} className="z-50 animate-slide-in" />}
    </div>
  );
}

function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Fixed: dedicated profile route + safe auth fallback */}
      <div className="mx-auto max-w-2xl glass-card rounded-xl border border-primary/30 p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-primary/40 bg-primary/20 text-primary">
            <UserCircle2 className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Профиль пользователя</h1>
            <p className="text-sm text-muted-foreground">Данные текущей сессии и аккаунта</p>
          </div>
        </div>
        <div className="space-y-3 rounded-lg border border-primary/20 bg-secondary/20 p-4 text-sm">
          <p><span className="text-muted-foreground">Имя:</span> {profile?.full_name || 'Не заполнено'}</p>
          <p><span className="text-muted-foreground">Логин:</span> {profile?.username || 'Не заполнено'}</p>
          <p><span className="text-muted-foreground">Роль:</span> {profile?.role || 'Участник'}</p>
          <p><span className="text-muted-foreground">Email:</span> {user.email || 'Не указан'}</p>
        </div>
        <div className="mt-6 flex gap-2">
          <button type="button" onClick={() => navigate('/')} className="rounded-lg border border-primary/30 px-4 py-2 text-sm text-primary transition hover:cyber-glow">
            Назад в хаб
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={async () => {
              setSubmitting(true);
              try {
                await signOut();
                navigate('/auth', { replace: true });
              } finally {
                setSubmitting(false);
              }
            }}
            className="rounded-lg border border-red-400/40 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
          >
            <LogOut className="mr-1 inline h-4 w-4" />
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse-glow rounded-xl border border-primary/30 px-4 py-2 text-sm text-primary">Проверка входа...</div>
      </div>
    );
  }
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse-glow rounded-xl border border-primary/30 px-4 py-2 text-sm text-primary">Инициализация...</div>
      </div>
    );
  }
  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="/book/:userId" element={<BookingPage />} />
      <Route path="*" element={<Navigate to={user ? '/' : '/auth'} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
