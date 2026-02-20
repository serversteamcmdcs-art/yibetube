import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getComments as apiGetComments, createComment as apiCreateComment } from '$lib/api';
import { getUserFromRequest } from '$lib/auth';

export const GET: RequestHandler = async ({ url }) => {
	const videoId = url.searchParams.get('videoId');

	if (!videoId) {
		return json({ error: 'Video ID is required' }, { status: 400 });
	}

	try {
		const result = await apiGetComments(parseInt(videoId));
		return json({ comments: result.comments });
	} catch (error: any) {
		console.error('Get comments error:', error);
		return json({ error: error.message || 'Failed to get comments' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	const user = getUserFromRequest({ request: { headers: new Headers() }, cookies } as any);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { videoId, content, parentId } = await request.json();

		if (!videoId || !content) {
			return json({ error: 'Video ID and content are required' }, { status: 400 });
		}

		const cookieHeader = cookies.toString();
		const result = await apiCreateComment(videoId, content, parentId, cookieHeader);

		return json({ comment: result.comment }, { status: 201 });
	} catch (error: any) {
		console.error('Comment error:', error);
		return json({ error: error.message || 'Failed to create comment' }, { status: 500 });
	}
};
