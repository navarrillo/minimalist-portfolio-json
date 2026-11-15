import type { APIRoute } from "astro"
import { siteBackgroundColor, siteName, siteShortName } from "@/site"

export const GET: APIRoute = () => {
  const manifest = {
    name: siteName(),
    short_name: siteShortName(),
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    theme_color: siteBackgroundColor,
    background_color: siteBackgroundColor,
  }

  return new Response(`${JSON.stringify(manifest, null, 2)}\n`, {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
    },
  })
}
