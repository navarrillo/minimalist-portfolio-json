# Deploy

Production is the `main` branch. Caddy serves the built files at [cv.sergionavarro.me](https://cv.sergionavarro.me) from `/srv/sites/cv`. Nothing in this repo runs on a GitHub Actions self-hosted runner: the repository is public, so a runner on the VPS would expose that machine.

A pull-based script on the server checks `origin/main` about every 2 minutes. When the branch moves, the script checks out that commit, runs:

```bash
npm ci && npm run build
```

and atomically publishes `dist/` to `/srv/sites/cv`. The build is fully static. No Node process stays up to serve the site.

## Requirements

Astro 7.4 needs Node.js `>=22.23.4` and npm `>=9.6.5`. `sharp@0.35.5` needs Node.js `>=20.9.0`, so the stricter requirement is Node.js `>=22.23.4` (`.nvmrc` selects major 22).

Build with `TZ=UTC`. Work and education years come from `Date#getFullYear()` on ISO dates, which JavaScript treats as UTC midnight. A timezone west of UTC can shift 1 January dates back one year.

## Publish

1. Fetch `origin/main` and skip the run when that commit is already live.
2. In a build directory, check out the new commit and run `npm ci && npm run build`.
3. Copy `dist/` into a new release directory, then point `/srv/sites/cv` at it with an atomic symlink update (or a same-filesystem rename). Caddy should never see a half-written tree.

```caddyfile
cv.sergionavarro.me {
	root * /srv/sites/cv
	encode gzip
	file_server
}
```

`dist/index.html` is the document at `/`. Hashed assets live under `dist/_astro/`.

## Printing a private contact line

The built files do not include an email address. To show one on a PDF, open the site with a URL fragment and print from the browser:

```text
https://cv.sergionavarro.me/#contact=you@example.com
```

The fragment stays in the browser. It is not sent to the server and is not part of the build. The page copies it into a line that is visible only while printing. With no fragment, that line stays empty. Percent-encode the value if it contains characters such as `+` or `&`.
