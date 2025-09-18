interface EmailData {
  fromName?: string;
  fromEmail: string;
  recipients: string;
  cc?: string;
  subject: string;
  body: string; // HTML body
}

/**
 * Encodes a string into Quoted-Printable format.
 * This is necessary for email body content to be compatible with all email clients.
 * @param str The string to encode.
 * @returns The Quoted-Printable encoded string.
 */
function encodeQuotedPrintable(str: string): string {
  // Normalize line endings to CRLF for consistent processing
  const normalizedStr = str.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
  
  let result = '';
  for (let i = 0; i < normalizedStr.length; i++) {
    const char = normalizedStr[i];
    const charCode = normalizedStr.charCodeAt(i);

    if (
      (charCode >= 33 && charCode <= 60) ||
      (charCode >= 62 && charCode <= 126)
    ) {
      result += char;
    } else if (char === ' ' || char === '\t') {
       if (i + 2 <= normalizedStr.length && normalizedStr.substring(i + 1, i + 3) === '\r\n') {
          result += char === ' ' ? '=20' : '=09';
       } else {
          result += char;
       }
    } else if (char === '\r' || char === '\n') {
        result += char;
    } else {
      const hex = charCode.toString(16).toUpperCase();
      result += '=' + (hex.length < 2 ? '0' : '') + hex;
    }
  }

  // Enforce the 76-character line length limit with soft line breaks "=\r\n".
  let finalOutput = '';
  const lines = result.split('\r\n');
  for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      // Workaround for empty lines getting an extra CRLF
      if (line === '') {
          finalOutput += (i < lines.length - 1) ? '\r\n' : '';
          continue;
      }
      while (line.length > 76) {
          let breakPoint = 75;
          if (line[breakPoint] === '=') breakPoint--;
          if (line[breakPoint - 1] === '=') breakPoint -= 2;

          finalOutput += line.substring(0, breakPoint) + '=\r\n';
          line = line.substring(breakPoint);
      }
      finalOutput += line;
      if (i < lines.length - 1) {
          finalOutput += '\r\n';
      }
  }
  return finalOutput;
}


export function generateEmlContent(data: EmailData): string {
  const boundary = `----=_Part_${Math.random().toString(36).substring(2)}`;
  
  const textBody = data.body
    .replace(/<p>/gi, '')
    .replace(/<\/p>/gi, '\r\n\r\n')
    .replace(/<br\s*\/?>/gi, '\r\n')
    .replace(/<[^>]+>/g, '')
    .trim();

  const fromDisplayName = data.fromName ? `"${data.fromName.replace(/"/g, '\\"')}"` : null;
  const fromHeaderValue = fromDisplayName ? `${fromDisplayName} <${data.fromEmail}>` : data.fromEmail;

  const headers = [
    `From: ${fromHeaderValue}`,
    `To: ${data.recipients}`,
    data.cc ? `Cc: ${data.cc}` : null,
    `Subject: ${data.subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    `Date: ${new Date().toUTCString()}`,
  ].filter(Boolean).join('\r\n');

  const bodyParts = [
    `--${boundary}`,
    `Content-Type: text/plain; charset=utf-8`,
    `Content-Transfer-Encoding: quoted-printable`,
    ``,
    encodeQuotedPrintable(textBody),
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=utf-8`,
    `Content-Transfer-Encoding: quoted-printable`,
    ``,
    encodeQuotedPrintable(data.body),
    ``,
    `--${boundary}--`
  ];

  // Join with CRLF for email standard compliance
  const body = bodyParts.join('\r\n');

  return `${headers}\r\n\r\n${body}`;
}
