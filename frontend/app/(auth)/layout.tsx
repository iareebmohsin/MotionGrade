import { Logo } from "@/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 min-h-screen px-3 sm:px-6 py-3 sm:py-5">
      <div className="mx-auto max-w-[1180px] min-h-[calc(100vh-40px)] rounded-[28px] border border-white/10 bg-frame overflow-hidden grid lg:grid-cols-2">
        <aside className="hidden lg:flex flex-col justify-between p-12 border-r border-white/[0.06]">
          <Logo />
          <div className="animate-fade-in" style={{ animationDelay: "120ms", animationFillMode: "both" }}>
            <span className="tag">Why film your sets</span>
            <p className="mt-5 text-4xl font-medium text-white leading-[1.12] max-w-md">
              You cannot see your own knees cave.
              <br />
              <span className="text-cream">The camera can.</span>
            </p>
            <p className="text-white/45 mt-5 max-w-md leading-relaxed">
              MotionGrade turns a phone clip into a joint-by-joint report so you can fix one thing at a
              time.
            </p>
          </div>
          <p className="text-white/30 text-xs">Self-hosted. Your videos stay on your server.</p>
        </aside>

        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <div className="lg:hidden mb-8">
              <Logo />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
