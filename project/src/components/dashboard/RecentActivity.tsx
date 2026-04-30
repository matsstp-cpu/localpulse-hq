import { CheckCircle2, Info, ArrowUpRight } from "lucide-react";

const activities = [
  { id: 1, title: "Leads imported", desc: "Global Tech Forum 2026 segment", time: "2 hours ago", icon: ArrowUpRight, color: "text-accent" },
  { id: 2, title: "Campaign deployed", desc: "Localization Insider Club Workshop", time: "5 hours ago", icon: CheckCircle2, color: "text-emerald-400" },
  { id: 3, title: "AmoCRM Sync", desc: "Funnel stages updated automatically", time: "1 day ago", icon: Info, color: "text-blue-400" },
];

export function RecentActivity() {
  return (
    <div className="space-y-6">
      {activities.map((item, i) => (
        <div key={item.id} className="flex gap-4 relative group cursor-default">
          {i !== activities.length - 1 && (
            <div className="absolute top-8 left-4 bottom-[-16px] w-[1px] bg-white/5 group-hover:bg-white/10 transition-colors" />
          )}
          <div className={`w-8 h-8 rounded-full bg-surface border border-white/5 flex items-center justify-center shrink-0 z-10 group-hover:border-white/20 transition-colors ${item.color}`}>
            <item.icon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <p className="text-sm font-medium text-slate-200">{item.title}</p>
            <p className="text-xs text-muted mt-0.5 truncate">{item.desc}</p>
          </div>
          <div className="text-[10px] text-muted font-medium pt-1 shrink-0">{item.time}</div>
        </div>
      ))}
    </div>
  );
}
