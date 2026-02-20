export async function onRequest(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-pw',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method === 'GET') {
    const data = await env.GAGU_STORE.get('products');
    const parsed = data ? JSON.parse(data) : [];
    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (request.method === 'POST') {
    const auth = request.headers.get('x-admin-pw');
    if (auth !== '1234') {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }
    const body = await request.json();
    await env.GAGU_STORE.put('products', JSON.stringify(body));
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method not allowed', { status: 405 });
}
