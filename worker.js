export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/save" && request.method === "POST") {
      const { title, content } = await request.json();
      await env.WIKI.put(title, content);
      return new Response("OK");
    }

    if (url.pathname.startsWith("/edit/")) {
      const title = decodeURIComponent(url.pathname.replace("/edit/", ""));
      const content = await env.WIKI.get(title) || "";
      return html(renderEditor(title, content));
    }

    const title = decodeURIComponent(url.pathname.slice(1)) || "home";
    const content = await env.WIKI.get(title);

    if (!content) {
      return html(renderNotFound(title), 404);
    }

    return html(renderPage(title, content));
  }
};

function html(body, status = 200) {
  return new Response(body, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" }
  });
}

function renderPage(title, content) {
  return `
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
body { font-family: sans-serif; max-width: 800px; margin: 40px auto; }
pre { white-space: pre-wrap; }
</style>
</head>
<body>
<h1>${title}</h1>
<pre>${escapeHtml(content)}</pre>
<p><a href="/edit/${encodeURIComponent(title)}">Edit</a></p>
</body>
</html>`;
}

function renderEditor(title, content) {
  return `
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Edit ${title}</title>
<style>
body { font-family: sans-serif; max-width: 800px; margin: 40px auto; }
textarea { width: 100%; height: 60vh; }
</style>
</head>
<body>
<h1>Edit: ${title}</h1>
<textarea id="content">${escapeHtml(content)}</textarea>
<br><br>
<button onclick="save()">Save</button>

<script>
async function save() {
  await fetch("/save", {
    method: "POST",
    headers: {"content-type": "application/json"},
    body: JSON.stringify({
      title: "${title}",
      content: document.getElementById("content").value
    })
  });
  window.location = "/${title}";
}
</script>

</body>
</html>`;
}

function renderNotFound(title) {
  return `
<h1>Page not found: ${title}</h1>
<a href="/edit/${encodeURIComponent(title)}">Create page</a>
`;
}

function escapeHtml(str) {
  return (str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
