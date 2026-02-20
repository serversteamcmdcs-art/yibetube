"""
Python сервер для работы с базой данных VibeTube
Использует Flask и SQLite (через существующую базу vibetube.db)
"""

from flask import Flask, request, jsonify, g
import sqlite3
import jwt
import bcrypt
import os
from functools import wraps
from datetime import datetime, timedelta

app = Flask(__name__)

# Конфигурация
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'vibetube.db')
JWT_SECRET = 'vibetube-secret-key-change-in-production'


# ==================== Database Helpers ====================

def get_db_connection():
    """Получить подключение к базе данных"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def dict_from_row(row):
    """Конвертировать sqlite3.Row в словарь"""
    if row is None:
        return None
    return dict(row)


# ==================== Auth Helpers ====================

def hash_password(password: str) -> str:
    """Хешировать пароль"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    """Проверить пароль"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


def generate_token(user_id: int, username: str, email: str) -> str:
    """Сгенерировать JWT токен"""
    payload = {
        'id': user_id,
        'username': username,
        'email': email,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')


def verify_token(token: str) -> dict | None:
    """Проверить JWT токен"""
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    except:
        return None


def get_current_user():
    """Получить текущего пользователя из токена"""
    token = request.cookies.get('token')
    if not token:
        # Check Authorization header
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header[7:]
    
    if token:
        return verify_token(token)
    return None


def login_required(f):
    """Декоратор для защиты маршрутов"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Unauthorized'}), 401
        g.current_user = user
        return f(*args, **kwargs)
    return decorated_function


# ==================== API Auth ====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Регистрация пользователя"""
    data = request.get_json()
    
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400
    
    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400
    
    conn = get_db_connection()
    
    # Check if user exists
    existing = conn.execute(
        'SELECT id FROM users WHERE email = ? OR username = ?',
        (email, username)
    ).fetchone()
    
    if existing:
        conn.close()
        return jsonify({'error': 'User already exists'}), 409
    
    # Hash password and create user
    hashed_password = hash_password(password)
    avatar = f"https://ui-avatars.com/api/?name={username}&background=9b59b6&color=fff"
    
    cursor = conn.execute(
        'INSERT INTO users (username, email, password, avatar) VALUES (?, ?, ?, ?)',
        (username, email, hashed_password, avatar)
    )
    conn.commit()
    user_id = cursor.lastrowid
    conn.close()
    
    # Generate token
    token = generate_token(user_id, username, email)
    
    return jsonify({
        'user': {'id': user_id, 'username': username, 'email': email},
        'token': token
    }), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    """Вход пользователя"""
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()
    
    if not user or not verify_password(password, user['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    token = generate_token(user['id'], user['username'], user['email'])
    
    response = jsonify({
        'user': {
            'id': user['id'],
            'username': user['username'],
            'email': user['email']
        },
        'token': token
    })
    
    # Set cookie
    response.set_cookie('token', token, httponly=True, samesite='Lax', max_age=60*60*24*7)
    return response


@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Выход пользователя"""
    response = jsonify({'success': True})
    response.set_cookie('token', '', httponly=True, max_age=0)
    return response


@app.route('/api/auth/me', methods=['GET'])
@login_required
def get_me():
    """Получить текущего пользователя"""
    user = g.current_user
    
    conn = get_db_connection()
    full_user = conn.execute('''
        SELECT id, username, email, avatar, banner, description, created_at
        FROM users WHERE id = ?
    ''', (user['id'],)).fetchone()
    conn.close()
    
    return jsonify({'user': dict_from_row(full_user)})


# ==================== API Users ====================

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Получить пользователя по ID"""
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    if user is None:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(dict_from_row(user))


@app.route('/api/user/update', methods=['PUT'])
@login_required
def update_user():
    """Обновить профиль пользователя"""
    user = g.current_user
    data = request.get_json()
    
    conn = get_db_connection()
    
    # Build update query
    fields = []
    values = []
    for key in ['username', 'email', 'avatar', 'banner', 'description']:
        if key in data:
            fields.append(f'{key} = ?')
            values.append(data[key])
    
    if not fields:
        conn.close()
        return jsonify({'error': 'No fields to update'}), 400
    
    values.append(user['id'])
    
    conn.execute(f'UPDATE users SET {", ".join(fields)} WHERE id = ?', values)
    conn.commit()
    
    updated_user = conn.execute('SELECT * FROM users WHERE id = ?', (user['id'],)).fetchone()
    conn.close()
    
    return jsonify({'user': dict_from_row(updated_user)})


# ==================== API Videos ====================

@app.route('/api/videos', methods=['GET'])
def get_videos():
    """Получить видео (с фильтрацией)"""
    limit = request.args.get('limit', 20, type=int)
    offset = request.args.get('offset', 0, type=int)
    search = request.args.get('search', '')
    user_id = request.args.get('userId', type=int)
    
    conn = get_db_connection()
    
    query = '''
        SELECT v.*, u.username, u.avatar as user_avatar, u.banner,
            (SELECT COUNT(*) FROM likes WHERE video_id = v.id AND type = 'like') as likes,
            (SELECT COUNT(*) FROM likes WHERE video_id = v.id AND type = 'dislike') as dislikes
        FROM videos v
        JOIN users u ON v.user_id = u.id
    '''
    
    params = []
    if user_id:
        query += ' WHERE v.user_id = ?'
        params.append(user_id)
    elif search:
        query += ' WHERE v.title LIKE ? OR v.description LIKE ?'
        params.extend([f'%{search}%', f'%{search}%'])
    
    query += ' ORDER BY v.created_at DESC LIMIT ? OFFSET ?'
    params.extend([limit, offset])
    
    videos = conn.execute(query, params).fetchall()
    conn.close()
    
    return jsonify({'videos': [dict_from_row(v) for v in videos]})


@app.route('/api/videos/<int:video_id>', methods=['GET'])
def get_video(video_id):
    """Получить видео по ID"""
    conn = get_db_connection()
    video = conn.execute('''
        SELECT v.*, u.username, u.avatar as user_avatar, u.description as user_description,
            (SELECT COUNT(*) FROM likes WHERE video_id = v.id AND type = 'like') as likes,
            (SELECT COUNT(*) FROM likes WHERE video_id = v.id AND type = 'dislike') as dislikes,
            (SELECT COUNT(*) FROM subscriptions WHERE channel_id = v.user_id) as subscribers
        FROM videos v
        JOIN users u ON v.user_id = u.id
        WHERE v.id = ?
    ''', (video_id,)).fetchone()
    
    if not video:
        conn.close()
        return jsonify({'error': 'Video not found'}), 404
    
    # Increment views
    conn.execute('UPDATE videos SET views = views + 1 WHERE id = ?', (video_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'video': dict_from_row(video)})


@app.route('/api/videos/<int:video_id>/update', methods=['PUT'])
@login_required
def update_video(video_id):
    """Обновить видео"""
    user = g.current_user
    data = request.get_json()
    
    conn = get_db_connection()
    video = conn.execute('SELECT * FROM videos WHERE id = ?', (video_id,)).fetchone()
    
    if not video:
        conn.close()
        return jsonify({'error': 'Video not found'}), 404
    
    if video['user_id'] != user['id']:
        conn.close()
        return jsonify({'error': 'Forbidden'}), 403
    
    # Build update query
    fields = []
    values = []
    for key in ['title', 'description', 'thumbnail', 'thumbnail_url']:
        if key in data:
            fields.append(f'{key} = ?')
            values.append(data[key])
    
    if fields:
        values.append(video_id)
        conn.execute(f'UPDATE videos SET {", ".join(fields)} WHERE id = ?', values)
        conn.commit()
    
    updated_video = conn.execute('SELECT * FROM videos WHERE id = ?', (video_id,)).fetchone()
    conn.close()
    
    return jsonify({'video': dict_from_row(updated_video)})


@app.route('/api/videos/<int:video_id>', methods=['DELETE'])
@login_required
def delete_video(video_id):
    """Удалить видео"""
    user = g.current_user
    
    conn = get_db_connection()
    video = conn.execute('SELECT * FROM videos WHERE id = ?', (video_id,)).fetchone()
    
    if not video:
        conn.close()
        return jsonify({'error': 'Video not found'}), 404
    
    if video['user_id'] != user['id']:
        conn.close()
        return jsonify({'error': 'Forbidden'}), 403
    
    conn.execute('DELETE FROM videos WHERE id = ?', (video_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})


# ==================== API Comments ====================

@app.route('/api/comments', methods=['GET'])
def get_comments():
    """Получить комментарии к видео"""
    video_id = request.args.get('videoId', type=int)
    
    if not video_id:
        return jsonify({'error': 'Video ID is required'}), 400
    
    conn = get_db_connection()
    
    comments = conn.execute('''
        SELECT c.*, u.username, u.avatar,
            (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id AND type = 'like') as likes,
            (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id AND type = 'dislike') as dislikes,
            (SELECT COUNT(*) FROM comments WHERE parent_id = c.id) as reply_count
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.video_id = ? AND c.parent_id IS NULL
        ORDER BY c.is_pinned DESC, c.created_at DESC
    ''', (video_id,)).fetchall()
    
    # Get replies for each comment
    comments_with_replies = []
    for comment in comments:
        comment_dict = dict_from_row(comment)
        replies = conn.execute('''
            SELECT c.*, u.username, u.avatar,
                (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id AND type = 'like') as likes,
                (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id AND type = 'dislike') as dislikes
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.parent_id = ?
            ORDER BY c.created_at ASC
        ''', (comment['id'],)).fetchall()
        comment_dict['replies'] = [dict_from_row(r) for r in replies]
        comments_with_replies.append(comment_dict)
    
    conn.close()
    
    return jsonify({'comments': comments_with_replies})


@app.route('/api/comments', methods=['POST'])
@login_required
def create_comment():
    """Создать комментарий"""
    user = g.current_user
    data = request.get_json()
    
    video_id = data.get('videoId')
    content = data.get('content')
    parent_id = data.get('parentId')
    
    if not video_id or not content:
        return jsonify({'error': 'Video ID and content are required'}), 400
    
    conn = get_db_connection()
    cursor = conn.execute(
        'INSERT INTO comments (video_id, user_id, content, parent_id) VALUES (?, ?, ?, ?)',
        (video_id, user['id'], content, parent_id)
    )
    conn.commit()
    comment_id = cursor.lastrowid
    
    comment = conn.execute('''
        SELECT c.*, u.username, u.avatar,
            (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id AND type = 'like') as likes,
            (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id AND type = 'dislike') as dislikes
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.id = ?
    ''', (comment_id,)).fetchone()
    
    conn.close()
    
    return jsonify({'comment': dict_from_row(comment)}), 201


@app.route('/api/comments/<int:comment_id>', methods=['DELETE'])
@login_required
def delete_comment(comment_id):
    """Удалить комментарий"""
    user = g.current_user
    
    conn = get_db_connection()
    
    # Get comment with video info
    comment = conn.execute('''
        SELECT c.user_id, c.video_id, v.user_id as video_owner_id 
        FROM comments c
        JOIN videos v ON c.video_id = v.id
        WHERE c.id = ?
    ''', (comment_id,)).fetchone()
    
    if not comment:
        conn.close()
        return jsonify({'error': 'Comment not found'}), 404
    
    # Allow deletion if user is comment author OR video owner
    if comment['user_id'] != user['id'] and comment['video_owner_id'] != user['id']:
        conn.close()
        return jsonify({'error': 'Not authorized to delete this comment'}), 403
    
    conn.execute('DELETE FROM comments WHERE id = ?', (comment_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})


@app.route('/api/comments/<int:comment_id>/pin', methods=['POST'])
@login_required
def pin_comment(comment_id):
    """Закрепить комментарий"""
    user = g.current_user
    
    conn = get_db_connection()
    
    # Get comment with video info
    comment = conn.execute('''
        SELECT c.*, v.user_id as video_owner_id 
        FROM comments c
        JOIN videos v ON c.video_id = v.id
        WHERE c.id = ?
    ''', (comment_id,)).fetchone()
    
    if not comment:
        conn.close()
        return jsonify({'error': 'Comment not found'}), 404
    
    if comment['video_owner_id'] != user['id']:
        conn.close()
        return jsonify({'error': 'Not authorized to pin this comment'}), 403
    
    new_pinned = 1 if not comment['is_pinned'] else 0
    conn.execute('UPDATE comments SET is_pinned = ? WHERE id = ?', (new_pinned, comment_id))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'is_pinned': new_pinned})


@app.route('/api/comments/<int:comment_id>/heart', methods=['POST'])
@login_required
def heart_comment(comment_id):
    """Отметить комментарий сердечком (для автора видео)"""
    user = g.current_user
    
    conn = get_db_connection()
    
    # Get comment with video info
    comment = conn.execute('''
        SELECT c.*, v.user_id as video_owner_id 
        FROM comments c
        JOIN videos v ON c.video_id = v.id
        WHERE c.id = ?
    ''', (comment_id,)).fetchone()
    
    if not comment:
        conn.close()
        return jsonify({'error': 'Comment not found'}), 404
    
    if comment['video_owner_id'] != user['id']:
        conn.close()
        return jsonify({'error': 'Not authorized to heart this comment'}), 403
    
    new_hearted = 1 if not comment['is_hearted'] else 0
    conn.execute('UPDATE comments SET is_hearted = ? WHERE id = ?', (new_hearted, comment_id))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'is_hearted': new_hearted})


@app.route('/api/comments/<int:comment_id>/like', methods=['POST'])
@login_required
def like_comment(comment_id):
    """Лайк/дизлайк комментария"""
    user = g.current_user
    data = request.get_json()
    like_type = data.get('type')
    
    if like_type not in ['like', 'dislike']:
        return jsonify({'error': 'Invalid type'}), 400
    
    conn = get_db_connection()
    
    # Check existing like
    existing = conn.execute(
        'SELECT * FROM comment_likes WHERE comment_id = ? AND user_id = ?',
        (comment_id, user['id'])
    ).fetchone()
    
    if existing:
        if existing['type'] == like_type:
            # Remove like
            conn.execute(
                'DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?',
                (comment_id, user['id'])
            )
            conn.commit()
            conn.close()
            return jsonify({'action': 'removed', 'type': like_type})
        else:
            # Update like
            conn.execute(
                'UPDATE comment_likes SET type = ? WHERE comment_id = ? AND user_id = ?',
                (like_type, comment_id, user['id'])
            )
            conn.commit()
            conn.close()
            return jsonify({'action': 'updated', 'type': like_type})
    else:
        # Add new like
        conn.execute(
            'INSERT INTO comment_likes (comment_id, user_id, type) VALUES (?, ?, ?)',
            (comment_id, user['id'], like_type)
        )
        conn.commit()
        conn.close()
        return jsonify({'action': 'added', 'type': like_type})


# ==================== API Likes ====================

@app.route('/api/likes', methods=['GET'])
def get_video_likes():
    """Получить лайки видео"""
    video_id = request.args.get('videoId', type=int)
    user = get_current_user()
    
    if not video_id:
        return jsonify({'like': None})
    
    conn = get_db_connection()
    
    if user:
        like = conn.execute(
            'SELECT type FROM likes WHERE video_id = ? AND user_id = ?',
            (video_id, user['id'])
        ).fetchone()
        conn.close()
        return jsonify({'like': like['type'] if like else None})
    
    conn.close()
    return jsonify({'like': None})


@app.route('/api/likes', methods=['POST'])
@login_required
def toggle_like():
    """Поставить/убрать лайк"""
    user = g.current_user
    data = request.get_json()
    
    video_id = data.get('videoId')
    like_type = data.get('type')
    
    if not video_id or not like_type or like_type not in ['like', 'dislike']:
        return jsonify({'error': 'Invalid request'}), 400
    
    conn = get_db_connection()
    
    existing = conn.execute(
        'SELECT * FROM likes WHERE video_id = ? AND user_id = ?',
        (video_id, user['id'])
    ).fetchone()
    
    if existing:
        if existing['type'] == like_type:
            # Remove like
            conn.execute(
                'DELETE FROM likes WHERE video_id = ? AND user_id = ?',
                (video_id, user['id'])
            )
            conn.commit()
            conn.close()
            return jsonify({'action': 'removed', 'type': like_type})
        else:
            # Update like
            conn.execute(
                'UPDATE likes SET type = ? WHERE video_id = ? AND user_id = ?',
                (like_type, video_id, user['id'])
            )
            conn.commit()
            conn.close()
            return jsonify({'action': 'updated', 'type': like_type})
    else:
        # Add new like
        conn.execute(
            'INSERT INTO likes (video_id, user_id, type) VALUES (?, ?, ?)',
            (video_id, user['id'], like_type)
        )
        conn.commit()
        conn.close()
        return jsonify({'action': 'added', 'type': like_type})


@app.route('/api/liked/videos', methods=['GET'])
@login_required
def get_liked_videos():
    """Получить понравившиеся видео"""
    user = g.current_user
    
    conn = get_db_connection()
    videos = conn.execute('''
        SELECT v.*, u.username, u.avatar as user_avatar
        FROM likes l
        JOIN videos v ON l.video_id = v.id
        JOIN users u ON v.user_id = u.id
        WHERE l.user_id = ? AND l.type = 'like'
        ORDER BY l.created_at DESC
    ''', (user['id'],)).fetchall()
    conn.close()
    
    return jsonify({'videos': [dict_from_row(v) for v in videos]})


# ==================== API Subscriptions ====================

@app.route('/api/subscriptions', methods=['GET'])
def get_subscriptions():
    """Получить подписки"""
    subscriber_id = request.args.get('subscriber_id', type=int)
    channel_id = request.args.get('channel_id', type=int)
    user = get_current_user()
    
    conn = get_db_connection()
    
    if subscriber_id:
        subs = conn.execute(
            'SELECT * FROM subscriptions WHERE subscriber_id = ?',
            (subscriber_id,)
        ).fetchall()
    elif channel_id:
        subs = conn.execute(
            'SELECT * FROM subscriptions WHERE channel_id = ?',
            (channel_id,)
        ).fetchall()
    else:
        subs = conn.execute('SELECT * FROM subscriptions').fetchall()
    
    conn.close()
    
    return jsonify({'subscriptions': [dict_from_row(s) for s in subs]})


@app.route('/api/subscriptions', methods=['POST'])
@login_required
def toggle_subscribe():
    """Подписаться/отписаться"""
    user = g.current_user
    data = request.get_json()
    
    channel_id = data.get('channel_id')
    
    if not channel_id:
        return jsonify({'error': 'Channel ID is required'}), 400
    
    if channel_id == user['id']:
        return jsonify({'error': 'Cannot subscribe to yourself'}), 400
    
    conn = get_db_connection()
    
    existing = conn.execute(
        'SELECT * FROM subscriptions WHERE subscriber_id = ? AND channel_id = ?',
        (user['id'], channel_id)
    ).fetchone()
    
    if existing:
        conn.execute(
            'DELETE FROM subscriptions WHERE subscriber_id = ? AND channel_id = ?',
            (user['id'], channel_id)
        )
        conn.commit()
        conn.close()
        return jsonify({'action': 'unsubscribed'})
    else:
        conn.execute(
            'INSERT INTO subscriptions (subscriber_id, channel_id) VALUES (?, ?)',
            (user['id'], channel_id)
        )
        conn.commit()
        conn.close()
        return jsonify({'action': 'subscribed'})


# ==================== API Watch History ====================

@app.route('/api/watch-history', methods=['GET'])
@login_required
def get_watch_history():
    """Получить историю просмотров"""
    user = g.current_user
    
    conn = get_db_connection()
    history = conn.execute('''
        SELECT wh.*, v.title, v.thumbnail_url, v.video_url, u.username
        FROM watch_history wh
        JOIN videos v ON wh.video_id = v.id
        JOIN users u ON v.user_id = u.id
        WHERE wh.user_id = ?
        ORDER BY wh.watched_at DESC
    ''', (user['id'],)).fetchall()
    conn.close()
    
    return jsonify({'history': [dict_from_row(h) for h in history]})


@app.route('/api/watch-history', methods=['POST'])
@login_required
def add_to_watch_history():
    """Добавить в историю просмотров"""
    user = g.current_user
    data = request.get_json()
    
    video_id = data.get('video_id')
    
    if not video_id:
        return jsonify({'error': 'Video ID is required'}), 400
    
    conn = get_db_connection()
    
    # Remove existing entry (to update timestamp)
    conn.execute(
        'DELETE FROM watch_history WHERE user_id = ? AND video_id = ?',
        (user['id'], video_id)
    )
    
    # Add new entry
    conn.execute(
        'INSERT INTO watch_history (user_id, video_id) VALUES (?, ?)',
        (user['id'], video_id)
    )
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})


# ==================== API Studio ====================

@app.route('/api/studio/videos', methods=['GET'])
@login_required
def get_studio_videos():
    """Получить видео пользователя для студии"""
    user = g.current_user
    
    conn = get_db_connection()
    videos = conn.execute('''
        SELECT v.*,
            (SELECT COUNT(*) FROM likes WHERE video_id = v.id AND type = 'like') as likes,
            (SELECT COUNT(*) FROM comments WHERE video_id = v.id) as comments
        FROM videos v
        WHERE v.user_id = ?
        ORDER BY v.created_at DESC
    ''', (user['id'],)).fetchall()
    conn.close()
    
    return jsonify({'videos': [dict_from_row(v) for v in videos]})


@app.route('/api/studio/stats', methods=['GET'])
@login_required
def get_studio_stats():
    """Получить статистику канала"""
    user = g.current_user
    
    conn = get_db_connection()
    
    # Total videos
    total_videos = conn.execute(
        'SELECT COUNT(*) as count FROM videos WHERE user_id = ?',
        (user['id'],)
    ).fetchone()['count']
    
    # Total views
    total_views = conn.execute(
        'SELECT SUM(views) as total FROM videos WHERE user_id = ?',
        (user['id'],)
    ).fetchone()['total'] or 0
    
    # Total subscribers
    total_subscribers = conn.execute(
        'SELECT COUNT(*) as count FROM subscriptions WHERE channel_id = ?',
        (user['id'],)
    ).fetchone()['count']
    
    # Total likes
    total_likes = conn.execute('''
        SELECT COUNT(*) as count FROM likes l
        JOIN videos v ON l.video_id = v.id
        WHERE v.user_id = ? AND l.type = 'like'
    ''', (user['id'],)).fetchone()['count']
    
    conn.close()
    
    return jsonify({
        'stats': {
            'total_videos': total_videos,
            'total_views': total_views,
            'total_subscribers': total_subscribers,
            'total_likes': total_likes
        }
    })


@app.route('/api/studio/comments', methods=['GET'])
@login_required
def get_studio_comments():
    """Получить комментарии к видео пользователя"""
    user = g.current_user
    
    video_id = request.args.get('video_id', type=int)
    
    conn = get_db_connection()
    
    if video_id:
        # Check if video belongs to user
        video = conn.execute(
            'SELECT * FROM videos WHERE id = ? AND user_id = ?',
            (video_id, user['id'])
        ).fetchone()
        
        if not video:
            conn.close()
            return jsonify({'error': 'Video not found'}), 404
        
        comments = conn.execute('''
            SELECT c.*, u.username, u.avatar
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.video_id = ?
            ORDER BY c.created_at DESC
        ''', (video_id,)).fetchall()
    else:
        # Get all comments from user's videos
        comments = conn.execute('''
            SELECT c.*, u.username, u.avatar, v.title as video_title
            FROM comments c
            JOIN users u ON c.user_id = u.id
            JOIN videos v ON c.video_id = v.id
            WHERE v.user_id = ?
            ORDER BY c.created_at DESC
            LIMIT 50
        ''', (user['id'],)).fetchall()
    
    conn.close()
    
    return jsonify({'comments': [dict_from_row(c) for c in comments]})


# ==================== Health Check ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Проверка работоспособности сервера"""
    return jsonify({
        'status': 'ok',
        'database': DB_PATH,
        'exists': os.path.exists(DB_PATH)
    })


if __name__ == '__main__':
    print(f"🚀 Server starting...")
    print(f"📁 Database: {DB_PATH}")
    print(f"📁 Database exists: {os.path.exists(DB_PATH)}")
    # Измените host и port здесь для другого IP/порта
    app.run(host='0.0.0.0', port=5000, debug=True)
