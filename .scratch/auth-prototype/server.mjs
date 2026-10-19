import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const routes = new Map([
  ["/", [new URL("./index.html", import.meta.url), "text/html; charset=utf-8"]],
  ["/index.html", [new URL("./index.html", import.meta.url), "text/html; charset=utf-8"]],
  ["/style.css", [new URL("./style.css", import.meta.url), "text/css; charset=utf-8"]],
  ["/preview.js", [new URL("./preview.js", import.meta.url), "text/javascript; charset=utf-8"]],
  ["/assets/mark.png", [new URL("../../public/brand/khonnai-mark.png", import.meta.url), "image/png"]],
  ["/assets/noto-sans-latin.woff2", [new URL("../../public/landing/fonts/noto-sans-latin.woff2", import.meta.url), "font/woff2"]],
  ["/assets/noto-sans-thai.woff2", [new URL("../../public/landing/fonts/noto-sans-thai.woff2", import.meta.url), "font/woff2"]],
]);

const headers = {
  "Content-Security-Policy": "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'none'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'; object-src 'none'",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Cache-Control": "no-store",
};

const server = http.createServer(async (request, response) => {
  if (!["GET", "HEAD"].includes(request.method)) {
    response.writeHead(405, { ...headers, Allow: "GET, HEAD" });
    response.end();
    return;
  }
  const route = routes.get(new URL(request.url, "http://127.0.0.1").pathname);
  if (!route) {
    response.writeHead(404, headers);
    response.end();
    return;
  }
  try {
    const bytes = await readFile(fileURLToPath(route[0]));
    response.writeHead(200, { ...headers, "Content-Type": route[1], "Content-Length": bytes.byteLength });
    response.end(request.method === "HEAD" ? undefined : bytes);
  } catch {
    response.writeHead(404, headers);
    response.end();
  }
});

server.listen(5292, "127.0.0.1", () => {
  process.stdout.write("Auth prototype available at http://127.0.0.1:5292/\n");
});
