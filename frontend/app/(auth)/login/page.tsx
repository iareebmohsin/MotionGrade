"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/FormField";
import { login } from "@/lib/api";
import { setToken } from "@/lib/auth";

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div className="animate-fade-in" style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}>
      {children}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const validate = (): boolean => {
    let valid = true;
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setEmailError("Enter a valid email");
      valid = false;
    } else {
      setEmailError(null);
    }
    if (password.length < 6) {
      setPasswordError("At least 6 characters");
      valid = false;
    } else {
      setPasswordError(null);
    }
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await login(email, password);
      setToken(res.token, res.email);
      router.push("/analyze");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
      setErrorKey((k) => k + 1);
      setCooldown(true);
      setTimeout(() => setCooldown(false), 1500);
      setTimeout(() => setError(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FadeIn>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Welcome back</h1>
        <p className="text-white/40 mt-1 mb-8">Sign in to keep grading your lifts.</p>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="panel p-6 relative overflow-hidden">
          {error && (
            <div
              key={errorKey}
              className="absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] backdrop-blur-sm bg-[#0a0a0a]/70 animate-error-overlay"
            >
              <p className="text-rose-300 text-sm font-medium px-8 text-center">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <FormField label="Email address" error={emailError}>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(null);
                }}
                className={`field ${emailError ? "field-error" : ""}`}
                placeholder="you@example.com"
              />
            </FormField>

            <FormField label="Password" error={passwordError}>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(null);
                }}
                className={`field ${passwordError ? "field-error" : ""}`}
                placeholder="Your password"
              />
            </FormField>

            <button type="submit" disabled={loading || cooldown} className="btn-primary w-full py-3 mt-2">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </FadeIn>

      <FadeIn delay={200}>
        <p className="mt-5 text-center text-white/35 text-sm">
          New here?{" "}
          <Link href="/register" className="text-accent hover:text-accent-hover transition-colors">
            Create an account
          </Link>
        </p>
      </FadeIn>
    </>
  );
}
