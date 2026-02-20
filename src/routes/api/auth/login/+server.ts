import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { login as apiLogin } from '$lib/api';
import { generateToken } from '$lib/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return json({ error: 'Email and password are required' }, { status: 400 });
		}

		// Call Python API
		const cookieHeader = cookies.toString();
		const result = await apiLogin(email, password, cookieHeader);

		const userPayload = {
			id: result.user.id,
			username: result.user.username,
			email: result.user.email
		};

		// Generate SvelteKit token for internal use
		const token = generateToken(userPayload);

		return json(
			{ user: userPayload, token: result.token },
			{
				status: 200,
				headers: {
					'Set-Cookie': `token=${result.token || token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
				}
			}
		);
	} catch (error: any) {
		console.error('Login error:', error);
		return json({ error: error.message || 'Login failed' }, { status: 500 });
	}
};
