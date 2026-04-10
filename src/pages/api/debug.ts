import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

// REMOVE DEBUG ENDPOINT AFTER USE

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const cfEnv = env;
    const result = {
      envType: typeof cfEnv,
      envKeys_sample: typeof cfEnv === 'object' ? Object.keys(cfEnv).slice(0, 20) : 'not object',
      resendApiKey: cfEnv.RESEND_API_KEY ? 'HAS_VALUE' : 'UNDEFINED',
      resendAudienceId: cfEnv.RESEND_AUDIENCE_ID ? 'HAS_VALUE' : 'UNDEFINED',
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
