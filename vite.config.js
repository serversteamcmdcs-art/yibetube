import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5000,
    host: true,
    allowedHosts: ['vibetube.p7z.ru']
  },
  build: {
    outDir: 'dist' // папка со сборкой
  }
});
