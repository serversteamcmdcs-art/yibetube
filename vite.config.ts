import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const databaseUrl = process.env.DATABASE_URL as string | undefined;
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5173;

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 3000,
	}
});
