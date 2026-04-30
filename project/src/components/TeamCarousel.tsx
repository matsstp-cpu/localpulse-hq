import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';

const TeamCarousel = ({ members }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Навигация
  const next = () => setCurrentIndex((prev) => (prev + 1) % members.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + members.length) % members.length);

  return (
    <div className="relative group p-8 bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
      {/* Заголовок секции */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-cyan-400 font-mono text-sm tracking-widest uppercase">Core Team // Команда</h3>
        <div className="flex gap-2">
          <button onClick={prev} className="p-1 hover:bg-cyan-500/20 rounded border border-white/10 transition-all">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next} className="p-1 hover:bg-cyan-500/20 rounded border border-white/10 transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Сама карусель */}
      <div className="relative h-[200px]">
        <div 
          className="flex transition-transform duration-500 ease-in-out" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {members.map((member, index) => (
            <div key={member.id} className="min-w-full px-2">
              <div className={`p-6 rounded-xl border transition-all duration-500 ${
                index === currentIndex 
                ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
                : 'bg-transparent border-transparent opacity-30 scale-95 blur-[1px]'
              }`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-2xl font-bold border-2 border-white/20">
                    {member.name[0]}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white tracking-tight">{member.name}</h4>
                    <p className="text-cyan-400 text-sm font-mono">{member.role}</p>
                    <div className="mt-2 flex gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-400 uppercase">Active</span>
                      {member.role === 'Dev' && <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 uppercase">System Admin</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamCarousel;
