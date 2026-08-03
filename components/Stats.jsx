import Reveal from "./Reveal";

// Three, not four. The fourth was `{ value: "2", label: "Residential &
// Commercial Expertise" }` — a number that means nothing on its own and
// invited the reader to wonder what "2" referred to.
const stats = [
  { value: "8", label: "Generations in Haywood County" },
  { value: "1,000+", label: "Customers Represented" },
  { value: "2017", label: "With Howard Hanna Since" },
];

export default function Stats() {
  return (
    <section className="border-b border-ink/10 bg-[#eae9e5]">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-y-10 px-6 py-14 sm:grid-cols-3 lg:px-12 lg:py-16">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 120} className="text-center">
            <p className="font-serif text-4xl text-ink lg:text-5xl">
              {s.value}
            </p>
            <p className="mt-3 text-[9px] uppercase tracking-[0.25em] text-ink/80">
              {s.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
