export async function onRequestGet({ params, env }) {
  const data = await env.WIKI_DB.get(params.slug);
  return new Response(data || "");
}

export async function onRequestPost({ params, request, env }) {
  const text = await request.text();
  await env.WIKI_DB.put(params.slug, text);
  return new Response("saved");
}
