import { Check, AlertTriangle, X } from "lucide-react";
import type { FeedbackItem, FeedbackStatus } from "@/types/analysis";

const STATUS: Record<
  FeedbackStatus,
  { Icon: React.ComponentType<{ className?: string }>; bar: string; icon: string }
> = {
  ok: { Icon: Check, bar: "bg-emerald-400", icon: "text-emerald-400" },
  warning: { Icon: AlertTriangle, bar: "bg-amber-400", icon: "text-amber-400" },
  error: { Icon: X, bar: "bg-rose-400", icon: "text-rose-400" },
};

export function FeedbackList({ items, baseDelay = 0 }: { items: FeedbackItem[]; baseDelay?: number }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => {
        const s = STATUS[item.status as FeedbackStatus];
        const { Icon } = s;
        return (
          <li
            key={item.id}
            className="flex items-start gap-3 rounded-lg bg-[#0d0d0d] border border-white/[0.06] px-4 py-3 animate-slide-up"
            style={{ animationDelay: `${baseDelay + i * 150}ms`, animationFillMode: "both" }}
          >
            <span className={`w-1 self-stretch rounded-full shrink-0 ${s.bar}`} />
            <Icon className={`w-4 h-4 shrink-0 mt-1 ${s.icon}`} />
            <div className="min-w-0">
              <p className="font-medium capitalize text-white/90 text-sm">{item.aspect.replace(/_/g, " ")}</p>
              <p className="text-sm text-white/45 mt-0.5 leading-relaxed">{item.message}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
