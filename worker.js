export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS helper
    const json = (data) =>
      new Response(JSON.stringify(data), {
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

    const text = (data) =>
      new Response(data, {
        headers: {
          "content-type": "text/plain",
          "Access-Control-Allow-Origin": "*",
        },
      });

    // ---------------------------
    // GET ALL PAGES
    // ---------------------------
    if (path === "/api/pages") {
      const list = await env.WIKI_DB.list();
      return json(list.keys.map(k => k.name));
    }

    // ---------------------------
    // GET PAGE
    // ---------------------------
    if (path.startsWith("/api/page/") && request.method === "GET") {
      const slug = path.split("/").pop();
      const data = await env.WIKI_DB.get(slug);
      return text(data || "");
    }

    // ---------------------------
    // SAVE PAGE
    // ---------------------------
    if (path.startsWith("/api/page/") && request.method === "POST") {
      const slug = path.split("/").pop();
      const body = await request.text();

      await env.WIKI_DB.put(slug, body);

      return text("saved");
    }

    return text("OK Wiki Worker is running");
  },
};
