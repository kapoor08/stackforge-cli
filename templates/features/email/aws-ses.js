import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const client = new SESClient({
  region: process.env.AWS_SES_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function sendEmail(to, subject, html) {
  const command = new SendEmailCommand({
    Source: 'noreply@example.com',
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Html: { Data: html } },
    },
  });
  await client.send(command);
}
