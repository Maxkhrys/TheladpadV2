import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import Reveal from '../components/Reveal';
import SectionLabel from '../components/SectionLabel';
import Photo from '../components/Photo';
import { UNSPLASH } from '../data/media';

const VALUES = [
  {
    title: 'Craft',
    copy: 'Every fade, every line, every shave — worked with patience until it earns the mirror check.',
  },
  {
    title: 'Consistency',
    copy: 'Same standard, every visit, every barber. You should never have to wonder which lad you got.',
  },
  {
    title: 'Community',
    copy: "Castle Hill regulars, first-timers, the lot. It's a chair for everyone in Carlow.",
  },
];

export default function About() {
  return (
    <PageTransition>
      <section className="relative h-[60vh] min-h-[420px] flex items-end overflow-hidden">
        <Photo src={UNSPLASH.shave} alt="Inside The Lad Pad Barbershop" className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <SectionLabel>Our Story</SectionLabel>
          <h1 className="font-display text-5xl sm:text-6xl text-text-primary max-w-2xl">
            It&rsquo;s not just about the haircut.
          </h1>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Reveal>
          <img
            src="/images/lad-pad-logo.png"
            alt="The Lad Pad Barbershop"
            className="h-24 mx-auto mb-16 object-contain"
          />
        </Reveal>

        <Reveal className="space-y-6 text-text-muted text-lg leading-relaxed">
          <p>
            The Lad Pad opened its doors on Castle Hill with one idea: a barbershop should feel
            like somewhere you actually want to sit for forty-five minutes. Not a queue, not a
            quick trim — a proper stop in your week.
          </p>
          <p>
            Hexagon lights overhead, black leather in the chairs, and a wall that says exactly what
            we think of average. Here at The Lad Pad, it&rsquo;s not just about the haircut; it&rsquo;s
            the vibe.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="my-16 text-center">
          <p className="font-display italic text-3xl sm:text-4xl text-copper-soft leading-snug">
            &ldquo;Sicker than your average.&rdquo;
          </p>
        </Reveal>

        <Reveal delay={0.1} className="space-y-6 text-text-muted text-lg leading-relaxed">
          <p>
            No two lads leave looking the same, and that&rsquo;s the point. Skin fades, beard
            sculpts, hot towel shaves — whatever you're in for, you're getting the same level of
            care every single time, from a team that trained for it.
          </p>
        </Reveal>
      </section>

      <section className="bg-surface py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionLabel number="—">What We Stand For</SectionLabel>
            <h2 className="font-display text-4xl sm:text-5xl text-text-primary mb-12">Values, not slogans.</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal
                key={v.title}
                delay={i * 0.12}
                className={`px-0 sm:px-8 py-8 sm:py-0 ${i > 0 ? 'sm:border-l' : ''} border-border-copper/30`}
              >
                <span className="text-copper text-xs tracking-widest2 font-sans">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-2xl text-text-primary mt-3 mb-3">{v.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{v.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <Reveal>
          <h2 className="font-display text-4xl sm:text-5xl text-text-primary mb-8">Come see for yourself.</h2>
          <Link to="/book" className="btn-copper min-tap">
            Book Your Slot
          </Link>
        </Reveal>
      </section>
    </PageTransition>
  );
}
