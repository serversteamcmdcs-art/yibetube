import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getVideoLikes as apiGetVideoLikes, toggleLike as apiToggleLike } from '$lib/api';
import { getUserFromRequest } from '$lib/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const user = getUserFromRequest({ request: { headers: new Headers() }, cookies } as any);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { videoId, type } = await request.json();

		if (!videoId || !type || !['like', 'dislike'].includes(type)) {
			return json({ error: 'Invalid request' }, { status: 400 });
		}

		const cookieHeader = cookies.toString();
		const result = await apiToggleLike(videoId, type, cookieHeader);

		return json({ action: result.action, type: result.type });
	} catch (error: any) {
		console.error('Like error:', error);
		return json({ error: error.message || 'Failed to process like' }, { status: 500 });
	}
};

export const GET: RequestHandler = async ({ url, cookies }) => {
	const user = getUserFromRequest({ request: { headers: new Headers() }, cookies } as any);
	const videoId = url.searchParams.get('videoId');

	if (!user || !videoId) {
		return json({ like: null });
	}

	try {
		const result = await apiGetVideoLikes(parseInt(videoId), cookies.toString());
		return json({ like: result.like });
	} catch (error: any) {
		return json({ like: null });
	}
};
