"""
数据模型定义 - Task 表
字段：id, title, description, status, priority, due_date, progress, image_proof, created_at, updated_at
"""

from datetime import datetime, timezone
from db import db  # pyright: ignore[reportImplicitRelativeImport]


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)          # 必填，任务标题
    description = db.Column(db.Text, default="")                # 选填，任务描述
    status = db.Column(db.String(20), default="pending")        # pending | in_progress | completed
    priority = db.Column(db.String(10), default="medium")       # low | medium | high
    due_date = db.Column(db.Date, nullable=True)                # 截止日期（可选）
    progress = db.Column(db.Integer, default=0)                 # 进度 0-100
    image_proof = db.Column(db.Text, nullable=True)             # 凭证图片 Base64
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
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "progress": self.progress,
            "image_proof": self.image_proof,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
