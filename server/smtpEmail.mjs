import tls from 'node:tls';
import { Buffer } from 'node:buffer';
import { sanitizeFilename } from './quoteEmail.mjs';

export async function sendSmtpEmail(config, email) {
  const host = config.host || 'smtp.hostinger.com';
  const port = Number(config.port || 465);
  const username = config.username;
  const password = config.password;
  if (!username || !password) throw new Error('SMTP username and password are required.');

  const socket = tls.connect({ host, port, servername: host });
  const smtp = createSmtpSession(socket);
  try {
    await smtp.expect(220);
    await smtp.command(`EHLO ${config.helo || 'apexpackagingsolutions.com'}`, 250);
    await smtp.command('AUTH LOGIN', 334);
    await smtp.command(Buffer.from(username).toString('base64'), 334);
    await smtp.command(Buffer.from(password).toString('base64'), 235);
    await smtp.command(`MAIL FROM:<${extractEmailAddress(config.envelopeFrom || username)}>`, 250);
    for (const recipient of email.to || []) {
      await smtp.command(`RCPT TO:<${recipient}>`, 250);
    }
    await smtp.command('DATA', 354);
    await smtp.writeData(buildMimeMessage(email));
    await smtp.expect(250);
    await smtp.command('QUIT', 221).catch(() => {});
    return { id: 'smtp-sent' };
  } finally {
    socket.end();
  }
}

function createSmtpSession(socket) {
  let buffer = '';
  const waiters = [];

  socket.setEncoding('utf8');
  socket.on('data', (chunk) => {
    buffer += chunk;
    flushWaiters();
  });
  socket.on('error', (error) => {
    while (waiters.length) waiters.shift().reject(error);
  });

  function flushWaiters() {
    while (waiters.length) {
      const response = readCompleteResponse();
      if (!response) return;
      waiters.shift().resolve(response);
    }
  }

  function readCompleteResponse() {
    const lines = buffer.split(/\r?\n/);
    if (lines.length < 2) return null;
    const consumed = [];
    for (let i = 0; i < lines.length - 1; i += 1) {
      consumed.push(lines[i]);
      if (/^\d{3} /.test(lines[i])) {
        buffer = lines.slice(i + 1).join('\n');
        return consumed.join('\n');
      }
    }
    return null;
  }

  async function expect(code) {
    const response = await new Promise((resolve, reject) => {
      waiters.push({ resolve, reject });
      flushWaiters();
    });
    if (!response.startsWith(String(code))) throw new Error(`SMTP expected ${code}, got: ${response}`);
    return response;
  }

  async function command(line, code) {
    socket.write(`${line}\r\n`);
    return expect(code);
  }

  async function writeData(message) {
    socket.write(`${dotStuff(message)}\r\n.\r\n`);
  }

  return { command, expect, writeData };
}

function buildMimeMessage(email) {
  const mixedBoundary = `mixed_${cryptoRandom()}`;
  const altBoundary = `alt_${cryptoRandom()}`;
  const headers = [
    `From: ${email.from}`,
    `To: ${(email.to || []).join(', ')}`,
    email.reply_to ? `Reply-To: ${email.reply_to}` : '',
    `Subject: ${encodeHeader(email.subject || 'New quote inquiry')}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${mixedBoundary}"`
  ].filter(Boolean);

  const body = [
    ...headers,
    '',
    `--${mixedBoundary}`,
    `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
    '',
    `--${altBoundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    email.text || '',
    '',
    `--${altBoundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    email.html || '',
    '',
    `--${altBoundary}--`
  ];

  for (const attachment of email.attachments || []) {
    const filename = sanitizeFilename(attachment.filename || 'attachment');
    body.push(
      '',
      `--${mixedBoundary}`,
      `Content-Type: application/octet-stream; name="${filename}"`,
      'Content-Transfer-Encoding: base64',
      `Content-Disposition: attachment; filename="${filename}"`,
      '',
      wrapBase64(attachment.content || '')
    );
  }

  body.push('', `--${mixedBoundary}--`, '');
  return body.join('\r\n');
}

function dotStuff(message) {
  return message.replace(/^\./gm, '..');
}

function wrapBase64(value) {
  return String(value).replace(/(.{1,76})/g, '$1\r\n').trim();
}

function extractEmailAddress(value) {
  const match = String(value).match(/<([^>]+)>/);
  return match ? match[1] : String(value).trim();
}

function encodeHeader(value) {
  return String(value).replace(/\r?\n/g, ' ');
}

function cryptoRandom() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
