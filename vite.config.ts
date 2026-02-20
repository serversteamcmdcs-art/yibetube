import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		allowedHosts: [
          'vibetube.p7z.ru',
          'vibetube.c6t.ru',
			]
	    port : 3000,
	}
});
