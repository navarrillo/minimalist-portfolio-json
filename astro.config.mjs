import { defineConfig } from 'astro/config';

// Static HTML, CSS, and JS in dist/ for a file server. No Node adapter.
export default defineConfig({
  output: 'static',
  vite: {
    build: {
      sourcemap: false,
    },
  },
});
