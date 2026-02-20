"""
Модуль для работы с базой данных
Содержит функции для выполнения запросов к SQLite
"""

import sqlite3
from typing import List, Dict, Any, Optional
from contextlib import contextmanager
from config import DB_PATH, DB_OPTIONS


@contextmanager
def get_connection():
    """Контекстный менеджер для подключения к БД"""
    conn = sqlite3.connect(DB_PATH, **DB_OPTIONS)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()


def dict_from_row(row: Optional[sqlite3.Row]) -> Optional[Dict[str, Any]]:
    """Конвертировать sqlite3.Row в словарь"""
    if row is None:
        return None
    return dict(row)


def execute_query(query: str, params: tuple = ()) -> List[Dict[str, Any]]:
    """Выполнить SELECT запрос и вернуть результаты"""
    with get_connection() as conn:
        cursor = conn.execute(query, params)
        rows = cursor.fetchall()
        return [dict_from_row(row) for row in rows]


def execute_one(query: str, params: tuple = ()) -> Optional[Dict[str, Any]]:
    """Выполнить SELECT запрос и вернуть одну строку"""
    with get_connection() as conn:
        row = conn.execute(query, params).fetchone()
        return dict_from_row(row)


def execute_insert(query: str, params: tuple = ()) -> int:
    """Выполнить INSERT запрос и вернуть ID вставленной строки"""
    with get_connection() as conn:
        cursor = conn.execute(query, params)
        return cursor.lastrowid


def execute_update(query: str, params: tuple = ()) -> int:
    """Выполнить UPDATE/DELETE запрос и вернуть количество затронутых строк"""
    with get_connection() as conn:
        cursor = conn.execute(query, params)
        return cursor.rowcount


# ==================== Функции для Users ====================

def get_all_users() -> List[Dict[str, Any]]:
    """Получить всех пользователей"""
    return execute_query('SELECT * FROM users')


def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    """Получить пользователя по ID"""
    return execute_one('SELECT * FROM users WHERE id = ?', (user_id,))


def get_user_by_username(username: str) -> Optional[Dict[str, Any]]:
    """Получить пользователя по имени"""
    return execute_one('SELECT * FROM users WHERE username = ?', (username,))


def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    """Получить пользователя по email"""
    return execute_one('SELECT * FROM users WHERE email = ?', (email,))


def create_user(username: str, email: str, password: str, avatar: str = None) -> int:
    """Создать нового пользователя"""
    return execute_insert(
        'INSERT INTO users (username, email, password, avatar) VALUES (?, ?, ?, ?)',
        (username, email, password, avatar)
    )


def update_user(user_id: int, **kwargs) -> int:
    """Обновить пользователя"""
    fields = ', '.join(f'{k} = ?' for k in kwargs.keys())
    values = tuple(kwargs.values()) + (user_id,)
    return execute_update(f'UPDATE users SET {fields} WHERE id = ?', values)


def delete_user(user_id: int) -> int:
    """Удалить пользователя"""
    return execute_update('DELETE FROM users WHERE id = ?', (user_id,))


# ==================== Функции для Videos ====================

def get_all_videos() -> List[Dict[str, Any]]:
    """Получить все видео"""
    return execute_query('SELECT * FROM videos ORDER BY created_at DESC')


def get_video_by_id(video_id: int) -> Optional[Dict[str, Any]]:
    """Получить видео по ID"""
    return execute_one('SELECT * FROM videos WHERE id = ?', (video_id,))


def get_videos_by_user(user_id: int) -> List[Dict[str, Any]]:
    """Получить видео пользователя"""
    return execute_query(
        'SELECT * FROM videos WHERE user_id = ? ORDER BY created_at DESC',
        (user_id,)
    )


def create_video(user_id: int, title: str, video_url: str, **kwargs) -> int:
    """Создать новое видео"""
    fields = 'user_id, title, video_url'
    values = (user_id, title, video_url)
    if kwargs:
        fields += ', ' + ', '.join(kwargs.keys())
        values += tuple(kwargs.values())
    return execute_insert(
        f'INSERT INTO videos ({fields}) VALUES ({"?, " * (len(values) - 1)}?)',
        values
    )


def update_video(video_id: int, **kwargs) -> int:
    """Обновить видео"""
    fields = ', '.join(f'{k} = ?' for k in kwargs.keys())
    values = tuple(kwargs.values()) + (video_id,)
    return execute_update(f'UPDATE videos SET {fields} WHERE id = ?', values)


def delete_video(video_id: int) -> int:
    """Удалить видео"""
    return execute_update('DELETE FROM videos WHERE id = ?', (video_id,))


def increment_video_views(video_id: int) -> int:
    """Увеличить счётчик просмотров"""
    return execute_update(
        'UPDATE videos SET views = views + 1 WHERE id = ?',
        (video_id,)
    )


# ==================== Функции для Comments ====================

def get_comments_by_video(video_id: int) -> List[Dict[str, Any]]:
    """Получить комментарии к видео"""
    return execute_query(
        'SELECT * FROM comments WHERE video_id = ? ORDER BY created_at DESC',
        (video_id,)
    )


def get_comment_by_id(comment_id: int) -> Optional[Dict[str, Any]]:
    """Получить комментарий по ID"""
    return execute_one('SELECT * FROM comments WHERE id = ?', (comment_id,))


def create_comment(video_id: int, user_id: int, content: str, parent_id: int = None) -> int:
    """Создать новый комментарий"""
    return execute_insert(
        'INSERT INTO comments (video_id, user_id, parent_id, content) VALUES (?, ?, ?, ?)',
        (video_id, user_id, parent_id, content)
    )


def delete_comment(comment_id: int) -> int:
    """Удалить комментарий"""
    return execute_update('DELETE FROM comments WHERE id = ?', (comment_id,))


# ==================== Функции для Likes ====================

def get_likes_by_video(video_id: int) -> List[Dict[str, Any]]:
    """Получить лайки видео"""
    return execute_query('SELECT * FROM likes WHERE video_id = ?', (video_id,))


def get_user_like_for_video(user_id: int, video_id: int) -> Optional[Dict[str, Any]]:
    """Получить лайк пользователя для видео"""
    return execute_one(
        'SELECT * FROM likes WHERE user_id = ? AND video_id = ?',
        (user_id, video_id)
    )


def add_like(user_id: int, video_id: int, like_type: str) -> int:
    """Добавить лайк/дизлайк"""
    return execute_insert(
        'INSERT INTO likes (user_id, video_id, type) VALUES (?, ?, ?)',
        (user_id, video_id, like_type)
    )


def remove_like(user_id: int, video_id: int) -> int:
    """Удалить лайк"""
    return execute_update(
        'DELETE FROM likes WHERE user_id = ? AND video_id = ?',
        (user_id, video_id)
    )


# ==================== Функции для Subscriptions ====================

def get_subscriptions(user_id: int) -> List[Dict[str, Any]]:
    """Получить подписки пользователя"""
    return execute_query(
        'SELECT * FROM subscriptions WHERE subscriber_id = ?',
        (user_id,)
    )


def get_subscribers(channel_id: int) -> List[Dict[str, Any]]:
    """Получить подписчиков канала"""
    return execute_query(
        'SELECT * FROM subscriptions WHERE channel_id = ?',
        (channel_id,)
    )


def subscribe(subscriber_id: int, channel_id: int) -> int:
    """Подписаться на канал"""
    return execute_insert(
        'INSERT INTO subscriptions (subscriber_id, channel_id) VALUES (?, ?)',
        (subscriber_id, channel_id)
    )


def unsubscribe(subscriber_id: int, channel_id: int) -> int:
    """Отписаться от канала"""
    return execute_update(
        'DELETE FROM subscriptions WHERE subscriber_id = ? AND channel_id = ?',
        (subscriber_id, channel_id)
    )


# ==================== Функции для Watch History ====================

def get_watch_history(user_id: int) -> List[Dict[str, Any]]:
    """Получить историю просмотров пользователя"""
    return execute_query(
        'SELECT * FROM watch_history WHERE user_id = ? ORDER BY watched_at DESC',
        (user_id,)
    )


def add_to_watch_history(user_id: int, video_id: int) -> int:
    """Добавить видео в историю просмотров"""
    return execute_insert(
        'INSERT INTO watch_history (user_id, video_id) VALUES (?, ?)',
        (user_id, video_id)
    )


def clear_watch_history(user_id: int) -> int:
    """Очистить историю просмотров"""
    return execute_update(
        'DELETE FROM watch_history WHERE user_id = ?',
        (user_id,)
    )
