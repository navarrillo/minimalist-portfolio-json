import { basics } from "@cv"

/**
 * Page background from the global stylesheet (`html { background: #fff }`).
 * Home-screen icons and the web manifest use the same colour so the mark
 * sits on an opaque tile that matches the site.
 */
export const siteBackgroundColor = "#ffffff"

/** Display name from the CV document. Falls back when the field is blank. */
export function siteName(name: string = basics.name): string {
  const trimmed = name.trim()
  return trimmed.length > 0 ? trimmed : "Portfolio"
}

/**
 * Compact home-screen label. The full name when it already fits, otherwise
 * the first word, trimmed to the usual 12-character launcher limit.
 */
export function siteShortName(name: string = siteName()): string {
  if (name.length <= 12) return name
  const first = name.split(/\s+/)[0] ?? name
  return first.length <= 12 ? first : first.slice(0, 12)
}
