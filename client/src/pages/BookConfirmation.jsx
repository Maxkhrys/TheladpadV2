import { useSearchParams } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import ConfirmationScreen from '../components/BookingFlow/ConfirmationScreen';

export default function BookConfirmation() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const cancelled = searchParams.get('cancelled');

  return (
    <PageTransition>
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <ConfirmationScreen sessionId={sessionId} cancelled={cancelled} />
      </section>
    </PageTransition>
  );
}
