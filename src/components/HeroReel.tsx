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

    // play() запускает скачивание видео (~600KB) немедленно, поэтому до
    // window.load не стартуем: видео не должно конкурировать за полосу
    // с LCP-постером, шрифтами и JS в критическом окне загрузки.
    let wantPlay = false;
    const tryPlay = () => {
      if (wantPlay) v.play().catch(() => {});
    };

    const io = new IntersectionObserver(
      ([e]) => {
        wantPlay = e.isIntersecting;
        if (!e.isIntersecting) {
          v.pause();
          return;
        }
        if (document.readyState === "complete") tryPlay();
        // иначе — сыграет обработчик window.load ниже
      },
      { threshold: 0.2 },
    );

    if (document.readyState !== "complete") {
      window.addEventListener("load", tryPlay, { once: true });
    }
    io.observe(v);
    return () => {
      io.disconnect();
      window.removeEventListener("load", tryPlay);
    };
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
