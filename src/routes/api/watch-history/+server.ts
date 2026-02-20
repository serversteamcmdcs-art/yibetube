import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getWatchHistory as apiGetWatchHistory, addToWatchHistory as apiAddToWatchHistory } from '$lib/api';
import { getUserFromRequest } from '$lib/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const user = getUserFromRequest({ request: { headers: new Headers() }, cookies } as any);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { videoId } = await request.json();
		const cookieHeader = cookies.toString();
		await apiAddToWatchHistory(videoId, cookieHeader);
		return json({ success: true });
	} catch (error: any) {
		return json({ success: false });
	}
};

export const GET: RequestHandler = async ({ cookies }) => {
	const user = getUserFromRequest({ request: { headers: new Headers() }, cookies } as any);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const cookieHeader = cookies.toString();
		const result = await apiGetWatchHistory(cookieHeader);
		
		// Преобразуем историю в формат с видео
		const videos = result.history.map((h: any) => ({
			...h,
			username: h.username,
			user_avatar: h.user_avatar,
			watched_at: h.watched_at
		}));

		return json({ videos });
	} catch (error: any) {
		return json({ error: error.message || 'Failed to load history' }, { status: 500 });
	}
};
