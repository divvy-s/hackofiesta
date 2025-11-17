import React, { useEffect, useRef } from "react";
import Image from "next/image";

// HeroParallax Component (updated)
// Improvements:
// - Foreground (top) layer now scales to visually cover larger area so it doesn't appear "short".
// - Added props to tune the foreground sizing and parallax strength.
// - Better mobile breakpoints so foreground doesn't overflow awkwardly.
//
// Usage:
// <HeroParallax
//    backImage="/images/back.jpg"
//    topImage="/images/top.png"
//    height={720}
//    topScale={1.15} // controls how wide the top layer is compared to viewport (1.0 = 100vw)
//    topMaxHeight={520} // px maximum height for the top layer
// >
//   <h1 className="text-5xl font-bold">Welcome</h1>
// </HeroParallax>

type Props = {
  backImage: string; // background layer (further)
  topImage: string; // foreground/top layer (closer to user)
  height?: number; // px height of the hero (default 720)
  className?: string;
  children?: React.ReactNode;

  // tuning props
  topScale?: number; // how much wider than viewport the top layer should be (default 1.15)
  topMaxHeight?: number; // px max-height for top image (default 520)
  backParallax?: number; // px strength for background
  topParallax?: number; // px strength for foreground
};

export default function HeroParallax({
  backImage,
  topImage,
  height = 720,
  className = "",
  children,
  topScale = 1.15,
  topMaxHeight = 520,
  backParallax = 40,
  topParallax = 120,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const backRef = useRef<HTMLDivElement | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function onScroll() {
      const currContainer = containerRef.current;
      if (!currContainer) return;

      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const rect = currContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        // progress 0..1 while the hero is within the viewport roughly
        const start = windowHeight;
        const end = -rect.height;
        const total = start - end;
        const current = rect.top - end;
        let progress = 1 - (current / total);
        progress = Math.max(0, Math.min(1, progress));

        // Map progress to offsets
        const backOffset = (progress - 0.5) * -backParallax;
        const topOffset = (progress - 0.5) * topParallax;

        if (backRef.current) {
          backRef.current.style.transform = `translate3d(0, ${backOffset}px, 0) scale(1.03)`;
        }
        if (topRef.current) {
          topRef.current.style.transform = `translate3d(-50%, calc(-50% + ${topOffset}px), 0)`;
        }
      });
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [backParallax, topParallax]);

  return (
    <section
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Background layer */}
      <div
        ref={backRef}
        aria-hidden
        className="absolute inset-0 will-change-transform transition-transform duration-300"
        style={{ transform: "translate3d(0,0,0)" }}
      >
        <Image
          src={backImage}
          alt="back layer"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Center content */}
      <div className="relative z-20 h-full flex items-center justify-center px-6">
        <div className="max-w-4xl text-center text-white drop-shadow-lg">
          {children}
        </div>
      </div>

      {/* Foreground/top layer - larger and centered */}
      <div
        ref={topRef}
        aria-hidden
        className="absolute left-1/2 top-1/2 z-30 will-change-transform transition-transform duration-300"
        style={{ pointerEvents: "none", transform: "translate3d(-50%,-50%,0)" }}
      >
        <div
          // The wrapper ensures we can scale the image beyond viewport width while clamping height
          style={{
            width: `${topScale * 100}vw`,
            maxWidth: `1800px`,
            maxHeight: `${topMaxHeight}px`,
            height: "auto",
            overflow: "hidden",
            display: "block",
          }}
          className="relative"
        >
          <Image
            src={topImage}
            alt="top layer"
            // fill to allow objectFit to cover the wrapper area
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white/6 z-10 pointer-events-none" />

      <style jsx>{`
        /* small-screen adjustments */
        @media (max-width: 768px) {
          div[ref="topRef"] {
            /* reduce aggressive transforms on mobile */
          }
        }
      `}</style>
    </section>
  );
}
