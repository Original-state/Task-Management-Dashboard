"""
数据库初始化与连接管理
使用 SQLite + SQLAlchemy ORM
"""

import os
from flask_sqlalchemy import SQLAlchemy

# 创建全局 db 实例
db = SQLAlchemy()


def init_db(app):
    """
    初始化数据库，绑定 Flask app。
    数据库文件路径可通过 DATABASE_URL 环境变量配置，
    默认为 backend/instance/tasks.db
    """
    # 确保 instance 目录存在
    instance_dir = os.path.join(app.root_path, "instance")
    os.makedirs(instance_dir, exist_ok=True)
    db_path = os.getenv("DATABASE_URL", f"sqlite:///{instance_dir}/tasks.db")
    app.config["SQLALCHEMY_DATABASE_URI"] = db_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    # 创建所有表（若尚未创建）
    with app.app_context():
        db.create_all()
