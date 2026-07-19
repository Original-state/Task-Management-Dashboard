"""
任务管理 API 路由（Flask Blueprint）
提供 5 个 RESTful 接口：CRUD 全量覆盖
"""

from datetime import datetime
from flask import Blueprint, request, jsonify
from db import db  # pyright: ignore[reportImplicitRelativeImport]
from models import Task  # pyright: ignore[reportImplicitRelativeImport]

# 创建蓝图，统一 url_prefix=/api
api_bp = Blueprint("api", __name__)


# ==================== 辅助函数 ====================

# 合法值白名单
VALID_STATUSES = {"pending", "in_progress", "completed"}
VALID_PRIORITIES = {"low", "medium", "high"}


def _progress_to_status(progress):
    """根据进度自动映射状态：0→pending, 1-99→in_progress, 100→completed"""
    if progress is None or progress == 0:
        return "pending"
    elif progress >= 100:
        return "completed"
    else:
        return "in_progress"


def _validate_status(value):
    """校验状态值，不合法则返回 (error_msg, status_code)，合法返回 None"""
    if value is not None and value not in VALID_STATUSES:
        return f"Invalid status '{value}', must be one of: {', '.join(sorted(VALID_STATUSES))}"
    return None


def _validate_priority(value):
    """校验优先级值"""
    if value is not None and value not in VALID_PRIORITIES:
        return f"Invalid priority '{value}', must be one of: {', '.join(sorted(VALID_PRIORITIES))}"
    return None


# ==================== API 接口 ====================


@api_bp.route("/tasks", methods=["GET"])
def list_tasks():
    """GET /api/tasks — 获取所有任务列表"""
    tasks = Task.query.order_by(Task.created_at.desc()).all()
    return jsonify({"tasks": [t.to_dict() for t in tasks]}), 200


@api_bp.route("/tasks", methods=["POST"])
def create_task():
    """POST /api/tasks — 创建新任务"""
    data = request.get_json(silent=True) or {}
    if not data.get("title", "").strip():
        return jsonify({"error": "Title is required"}), 400

    # 校验合法值
    for validate, field in [
        (_validate_status, data.get("status")),
        (_validate_priority, data.get("priority")),
    ]:
        err = validate(field)
        if err:
            return jsonify({"error": err}), 400

    task = Task()
    task.title = data["title"].strip()
    task.description = data.get("description", "")
    task.priority = data.get("priority", "medium")
    task.progress = data.get("progress", 0)
    task.image_proof = data.get("image_proof")

    # 截止日期（可选，格式 YYYY-MM-DD）
    due_date_str = data.get("due_date")
    if due_date_str:
        try:
            task.due_date = datetime.strptime(due_date_str, "%Y-%m-%d").date()
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid due_date format, use YYYY-MM-DD"}), 400

    # 根据 progress 自动确定 status（优先级高于显式传入的 status）
    task.status = _progress_to_status(task.progress)

    db.session.add(task)
    db.session.commit()
    return jsonify({"message": "Created", "task": task.to_dict()}), 201


@api_bp.route("/tasks/<int:id>", methods=["GET"])
def get_task(id):
    """GET /api/tasks/<id> — 获取单个任务详情"""
    task = db.session.get(Task, id)
    if not task:
        return jsonify({"error": f"Task {id} not found"}), 404
    return jsonify({"task": task.to_dict()}), 200


@api_bp.route("/tasks/<int:id>", methods=["PUT"])
def update_task(id):
    """PUT /api/tasks/<id> — 更新任务（支持部分字段更新）"""
    task = db.session.get(Task, id)
    if not task:
        return jsonify({"error": f"Task {id} not found"}), 404

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    # 校验合法值
    err = _validate_status(data.get("status")) or _validate_priority(data.get("priority"))
    if err:
        return jsonify({"error": err}), 400

    # 仅更新传入的字段（部分更新）
    if "title" in data:
        task.title = data["title"].strip()
    if "description" in data:
        task.description = data["description"]
    if "status" in data:
        task.status = data["status"]
    if "priority" in data:
        task.priority = data["priority"]
    if "due_date" in data:
        due_date_str = data["due_date"]
        if due_date_str:
            try:
                task.due_date = datetime.strptime(due_date_str, "%Y-%m-%d").date()
            except (ValueError, TypeError):
                return jsonify({"error": "Invalid due_date format, use YYYY-MM-DD"}), 400
        else:
            task.due_date = None  # 允许清空截止日期
    if "progress" in data:
        task.progress = data["progress"]
    if "image_proof" in data:
        task.image_proof = data["image_proof"]

    # 如果传入了 progress，自动推算 status（progress 优先级高于显式 status）
    if "progress" in data:
        task.status = _progress_to_status(task.progress)

    db.session.commit()
    return jsonify({"message": "Updated", "task": task.to_dict()}), 200


@api_bp.route("/tasks/<int:id>", methods=["DELETE"])
def delete_task(id):
    """DELETE /api/tasks/<id> — 删除任务"""
    task = db.session.get(Task, id)
    if not task:
        return jsonify({"error": f"Task {id} not found"}), 404
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200


@api_bp.route("/tasks/<int:id>/export", methods=["GET"])
def export_task(id):
    """GET /api/tasks/<id>/export?include_images=false — 导出单个任务为 JSON"""
    task = db.session.get(Task, id)
    if not task:
        return jsonify({"error": f"Task {id} not found"}), 404
    include_images = request.args.get("include_images", "false").lower() == "true"
    d = task.to_dict()
    if not include_images:
        d.pop("image_proof", None)
    response = jsonify({"task": d})
    response.headers["Content-Disposition"] = f"attachment; filename=task_{id}.json"
    return response


@api_bp.route("/tasks/import", methods=["POST"])
def import_tasks():
    """POST /api/tasks/import — 批量导入任务（JSON）"""
    data = request.get_json(silent=True) or {}
    tasks_data = data.get("tasks", [])
    if not tasks_data:
        return jsonify({"error": "No tasks found in request"}), 400

    imported = 0
    for item in tasks_data:
        title = (item.get("title") or "").strip()
        if not title:
            continue
        task = Task()
        task.title = title
        task.description = item.get("description", "")
        task.priority = item.get("priority", "medium")
        task.progress = item.get("progress", 0)
        task.image_proof = item.get("image_proof")
        task.status = item.get("status", "pending")
        due_date_str = item.get("due_date")
        if due_date_str:
            try:
                task.due_date = datetime.strptime(due_date_str, "%Y-%m-%d").date()
            except (ValueError, TypeError):
                pass
        db.session.add(task)
        imported += 1

    db.session.commit()
    return jsonify({"message": f"Imported {imported} tasks", "count": imported}), 201
