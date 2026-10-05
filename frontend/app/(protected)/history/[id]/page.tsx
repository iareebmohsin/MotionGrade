"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { getAnalysisById, deleteAnalysis, skeletonVideoUrl } from "@/lib/api";
import { ScoreBadge } from "@/components/ScoreBadge";
import { FeedbackList } from "@/components/FeedbackList";
import { CameraErrorCard } from "@/components/CameraErrorCard";
import type { Analysis } from "@/types/analysis";

function In({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <div className={`animate-slide-up ${className}`} style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}>
      {children}
    </div>
  );
}

function DeleteModal({
  onConfirm,
  onCancel,
  deleting,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
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
        <h3 className="text-white font-semibold text-lg mb-2">Delete this session?</h3>
        <p className="text-white/45 text-sm mb-6">
          The report and its tracked video will be permanently removed. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={close} disabled={deleting} className="btn-ghost flex-1 py-2.5 text-sm">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={deleting} className="btn-danger flex-1 py-2.5 text-sm font-medium">
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AnalysisDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getAnalysisById(Number(id))
      .then(setAnalysis)
      .catch(() => setAnalysis(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteAnalysis(Number(id));
      router.push("/history");
    } catch {
      setDeleting(false);
      setShowModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] text-white/30 text-sm animate-pulse">Loading…</div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-3 animate-fade-in" style={{ animationFillMode: "both" }}>
        <p className="text-white/40 text-sm">That session does not exist.</p>
        <Link href="/history" className="btn-ghost px-4 py-2 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to sessions
        </Link>
      </div>
    );
  }

  const cameraError = analysis.feedbackItems.find((i) => i.aspect === "camera_angle");

  if (cameraError) {
    return (
      <div className="relative mx-auto max-w-lg px-4 py-12">
        <CameraErrorCard message={cameraError.message} />
      </div>
    );
  }

  const n = analysis.feedbackItems.length;
  const feedbackDelay = 320;
  const deleteDelay = feedbackDelay + n * 150 + 200;

  return (
    <>
      {showModal && <DeleteModal onConfirm={handleDelete} onCancel={() => setShowModal(false)} deleting={deleting} />}

      <div className="relative mx-auto max-w-6xl px-6 sm:px-10 h-[calc(100vh-64px)] flex flex-col py-6">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-5 animate-fade-in">
          <div>
            <Link href="/history" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/80 text-xs mb-2 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Sessions
            </Link>
            <h1 className="text-2xl font-semibold text-white tracking-tight capitalize">
              {analysis.exerciseId.replace(/_/g, " ")}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="chip capitalize">{analysis.muscleGroup}</span>
            <span className="chip">{new Date(analysis.createdAt).toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-5 flex-1 min-h-0">
          <In delay={100} className="flex flex-col min-h-0">
            {analysis.skeletonVideoPath ? (
              <div className="panel p-4 flex flex-col flex-1 min-h-0">
                <p className="eyebrow mb-3 shrink-0">Joint tracking</p>
                <video
                  src={skeletonVideoUrl(analysis.id)}
                  controls
                  playsInline
                  className="flex-1 min-h-0 w-full rounded-lg bg-black"
                  onLoadedMetadata={(e) => {
                    e.currentTarget.currentTime = 0.04;
                  }}
                />
              </div>
            ) : (
              <div className="panel p-5 flex-1 flex items-center justify-center">
                <span className="text-white/25 text-sm">No tracked video for this session</span>
              </div>
            )}
          </In>

          <div className="flex flex-col gap-4 min-h-0">
            <ScoreBadge score={analysis.overallScore} delay={200} />

            <div className="flex flex-col gap-4 overflow-y-auto scrollbar-hide flex-1 min-h-0">
              {n > 0 && (
                <In delay={feedbackDelay}>
                  <div className="panel p-5">
                    <p className="eyebrow mb-4">What we saw</p>
                    <FeedbackList items={analysis.feedbackItems} baseDelay={feedbackDelay} />
                  </div>
                </In>
              )}

              <In delay={deleteDelay}>
                <button onClick={() => setShowModal(true)} disabled={deleting} className="btn-danger w-full py-3 text-sm">
                  <Trash2 className="w-4 h-4" />
                  Delete session
                </button>
              </In>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
