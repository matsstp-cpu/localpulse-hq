"use client";
import { LayoutDashboard, Users, Folders, Zap, Settings, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: Users, label: "Clients & Leads" },
  { icon: Folders, label: "Projects" },
  { icon: Zap, label: "Automations" },
  { icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const [activeItem, setActiveItem] = useState("Overview");

  return (
    <aside className="w-64 h-full bg-surface/30 border-r border-white/5 flex flex-col backdrop-blur-xl shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center shadow-glow">
            <Zap className="w-3.5 h-3.5 text-background" />
          </div>
          <span className="font-semibold text-slate-100 tracking-tight text-lg">LocalPulse</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-4 px-2 mt-2">Menu</div>
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setActiveItem(item.label)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group",
              activeItem === item.label
                ? "bg-accent/10 text-accent border border-accent/10 shadow-[inset_0_0_12px_rgba(34,211,238,0.05)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
            )}
          >
            <item.icon className={cn(
              "w-4 h-4 transition-transform duration-200",
              activeItem === item.label ? "scale-110" : "group-hover:scale-110"
            )} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 bg-gradient-to-b from-transparent to-surface/50">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-sm font-medium group-hover:shadow-glow transition-all">
            AM
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-slate-200 truncate">Anastasia Mats</p>
            <p className="text-xs text-muted truncate">BDM</p>
          </div>
        </div>
        <div className="mt-3 px-3 flex items-center gap-2 text-[11px] text-muted font-medium">
          <Building2 className="w-3.5 h-3.5" />
          <span className="truncate">LocalTrans & Custom.MT</span>
        </div>
      </div>
    </aside>
  );
}
