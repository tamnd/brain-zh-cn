// Cloudflare Pages Advanced Mode Worker
// Serves raw Markdown to AI agents that send Accept: text/markdown
// See https://acceptmarkdown.com for the spec

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const accept = request.headers.get("Accept") ?? "";

    const wantsMarkdown = accept.split(",").some(part => {
      const [type] = part.trim().split(";");
      return type.trim() === "text/markdown";
    });

    if (wantsMarkdown) {
      // Map URL path to the static .md file: /foo/bar/ → /foo/bar/index.md
      const mdPath = (url.pathname.endsWith("/") ? url.pathname : url.pathname + "/") + "index.md";
      const mdUrl = new URL(url.toString());
      mdUrl.pathname = mdPath;

      const mdRes = await env.ASSETS.fetch(new Request(mdUrl.toString()));
      if (mdRes.ok) {
        return new Response(mdRes.body, {
          status: 200,
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "Vary": "Accept",
            "Cache-Control": "public, max-age=3600",
          },
        });
      }
    }

    // Default: serve the HTML asset
    const res = await env.ASSETS.fetch(request);
    if ((res.headers.get("Content-Type") ?? "").includes("text/html")) {
      const headers = new Headers(res.headers);
      headers.set("Vary", "Accept");
      return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
    }
    return res;
  },
};
