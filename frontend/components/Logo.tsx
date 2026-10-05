import Link from "next/link";
import { PersonStanding } from "lucide-react";

type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, { box: string; icon: string; text: string }> = {
  sm: { box: "w-7 h-7", icon: "w-4 h-4", text: "text-base" },
  md: { box: "w-8 h-8", icon: "w-[18px] h-[18px]", text: "text-lg" },
  lg: { box: "w-11 h-11", icon: "w-6 h-6", text: "text-3xl" },
};

export function Logo({ href = "/", size = "md" }: { href?: string; size?: Size }) {
  const s = SIZES[size];
  return (
    <Link href={href} className="inline-flex items-center gap-2.5 group">
      <span
        className={`${s.box} rounded-full bg-accent flex items-center justify-center shadow-[0_4px_16px_rgba(229,247,90,0.25)] group-hover:bg-accent-hover transition`}
      >
        <PersonStanding className={`${s.icon} text-[#111]`} strokeWidth={2.5} />
      </span>
      <span className={`${s.text} font-semibold tracking-tight text-white`}>MotionGrade</span>
    </Link>
  );
}
