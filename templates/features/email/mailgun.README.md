# Email (Mailgun)

Mailgun email integration for sending transactional emails.

## Setup

1. Sign up at [Mailgun](https://mailgun.com)
2. Get your API key and domain from the dashboard
3. Add to `.env`:
   ```
   MAILGUN_API_KEY=your_api_key
   MAILGUN_DOMAIN=your_domain.mailgun.org
   ```

## Usage

See `src/lib/mailgun.ts` for the email client implementation.

## Documentation

- [Mailgun Node.js SDK](https://github.com/mailgun/mailgun-js)
