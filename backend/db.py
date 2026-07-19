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
    - 本地开发：backend/instance/tasks.db
    - Vercel 部署：/tmp 可写，冷启动后清空（符合"重启即清空"）
      数据库文件路径可通过 DATABASE_URL 环境变量覆盖
    """
    if os.getenv("VERCEL") == "1":
        # Vercel Serverless：仅 /tmp 可写，且为临时存储
        db_path = os.getenv("DATABASE_URL", "sqlite:////tmp/taskmaster.db")
    else:
        # 本地开发：写入 instance 目录
        instance_dir = os.path.join(app.root_path, "instance")
        os.makedirs(instance_dir, exist_ok=True)
        db_path = os.getenv("DATABASE_URL", f"sqlite:///{instance_dir}/tasks.db")

    app.config["SQLALCHEMY_DATABASE_URI"] = db_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    # 创建所有表（冷启动时即重建空库）
    with app.app_context():
        db.create_all()
