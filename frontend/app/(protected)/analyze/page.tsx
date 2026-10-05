"use client";

import { useState, useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react";
import { UploadZone } from "@/components/UploadZone";
import { ScoreBadge } from "@/components/ScoreBadge";
import { FeedbackList } from "@/components/FeedbackList";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { CameraErrorCard } from "@/components/CameraErrorCard";
import { analyzeVideo, skeletonVideoUrl } from "@/lib/api";
import type { Analysis } from "@/types/analysis";

function AnimatedSection({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={`animate-slide-up ${className}`} style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}>
      {children}
    </div>
  );
}

export default function AnalyzePage() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorExiting, setErrorExiting] = useState(false);
  // Tracks whether upload is done so the interval can simulate processing (60→97%)
  const uploadDoneRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cancel in-flight XHR if the component unmounts during analysis
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Warn before tab close/refresh while analysis is running
  useEffect(() => {
    if (!loading) return;
    const prevent = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [loading]);

  useEffect(() => {
    if (!loading) return;
    uploadDoneRef.current = false;
    const interval = setInterval(() => {
      if (uploadDoneRef.current) {
        // Steady slow increment — reaches 99% in ~70s so bar never stalls visually
        setProgress((p) => Math.min(p + 0.3 + Math.random() * 0.15, 99));
      }
    }, 700);
    return () => clearInterval(interval);
  }, [loading]);

  const handleAnalyze = async (file: File, exerciseId: string) => {
    abortControllerRef.current = new AbortController();
    setLoading(true);
    setProgress(1); // Start at 1% immediately so bar is never empty
    setError(null);
    setResult(null);
    try {
      const analysis = await analyzeVideo(
        file,
        exerciseId,
        (p) => {
          // api.ts sends 0-60 for upload bytes, 100 when request completes.
          // Map 0-60 → 1-55% so the bar starts smoothly from 1 instead of jumping.
          if (p <= 60) setProgress(1 + (p / 60) * 54);
          if (p >= 60) uploadDoneRef.current = true;
        },
        abortControllerRef.current.signal
      );
      setProgress(100);
      await new Promise((r) => setTimeout(r, 350));
      setResult(analysis);
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      setError(e instanceof Error ? e.message : "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const dismissError = () => {
    setErrorExiting(true);
    setTimeout(() => {
      setError(null);
      setErrorExiting(false);
    }, 250);
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setProgress(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] px-4">
        <div className="panel p-8 animate-fade-in w-full max-w-md">
          <LoadingOverlay progress={progress} />
          <p className="text-white/35 text-xs text-center mt-2">Keep this tab open while the clip is processed.</p>
        </div>
      </div>
    );
  }

  if (result) {
    const cameraError = result.feedbackItems.find((i) => i.aspect === "camera_angle");
    if (cameraError) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-64px)] px-4 animate-fade-in" style={{ animationFillMode: "both" }}>
          <div className="w-full max-w-lg">
            <CameraErrorCard message={cameraError.message} />
            <div className="mt-4 flex justify-center">
              <button onClick={reset} className="btn-ghost px-5 py-2.5 text-sm">
                <RotateCcw className="w-4 h-4" />
                Try a different clip
              </button>
            </div>
          </div>
        </div>
      );
    }

    const n = result.feedbackItems.length;
    const feedbackDelay = 320;
    const resetDelay = feedbackDelay + n * 150 + 200;

    return (
      <div className="relative mx-auto max-w-6xl px-6 sm:px-10 h-[calc(100vh-64px)] flex flex-col py-6">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-5 animate-fade-in">
          <div>
            <p className="eyebrow">Report</p>
            <h1 className="text-2xl font-semibold text-white tracking-tight capitalize mt-1">
              {result.exerciseId.replace(/_/g, " ")}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="chip capitalize">{result.muscleGroup}</span>
            <span className="chip">{new Date(result.createdAt).toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-5 flex-1 min-h-0">
          {/* Video */}
          <AnimatedSection delay={100} className="flex flex-col min-h-0">
            {result.skeletonVideoPath ? (
              <div className="panel p-4 flex flex-col flex-1 min-h-0">
                <p className="eyebrow mb-3 shrink-0">Joint tracking</p>
                <video
                  src={skeletonVideoUrl(result.id)}
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
          </AnimatedSection>

          {/* Grade + notes */}
          <div className="flex flex-col gap-4 min-h-0">
            <ScoreBadge score={result.overallScore} delay={200} />

            <div className="flex flex-col gap-4 overflow-y-auto scrollbar-hide flex-1 min-h-0">
              {n > 0 && (
                <AnimatedSection delay={feedbackDelay}>
                  <div className="panel p-5">
                    <p className="eyebrow mb-4">What we saw</p>
                    <FeedbackList items={result.feedbackItems} baseDelay={feedbackDelay} />
                  </div>
                </AnimatedSection>
              )}

              <AnimatedSection delay={resetDelay}>
                <button onClick={reset} className="btn-ghost w-full py-3 text-sm">
                  <RotateCcw className="w-4 h-4" />
                  Grade another clip
                </button>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-xl px-6 py-10">
      <div className="mb-6 animate-fade-in">
        <p className="eyebrow">New session</p>
        <h1 className="text-2xl font-semibold text-white tracking-tight mt-1">Upload a set to grade</h1>
      </div>

      <div className="panel p-6 animate-slide-up relative overflow-hidden" style={{ animationDelay: "80ms", animationFillMode: "both" }}>
        <UploadZone onAnalyze={handleAnalyze} loading={loading} />
        {error && (
          <div
            className={`absolute inset-0 z-10 flex flex-col items-center justify-center rounded-[inherit] backdrop-blur-sm bg-[#0a0a0a]/70 ${
              errorExiting ? "animate-fade-out" : "animate-fade-in"
            }`}
          >
            <div className="panel px-6 py-5 text-center max-w-[280px]">
              <p className="text-rose-300 text-sm font-medium">{error}</p>
              <button onClick={dismissError} className="btn-ghost mt-4 px-5 py-2 text-sm w-full">
                Try again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
