import type { APIRoute } from 'astro';

// REMOVE DEBUG ENDPOINT AFTER USE

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const result: Record<string, unknown> = {
      localsConstructor: locals?.constructor?.name,
      localsKeys: Object.keys(locals || {}),
      runtime: (locals as any)?.runtime,
      cfContext: (locals as any)?.cfContext,
      allLocals: JSON.stringify(Object.keys(locals || {})),
    };

    // @ts-ignore
    if (typeof globalThis !== 'undefined') {
      // @ts-ignore
      const gt = globalThis;
      result.envVarValue = typeof env !== 'undefined' ? env.RESEND_API_KEY : 'env undefined';
      result.globalKeys_sample = Object.keys(gt).slice(0, 20);
    }

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
