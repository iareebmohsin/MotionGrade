"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, Film, Check, Video } from "lucide-react";

const GROUPS = [
  { id: "legs", label: "Legs" },
  { id: "chest", label: "Chest" },
  { id: "shoulders", label: "Shoulders" },
  { id: "back", label: "Back" },
] as const;

type GroupId = (typeof GROUPS)[number]["id"];

type CameraView = "side" | "front" | "any" | "none";

const CAMERA_HINT: Record<CameraView, string | null> = {
  side: "Side view",
  front: "Front view",
  any: "Any angle",
  none: null,
};

const EXERCISES_BY_GROUP: Record<
  GroupId,
  { id: string; label: string; supported: boolean; cameraView: CameraView }[]
> = {
  legs: [
    { id: "squat", label: "Squat", supported: true, cameraView: "side" },
    { id: "lunge", label: "Lunge", supported: true, cameraView: "side" },
    { id: "romanian_deadlift", label: "Romanian Deadlift", supported: true, cameraView: "side" },
  ],
  chest: [
    { id: "push_up", label: "Push Up", supported: true, cameraView: "side" },
    { id: "bench_press", label: "Bench Press", supported: true, cameraView: "any" },
    { id: "incline_bench_press", label: "Incline Bench Press", supported: true, cameraView: "side" },
  ],
  shoulders: [
    { id: "overhead_press", label: "Overhead Press", supported: true, cameraView: "any" },
    { id: "lateral_raise", label: "Lateral Raise", supported: true, cameraView: "any" },
    { id: "upright_row", label: "Upright Row", supported: true, cameraView: "front" },
  ],
  back: [
    { id: "pull_up", label: "Pull Up", supported: true, cameraView: "any" },
    { id: "barbell_row", label: "Barbell Row", supported: true, cameraView: "side" },
    { id: "deadlift", label: "Deadlift", supported: true, cameraView: "side" },
  ],
};

interface Props {
  onAnalyze: (file: File, exerciseId: string) => void;
  loading: boolean;
}

export function UploadZone({ onAnalyze, loading }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupId>("legs");
  const [exerciseId, setExerciseId] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleGroupChange = (groupId: GroupId) => {
    setSelectedGroup(groupId);
    setExerciseId("");
  };

  const handleExerciseSelect = (id: string, supported: boolean) => {
    if (supported) setExerciseId(id);
  };

  const handleSubmit = () => {
    if (file && !loading) onAnalyze(file, exerciseId);
  };

  const ready = Boolean(file && exerciseId && !loading);

  return (
    <div className="space-y-6">
      {/* Step 1: clip */}
      <div>
        <p className="eyebrow mb-3">1 · Clip</p>
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={[
            "relative cursor-pointer rounded-xl border border-dashed py-7 px-6",
            "transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center",
            dragging
              ? "border-accent bg-accent/10 animate-glow-pulse"
              : file
              ? "border-accent/50 bg-accent/[0.05]"
              : "border-white/15 bg-[#0d0d0d] hover:border-accent/40 hover:bg-accent/[0.04] animate-border-pulse",
          ].join(" ")}
        >
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/avi,video/x-matroska"
            className="hidden"
            onChange={handleFileChange}
          />

          {file ? (
            <>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Film className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-white/90 font-medium break-all leading-snug">{file.name}</p>
                <p className="text-white/40 text-xs mt-1">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
              <button
                className="btn-ghost px-3 py-1 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
              >
                Choose another
              </button>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-lg bg-white/[0.04] flex items-center justify-center">
                <UploadCloud className="w-6 h-6 text-white/50" />
              </div>
              <div>
                <p className="text-white/85 font-medium">Drop a video or click to browse</p>
                <p className="text-white/35 text-xs mt-1">MP4, MOV or AVI · up to 500 MB</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Step 2: lift */}
      <div>
        <p className="eyebrow mb-3">2 · Lift</p>

        <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-[#0d0d0d] border border-white/[0.06] mb-3">
          {GROUPS.map((g) => (
            <button
              key={g.id}
              onClick={() => handleGroupChange(g.id)}
              className={[
                "py-2 rounded-md text-sm font-medium transition-all duration-200",
                selectedGroup === g.id
                  ? "bg-white/[0.08] text-white shadow-sm"
                  : "text-white/45 hover:text-white/80",
              ].join(" ")}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {EXERCISES_BY_GROUP[selectedGroup].map((ex) => {
            const active = exerciseId === ex.id && ex.supported;
            return (
              <button
                key={ex.id}
                onClick={() => handleExerciseSelect(ex.id, ex.supported)}
                disabled={!ex.supported}
                className={[
                  "flex flex-col items-start gap-1.5 rounded-lg border px-3.5 py-3 text-left transition-all duration-200",
                  active
                    ? "border-accent/50 bg-accent/[0.08]"
                    : ex.supported
                    ? "border-white/[0.06] bg-[#0d0d0d] hover:border-white/20"
                    : "border-white/[0.04] bg-transparent cursor-not-allowed opacity-40",
                ].join(" ")}
              >
                <span className="flex items-center justify-between w-full">
                  <span className={`text-sm font-medium ${active ? "text-accent" : "text-white/80"}`}>
                    {ex.label}
                  </span>
                  {active && <Check className="w-4 h-4 text-accent shrink-0" />}
                </span>
                {!ex.supported ? (
                  <span className="text-[11px] text-white/30">Coming soon</span>
                ) : CAMERA_HINT[ex.cameraView] ? (
                  <span className="flex items-center gap-1 text-[11px] text-white/35">
                    <Video className="w-3 h-3" />
                    {CAMERA_HINT[ex.cameraView]}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <button onClick={handleSubmit} disabled={!ready} className="btn-primary w-full py-3.5 text-base">
        Grade my form
      </button>
    </div>
  );
}
