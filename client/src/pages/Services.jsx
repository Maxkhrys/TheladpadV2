import PageTransition from '../components/PageTransition';
import Reveal from '../components/Reveal';
import SectionLabel from '../components/SectionLabel';
import ServiceCard from '../components/ServiceCard';
import { useShop } from '../context/ShopContext';

export default function Services() {
  const { services, loading } = useShop();

  return (
    <PageTransition>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <Reveal>
          <SectionLabel>Services &amp; Pricing</SectionLabel>
          <h1 className="font-display text-5xl sm:text-6xl text-text-primary max-w-2xl">
            Every cut, priced straight.
          </h1>
          <p className="text-text-muted max-w-xl mt-6 text-base leading-relaxed">
            No hidden extras, no upsell. What you see is what you pay — and what gets charged in
            full the moment you book.
          </p>
        </Reveal>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(loading ? Array.from({ length: 6 }) : services).map((service, i) =>
            service ? (
              <ServiceCard key={service.id} service={service} index={i} />
            ) : (
              <div key={i} className="card-surface h-64 animate-pulse" />
            )
          )}
        </div>
      </section>
    </PageTransition>
  );
}
