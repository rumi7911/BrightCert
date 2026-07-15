// Primitives for the approved ledger design language (dashboard v3):
// hairline sections, section-header-with-action, dot+word statuses, 13px data type.

// Page-level header: title + subtitle over a hairline, optional right-side action
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-[#EEF1F6] pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#0F2044] sm:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-[#64748B]">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// Ledger-style section header: title + optional action link on one baseline
export function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-1 flex items-baseline justify-between">
      <h2 className="text-[13px] font-semibold text-[#0F2044]">{title}</h2>
      {action}
    </div>
  );
}

// Dot + word status, the ledger replacement for pill badges
export function DotStatus({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#33405C]">
      <span className="h-[7px] w-[7px] rounded-full" style={{ backgroundColor: color }} aria-hidden />
      {label}
    </span>
  );
}
