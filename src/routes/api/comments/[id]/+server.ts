import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteComment as apiDeleteComment } from '$lib/api';
import { getUserFromRequest } from '$lib/auth';

export const DELETE: RequestHandler = async ({ params, cookies }) => {
	const user = getUserFromRequest({ request: { headers: new Headers() }, cookies } as any);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const cookieHeader = cookies.toString();
		await apiDeleteComment(parseInt(params.id), cookieHeader);
		return json({ success: true });
	} catch (error: any) {
		console.error('Delete comment error:', error);
		if (error.message === 'Comment not found') {
			return json({ error: 'Comment not found' }, { status: 404 });
		}
		return json({ error: error.message || 'Failed to delete comment' }, { status: 500 });
	}
};
