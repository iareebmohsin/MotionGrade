"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Trash2 } from "lucide-react";
import { getAnalyses, deleteAllAnalyses } from "@/lib/api";
import { ScoreBadge } from "@/components/ScoreBadge";
import type { Analysis } from "@/types/analysis";

function ClearAllModal({
  onConfirm,
  onCancel,
  clearing,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  clearing: boolean;
}) {
  const [closing, setClosing] = useState(false);

  const close = () => {
    setClosing(true);
    setTimeout(onCancel, 280);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm ${closing ? "animate-fade-out" : "animate-fade-in"}`}
        style={{ animationFillMode: "both" }}
        onClick={close}
      />
      <div
        className={`relative panel p-6 w-full max-w-sm ${closing ? "animate-slide-down-out" : "animate-slide-up"}`}
        style={{ animationFillMode: "both" }}
      >
        <h3 className="text-white font-semibold text-lg mb-2">Clear every session?</h3>
        <p className="text-white/45 text-sm mb-6">
          All reports and their tracked videos will be permanently removed. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={close} disabled={clearing} className="btn-ghost flex-1 py-2.5 text-sm">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={clearing} className="btn-danger flex-1 py-2.5 text-sm font-medium">
            {clearing ? "Clearing…" : "Clear all"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    getAnalyses()
      .then(setAnalyses)
      .catch(() => setError("Could not load your sessions. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const handleClearAll = async () => {
    setClearing(true);
    try {
      await deleteAllAnalyses();
      setAnalyses([]);
      setShowClearModal(false);
    } catch {
      setShowClearModal(false);
    } finally {
      setClearing(false);
    }
  };

  return (
    <>
      {showClearModal && (
        <ClearAllModal onConfirm={handleClearAll} onCancel={() => setShowClearModal(false)} clearing={clearing} />
      )}

      <div className="relative mx-auto max-w-3xl px-6 sm:px-10 py-10 pb-20">
        <div className="flex items-end justify-between mb-8 animate-fade-in" style={{ animationFillMode: "both" }}>
          <div>
            <p className="eyebrow">Archive</p>
            <h1 className="text-2xl font-semibold text-white tracking-tight mt-1">Past sessions</h1>
          </div>

          {analyses.length > 0 && (
            <button onClick={() => setShowClearModal(true)} className="btn-ghost px-3 py-1.5 text-xs hover:!text-rose-300 hover:!border-rose-500/40">
              <Trash2 className="w-3.5 h-3.5" />
              Clear all
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-white/30 text-sm text-center py-12 animate-pulse">Loading…</div>
        ) : error ? (
          <div className="panel p-6 text-center text-rose-300/80 text-sm animate-fade-in" style={{ animationFillMode: "both" }}>
            {error}
          </div>
        ) : analyses.length === 0 ? (
          <div className="panel p-10 text-center animate-fade-in" style={{ animationFillMode: "both" }}>
            <p className="text-white/70 font-medium">Nothing graded yet</p>
            <p className="text-white/35 text-sm mt-1">Upload a clip from the Analyze tab and it will show up here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {analyses.map((a, i) => (
              <Link
                key={a.id}
                href={`/history/${a.id}`}
                className="panel px-5 py-4 flex items-center gap-5 hover:border-white/25 hover:bg-raised transition-all duration-200 group animate-fade-in"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
              >
                <span className="font-mono text-xs text-white/25 w-7 shrink-0">
                  {String(analyses.length - i).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="text-white/90 font-medium capitalize">{a.exerciseId.replace(/_/g, " ")}</span>
                    <span className="chip capitalize py-0.5">{a.muscleGroup}</span>
                  </div>
                  <span className="text-white/35 text-xs">{new Date(a.createdAt).toLocaleString()}</span>
                </div>
                <div className="shrink-0">
                  <ScoreBadge score={a.overallScore} compact />
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-accent transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
