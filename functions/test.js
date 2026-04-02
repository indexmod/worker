export async function onRequest() {
  return new Response("FUNCTIONS ARE ALIVE", {
    headers: { "content-type": "text/plain" }
  });
}
