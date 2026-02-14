# Payments (Razorpay)

Razorpay integration for payment processing (India-focused).

## Setup

1. Sign up at [Razorpay](https://razorpay.com)
2. Get your API keys from the dashboard
3. Add to `.env`:
   ```
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```

## Usage

See `src/lib/razorpay.ts` for the payment client implementation.

## Documentation

- [Razorpay Node.js SDK](https://razorpay.com/docs/api/)
