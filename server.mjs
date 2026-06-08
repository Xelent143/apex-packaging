import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleQuoteRequest, sendQuoteEmail } from './server/quoteEmail.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const distDir = resolve(__dirname, 'dist');
const port = Number(process.env.PORT || 4321);

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

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

    if (req.method === 'POST' && url.pathname === '/api/quote') {
      const request = new Request(url, {
        method: 'POST',
        headers: nodeHeadersToWebHeaders(req.headers),
        body: req,
        duplex: 'half'
      });
      const response = await handleQuoteRequest(request, {
        apiKey: process.env.RESEND_API_KEY || '',
        from: process.env.QUOTE_FROM_EMAIL || 'Apex Packaging <onboarding@resend.dev>',
        to: process.env.QUOTE_TO_EMAIL || 'xelenttraders@gmail.com',
        sendEmail: sendQuoteEmail
      });

      await writeWebResponse(res, response);
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
  res.writeHead(200, {
    'Content-Type': contentTypes[ext] || 'application/octet-stream',
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
  });

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  createReadStream(filePath).pipe(res);
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
