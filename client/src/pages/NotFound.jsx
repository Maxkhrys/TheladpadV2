import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

export default function NotFound() {
  return (
    <PageTransition>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-40 text-center">
        <p className="label-eyebrow justify-center">404</p>
        <h1 className="font-display text-5xl text-text-primary mt-4 mb-8">That chair&rsquo;s empty.</h1>
        <Link to="/" className="btn-copper min-tap">
          Back Home
        </Link>
      </section>
    </PageTransition>
  );
}
