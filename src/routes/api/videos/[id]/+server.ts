import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getVideo as apiGetVideo, deleteVideo as apiDeleteVideo } from '$lib/api';
import { getUserFromRequest } from '$lib/auth';

export const GET: RequestHandler = async ({ params }) => {
	const videoId = parseInt(params.id);

	try {
		const result = await apiGetVideo(videoId);
		return json({ video: result.video });
	} catch (error: any) {
		console.error('Get video error:', error);
		if (error.message === 'Video not found') {
			return json({ error: 'Video not found' }, { status: 404 });
		}
		return json({ error: error.message || 'Failed to get video' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params, cookies }) => {
	const user = getUserFromRequest({ request: { headers: new Headers() }, cookies } as any);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const cookieHeader = cookies.toString();
		await apiDeleteVideo(parseInt(params.id), cookieHeader);
		return json({ success: true });
	} catch (error: any) {
		console.error('Delete video error:', error);
		if (error.message === 'Video not found') {
			return json({ error: 'Video not found' }, { status: 404 });
		}
		if (error.message === 'Forbidden') {
			return json({ error: 'Forbidden' }, { status: 403 });
		}
		return json({ error: error.message || 'Failed to delete video' }, { status: 500 });
	}
};
