import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import test from "node:test"

const ICONS = {
  "apple-touch-icon.png": 180,
  "icon-192.png": 192,
  "icon-512.png": 512,
}

function pngInfo(buf) {
  assert.equal(buf.subarray(0, 8).toString("hex"), "89504e470d0a1a0a")
  assert.equal(buf.subarray(12, 16).toString("ascii"), "IHDR")
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
    colorType: buf[25],
  }
}

function shortName(name) {
  const trimmed = name.trim()
  if (trimmed.length <= 12) return trimmed
  const first = trimmed.split(/\s+/)[0] ?? trimmed
  return first.length <= 12 ? first : first.slice(0, 12)
}

test("home screen icons are opaque PNGs", () => {
  for (const [file, size] of Object.entries(ICONS)) {
    const info = pngInfo(readFileSync(`public/${file}`))
    assert.equal(info.width, size, file)
    assert.equal(info.height, size, file)
    // colour type 2 is truecolour RGB, with no alpha channel
    assert.equal(info.colorType, 2, file)
  }
})

test("the document head keeps the favicon and points at the home screen files", () => {
  const layout = readFileSync("src/layouts/Layout.astro", "utf8")
  assert.match(layout, /rel="icon" type="image\/svg\+xml" href="\/favicon\.svg"/)
  assert.match(layout, /rel="apple-touch-icon" href="\/apple-touch-icon\.png"/)
  assert.match(layout, /rel="manifest" href="\/site\.webmanifest"/)
  assert.match(layout, /name="apple-mobile-web-app-title"/)
})

test("the production build serves icons and the manifest from the site root", () => {
  assert.ok(
    existsSync("dist/index.html"),
    "dist/ is missing; run npm run build before npm test",
  )

  for (const [file, size] of Object.entries(ICONS)) {
    const built = `dist/${file}`
    assert.ok(existsSync(built), built)
    const info = pngInfo(readFileSync(built))
    assert.equal(info.width, size, built)
    assert.equal(info.height, size, built)
    assert.equal(info.colorType, 2, built)
  }

  const cv = JSON.parse(readFileSync("cv_english.json", "utf8"))
  const name = cv.basics.name.trim()
  const manifest = JSON.parse(readFileSync("dist/site.webmanifest", "utf8"))
  assert.equal(manifest.name, name)
  assert.equal(manifest.short_name, shortName(name))
  assert.equal(manifest.theme_color, "#ffffff")
  assert.equal(manifest.background_color, "#ffffff")
  assert.deepEqual(
    manifest.icons.map((icon) => icon.src),
    ["/icon-192.png", "/icon-512.png"],
  )

  const html = readFileSync("dist/index.html", "utf8")
  assert.match(html, /rel="apple-touch-icon" href="\/apple-touch-icon\.png"/)
  assert.match(html, /rel="manifest" href="\/site\.webmanifest"/)
  assert.match(html, /rel="icon"[^>]*href="\/favicon\.svg"/)
  assert.match(
    html,
    new RegExp(`name="apple-mobile-web-app-title" content="${name}"`),
  )
})
