import type { APIRoute } from 'astro';

// REMOVE DEBUG ENDPOINT AFTER USE

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const cfRuntime = (locals as any)?.cfContext?.runtime;
    const cfEnv = cfRuntime?.env;
    const result = {
      cfRuntimeEnv: cfEnv ? Object.keys(cfEnv) : 'none',
      cfEnvValues: cfEnv ? {
        RESEND_API_KEY: cfEnv.RESEND_API_KEY ? 'HAS_VALUE' : 'UNDEFINED',
        RESEND_AUDIENCE_ID: cfEnv.RESEND_AUDIENCE_ID ? 'HAS_VALUE' : 'UNDEFINED',
      } : 'cfEnv is falsy',
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
