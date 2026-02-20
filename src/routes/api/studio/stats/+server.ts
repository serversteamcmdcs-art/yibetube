import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getStudioStats as apiGetStudioStats } from '$lib/api';
import { getUserFromRequest } from '$lib/auth';

export const GET: RequestHandler = async ({ cookies }) => {
	const user = getUserFromRequest({ request: { headers: new Headers() }, cookies } as any);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const cookieHeader = cookies.toString();
		const result = await apiGetStudioStats(cookieHeader);

		return json({
			totalViews: result.stats.total_views,
			totalVideos: result.stats.total_videos,
			totalLikes: result.stats.total_likes,
			totalComments: 0, // Нужно добавить в Python API
			subscribers: result.stats.total_subscribers
		});
	} catch (error: any) {
		console.error('Stats error:', error);
		return json({ error: error.message || 'Failed to load stats' }, { status: 500 });
	}
};
