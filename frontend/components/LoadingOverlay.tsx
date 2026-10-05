interface Props {
  progress: number;
}

export function LoadingOverlay({ progress }: Props) {
  const displayProgress = Math.round(Math.min(100, Math.max(0, progress)));

  return (
    <div className="flex flex-col items-center gap-7 py-6">
      <div className="relative w-full aspect-[16/7] rounded-lg bg-[#0d0d0d] border border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 h-px bg-accent/70 shadow-[0_0_14px_rgba(229,247,90,0.9)] animate-scan" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-4xl font-semibold text-accent tabular-nums">{displayProgress}%</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-white/85 font-medium">Tracking joints frame by frame…</p>
        <p className="text-white/35 text-sm mt-1">Longer clips take longer</p>
      </div>

      <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full bg-accent transition-all duration-700 ease-out"
          style={{ width: `${displayProgress}%` }}
        />
      </div>
    </div>
  );
}
