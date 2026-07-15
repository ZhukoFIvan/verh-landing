import { ShaderBg } from "@/components/ShaderBg";
import { HeroReel } from "@/components/HeroReel";

export function Hero() {
  return (
    <section className="hero" id="hero" aria-label="Главный экран">
      <ShaderBg />
      <div className="hero-aurora" aria-hidden="true">
        <span className="a1" />
        <span className="a2" />
        <span className="a3" />
      </div>

      <div className="hero-copy">
        <span className="pill hero-kicker">
          <span className="dot" aria-hidden="true" />
          Веб-студия · Москва
        </span>

        <h1 className="hero-title">
          <span className="reveal-line">
            <span className="w" style={{ "--i": 0 } as React.CSSProperties}>Сайты</span>{" "}
            <span className="w" style={{ "--i": 1 } as React.CSSProperties}>и</span>{" "}
            <span className="w" style={{ "--i": 2 } as React.CSSProperties}>продукты,</span>
          </span>
          <span className="reveal-line">
            <span className="w muted" style={{ "--i": 3 } as React.CSSProperties}>которые</span>{" "}
            <span className="w accent" style={{ "--i": 4 } as React.CSSProperties}>работают.</span>
          </span>
        </h1>

        <p className="hero-sub">
          Нас двое — дизайн и код. Разработка сайтов, Telegram-ботов и веб-приложений:
          придумываем, рисуем и доводим до прода. Без агентства и прослойки из менеджеров.
        </p>

        <div className="hero-actions">
          <a href="#contact" className="btn-primary" data-magnetic>
            Обсудить проект <span className="arrow" aria-hidden="true">↗</span>
          </a>
          <a href="#work" className="btn-text">
            Наши работы <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div className="hero-stage" aria-hidden="true">
        <HeroReel />
      </div>

      <a href="#work" className="hero-cue">
        <span className="mouse"><i /></span>
        <span>листайте вниз</span>
      </a>
    </section>
  );
}
