import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

export async function sendEmail(to, subject, html) {
  const sentFrom = new Sender('noreply@example.com', 'Your App');
  const recipients = [new Recipient(to, to)];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject(subject)
    .setHtml(html);

  await mailerSend.email.send(emailParams);
}
