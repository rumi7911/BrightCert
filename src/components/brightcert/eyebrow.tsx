export function Eyebrow({
  children,
  center = false,
  light = false,
}: {
  children: React.ReactNode;
  center?: boolean;
  light?: boolean;
}) {
  const tone = light ? "text-[#6EE7B7]" : "text-[#047857]";
  const dash = light ? "bg-[#6EE7B7]" : "bg-[#047857]";
  return (
    <p className={`flex items-center gap-2 text-xs font-bold ${tone} uppercase tracking-widest mb-4 ${center ? "justify-center" : ""}`}>
      <span className={`h-px w-6 ${dash}`} aria-hidden />
      {children}
    </p>
  );
}
