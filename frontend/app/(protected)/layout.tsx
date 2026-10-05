"use client";

import { useState, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  // useLayoutEffect fires synchronously before paint — eliminates the 1-frame blank flash
  useLayoutEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;

  return (
    <div className="relative z-10 min-h-screen">
      <Navbar />
      {children}
    </div>
  );
}
