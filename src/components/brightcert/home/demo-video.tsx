"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

const VIDEO_ID = "9SnF6wdi1AY";
const VIDEO_TITLE = "BrightCert product demo: a full Cyber Essentials readiness assessment";

// Nothing from YouTube loads until someone presses play. The still is served
// from our own origin, so opening the homepage makes no third-party request
// and sets no third-party cookie — which matters because the consent banner
// has not been answered yet at that point. youtube-nocookie keeps the
// post-click request out of the standard advertising cookie set.
const EMBED_SRC = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`;

export function DemoVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-[18px] border border-white/[0.14] bg-black shadow-[0_24px_60px_-18px_rgba(0,0,0,0.6)]">
      {playing ? (
        <iframe
          src={EMBED_SRC}
          title={VIDEO_TITLE}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${VIDEO_TITLE}`}
          className="bc-focus group absolute inset-0 h-full w-full cursor-pointer"
        >
          <Image
            src="/demo-video-poster.jpg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 880px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" aria-hidden />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110">
              <Play className="ml-0.5 h-6 w-6 fill-[#0F2044] text-[#0F2044]" strokeWidth={1.5} aria-hidden />
            </span>
          </span>
          <span className="absolute bottom-3 right-3 rounded bg-black/80 px-1.5 py-1 font-mono text-[11px] font-semibold text-white">
            2:04
          </span>
        </button>
      )}
    </div>
  );
}
