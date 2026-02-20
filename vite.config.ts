import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [sveltekit()],
	plugins: [react()],
	
  server: {
	  port : 3000,
    // 1. Allow the server to listen on all network interfaces (0.0.0.0)
    // This is necessary for Docker to expose the port correctly.
    host: true, 
    
    // 2. Explicitly allow the host name seen by the reverse proxy/browser.
    allowedHosts: [
      'localhost',  // Always good practice
      '127.0.0.1',   // Also a good idea
	  'vibetube.c6t.ru',
	  'vibetube.p7z.ru'
    ]
  }
});
