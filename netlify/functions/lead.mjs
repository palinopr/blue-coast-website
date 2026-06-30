// Forwards a captured lead to GoHighLevel. Netlify Forms already stores every
// submission, so this is best-effort: if GHL_WEBHOOK_URL is unset or the call
// fails, the lead is still safe and we return ok.
export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let data = {};
  try {
    data = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'bad json' }), { status: 400 });
  }

  const url = process.env.GHL_WEBHOOK_URL;
  if (url) {
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: 'bluecoastpr.com',
          submittedAt: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error('GHL forward failed:', err?.message || err);
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
