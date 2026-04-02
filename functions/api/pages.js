export async function onRequest({ env }) {
  const list = await env.WIKI_DB.list();
  return new Response(JSON.stringify(list.keys.map(k => k.name)), {
    headers: { "content-type": "application/json" }
  });
}
