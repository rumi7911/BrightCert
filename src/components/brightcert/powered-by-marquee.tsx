const STACK = ["Google Gemini", "Google Cloud", "Supabase", "Stripe", "Vercel", "Resend"];

// Infinite scroll: the track renders the stack twice back to back and
// animates exactly -50%, so the loop point is invisible.
export function PoweredByMarquee() {
  const track = [...STACK, ...STACK];

  return (
    <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <ul className="flex w-max items-center gap-12 animate-marquee">
        {track.map((name, i) => (
          <li
            key={`${name}-${i}`}
            className="shrink-0 text-sm font-semibold tracking-wide text-[#94A3B8] whitespace-nowrap"
            aria-hidden={i >= STACK.length}
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
