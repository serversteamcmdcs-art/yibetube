import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateVideo as apiUpdateVideo } from '$lib/api';
import { getUserFromRequest } from '$lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export const PUT: RequestHandler = async ({ params, request, cookies }) => {
	const user = getUserFromRequest({ request: { headers: new Headers() }, cookies } as any);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formData = await request.formData();
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const thumbnailFile = formData.get('thumbnail') as File | null;
		const videoId = params.id;

		if (!title) {
			return json({ error: 'Title is required' }, { status: 400 });
		}

		let thumbnailUrl: string | undefined;

		if (thumbnailFile && thumbnailFile.size > 0) {
			try {
				const uploadsDir = join(process.cwd(), 'static', 'uploads');
				await mkdir(uploadsDir, { recursive: true });

				const ext = thumbnailFile.name.split('.').pop();
				const filename = `thumb_${videoId}_${Date.now()}.${ext}`;
				const filePath = join(uploadsDir, filename);
				const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
				await writeFile(filePath, buffer);
				thumbnailUrl = `/uploads/${filename}`;
			} catch (fileError: any) {
				console.error('File upload error:', fileError);
				return json({ error: 'Failed to upload thumbnail: ' + fileError.message }, { status: 500 });
			}
		}

		const updateData: any = { title, description };
		if (thumbnailUrl) {
			updateData.thumbnail = thumbnailUrl;
			updateData.thumbnail_url = thumbnailUrl;
		}

		const cookieHeader = cookies.toString();
		const result = await apiUpdateVideo(parseInt(videoId), updateData, cookieHeader);

		return json({ video: result.video });
	} catch (error: any) {
		console.error('Update error:', error);
		if (error.message === 'Video not found') {
			return json({ error: 'Video not found' }, { status: 404 });
		}
		if (error.message === 'Forbidden') {
			return json({ error: 'Forbidden' }, { status: 403 });
		}
		return json({ error: error.message || 'Failed to update video' }, { status: 500 });
	}
};
