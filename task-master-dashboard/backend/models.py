"""
数据模型定义 - Task 表
字段：id, title, description, status, priority, created_at, updated_at
"""

from datetime import datetime, timezone
from db import db


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)          # 必填，任务标题
    description = db.Column(db.Text, default="")                # 选填，任务描述
    status = db.Column(db.String(20), default="pending")        # pending | in_progress | completed
    priority = db.Column(db.String(10), default="medium")       # low | medium | high
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self):
        """将模型实例序列化为字典，方便 JSON 响应"""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "priority": self.priority,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
