import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const BLOCKED_HOST = 'frontend_web'; 

export default defineConfig({
	plugins: [sveltekit()],
	plugins: [react()],
	server: {
        host: true, 
		port: 3000,
    allowedHosts: [
      BLOCKED_HOST, // The specific host from the error message
      'localhost',  // Always good practice
      '127.0.0.1'   // Also a good idea
    ]
   }
});
