"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/FormField";
import { register } from "@/lib/api";
import { setToken } from "@/lib/auth";

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div className="animate-fade-in" style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}>
      {children}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  // Prefill from the landing page hero form (?email=...)
  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get("email");
    if (fromQuery) setEmail(fromQuery);
  }, []);

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
      const res = await register(email, password);
      setToken(res.token, res.email);
      router.push("/analyze");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the account.");
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
        <h1 className="text-2xl font-semibold text-white tracking-tight">Create your account</h1>
        <p className="text-white/40 mt-1 mb-8">Takes ten seconds. No card, no email confirmation.</p>
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
                placeholder="At least 6 characters"
              />
            </FormField>

            <button type="submit" disabled={loading || cooldown} className="btn-primary w-full py-3 mt-2">
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>
      </FadeIn>

      <FadeIn delay={200}>
        <p className="mt-5 text-center text-white/35 text-sm">
          Already registered?{" "}
          <Link href="/login" className="text-accent hover:text-accent-hover transition-colors">
            Sign in
          </Link>
        </p>
      </FadeIn>
    </>
  );
}
