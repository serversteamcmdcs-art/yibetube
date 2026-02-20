"""
Конфигурация подключения к базе данных
"""

import os

# Путь к базе данных (относительно корня проекта)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'vibetube.db')

# Настройки Flask
SECRET_KEY = 'vibetube-secret-key-change-in-production'

# URL базы данных (для совместимости с различными ORM)
DATABASE_URL = f'sqlite:///{DB_PATH}'

# Настройки подключения
DB_OPTIONS = {
    'check_same_thread': False,
    'timeout': 30
}
