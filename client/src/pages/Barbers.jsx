import PageTransition from '../components/PageTransition';
import Reveal from '../components/Reveal';
import SectionLabel from '../components/SectionLabel';
import BarberCard from '../components/BarberCard';
import { useShop } from '../context/ShopContext';

export default function Barbers() {
  const { barbers, loading } = useShop();

  return (
    <PageTransition>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <Reveal>
          <SectionLabel>Meet The Team</SectionLabel>
          <h1 className="font-display text-5xl sm:text-6xl text-text-primary max-w-2xl">
            The lads behind the chairs.
          </h1>
          <p className="text-text-muted max-w-xl mt-6 text-base leading-relaxed">
            Pick a barber, or leave it to us with &ldquo;any available&rdquo; when you book.
          </p>
        </Reveal>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(loading ? Array.from({ length: 4 }) : barbers).map((barber, i) =>
            barber ? (
              <BarberCard key={barber.id} barber={barber} index={i} />
            ) : (
              <div key={i} className="card-surface h-96 animate-pulse" />
            )
          )}
        </div>
      </section>
    </PageTransition>
  );
}
