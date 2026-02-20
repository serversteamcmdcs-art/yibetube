// vite.config.js or vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The blocked host is typically the Docker service name, e.g., 'frontend_web'
const BLOCKED_HOST = 'frontend_web'; 

export default defineConfig({
  plugins: [react()],
  //  Add the server configuration block
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
  }
})
