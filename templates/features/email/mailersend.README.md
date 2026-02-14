# Email (MailerSend)

MailerSend email integration for sending transactional emails.

## Setup

1. Sign up at [MailerSend](https://mailersend.com)
2. Generate an API token from the dashboard
3. Add to `.env`:
   ```
   MAILERSEND_API_KEY=your_api_token
   ```

## Usage

See `src/lib/mailersend.ts` for the email client implementation.

## Documentation

- [MailerSend Node.js SDK](https://github.com/mailersend/mailersend-nodejs)
