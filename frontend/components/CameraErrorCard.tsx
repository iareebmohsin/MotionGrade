import { Camera } from "lucide-react";

interface Props {
  message: string;
}

export function CameraErrorCard({ message }: Props) {
  return (
    <div className="panel p-8 max-w-md mx-auto text-center space-y-5 animate-slide-up" style={{ animationFillMode: "both" }}>
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-accent/10 border border-accent/30">
        <Camera className="w-8 h-8 text-accent" />
      </div>
      <div>
        <p className="eyebrow mb-2">Camera angle</p>
        <h2 className="text-white font-semibold text-xl mb-3">We could not read this angle</h2>
        <p className="text-white/50 text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
