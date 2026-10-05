"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Dumbbell, ScanLine, HardDrive } from "lucide-react";
import { Logo } from "@/components/Logo";
import { isAuthenticated } from "@/lib/auth";

const FACTS = [
  { Icon: Dumbbell, value: "12", label: "lifts graded" },
  { Icon: ScanLine, value: "33", label: "joints tracked" },
  { Icon: HardDrive, value: "Local", label: "videos stay here" },
];

export default function EntryPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) router.replace("/analyze");
  }, [router]);

  return (
    <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
      <div
        className="w-full max-w-md panel rounded-[28px] p-7 sm:p-9 animate-slide-up"
        style={{ animationFillMode: "both" }}
      >
        <div className="flex items-center justify-between">
          <Logo />
          <span className="chip">Self-hosted</span>
        </div>

        <span className="tag mt-9">Form analysis</span>
        <h1 className="mt-4 text-3xl sm:text-[2.35rem] font-medium text-white leading-[1.12]">
          Grade your lifts
          <br />
          <span className="text-cream">from a phone clip.</span>
        </h1>
        <p className="mt-3 text-white/50 text-sm leading-relaxed">
          Upload a set, pick the lift, and get a per-aspect grade with a joint-tracked video and notes
          on what to fix.
        </p>

        <div className="mt-7 grid grid-cols-3 gap-2">
          {FACTS.map(({ Icon, value, label }, i) => (
            <div
              key={label}
              className="panel-raised px-3 py-3 animate-fade-in"
              style={{ animationDelay: `${160 + i * 80}ms`, animationFillMode: "both" }}
            >
              <Icon className="w-4 h-4 text-accent mb-2" />
              <p className="text-white font-semibold leading-none">{value}</p>
              <p className="text-white/40 text-[11px] mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-7 space-y-2.5">
          <Link href="/register" className="btn-primary w-full py-3 text-sm">
            Create account
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/login" className="btn-ghost w-full py-3 text-sm">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
