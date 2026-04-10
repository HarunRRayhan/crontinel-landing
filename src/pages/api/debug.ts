import type { APIRoute } from 'astro';

// REMOVE DEBUG ENDPOINT AFTER USE

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // @ts-ignore
    const cfContext = (locals as any)?.cfContext;
    const result = {
      localsKeys: Object.keys(locals || {}),
      cfContextKeys: cfContext ? Object.keys(cfContext) : 'none',
      cfContextRuntime: cfContext?.runtime ? Object.keys(cfContext.runtime) : 'none',
      cfContextEnv: cfContext?.env ? Object.keys(cfContext.env).filter(k => k.includes('RESEND')) : 'none',
      cfContextEnvValues: cfContext?.env ? {
        RESEND_API_KEY: cfContext.env.RESEND_API_KEY,
        RESEND_AUDIENCE_ID: cfContext.env.RESEND_AUDIENCE_ID,
      } : 'none',
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
