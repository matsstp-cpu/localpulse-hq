import React, { useState, useEffect } from 'react';
import { Send, AlertCircle } from 'lucide-react';

const CyberFeed = ({ supabase }) => {
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [loading, setLoading] = useState(false);

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setPosts(data);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSend = async () => {
    if (!newPostText.trim()) return;
    setLoading(true);
    
    const { error } = await supabase
      .from('posts')
      .insert([{ content: newPostText, author_role: 'BDM' }]); // Роль зафиксирована согласно твоему профилю

    if (!error) {
      setNewPostText('');
      loadPosts();
    }
    setLoading(false);
  };

  return (
    <div className="glass-card p-4 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {posts.map(post => (
          <div key={post.id} className="border-l-2 border-cyan-500 pl-3 py-1 bg-white/5">
            <p className="text-sm text-gray-300">{post.content}</p>
          </div>
        ))}
      </div>
      <div className="relative mt-auto">
        <input 
          type="text" 
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Поделиться импульсом..." 
          className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 pr-10 text-sm focus:border-cyan-500 outline-none transition-all"
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="absolute right-2 top-1.5 text-cyan-500 hover:text-cyan-400 disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
