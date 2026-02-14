# Email (SendGrid)

SendGrid email integration for sending transactional emails.

## Setup

1. Sign up at [SendGrid](https://sendgrid.com)
2. Generate an API key from Settings > API Keys
3. Add your API key to `.env`:
   ```
   SENDGRID_API_KEY=your_api_key_here
   ```

## Usage

See `src/lib/sendgrid.ts` for the email client implementation.

## Documentation

- [SendGrid Node.js Library](https://github.com/sendgrid/sendgrid-nodejs)
