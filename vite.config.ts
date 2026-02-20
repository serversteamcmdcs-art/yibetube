import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
  server: {
    // 1. Allow the server to listen on all network interfaces (0.0.0.0)
    // This is necessary for Docker to expose the port correctly.
    host: true, 
    
    // 2. Explicitly allow the host name seen by the reverse proxy/browser.
    allowedHosts: [
      BLOCKED_HOST, // The specific host from the error message
      'localhost',  // Always good practice
      '127.0.0.1'   // Also a good idea
    ]
	  port : 3000,
  }
});
