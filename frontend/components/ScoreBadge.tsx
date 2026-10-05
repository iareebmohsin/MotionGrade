import { ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";
import type { OverallScore } from "@/types/analysis";

const CONFIG: Record<
  OverallScore,
  {
    label: string;
    hint: string;
    bars: number;
    Icon: React.ComponentType<{ className?: string }>;
    text: string;
    fill: string;
    iconBox: string;
    border: string;
    chip: string;
  }
> = {
  good: {
    label: "Solid form",
    hint: "Keep doing what you are doing.",
    bars: 3,
    Icon: ShieldCheck,
    text: "text-emerald-300",
    fill: "bg-emerald-400",
    iconBox: "bg-emerald-400/10",
    border: "border-emerald-400/30",
    chip: "bg-emerald-400/10 border-emerald-400/30 text-emerald-300",
  },
  needs_improvement: {
    label: "Room to improve",
    hint: "One or two things to work on next session.",
    bars: 2,
    Icon: AlertTriangle,
    text: "text-amber-300",
    fill: "bg-amber-400",
    iconBox: "bg-amber-400/10",
    border: "border-amber-400/30",
    chip: "bg-amber-400/10 border-amber-400/30 text-amber-300",
  },
  poor: {
    label: "Needs work",
    hint: "Drop the weight and rebuild the pattern.",
    bars: 1,
    Icon: ShieldAlert,
    text: "text-rose-300",
    fill: "bg-rose-400",
    iconBox: "bg-rose-400/10",
    border: "border-rose-400/30",
    chip: "bg-rose-400/10 border-rose-400/30 text-rose-300",
  },
};

export function ScoreBadge({
  score,
  compact = false,
  delay = 0,
}: {
  score: OverallScore;
  compact?: boolean;
  delay?: number;
}) {
  const c = CONFIG[score];
  const { Icon } = c;

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold ${c.chip}`}>
        <Icon className="w-3.5 h-3.5" />
        {c.label}
      </span>
    );
  }

  return (
    <div
      className={`animate-score-reveal panel p-5 flex items-center gap-4 ${c.border}`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${c.iconBox}`}>
        <Icon className={`w-6 h-6 ${c.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white/35 text-[0.7rem] uppercase tracking-[0.2em] font-semibold">Overall grade</p>
        <p className={`text-xl font-semibold ${c.text}`}>{c.label}</p>
        <p className="text-white/40 text-xs mt-0.5">{c.hint}</p>
      </div>
      <div className="flex gap-1 shrink-0">
        {[0, 1, 2].map((i) => (
          <span key={i} className={`w-2 h-8 rounded-full ${i < c.bars ? c.fill : "bg-white/10"}`} />
        ))}
      </div>
    </div>
  );
}
