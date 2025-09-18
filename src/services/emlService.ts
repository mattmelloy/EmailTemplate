interface EmailData {
  fromName?: string;
  fromEmail: string;
  to: string;
  cc?: string;
  subject: string;
  body: string; // HTML body
}

export function generateEmlContent(data: EmailData): string {
  const boundary = `----=_Part_${Math.random().toString(36).substring(2)}`;
  
  const textBody = data.body
    .replace(/<p>/gi, '')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim();

  const fromHeaderValue = data.fromName ? `"${data.fromName}" <${data.fromEmail}>` : data.fromEmail;

  const headers = [
    `From: ${fromHeaderValue}`,
    `To: ${data.to}`,
    data.cc ? `Cc: ${data.cc}` : null,
    `Subject: ${data.subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    `Date: ${new Date().toUTCString()}`,
  ].filter(Boolean).join('\n');

  const body = [
    `--${boundary}`,
    `Content-Type: text/plain; charset=utf-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    textBody,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=utf-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    data.body,
    ``,
    `--${boundary}--`
  ].join('\n');

  return `${headers}\n\n${body}`;
}
