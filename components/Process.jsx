import Reveal from "./Reveal";

const steps = [
  {
    n: "01",
    title: "Listen First",
    body: "Every relationship begins with your goals, your timing, and a clear understanding of what the right outcome means to you.",
  },
  {
    n: "02",
    title: "Know the Ground",
    body: "Deep Haywood County knowledge and current market context shape a practical strategy for residential or commercial property.",
  },
  {
    n: "03",
    title: "Advocate Clearly",
    body: "Entrepreneurial experience and more than 1,000 client journeys inform every conversation, offer, and negotiation.",
  },
  {
    n: "04",
    title: "A Seamless Close",
    body: "Inspections, due diligence, attorneys, and timelines are managed with steady communication from contract through closing.",
  },
];

export default function Process() {
  return (
    <section id="process" className="mx-auto max-w-[1440px] bg-bone px-6 py-24 lg:px-12 lg:py-32">
      <Reveal className="mb-16">
        <p className="text-[11px] uppercase tracking-widest2 text-gold">
          A Higher Standard of Care
        </p>
        <h2 className="mt-5 font-serif text-4xl text-ink lg:text-6xl">
          Thoughtful from hello <em className="text-gold-dim">to home.</em>
        </h2>
      </Reveal>

      <div className="grid gap-px bg-ink/15 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 120} className="bg-bone">
            <div className="group h-full p-8 transition-colors duration-500 hover:bg-[#e7e0d4]">
              <p className="font-serif text-5xl text-gold/40 transition-colors duration-500 group-hover:text-gold">
                {s.n}
              </p>
              <h3 className="mt-6 font-serif text-2xl text-ink">{s.title}</h3>
              <p className="mt-4 text-sm font-light leading-relaxed text-ink/60">
                {s.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
