"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ScanLine, Clock, LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { clearToken, getEmail } from "@/lib/auth";

const LINKS = [
  { href: "/analyze", label: "Analyze", Icon: ScanLine, match: (p: string) => p === "/analyze" },
  { href: "/history", label: "Sessions", Icon: Clock, match: (p: string) => p.startsWith("/history") },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const email = getEmail();

  const logout = () => {
    clearToken();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-md animate-slide-down">
      <nav className="max-w-6xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between gap-6">
        <Logo href="/analyze" size="sm" />

        <div className="flex items-center gap-1">
          {LINKS.map(({ href, label, Icon, match }) => {
            const active = match(pathname);
            return (
              <Link key={href} href={href} className={`nav-pill ${active ? "nav-pill-active" : "nav-pill-idle"}`}>
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="chip hidden sm:inline-flex max-w-[180px] truncate">{email}</span>
          <button onClick={logout} className="btn-ghost px-3.5 py-1.5 text-xs">
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </nav>
    </header>
  );
}
