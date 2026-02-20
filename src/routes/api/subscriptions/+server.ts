import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSubscriptions as apiGetSubscriptions, toggleSubscribe as apiToggleSubscribe } from '$lib/api';
import { getUserFromRequest } from '$lib/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const user = getUserFromRequest({ request: { headers: new Headers() }, cookies } as any);

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { channelId } = await request.json();

		if (!channelId) {
			return json({ error: 'Channel ID is required' }, { status: 400 });
		}

		if (channelId === user.id) {
			return json({ error: 'Cannot subscribe to yourself' }, { status: 400 });
		}

		const cookieHeader = cookies.toString();
		const result = await apiToggleSubscribe(channelId, cookieHeader);

		return json({ subscribed: result.action === 'subscribed' });
	} catch (error: any) {
		console.error('Subscription error:', error);
		return json({ error: error.message || 'Failed to process subscription' }, { status: 500 });
	}
};

export const GET: RequestHandler = async ({ url, cookies }) => {
	const user = getUserFromRequest({ request: { headers: new Headers() }, cookies } as any);
	const channelId = url.searchParams.get('channelId');

	if (!user || !channelId) {
		return json({ subscribed: false });
	}

	try {
		const result = await apiGetSubscriptions(user.id, parseInt(channelId));
		return json({ subscribed: result.subscriptions.length > 0 });
	} catch (error: any) {
		return json({ subscribed: false });
	}
};
