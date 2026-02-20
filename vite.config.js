import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5000,
    strictPort: false,
    host: true,
    allowedHosts: ['vibetube.p7z.ru', 'localhost', 'vibetube.c6t.ru']
    cors: true // опционально: разрешить кросс‑доменные запросы
  }
});
