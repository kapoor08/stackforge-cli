# Payments (Stripe)

## Setup
1. Add STRIPE_SECRET_KEY to .env.
2. Client lives at src/lib/stripe.ts (server-side use only).

## Example
```ts
import { stripe } from '@/lib/stripe';

const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: [{ price: 'price_123', quantity: 1 }],
  success_url: 'https://example.com/success',
  cancel_url: 'https://example.com/cancel'
});
```
