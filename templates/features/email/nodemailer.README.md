# Email (Nodemailer)

Nodemailer integration for sending emails via SMTP.

## Setup

1. Configure your SMTP server credentials
2. Add to `.env`:
   ```
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your_username
   SMTP_PASS=your_password
   ```

## Usage

See `src/lib/nodemailer.ts` for the email client implementation.

## Documentation

- [Nodemailer Documentation](https://nodemailer.com/)
