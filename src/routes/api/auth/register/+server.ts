import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { register as apiRegister } from '$lib/api';
import { generateToken } from '$lib/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { username, email, password } = await request.json();

		if (!username || !email || !password) {
			return json({ error: 'All fields are required' }, { status: 400 });
		}

		if (password.length < 6) {
			return json({ error: 'Password must be at least 6 characters' }, { status: 400 });
		}

		// Call Python API
		const cookieHeader = cookies.toString();
		const result = await apiRegister(username, email, password, cookieHeader);

		const user = result.user;

		// Generate SvelteKit token for internal use
		const token = generateToken(user);

		return json(
			{ user, token: result.token },
			{
				status: 201,
				headers: {
					'Set-Cookie': `token=${result.token || token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
				}
			}
		);
	} catch (error: any) {
		console.error('Register error:', error);
		return json({ error: error.message || 'Registration failed' }, { status: 500 });
	}
};
