vite: {
  optimizeDeps: {
    exclude: ['node-rfc'],
  },
  // start here
  server: {
    allowedHosts: [
      'web.example.test',
    ]
  }
}
