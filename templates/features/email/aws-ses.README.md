# Email (AWS SES)

Amazon Simple Email Service integration for sending transactional emails.

## Setup

1. Configure AWS SES in your AWS Console
2. Verify your domain or email addresses
3. Add credentials to `.env`:
   ```
   AWS_SES_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   ```

## Usage

See `src/lib/aws-ses.ts` for the email client implementation.

## Documentation

- [AWS SES Documentation](https://docs.aws.amazon.com/ses/)
