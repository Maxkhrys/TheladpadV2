import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import StaggerHeadline from '../components/StaggerHeadline';
import Reveal from '../components/Reveal';
import SectionLabel from '../components/SectionLabel';
import Photo from '../components/Photo';
import ServiceCard from '../components/ServiceCard';
import BarberCard from '../components/BarberCard';
import LocationHours from '../components/LocationHours';
import { useShop } from '../context/ShopContext';
import { UNSPLASH, INSTAGRAM_TILES } from '../data/media';

const HERO_WORDS = [
  { text: 'Not' },
  { text: 'just' },
  { text: 'a' },
  { text: 'haircut.' },
  { text: "It's" },
  { text: 'the' },
  { text: 'vibe.', copper: true },
];

const WHY_US = [
  {
    title: 'Craft, not conveyor belt',
    copy: 'Every cut is worked, not rushed. Our barbers trained for years to make it look effortless.',
  },
  {
    title: 'No double-booked chairs',
    copy: 'Real-time availability means your slot is your slot — no waiting room lottery.',
  },
  {
    title: 'Carlow, through and through',
    copy: 'Castle Hill regulars since day one. We know the town and the town knows us.',
  },
];

export default function Home() {
  const { services, barbers, primaryLocation, loading } = useShop();

  return (
    <PageTransition>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-end overflow-hidden">
        <Photo
          src={UNSPLASH.heroInterior}
          alt="Inside The Lad Pad Barbershop — hexagon LED ceiling and leather chairs"
          className="absolute inset-0 w-full h-full"
          imgClassName="object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28 w-full">
          <p className="label-eyebrow mb-5">The Lad Pad Barbershop &middot; Carlow</p>
          <StaggerHeadline
            words={HERO_WORDS}
            as="h1"
            className="max-w-3xl"
            wordClassName="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05]"
          />
          <Reveal delay={0.5} className="mt-6 max-w-lg">
            <p className="text-text-muted text-base sm:text-lg leading-relaxed">
              Sicker than your average, every single time. Hexagon lights overhead, hot towels on
              standby, and a chair with your name on it.
            </p>
          </Reveal>
          <Reveal delay={0.65} className="mt-9">
            <Link to="/book" className="btn-copper min-tap">
              Book Your Slot
            </Link>
          </Reveal>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Reveal>
          <SectionLabel number="01">Services</SectionLabel>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <h2 className="font-display text-4xl sm:text-5xl text-text-primary max-w-xl">
              Priced fair. Cut sharp.
            </h2>
            <Link to="/services" className="text-xs uppercase tracking-widest2 text-copper hover:text-copper-soft transition-colors shrink-0">
              View All Services →
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(loading ? Array.from({ length: 4 }) : services.slice(0, 4)).map((service, i) =>
            service ? (
              <ServiceCard key={service.id} service={service} index={i} />
            ) : (
              <div key={i} className="card-surface h-64 animate-pulse" />
            )
          )}
        </div>
      </section>

      {/* MEET THE TEAM PREVIEW */}
      <section className="bg-surface py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionLabel number="02">The Team</SectionLabel>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
              <h2 className="font-display text-4xl sm:text-5xl text-text-primary max-w-xl">
                Meet the lads behind the chairs.
              </h2>
              <Link to="/barbers" className="text-xs uppercase tracking-widest2 text-copper hover:text-copper-soft transition-colors shrink-0">
                Meet The Full Team →
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(loading ? Array.from({ length: 3 }) : barbers.slice(0, 3)).map((barber, i) =>
              barber ? (
                <BarberCard key={barber.id} barber={barber} index={i} />
              ) : (
                <div key={i} className="card-surface h-96 animate-pulse" />
              )
            )}
          </div>
        </div>
      </section>

      {/* WHY US STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 sm:grid-cols-3">
          {WHY_US.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.12} className={`px-0 sm:px-8 py-8 sm:py-0 ${i > 0 ? 'sm:border-l' : ''} border-border-copper/30`}>
              <span className="text-copper text-xs tracking-widest2 font-sans">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-display text-2xl text-text-primary mt-3 mb-3">{item.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{item.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* EDITORIAL FEATURE */}
      <section className="relative py-40 overflow-hidden">
        <Photo
          src={UNSPLASH.barberChairs}
          alt="The Lad Pad Barbershop interior"
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <p className="label-eyebrow justify-center mb-6">Est. Carlow</p>
            <h2 className="font-display text-5xl sm:text-7xl leading-[1.05] text-text-primary">
              Sicker than <span className="text-copper">your average.</span>
            </h2>
            <Link to="/book" className="btn-copper min-tap mt-10 inline-flex">
              Book Now
            </Link>
          </Reveal>
        </div>
      </section>

      {/* INSTAGRAM STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Reveal>
          <SectionLabel number="03">Follow Along</SectionLabel>
          <h2 className="font-display text-4xl sm:text-5xl text-text-primary mb-12">@theladpadbarbershop</h2>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {INSTAGRAM_TILES.map((src, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <Photo src={src} alt="The Lad Pad Barbershop on Instagram" className="aspect-square hover:scale-[1.03] transition-transform duration-500 ease-confident" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* LOCATION & HOURS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <Reveal>
          <SectionLabel number="04">Visit Us</SectionLabel>
          <h2 className="font-display text-4xl sm:text-5xl text-text-primary mb-12">Choose your location.</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <LocationHours location={primaryLocation} />
        </Reveal>
      </section>
    </PageTransition>
  );
}
