# Email (Resend)

## Setup
1. Add RESEND_API_KEY to .env.
2. Client lives at src/lib/resend.ts.

## Example
```ts
import { resend } from '@/lib/resend';

await resend.emails.send({
  from: 'you@example.com',
  to: 'user@example.com',
  subject: 'Welcome',
  html: '<strong>Hello</strong>'
});
```
