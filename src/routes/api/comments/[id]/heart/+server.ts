import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { heartComment as apiHeartComment } from '$lib/api';
import { getUserFromRequest } from '$lib/auth';

export const POST: RequestHandler = async ({ params, cookies }) => {
	const user = getUserFromRequest({ request: { headers: new Headers() }, cookies } as any);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const commentId = parseInt(params.id);
		const cookieHeader = cookies.toString();
		const result = await apiHeartComment(commentId, cookieHeader);

		return json({ is_hearted: result.is_hearted });
	} catch (error: any) {
		console.error('Heart error:', error);
		if (error.message.includes('not found')) {
			return json({ error: 'Comment not found' }, { status: 404 });
		}
		if (error.message.includes('Not authorized')) {
			return json({ error: 'Only video author can heart comments' }, { status: 403 });
		}
		return json({ error: error.message || 'Failed to heart comment' }, { status: 500 });
	}
};
