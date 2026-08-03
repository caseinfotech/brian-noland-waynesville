import Reveal from "./Reveal";

const strengths = [
  {
    title: "Residential",
    body: "Personal guidance for buyers and sellers, informed by more than 1,000 customer journeys.",
  },
  {
    title: "Commercial",
    body: "Experienced representation for investors, operators, landowners, and national commercial clients.",
  },
  {
    title: "Community",
    body: "A lifelong mountain connection, a close family, and meaningful service through his local church.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="border-y border-gold/10 bg-coal py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <Reveal>
          <p className="text-center text-[11px] uppercase tracking-widest2 text-gold">
            One Trusted Advisor
          </p>
          <h2 className="mx-auto mt-5 max-w-3xl text-center font-serif text-4xl text-bone lg:text-6xl">
            Local roots. <em className="text-gold-light">Full-range experience.</em>
          </h2>
          <div className="mt-14 grid gap-px bg-bone/15 md:grid-cols-3">
            {strengths.map((item) => (
              <div key={item.title} className="bg-coal p-8">
                <h3 className="font-serif text-2xl text-bone">{item.title}</h3>
                <p className="mt-4 text-sm font-light leading-7 text-mist">{item.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
