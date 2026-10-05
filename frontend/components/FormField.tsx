export function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-white/60 text-sm">{label}</label>
        {error && (
          <span className="text-rose-400 text-xs animate-fade-in" style={{ animationDuration: "0.2s" }}>
            {error}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
