import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, site }) => {
  const accept = request.headers.get('accept') || '';

  if (accept.includes('application/json')) {
    return new Response(JSON.stringify({
      error: 'Public checkout has been disabled. Contact Apex for a secure private payment link.'
    }), {
      status: 410,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const siteUrl = site?.toString() || import.meta.env.SITE_URL || 'https://apexpackagingsolutions.com';
  return new Response(null, {
    status: 303,
    headers: { Location: `${siteUrl.replace(/\/+$/, '')}/contact` }
  });
};
