"""
Пакет DB - модуль для работы с базой данных VibeTube
"""

from .database import (
    get_connection,
    execute_query,
    execute_one,
    execute_insert,
    execute_update,
    # Users
    get_all_users,
    get_user_by_id,
    get_user_by_username,
    get_user_by_email,
    create_user,
    update_user,
    delete_user,
    # Videos
    get_all_videos,
    get_video_by_id,
    get_videos_by_user,
    create_video,
    update_video,
    delete_video,
    increment_video_views,
    # Comments
    get_comments_by_video,
    get_comment_by_id,
    create_comment,
    delete_comment,
    # Likes
    get_likes_by_video,
    get_user_like_for_video,
    add_like,
    remove_like,
    # Subscriptions
    get_subscriptions,
    get_subscribers,
    subscribe,
    unsubscribe,
    # Watch History
    get_watch_history,
    add_to_watch_history,
    clear_watch_history,
)

__all__ = [
    'get_connection',
    'execute_query',
    'execute_one',
    'execute_insert',
    'execute_update',
    # Users
    'get_all_users',
    'get_user_by_id',
    'get_user_by_username',
    'get_user_by_email',
    'create_user',
    'update_user',
    'delete_user',
    # Videos
    'get_all_videos',
    'get_video_by_id',
    'get_videos_by_user',
    'create_video',
    'update_video',
    'delete_video',
    'increment_video_views',
    # Comments
    'get_comments_by_video',
    'get_comment_by_id',
    'create_comment',
    'delete_comment',
    # Likes
    'get_likes_by_video',
    'get_user_like_for_video',
    'add_like',
    'remove_like',
    # Subscriptions
    'get_subscriptions',
    'get_subscribers',
    'subscribe',
    'unsubscribe',
    # Watch History
    'get_watch_history',
    'add_to_watch_history',
    'clear_watch_history',
]
