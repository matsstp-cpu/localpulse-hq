import { useState } from 'react';
import { Send, MessageSquare, Heart, Share2, Sparkles } from 'lucide-react';
import ProfileCard from './ProfileCard';

interface Post {
  id: string;
  author: string;
  role: string;
  content: string;
  timestamp: string;
  likes: number;
}

export default function CyberFeed() {
  const [posts] = useState<Post[]>([
    {
      id: '1',
      author: 'Босс',
      role: 'CEO LocalTrans',
      content: 'Команда, мы официально перешли на модель тех-провайдера! Наш новый портал управления переводами запущен. Работаем! 🚀',
      timestamp: '2 часа назад',
      likes: 12
    },
    {
      id: '2',
      author: 'Настя',
      role: 'Marketing Lead',
      content: 'Готовлю рассылку к 10 марта для нашего Localization Insider Club. Есть идеи по харизматичным заголовкам?',
      timestamp: '5 часов назад',
      likes: 8
    }
  ]);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
      
      {/* ЛЕВАЯ КОЛОНКА: Профиль */}
      <aside className="lg:col-span-4 space-y-6">
        <ProfileCard 
          name="Анастасия" 
          role="Business Development Manager" 
          company="LocalTrans & Custom.MT" 
        />
        
        {/* Доп. блок: Статистика (просто для стиля) */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 bg-white/[0.02]">
          <h3 className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mb-4">Статистика Лидов</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-xs text-slate-400">В работе</span>
              <span className="text-lg font-mono text-white">24</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-[70%] cyber-glow" />
            </div>
          </div>
        </div>
      </aside>

      {/* ЦЕНТРАЛЬНАЯ КОЛОНКА: Посты */}
      <main className="lg:col-span-8 space-y-6">
        
        {/* Форма создания поста */}
        <div className="glass-card rounded-3xl p-4 border border-white/10 bg-white/[0.03]">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Sparkles size={18} className="text-blue-400" />
            </div>
            <input 
              type="text" 
              placeholder="Что нового в LocalTrans?" 
              className="flex-1 bg-transparent border-none text-white placeholder:text-slate-600 outline-none text-sm"
            />
            <button className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all active:scale-90">
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Список постов */}
        {posts.map((post) => (
          <article key={post.id} className="glass-card rounded-3xl p-6 border border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/10" />
                <div>
                  <h4 className="text-sm font-bold text-white">{post.author}</h4>
                  <p className="text-[10px] text-blue-400 uppercase tracking-wider font-medium">{post.role}</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 uppercase">{post.timestamp}</span>
            </div>
            
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {post.content}
            </p>

            <div className="flex gap-6 border-t border-white/5 pt-4">
              <button className="flex items-center gap-2 text-slate-500 hover:text-pink-500 transition-colors group">
                <Heart size={16} className="group-active:scale-125 transition-transform" />
                <span className="text-xs font-mono">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors">
                <MessageSquare size={16} />
                <span className="text-xs font-mono">Комментировать</span>
              </button>
              <button className="ml-auto text-slate-500 hover:text-white">
                <Share2 size={16} />
              </button>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
}
