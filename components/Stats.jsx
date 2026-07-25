import Reveal from "./Reveal";

const stats = [
  { value: "8", label: "Generations in Haywood County" },
  { value: "1,000+", label: "Customers Represented" },
  { value: "2017", label: "Beverly-Hanks Team Member Since" },
  { value: "2", label: "Residential & Commercial Expertise" },
];

export default function Stats() {
  return (
    <section className="border-b border-ink/10 bg-[#e7e0d4]">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-y-12 px-6 py-16 lg:grid-cols-4 lg:px-12 lg:py-20">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 120} className="text-center">
            <p className="font-serif text-4xl text-ink lg:text-5xl">
              {s.value}
            </p>
            <p className="mt-3 text-[9px] uppercase tracking-[0.25em] text-ink/55">
              {s.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
