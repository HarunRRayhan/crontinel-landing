import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

// REMOVE DEBUG ENDPOINT AFTER USE
export const GET: APIRoute = async ({ request }) => {
  try {
    const cfEnv = env;
    const result = {
      envType: typeof cfEnv,
      envKeys: Object.keys(cfEnv),
      hasAllSecrets: Object.keys(cfEnv).filter(k => k.includes('RESEND')).length,
      resendApiKey: typeof cfEnv.RESEND_API_KEY,
      resendAudienceId: typeof cfEnv.RESEND_AUDIENCE_ID,
      apiKeyLength: cfEnv.RESEND_API_KEY?.length ?? 0,
    };
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
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

    const resendApiKey = env.RESEND_API_KEY;
    const resendAudienceId = env.RESEND_AUDIENCE_ID;

    if (!resendApiKey) {
      console.error('RESEND_API_KEY is undefined in env');
      return new Response(JSON.stringify({ ok: false, error: 'Server misconfigured: missing API key' }), {
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
