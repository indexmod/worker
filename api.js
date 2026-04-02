export async function onRequest({ request, env }) {

  const url = new URL(request.url);
  const parts = url.pathname.split("/").filter(Boolean);

  const keyIndex = "pages:index";

  // 📚 LIST PAGES
  if (request.method === "GET" && parts[0] === "pages") {
    const list = await env.WIKI_DB.get(keyIndex);
    return new Response(list || "[]", {
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }

  // 📄 GET PAGE
  if (request.method === "GET" && parts[0] === "page") {
    const slug = parts[1];

    const text = await env.WIKI_DB.get("page:" + slug) || "";

    return new Response(text, {
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  // 💾 SAVE PAGE
  if (request.method === "POST" && parts[0] === "page") {
    const slug = parts[1];
    const body = await request.text();

    await env.WIKI_DB.put("page:" + slug, body);

    // обновляем индекс страниц
    let index = await env.WIKI_DB.get(keyIndex);
    index = index ? JSON.parse(index) : [];

    if (!index.includes(slug)) {
      index.push(slug);
      await env.WIKI_DB.put(keyIndex, JSON.stringify(index));
    }

    return new Response("saved", {
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  return new Response("ok");
}
