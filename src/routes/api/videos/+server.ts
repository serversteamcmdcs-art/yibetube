import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getVideos as apiGetVideos } from '$lib/api';

export const GET: RequestHandler = async ({ url }) => {
	const limit = parseInt(url.searchParams.get('limit') || '20');
	const offset = parseInt(url.searchParams.get('offset') || '0');
	const search = url.searchParams.get('search') || '';
	const userId = url.searchParams.get('userId');

	try {
		const result = await apiGetVideos({
			limit,
			offset,
			search,
			userId: userId ? parseInt(userId) : undefined
		});

		return json({ videos: result.videos });
	} catch (error: any) {
		console.error('Get videos error:', error);
		return json({ error: error.message || 'Failed to get videos' }, { status: 500 });
	}
};
