import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, Event, Profile } from '../lib/supabase';
import { Zap, ChevronLeft, Clock, Calendar, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import AppToast, { type ToastTone } from '../components/ui/AppToast';
import AppModal from '../components/ui/AppModal';

export default function BookingPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [demoSlots, setDemoSlots] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<Event | null>(null);
  const [booking, setBooking] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: ToastTone } | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [resultModal, setResultModal] = useState<{ title: string; message: string; tone: 'success' | 'error' }>({
    title: '',
    message: '',
    tone: 'success',
  });

  const notify = (message: string, tone: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, tone });
  };

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    // Fixed: all network requests are wrapped with try/catch + human-friendly feedback.
    const loadBookingData = async () => {
      if (!userId) {
        notify('Ссылка бронирования неполная. Пожалуйста, откройте корректное приглашение.', 'error');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data: prof, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        if (profileError) throw profileError;
        setProfile(prof);

        const now = new Date().toISOString();
        const { data: slots, error: slotsError } = await supabase
          .from('events')
          .select('*')
          .eq('user_id', userId)
          .eq('is_demo_slot', true)
          .eq('is_booked', false)
          .gte('start_time', now)
          .order('start_time')
          .limit(20);
        if (slotsError) throw slotsError;
        setDemoSlots(slots || []);
      } catch (error) {
        const technical = error instanceof Error ? error.message : '';
        notify(
          technical.toLowerCase().includes('jwt') || technical.toLowerCase().includes('auth')
            ? 'Похоже, сессия устарела. Обновите страницу или войдите заново.'
            : 'Не удалось загрузить слоты прямо сейчас. Это временно — попробуйте еще раз через минуту.',
          'error',
        );
      } finally {
        setLoading(false);
      }
    };
    void loadBookingData();
  }, [userId]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !booking.name || !booking.email) {
      notify('Заполните имя, email и выберите удобный слот.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const { error: err } = await supabase
        .from('events')
        .update({
          is_booked: true,
          booked_by_name: booking.name,
          booked_by_email: booking.email,
        })
        .eq('id', selectedSlot.id)
        .eq('is_booked', false);
      if (err) throw err;

      setResultModal({
        title: 'Встреча подтверждена',
        message: 'Слот успешно забронирован. Мы уже готовим подтверждение на вашу почту.',
        tone: 'success',
      });
      setIsResultModalOpen(true);
      setIsBookingModalOpen(false);
      setSelectedSlot(null);
      setBooking({ name: '', email: '', phone: '' });
      setDemoSlots((prev) => prev.filter((s) => s.id !== selectedSlot.id));
    } catch (error) {
      const technical = error instanceof Error ? error.message : '';
      const friendlyMessage =
        technical.toLowerCase().includes('jwt') || technical.toLowerCase().includes('auth')
          ? 'Сессия завершилась. Обновите страницу и повторите бронирование.'
          : 'Не удалось подтвердить слот. Возможно, его только что заняли. Выберите другой вариант.';
      notify(friendlyMessage, 'error');
      setResultModal({
        title: 'Не получилось завершить бронирование',
        message: friendlyMessage,
        tone: 'error',
      });
      setIsResultModalOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  function formatTime(iso: string) {
    return new Date(iso).toLocaleString('ru-RU', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  const avatar = profile?.full_name?.charAt(0).toUpperCase() || '?';

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 scanline">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative w-full max-w-2xl">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors mb-6 text-xs tracking-widest uppercase font-medium"
        >
          <ChevronLeft size={14} />
          Назад
        </button>

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 border border-blue-500 flex items-center justify-center glow-blue">
              <Zap size={20} className="text-blue-400" fill="currentColor" />
            </div>
            <span className="text-xl font-semibold tracking-[0.2em] text-white uppercase" style={{ fontFamily: 'Space Grotesk' }}>
              Cyber<span className="text-blue-400">Chic</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 tracking-widest uppercase">Бронирование демо</p>
        </div>

        {loading ? (
          <div className="glass rounded-sm p-8 text-center" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-slate-500">Загружаем доступные слоты...</p>
          </div>
        ) : !profile ? (
          <div className="glass rounded-sm p-8 text-center" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="mb-2 text-red-400">Профиль не найден</p>
            <p className="text-xs text-slate-600">Проверьте ссылку и попробуйте снова.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fixed: clearer Russian copy and status hints */}
            <div className="glass rounded-sm p-6" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-center mb-6">
                <div
                  className="w-16 h-16 rounded-sm flex items-center justify-center text-2xl font-semibold text-white mx-auto mb-3"
                  style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.2)' }}
                >
                  {avatar}
                </div>
                <h2 className="text-lg font-semibold text-white">{profile.full_name}</h2>
                <p className="text-xs text-slate-600 mt-1">@{profile.username}</p>
              </div>

              <div className="space-y-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {profile.bio && (
                  <div>
                    <p className="text-xs text-slate-600 tracking-widest uppercase mb-1">О себе</p>
                    <p className="text-sm text-slate-300">{profile.bio}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-600 tracking-widest uppercase mb-1">Роль</p>
                  <p className="text-sm text-blue-400 capitalize font-medium">{profile.role}</p>
                </div>
              </div>

              <p className="text-[10px] text-slate-700 mt-4 tracking-wider">ДОСТУПНЫЕ СЛОТЫ</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">{demoSlots.length}</p>
            </div>

            <div className="lg:col-span-2 glass rounded-sm p-6" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 className="text-sm font-semibold tracking-widest uppercase text-white mb-6">Выберите слот</h3>

              {demoSlots.length === 0 ? (
                <div className="text-center py-12 text-slate-600">
                  <Calendar size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm tracking-wider">Сейчас свободных слотов нет</p>
                  <p className="text-xs text-slate-700 mt-1">Проверьте чуть позже, новые окна появляются регулярно.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                    {demoSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => {
                          setSelectedSlot(slot);
                          setIsBookingModalOpen(true);
                        }}
                        className={`w-full p-3 rounded-sm border transition-all text-left ${
                          selectedSlot?.id === slot.id
                            ? 'bg-blue-600/20 border-blue-500/50'
                            : 'border-white/8 hover:border-blue-500/30 hover:bg-white/4'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-slate-500 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">{formatTime(slot.start_time)}</p>
                            {slot.description && (
                              <p className="text-xs text-slate-600 truncate">{slot.description}</p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <AppModal
        open={isBookingModalOpen && !!selectedSlot}
        title="Подтвердите бронирование"
        subtitle={selectedSlot ? `Слот: ${formatTime(selectedSlot.start_time)}` : undefined}
        onClose={() => setIsBookingModalOpen(false)}
        maxWidthClassName="max-w-lg"
        zIndexClassName="z-[80]"
      >
        {/* Fixed: booking flow now uses shared UI-kit modal component */}
        <form onSubmit={handleBook} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate-500">Ваше имя</label>
            <input
              type="text"
              value={booking.name}
              onChange={(e) => setBooking((p) => ({ ...p, name: e.target.value }))}
              placeholder="Например: Анна Смирнова"
              required
              className="w-full rounded-lg border border-primary/25 bg-secondary/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate-500">Email</label>
            <input
              type="email"
              value={booking.email}
              onChange={(e) => setBooking((p) => ({ ...p, email: e.target.value }))}
              placeholder="you@company.com"
              required
              className="w-full rounded-lg border border-primary/25 bg-secondary/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-slate-500">Телефон (необязательно)</label>
            <input
              type="tel"
              value={booking.phone}
              onChange={(e) => setBooking((p) => ({ ...p, phone: e.target.value }))}
              placeholder="+7 900 000-00-00"
              className="w-full rounded-lg border border-primary/25 bg-secondary/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsBookingModalOpen(false)}
              className="rounded-lg border border-primary/30 px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg border border-primary/50 bg-primary/20 px-3 py-2 text-sm font-medium text-primary transition hover:cyber-glow disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-1 inline h-4 w-4 animate-spin" />
                  Бронируем...
                </>
              ) : (
                'Подтвердить'
              )}
            </button>
          </div>
        </form>
      </AppModal>

      <AppModal
        open={isResultModalOpen}
        title={resultModal.title}
        onClose={() => setIsResultModalOpen(false)}
        maxWidthClassName="max-w-md"
        zIndexClassName="z-[85]"
      >
        {/* Fixed: result state also moved to shared modal for visual consistency */}
        <div className="mb-3 flex items-center gap-2">
          {resultModal.tone === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-400" />
          )}
          <p className="text-sm text-muted-foreground">{resultModal.message}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsResultModalOpen(false)}
          className="mt-3 w-full rounded-lg border border-primary/40 bg-primary/20 px-3 py-2 text-sm text-primary transition hover:cyber-glow"
        >
          Понятно
        </button>
      </AppModal>

      {toast && <AppToast message={toast.message} tone={toast.tone} />}
    </div>
  );
}
