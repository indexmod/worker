
export default {
  async fetch(request, env) {
    const objects = await env.VIDEO_BUCKET.list();

    let segments = objects.objects
      .map(obj => obj.key)
      .filter(key => key.endsWith(".ts"));

    if (segments.length === 0) {
      return new Response("No segments found", { status: 404 });
    }

    // Shuffle
    for (let i = segments.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [segments[i], segments[j]] = [segments[j], segments[i]];
    }

    // Берём первые 30 сегментов
    segments = segments.slice(0, 30);

    let playlist = "#EXTM3U\n";
    playlist += "#EXT-X-VERSION:3\n";
    playlist += "#EXT-X-TARGETDURATION:10\n";
    playlist += "#EXT-X-MEDIA-SEQUENCE:0\n";

    for (const seg of segments) {
      playlist += "#EXTINF:2.0,\n";
      playlist += seg + "\n";
    }

    playlist += "#EXT-X-ENDLIST\n";

    return new Response(playlist, {
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache"
      }
    });
  }
};
