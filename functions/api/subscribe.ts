interface Env {
  RESEND_API_KEY: string;
  RESEND_AUDIENCE_ID: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body = await request.json() as { email?: string };
    const email = (body?.email ?? '').trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: 'Valid email address required.' },
        { status: 422, headers: corsHeaders }
      );
    }

    if (!env.RESEND_API_KEY || !env.RESEND_AUDIENCE_ID) {
      // Graceful degradation: log but don't fail visibly
      console.error('Resend env vars not configured.');
      return Response.json({ ok: true }, { headers: corsHeaders });
    }

    const resendRes = await fetch(
      `https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          unsubscribed: false,
        }),
      }
    );

    if (!resendRes.ok && resendRes.status !== 409) {
      // 409 = already subscribed, treat as success
      console.error('Resend error:', resendRes.status, await resendRes.text());
      return Response.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500, headers: corsHeaders }
      );
    }

    return Response.json({ ok: true }, { headers: corsHeaders });
  } catch (err) {
    console.error('Subscribe error:', err);
    return Response.json(
      { error: 'Something went wrong.' },
      { status: 500, headers: corsHeaders }
    );
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
