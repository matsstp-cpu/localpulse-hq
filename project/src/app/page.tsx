"use client";
import { useState } from "react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TrendingUp, Users, Target, Zap } from "lucide-react";

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("30d");

  const metrics = [
    { title: "Active Leads", value: "842", change: "+24 AmoCRM sync", icon: Users, isPositive: true },
    { title: "Conversion Rate", value: "18.2%", change: "+2.1% this month", icon: Target, isPositive: true },
    { title: "Pipeline Value", value: "$124,500", change: "+$12k expected", icon: TrendingUp, isPositive: true },
    { title: "Automations", value: "98.9%", change: "Zero failures", icon: Zap, isPositive: true },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Overview</h1>
          <p className="text-sm text-muted mt-1">Добро пожаловать в LocalPulse. Системы работают стабильно.</p>
        </div>
        
        <div className="flex bg-surface/50 p-1 rounded-lg border border-white/5 backdrop-blur-md shrink-0">
          {["7d", "30d", "90d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                timeRange === range 
                  ? "bg-slate-800 text-slate-100 shadow-sm border border-white/10" 
                  : "text-muted hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <MetricCard key={i} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel-interactive rounded-2xl p-6 min-h-[400px] flex flex-col relative overflow-hidden group">
          <div className="absolute inset-0 bg-glass-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h2 className="text-lg font-medium text-slate-100 mb-6 relative z-10">Sales Funnel Health</h2>
          
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/[0.02] relative z-10 group-hover:border-white/20 transition-colors">
            <p className="text-sm text-muted flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Chart Data (Supabase Analytics) — Ready to connect
            </p>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-lg font-medium text-slate-100 mb-6">Recent Activity</h2>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
