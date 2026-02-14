import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail(to, subject, html) {
  const msg = {
    to,
    from: 'noreply@example.com',
    subject,
    html,
  };
  await sgMail.send(msg);
}
