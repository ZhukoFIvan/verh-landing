"use client";

import { useEffect } from "react";

export function ScrollFx() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const cleanups: Array<() => void> = [];

    // ── появление секций по скроллу ──
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    // ── счётчики цифр ──
    const countUp = (node: HTMLElement) => {
      const end = parseInt(node.dataset.count || "0", 10);
      if (reduce || !end) {
        node.textContent = String(end);
        return;
      }
      const dur = 1300;
      let t0 = 0;
      const step = (now: number) => {
        if (!t0) t0 = now;
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        node.textContent = String(Math.round(eased * end));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            countUp(e.target as HTMLElement);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 },
    );
    document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => cio.observe(el));

    // Вход героя — чистые CSS-анимации в globals.css: не зависят от гидрации JS.

    // ── прогресс-бар + фон навигации (нативный скролл, rAF-троттлинг) ──
    const prog = document.getElementById("prog");
    const topnav = document.getElementById("topnav");
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const sc = window.scrollY;
        const lim = document.documentElement.scrollHeight - window.innerHeight;
        if (prog) prog.style.transform = `scaleX(${lim > 0 ? sc / lim : 0})`;
        if (topnav) topnav.classList.toggle("scrolled", sc > 40);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // ── микро-интеракции по курсору (только десктоп, без reduced-motion) ──
    if (fine && !reduce) {
      // глубина карточек героя за курсором
      const hero = document.getElementById("hero");
      const depthEls = Array.from(document.querySelectorAll<HTMLElement>("#hero [data-depth]"));
      if (hero && depthEls.length) {
        let raf = 0;
        const onMove = (ev: MouseEvent) => {
          const r = hero.getBoundingClientRect();
          const dx = (ev.clientX - r.left) / r.width - 0.5;
          const dy = (ev.clientY - r.top) / r.height - 0.5;
          if (raf) return;
          raf = requestAnimationFrame(() => {
            depthEls.forEach((el) => {
              const d = parseFloat(el.dataset.depth || "0");
              el.style.setProperty("--px", (dx * d * 20).toFixed(1));
              el.style.setProperty("--py", (dy * d * 20).toFixed(1));
            });
            raf = 0;
          });
        };
        const onLeave = () =>
          depthEls.forEach((el) => {
            el.style.setProperty("--px", "0");
            el.style.setProperty("--py", "0");
          });
        hero.addEventListener("mousemove", onMove);
        hero.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          hero.removeEventListener("mousemove", onMove);
          hero.removeEventListener("mouseleave", onLeave);
          if (raf) cancelAnimationFrame(raf);
        });
      }

      // 3D-наклон карточек работ (мгновенный follow, плавный возврат)
      document.querySelectorAll<HTMLElement>(".work").forEach((card) => {
        let raf = 0;
        const onEnter = () => { card.style.transition = "box-shadow .5s var(--e-out)"; };
        const onMove = (ev: MouseEvent) => {
          if (raf) return;
          raf = requestAnimationFrame(() => {
            const r = card.getBoundingClientRect();
            const rx = (((ev.clientY - r.top) / r.height) - 0.5) * -5;
            const ry = (((ev.clientX - r.left) / r.width) - 0.5) * 5;
            card.style.transform = `perspective(1100px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px)`;
            raf = 0;
          });
        };
        const onLeave = () => { card.style.transition = ""; card.style.transform = ""; };
        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
          if (raf) cancelAnimationFrame(raf);
        });
      });

      // магнитные кнопки (мгновенный follow, плавный возврат)
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((btn) => {
        let raf = 0;
        const onEnter = () => { btn.style.transition = "background .2s"; };
        const onMove = (ev: MouseEvent) => {
          if (raf) return;
          raf = requestAnimationFrame(() => {
            const r = btn.getBoundingClientRect();
            const mx = (ev.clientX - r.left - r.width / 2) * 0.25;
            const my = (ev.clientY - r.top - r.height / 2) * 0.35;
            btn.style.transform = `translate(${mx.toFixed(1)}px, ${my.toFixed(1)}px)`;
            raf = 0;
          });
        };
        const onLeave = () => { btn.style.transition = ""; btn.style.transform = ""; };
        btn.addEventListener("mouseenter", onEnter);
        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          btn.removeEventListener("mouseenter", onEnter);
          btn.removeEventListener("mousemove", onMove);
          btn.removeEventListener("mouseleave", onLeave);
          if (raf) cancelAnimationFrame(raf);
        });
      });
    }

    return () => {
      io.disconnect();
      cio.disconnect();
      window.removeEventListener("scroll", onScroll);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <div className="scroll-prog">
      <div id="prog" style={{ transformOrigin: "left", transform: "scaleX(0)" }} />
    </div>
  );
}
