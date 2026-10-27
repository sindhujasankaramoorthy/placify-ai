// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";

function atsDevApiPlugin(): Plugin {
  return {
    name: "ats-dev-api-plugin",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        const url = req.url || "";
        if (!url.startsWith("/api/ats")) {
          return next();
        }

        try {
          const { handleAtsApi } = await import("./src/server/ats/handler.ts");

          const chunks: Buffer[] = [];
          req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
          req.on("end", async () => {
            try {
              const bodyBuffer = chunks.length > 0 ? Buffer.concat(chunks) : undefined;
              const protocol = (req.socket as any)?.encrypted ? "https" : "http";
              const host = req.headers.host || "localhost:8080";
              const fullUrl = `${protocol}://${host}${url}`;

              const headers = new Headers();
              for (const [key, value] of Object.entries(req.headers)) {
                if (value) {
                  if (Array.isArray(value)) {
                    value.forEach((v) => headers.append(key, v));
                  } else {
                    headers.set(key, value);
                  }
                }
              }

              const webReq = new Request(fullUrl, {
                method: req.method,
                headers,
                body: req.method !== "GET" && req.method !== "HEAD" ? bodyBuffer : undefined,
                duplex: "half",
              } as any);

              const webRes = await handleAtsApi(webReq);
              if (webRes) {
                res.statusCode = webRes.status;
                webRes.headers.forEach((val, key) => {
                  res.setHeader(key, val);
                });
                const ab = await webRes.arrayBuffer();
                res.end(Buffer.from(ab));
              } else {
                next();
              }
            } catch (err: any) {
              console.error("[ATS Dev API] Processing error:", err);
              if (!res.headersSent) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "INTERNAL_ERROR", message: err.message }));
              }
            }
          });

          req.on("error", (err) => {
            console.error("[ATS Dev API] Request stream error:", err);
            if (!res.headersSent) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "INTERNAL_ERROR", message: err.message }));
            }
          });
        } catch (err: any) {
          console.error("[ATS Dev API] Error loading handler:", err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "INTERNAL_ERROR", message: err.message }));
          }
        }
      });
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  plugins: [atsDevApiPlugin()],
});
