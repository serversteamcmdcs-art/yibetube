import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getLikedVideos as apiGetLikedVideos } from '$lib/api';
import { getUserFromRequest } from '$lib/auth';

export const GET: RequestHandler = async ({ cookies }) => {
	const user = getUserFromRequest({ request: { headers: new Headers() }, cookies } as any);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const cookieHeader = cookies.toString();
		const result = await apiGetLikedVideos(cookieHeader);
		return json({ videos: result.videos });
	} catch (error: any) {
		return json({ error: error.message || 'Failed to load liked videos' }, { status: 500 });
	}
};
