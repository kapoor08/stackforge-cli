# Payments (PayPal)

PayPal integration for payment processing.

## Setup

1. Create a PayPal developer account at [PayPal Developer](https://developer.paypal.com)
2. Get your Client ID and Secret from the dashboard
3. Add to `.env`:
   ```
   PAYPAL_CLIENT_ID=your_client_id
   PAYPAL_CLIENT_SECRET=your_client_secret
   ```

## Usage

See `src/lib/paypal.ts` for the payment client implementation.

## Documentation

- [PayPal Checkout SDK](https://developer.paypal.com/docs/checkout/)
