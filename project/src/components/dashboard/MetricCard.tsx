import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  isPositive: boolean;
}

export function MetricCard({ title, value, change, icon: Icon, isPositive }: MetricCardProps) {
  return (
    <div className="glass-panel-interactive rounded-2xl p-5 flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-500 -mr-10 -mt-10 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-medium text-muted">{title}</h3>
        <div className="p-2 bg-surface rounded-lg border border-white/5 group-hover:border-accent/20 transition-colors">
          <Icon className="w-4 h-4 text-slate-300 group-hover:text-accent transition-colors" />
        </div>
      </div>
      
      <div className="relative z-10">
        <p className="text-3xl font-semibold text-slate-100 tracking-tight mb-1">{value}</p>
        <p className={cn(
          "text-xs font-medium flex items-center gap-1",
          isPositive ? "text-emerald-400" : "text-rose-400"
        )}>
          <span>{isPositive ? "↑" : "↓"}</span>
          {change}
        </p>
      </div>
    </div>
  );
}
