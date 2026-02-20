/**
 * API клиент для подключения к Python серверу базы данных
 * Заменяет прямое подключение к SQLite файлу
 * 
 * Для изменения IP/порта измените API_BASE ниже
 */

// Измените этот адрес на IP/порт вашего Python сервера
const API_BASE = 'http://192.168.1.100:5000';

interface ApiOptions {
	method?: string;
	body?: any;
	headers?: Record<string, string>;
	cookies?: string;
}

async function apiCall<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
	const { method = 'GET', body, headers = {}, cookies } = options;

	const fetchOptions: RequestInit = {
		method,
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
	};

	if (cookies) {
		fetchOptions.headers = {
			...fetchOptions.headers,
			'Cookie': cookies,
		};
	}

	if (body) {
		fetchOptions.body = JSON.stringify(body);
	}

	const response = await fetch(`${API_BASE}${endpoint}`, fetchOptions);

	// Прокидываем куки из ответа
	const setCookie = response.headers.get('set-cookie');
	if (setCookie) {
		// Куки будут установлены на уровне SvelteKit endpoint
	}

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.error || 'API request failed');
	}

	return data;
}

// ==================== Auth API ====================

export async function login(email: string, password: string, cookies?: string) {
	return apiCall<{ user: any; token: string }>('/api/auth/login', {
		method: 'POST',
		body: { email, password },
		cookies,
	});
}

export async function register(username: string, email: string, password: string, cookies?: string) {
	return apiCall<{ user: any; token: string }>('/api/auth/register', {
		method: 'POST',
		body: { username, email, password },
		cookies,
	});
}

export async function logout(cookies?: string) {
	return apiCall<{ success: boolean }>('/api/auth/logout', {
		method: 'POST',
		cookies,
	});
}

export async function getMe(cookies?: string) {
	return apiCall<{ user: any }>('/api/auth/me', { cookies });
}

// ==================== Users API ====================

export async function getUser(userId: number) {
	return apiCall<any>(`/api/users/${userId}`);
}

export async function updateUser(data: any, cookies?: string) {
	return apiCall<{ user: any }>('/api/user/update', {
		method: 'PUT',
		body: data,
		cookies,
	});
}

// ==================== Videos API ====================

export async function getVideos(params: { limit?: number; offset?: number; search?: string; userId?: number } = {}, cookies?: string) {
	const query = new URLSearchParams();
	if (params.limit) query.set('limit', params.limit.toString());
	if (params.offset) query.set('offset', params.offset.toString());
	if (params.search) query.set('search', params.search);
	if (params.userId) query.set('userId', params.userId.toString());

	return apiCall<{ videos: any[] }>(`/api/videos?${query.toString()}`, { cookies });
}

export async function getVideo(videoId: number) {
	return apiCall<{ video: any }>(`/api/videos/${videoId}`);
}

export async function updateVideo(videoId: number, data: any, cookies?: string) {
	return apiCall<{ video: any }>(`/api/videos/${videoId}/update`, {
		method: 'PUT',
		body: data,
		cookies,
	});
}

export async function deleteVideo(videoId: number, cookies?: string) {
	return apiCall<{ success: boolean }>(`/api/videos/${videoId}`, {
		method: 'DELETE',
		cookies,
	});
}

// ==================== Comments API ====================

export async function getComments(videoId: number) {
	return apiCall<{ comments: any[] }>(`/api/comments?videoId=${videoId}`);
}

export async function createComment(videoId: number, content: string, parentId?: number, cookies?: string) {
	return apiCall<{ comment: any }>('/api/comments', {
		method: 'POST',
		body: { videoId, content, parentId },
		cookies,
	});
}

export async function deleteComment(commentId: number, cookies?: string) {
	return apiCall<{ success: boolean }>(`/api/comments/${commentId}`, {
		method: 'DELETE',
		cookies,
	});
}

export async function pinComment(commentId: number, cookies?: string) {
	return apiCall<{ success: boolean; is_pinned: number }>(`/api/comments/${commentId}/pin`, {
		method: 'POST',
		cookies,
	});
}

export async function heartComment(commentId: number, cookies?: string) {
	return apiCall<{ success: boolean; is_hearted: number }>(`/api/comments/${commentId}/heart`, {
		method: 'POST',
		cookies,
	});
}

export async function likeComment(commentId: number, type: 'like' | 'dislike', cookies?: string) {
	return apiCall<{ action: string; type: string }>(`/api/comments/${commentId}/like`, {
		method: 'POST',
		body: { type },
		cookies,
	});
}

// ==================== Likes API ====================

export async function getVideoLikes(videoId: number, cookies?: string) {
	return apiCall<{ like: string | null }>(`/api/likes?videoId=${videoId}`, { cookies });
}

export async function toggleLike(videoId: number, type: 'like' | 'dislike', cookies?: string) {
	return apiCall<{ action: string; type: string }>('/api/likes', {
		method: 'POST',
		body: { videoId, type },
		cookies,
	});
}

export async function getLikedVideos(cookies?: string) {
	return apiCall<{ videos: any[] }>('/api/liked/videos', { cookies });
}

// ==================== Subscriptions API ====================

export async function getSubscriptions(subscriberId?: number, channelId?: number) {
	const params = new URLSearchParams();
	if (subscriberId) params.set('subscriber_id', subscriberId.toString());
	if (channelId) params.set('channel_id', channelId.toString());

	return apiCall<{ subscriptions: any[] }>(`/api/subscriptions?${params.toString()}`);
}

export async function toggleSubscribe(channelId: number, cookies?: string) {
	return apiCall<{ action: string }>('/api/subscriptions', {
		method: 'POST',
		body: { channel_id: channelId },
		cookies,
	});
}

// ==================== Watch History API ====================

export async function getWatchHistory(cookies?: string) {
	return apiCall<{ history: any[] }>('/api/watch-history', { cookies });
}

export async function addToWatchHistory(videoId: number, cookies?: string) {
	return apiCall<{ success: boolean }>('/api/watch-history', {
		method: 'POST',
		body: { video_id: videoId },
		cookies,
	});
}

// ==================== Studio API ====================

export async function getStudioVideos(cookies?: string) {
	return apiCall<{ videos: any[] }>('/api/studio/videos', { cookies });
}

export async function getStudioStats(cookies?: string) {
	return apiCall<{ stats: any }>('/api/studio/stats', { cookies });
}

export async function getStudioComments(videoId?: number, cookies?: string) {
	const url = videoId ? `/api/studio/comments?video_id=${videoId}` : '/api/studio/comments';
	return apiCall<{ comments: any[] }>(url, { cookies });
}
