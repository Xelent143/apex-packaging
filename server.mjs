import { createReadStream, statSync } from 'node:fs';
import { appendFile, mkdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createBrotliCompress, createGzip } from 'node:zlib';
import { handleQuoteRequest, sendQuoteEmail } from './server/quoteEmail.mjs';
import { sendSmtpEmail } from './server/smtpEmail.mjs';
import { createApexTestCheckoutSession, handleCreateCheckoutSession } from './server/stripeCheckout.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const distDir = resolve(__dirname, 'dist');
const port = Number(process.env.PORT || 4321);
const defaultQuoteRecipient = 'sales@apexpackagingsolutions.com';
const defaultQuoteSender = 'Apex Packaging <sales@apexpackagingsolutions.com>';
const quoteFailureLogPath = resolve(__dirname, 'data', 'quote-email-failures.jsonl');
const canonicalHost = 'apexpackagingsolutions.com';
const wwwHost = 'www.apexpackagingsolutions.com';

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8'
};

const compressibleExtensions = new Set(['.css', '.html', '.js', '.json', '.svg', '.txt', '.xml']);

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const canonicalRedirect = getCanonicalRedirect(url, req.headers);

    if (canonicalRedirect) {
      res.writeHead(req.method === 'GET' || req.method === 'HEAD' ? 301 : 308, {
        Location: canonicalRedirect
      });
      res.end();
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/quote') {
      const request = new Request(url, {
        method: 'POST',
        headers: nodeHeadersToWebHeaders(req.headers),
        body: req,
        duplex: 'half'
      });
      const response = await handleQuoteRequest(request, {
        apiKey: process.env.RESEND_API_KEY || (process.env.SMTP_PASS ? 'smtp-configured' : ''),
        from: getQuoteSender(),
        to: process.env.QUOTE_TO_EMAIL || defaultQuoteRecipient,
        sendEmail: createQuoteEmailSender(),
        onDeliveryFailure: recordQuoteDeliveryFailure
      });

      await writeWebResponse(res, response);
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/create-checkout-session') {
      const request = new Request(url, {
        method: 'POST',
        headers: nodeHeadersToWebHeaders(req.headers),
        body: req,
        duplex: 'half'
      });
      const response = await handleCreateCheckoutSession(request, {
        secretKey: process.env.STRIPE_SECRET_KEY || '',
        siteUrl: process.env.SITE_URL || ''
      });

      await writeWebResponse(res, response);
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/test-checkout-session') {
      if (!(process.env.STRIPE_SECRET_KEY || '')) {
        res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Stripe is not configured.');
        return;
      }

      try {
        const session = await createApexTestCheckoutSession({
          fetchImpl: fetch,
          secretKey: process.env.STRIPE_SECRET_KEY || '',
          successUrl: `${process.env.SITE_URL || url.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${process.env.SITE_URL || url.origin}/paynow?payment=cancelled`
        });

        if (!session.url) throw new Error('Stripe did not return a checkout URL.');
        res.writeHead(303, { Location: session.url });
        res.end();
      } catch (error) {
        res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(error.message || 'Stripe checkout could not be started.');
      }
      return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD, POST' });
      res.end('Method Not Allowed');
      return;
    }

    serveStatic(url.pathname, req, res);
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Internal Server Error');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Apex Packaging server listening on ${port}`);
});

function getQuoteSender() {
  if (process.env.SMTP_PASS) return process.env.SMTP_FROM || process.env.QUOTE_FROM_EMAIL || defaultQuoteSender;
  return process.env.RESEND_FROM || process.env.QUOTE_FROM_EMAIL || defaultQuoteSender;
}

function createQuoteEmailSender() {
  if (!process.env.SMTP_PASS) return sendQuoteEmail;
  return (_apiKey, email) => sendSmtpEmail({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: process.env.SMTP_PORT || '465',
    username: process.env.SMTP_USER || defaultQuoteRecipient,
    password: process.env.SMTP_PASS,
    envelopeFrom: process.env.SMTP_USER || defaultQuoteRecipient
  }, email);
}

async function recordQuoteDeliveryFailure(submission, error, email) {
  console.error('Quote email delivery failed:', error?.message || error);
  const record = {
    failedAt: new Date().toISOString(),
    error: error?.message || String(error),
    to: email?.to || [],
    subject: email?.subject || '',
    source: submission.source,
    fields: submission.fields,
    files: submission.files.map(({ content, ...file }) => file)
  };

  await mkdir(dirname(quoteFailureLogPath), { recursive: true });
  await appendFile(quoteFailureLogPath, `${JSON.stringify(record)}\n`);
}

async function writeWebResponse(res, response) {
  const headers = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });
  res.writeHead(response.status, headers);
  if (response.body) {
    const buffer = Buffer.from(await response.arrayBuffer());
    res.end(buffer);
  } else {
    res.end();
  }
}

function serveStatic(pathname, req, res) {
  const filePath = resolveStaticPath(pathname);
  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
    return;
  }

  const ext = extname(filePath);
  const encoding = getCompressionEncoding(req, ext);
  const headers = {
    'Content-Type': contentTypes[ext] || 'application/octet-stream',
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    Vary: 'Accept-Encoding'
  };

  if (encoding) headers['Content-Encoding'] = encoding;

  res.writeHead(200, headers);

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  const stream = createReadStream(filePath);
  if (encoding === 'br') {
    stream.pipe(createBrotliCompress()).pipe(res);
  } else if (encoding === 'gzip') {
    stream.pipe(createGzip()).pipe(res);
  } else {
    stream.pipe(res);
  }
}

function getCompressionEncoding(req, ext) {
  if (!compressibleExtensions.has(ext)) return '';
  const acceptEncoding = String(req.headers['accept-encoding'] || '');
  if (acceptEncoding.includes('br')) return 'br';
  if (acceptEncoding.includes('gzip')) return 'gzip';
  return '';
}

function nodeHeadersToWebHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item);
    } else if (value != null) {
      headers.set(key, value);
    }
  }
  return headers;
}

function getCanonicalRedirect(url, headers) {
  const host = String(headers.host || '').toLowerCase().split(':')[0];
  if (host !== wwwHost) return '';

  return `https://${canonicalHost}${url.pathname}${url.search}`;
}

function resolveStaticPath(pathname) {
  const decodedPath = decodeURIComponent(pathname);
  const cleanPath = normalize(decodedPath).replace(/^(\.\.[/\\])+/, '');
  const candidates = [];

  if (cleanPath === '/' || cleanPath === '.') {
    candidates.push(join(distDir, 'index.html'));
  } else {
    candidates.push(join(distDir, cleanPath));
    candidates.push(join(distDir, cleanPath, 'index.html'));
    if (!extname(cleanPath)) candidates.push(join(distDir, `${cleanPath}.html`));
  }

  for (const candidate of candidates) {
    const resolved = resolve(candidate);
    if (!resolved.startsWith(distDir)) continue;
    try {
      const stats = statSync(resolved);
      if (stats.isFile()) return resolved;
    } catch {
      // Try the next candidate.
    }
  }

  return null;
}
