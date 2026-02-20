import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateUser as apiUpdateUser } from '$lib/api';
import { getUserFromRequest } from '$lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export const PUT: RequestHandler = async ({ request, cookies }) => {
	const user = getUserFromRequest({ request: { headers: new Headers() }, cookies } as any);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formData = await request.formData();
		const username = formData.get('username') as string;
		const email = formData.get('email') as string;
		const description = formData.get('description') as string;
		const avatarFile = formData.get('avatar') as File | null;
		const bannerFile = formData.get('banner') as File | null;

		if (!username || !email) {
			return json({ error: 'Username and email are required' }, { status: 400 });
		}

		const uploadsDir = join(process.cwd(), 'static', 'uploads', 'users');
		await mkdir(uploadsDir, { recursive: true });

		let avatarUrl: string | undefined;
		let bannerUrl: string | undefined;

		if (avatarFile && avatarFile.size > 0) {
			const avatarExt = avatarFile.name.split('.').pop();
			const avatarFilename = `avatar_${user.id}_${Date.now()}.${avatarExt}`;
			const avatarPath = join(uploadsDir, avatarFilename);
			const avatarBuffer = Buffer.from(await avatarFile.arrayBuffer());
			await writeFile(avatarPath, avatarBuffer);
			avatarUrl = `/uploads/users/${avatarFilename}`;
		}

		if (bannerFile && bannerFile.size > 0) {
			const bannerExt = bannerFile.name.split('.').pop();
			const bannerFilename = `banner_${user.id}_${Date.now()}.${bannerExt}`;
			const bannerPath = join(uploadsDir, bannerFilename);
			const bannerBuffer = Buffer.from(await bannerFile.arrayBuffer());
			await writeFile(bannerPath, bannerBuffer);
			bannerUrl = `/uploads/users/${bannerFilename}`;
		}

		const updateData: any = { username, email, description };
		if (avatarUrl) updateData.avatar = avatarUrl;
		if (bannerUrl) updateData.banner = bannerUrl;

		const cookieHeader = cookies.toString();
		const result = await apiUpdateUser(updateData, cookieHeader);

		return json({ user: result.user });
	} catch (error: any) {
		console.error('Update error:', error);
		return json({ error: error.message || 'Failed to update profile' }, { status: 500 });
	}
};
