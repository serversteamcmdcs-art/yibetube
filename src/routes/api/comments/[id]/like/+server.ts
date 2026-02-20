import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { likeComment as apiLikeComment } from '$lib/api';
import { getUserFromRequest } from '$lib/auth';

export const POST: RequestHandler = async ({ params, request, cookies }) => {
	const user = getUserFromRequest({ request: { headers: new Headers() }, cookies } as any);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const commentId = parseInt(params.id);
		const { type } = await request.json();

		if (!['like', 'dislike'].includes(type)) {
			return json({ error: 'Invalid type' }, { status: 400 });
		}

		const cookieHeader = cookies.toString();
		const result = await apiLikeComment(commentId, type, cookieHeader);

		return json({ action: result.action, type: result.type });
	} catch (error: any) {
		console.error('Comment like error:', error);
		return json({ error: error.message || 'Failed to like comment' }, { status: 500 });
	}
};

export const GET: RequestHandler = async () => {
	// Этот endpoint не используется в текущей версии фронтенда
	return json({ like: null });
};
