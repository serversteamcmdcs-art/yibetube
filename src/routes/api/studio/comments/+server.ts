import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getStudioComments as apiGetStudioComments } from '$lib/api';
import { getUserFromRequest } from '$lib/auth';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const user = getUserFromRequest({ request: { headers: new Headers() }, cookies } as any);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const videoId = url.searchParams.get('video_id');
		const cookieHeader = cookies.toString();
		const result = await apiGetStudioComments(videoId ? parseInt(videoId) : undefined, cookieHeader);

		return json({ comments: result.comments });
	} catch (error: any) {
		return json({ error: error.message || 'Failed to load comments' }, { status: 500 });
	}
};
