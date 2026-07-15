"use client";

import { useEffect, useRef } from "react";

// Видео-showcase в hero: муты + луп, играет только когда в зоне видимости
// (экономим батарею/трафик), уважает prefers-reduced-motion (тогда — постер).
export function HeroReel() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <div className="stage-reel">
      <video
        ref={ref}
        className="reel-video"
        poster="/works/hero-poster.webp"
        muted
        loop
        playsInline
        preload="none"
      >
        <source src="/works/hero.webm" type="video/webm" />
        <source src="/works/hero.mp4" type="video/mp4" />
      </video>
      <span className="reel-badge">
        <span className="dot" aria-hidden="true" /> Магнезия · лендинг
      </span>
    </div>
  );
}
