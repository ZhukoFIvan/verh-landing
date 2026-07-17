"use client";

import { useEffect, useRef } from "react";

/**
 * Живой градиент на OGL (тонкая обёртка над WebGL) — плавно перетекающий
 * mesh-gradient через domain-warped fbm в брендовых цветах. Лёгкий: один
 * фрагментный шейдер на полноэкранном треугольнике, пониженный dpr, пауза
 * вне вьюпорта, статичный кадр при prefers-reduced-motion.
 */
const VERT = /* glsl */ `
  attribute vec2 position;
  void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform vec2 u_res;
  uniform float u_t;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453123); }
  float noise(vec2 p){
    vec2 i=floor(p), f=fract(p);
    vec2 u=f*f*(3.0-2.0*f);
    return mix(mix(hash(i+vec2(0.0,0.0)),hash(i+vec2(1.0,0.0)),u.x),
               mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);
  }
  float fbm(vec2 p){
    float v=0.0, a=0.5;
    for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.02; a*=0.5; }
    return v;
  }
  void main(){
    vec2 uv = gl_FragCoord.xy / u_res.xy;
    float aspect = u_res.x / u_res.y;
    vec2 p = vec2(uv.x*aspect, uv.y) * 1.7;
    float t = u_t * 0.05;

    vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, -t*1.1)));
    float f = fbm(p + 1.7*q + t*0.4);

    vec3 base  = vec3(0.957, 0.961, 0.949);
    vec3 red   = vec3(0.780, 0.227, 0.267);
    vec3 coral = vec3(0.900, 0.420, 0.400);
    vec3 warm  = vec3(1.000, 0.860, 0.550);

    vec3 col = base;
    col = mix(col, red,   smoothstep(0.30, 0.92, f) * 0.50);
    col = mix(col, coral, smoothstep(0.40, 0.98, q.x) * 0.34);
    col = mix(col, warm,  smoothstep(0.55, 1.02, q.y) * 0.20);

    float d = distance(uv, vec2(0.5, 0.40));
    col = mix(base, col, smoothstep(0.10, 0.62, d));

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function ShaderBg() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    // ogl грузим лениво: декоративный фон не должен утяжелять критический
    // JS-бандл — async-чанк подтянется после гидрации, до неё работает
    // CSS-фолбэк (.hero-aurora).
    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const { Renderer, Program, Mesh, Triangle } = await import("ogl");
      if (disposed) return;

      let renderer: InstanceType<typeof Renderer>;
      try {
        renderer = new Renderer({ canvas, alpha: false, antialias: false, dpr: 0.7 });
      } catch {
        return; // нет WebGL — остаётся CSS-фолбэк (.hero-aurora)
      }

      const gl = renderer.gl;
      const hero = canvas.closest(".hero") as HTMLElement | null;
      hero?.setAttribute("data-shader", "on");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: { u_res: { value: [1, 1] }, u_t: { value: 0 } },
      });
      const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

      const resize = () => {
        const box = (hero || canvas) as HTMLElement;
        const w = box.clientWidth || window.innerWidth;
        const h = box.clientHeight || window.innerHeight;
        renderer.setSize(w, h);
        // OGL проставляет inline-размер в px — возвращаем канвас к 100%, чтобы тянулся за .hero
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        program.uniforms.u_res.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
        if (reduce) renderer.render({ scene: mesh }); // статичный кадр не должен пропадать после ресайза
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(hero || canvas);

      let raf = 0;
      let visible = true;
      const render = (t: number) => {
        program.uniforms.u_t.value = t * 0.001;
        renderer.render({ scene: mesh });
        raf = visible ? requestAnimationFrame(render) : 0;
      };

      const iob = new IntersectionObserver(
        (entries) => {
          visible = entries[0].isIntersecting;
          if (visible && !raf && !reduce) raf = requestAnimationFrame(render);
        },
        { threshold: 0 },
      );
      iob.observe(canvas);

      if (reduce) {
        program.uniforms.u_t.value = 8;
        renderer.render({ scene: mesh });
      } else {
        raf = requestAnimationFrame(render);
      }

      cleanup = () => {
        if (raf) cancelAnimationFrame(raf);
        ro.disconnect();
        iob.disconnect();
        hero?.removeAttribute("data-shader");
        const ext = gl.getExtension("WEBGL_lose_context");
        ext?.loseContext();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return <canvas ref={ref} className="hero-shader" aria-hidden="true" />;
}
