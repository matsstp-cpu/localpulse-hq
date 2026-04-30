"use client";
import { Search, Bell } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 border-b border-white/5 bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative group w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
          <input 
            type="text" 
            placeholder="Search leads, projects, or commands..." 
            className="w-full bg-surface/50 border border-white/5 rounded-full py-1.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all shadow-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="text-[10px] font-medium text-muted bg-white/5 px-1.5 py-0.5 rounded border border-white/10">⌘</kbd>
            <kbd className="text-[10px] font-medium text-muted bg-white/5 px-1.5 py-0.5 rounded border border-white/10">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-pulse-slow absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
          </div>
          <span className="text-xs font-medium text-slate-300">Systems Active</span>
        </div>
        
        <button className="relative text-muted hover:text-slate-200 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full shadow-glow"></span>
        </button>
      </div>
    </header>
  );
}
