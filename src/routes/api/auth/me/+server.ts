import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getMe } from '$lib/api';
import { getUserFromRequest } from '$lib/auth';

export const GET: RequestHandler = async ({ cookies }) => {
	const user = getUserFromRequest({ request: { headers: new Headers() }, cookies } as any);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const cookieHeader = cookies.toString();
		const result = await getMe(cookieHeader);
		return json({ user: result.user });
	} catch (error: any) {
		console.error('Get me error:', error);
		return json({ error: error.message || 'Failed to get user' }, { status: 500 });
	}
};
