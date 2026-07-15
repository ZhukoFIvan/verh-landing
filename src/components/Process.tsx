import { PROCESS } from "@/lib/content";

export function Process() {
  return (
    <section className="block" id="process" aria-labelledby="process-title">
      <div className="section-head reveal">
        <div className="section-tag">Как работаем</div>
        <h2 className="section-title" id="process-title">
          Никакой магии. <em>Четыре этапа.</em>
        </h2>
        <p className="section-aside">
          Вы видите промежуточные точки, мы — что важно для вас. Без «исчезновений в Figma на месяц».
        </p>
      </div>

      <ol className="process" aria-label="Этапы работы над проектом">
        {/* Без HowToStep: осиротевшие шаги без родительского HowTo невалидны,
            а HowTo rich results Google убрал ещё в 2023. */}
        {PROCESS.map((p, i) => (
          <li key={p.n} className={`step reveal${i > 0 ? " d" + i : ""}`}>
            <div className="step-num mono">{p.n} / 04</div>
            <div className="step-body">
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
