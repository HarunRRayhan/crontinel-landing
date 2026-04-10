import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const email = body?.email;

    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ ok: false, error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid email format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Cloudflare Workers SSR: secrets injected via cfContext.runtime.env
    const cfRuntime = (locals as any)?.cfContext?.runtime;
    const resendApiKey = import.meta.env.RESEND_API_KEY
      ?? (locals as any)?.cfContext?.runtime?.env?.RESEND_API_KEY
      ?? process.env.RESEND_API_KEY;

    const resendAudienceId = import.meta.env.RESEND_AUDIENCE_ID
      ?? (locals as any)?.cfContext?.runtime?.env?.RESEND_AUDIENCE_ID
      ?? process.env.RESEND_AUDIENCE_ID;

    if (!resendApiKey || !resendAudienceId) {
      console.error('Missing env vars:', {
        cfRuntimeEnv: cfRuntime?.env ? Object.keys(cfRuntime.env).filter(k => k.includes('RESEND')) : 'none',
        hasApiKey: !!resendApiKey,
        hasAudienceId: !!resendAudienceId,
      });
      return new Response(JSON.stringify({ ok: false, error: 'Server misconfigured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resendRes = await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        audience_id: resendAudienceId,
      }),
    });

    const data = await resendRes.json();

    if (!resendRes.ok) {
      console.error('Resend error:', data);
      return new Response(JSON.stringify({ ok: false, error: 'Failed to subscribe' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Subscribe error:', err);
    return new Response(JSON.stringify({ ok: false, error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
