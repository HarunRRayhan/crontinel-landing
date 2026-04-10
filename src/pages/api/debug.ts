import type { APIRoute } from 'astro';

// Debug endpoint - REMOVE AFTER USE
export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // @ts-ignore
    const globalAny = globalThis;
    const result: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      importMetaEnvKeys: Object.keys(import.meta.env || {}).filter(k => k.toLowerCase().includes('resend')),
      importMetaEnvHasResendKey: 'RESEND_API_KEY' in (import.meta.env || {}),
      importMetaEnvHasAudienceId: 'RESEND_AUDIENCE_ID' in (import.meta.env || {}),
      localsKeys: Object.keys(locals || {}),
      localsRuntime: (locals as any)?.runtime ? Object.keys((locals as any).runtime) : 'none',
      processEnvKeys: Object.keys(process.env || {}).filter(k => k.toLowerCase().includes('resend')),
      globalEnvKeys: typeof globalAny.__env__ !== 'undefined' ? Object.keys(globalAny.__env__).filter(k => k.toLowerCase().includes('resend')) : 'undefined',
    };

    return new Response(JSON.stringify(result, null, 2), {
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
