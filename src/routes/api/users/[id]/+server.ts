import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUser as apiGetUser } from '$lib/api';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const userId = parseInt(params.id);
		const result = await apiGetUser(userId);
		return json({ user: result });
	} catch (error: any) {
		if (error.message === 'User not found') {
			return json({ error: 'User not found' }, { status: 404 });
		}
		return json({ error: error.message || 'Failed to fetch user' }, { status: 500 });
	}
};
