import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn(
    '[stripe] STRIPE_SECRET_KEY is not set. Payments will fail until it is configured — see .env.example.'
  );
}

export const stripe = new Stripe(stripeSecretKey || 'sk_test_placeholder', {
  apiVersion: '2024-06-20',
});
