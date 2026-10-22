import { defineConfig } from 'astro/config';

// Static HTML, CSS, and JS in dist/ for a file server. No Node adapter.
export default defineConfig({
  output: 'static',
  // Astro 7 defaults this to "jsx", which drops spaces between inline elements.
  // Keep HTML-aware compression so the CV renders as it did on Astro 4–6.
  compressHTML: true,
  vite: {
    build: {
      sourcemap: false,
    },
  },
});
