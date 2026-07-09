import { cn } from "@/lib/utils";

// Shared card shell for the app dashboard — one place to tune the
// border/shadow language instead of repeating it on every section.
export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  return (
    <Tag
      className={cn(
        "rounded-[12px] border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,32,68,0.04)] p-5 lg:p-6",
        className
      )}
    >
      {children}
    </Tag>
  );
}
