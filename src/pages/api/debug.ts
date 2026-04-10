import type { APIRoute } from 'astro';

// REMOVE DEBUG ENDPOINT AFTER USE

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const cfRuntime = (locals as any)?.cfContext?.runtime;
    const cfEnv = cfRuntime?.env;
    const result = {
      cfRuntimeEnv: cfEnv ? Object.keys(cfEnv).filter(k => k.includes('RESEND')) : 'none',
      cfEnvRESEND_API_KEY: cfEnv?.RESEND_API_KEY ? 'PRESENT' : 'MISSING',
      cfEnvRESEND_AUDIENCE_ID: cfEnv?.RESEND_AUDIENCE_ID ? 'PRESENT' : 'MISSING',
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
