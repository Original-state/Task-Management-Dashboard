"use client";

import Link from "next/link";
import type { Task } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";

interface TaskCardProps {
  task: Task;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, newStatus: Task["status"]) => void;
}

export default function TaskCard({ task, onDelete, onStatusChange }: TaskCardProps) {
  const handleDelete = () => {
    if (window.confirm(`确定要删除任务"${task.title}"吗？此操作不可撤销。`)) {
      onDelete(task.id);
    }
  };

  // 截止日期是否已过期（且任务未完成）
  const isOverdue =
    task.due_date &&
    task.status !== "completed" &&
    new Date(task.due_date) < new Date(new Date().toDateString());

  // 进度条颜色
  const progressColor =
    task.progress < 30 ? "bg-red-500" : task.progress < 70 ? "bg-yellow-500" : "bg-green-500";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition">
      {/* 标题行 */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <Link
          href={`/tasks/${task.id}`}
          className="text-base font-semibold text-gray-800 hover:text-blue-600 transition line-clamp-1"
        >
          {task.title}
        </Link>
        <button
          onClick={handleDelete}
          className="shrink-0 text-gray-400 hover:text-red-500 transition text-sm"
          title="删除"
        >
          ✕
        </button>
      </div>

      {/* 描述 */}
      {task.description && (
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{task.description}</p>
      )}

      {/* 截止日期 */}
      {task.due_date && (
        <p className={`text-xs mb-2 ${isOverdue ? "text-red-500 font-medium" : "text-gray-400"}`}>
          {isOverdue ? "⚠ 已过期 · " : "📅 截止 "}
          {new Date(task.due_date).toLocaleDateString("zh-CN")}
        </p>
      )}

      {/* 进度条 */}
      {(task.progress > 0 || task.status === "in_progress") && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">进度</span>
            <span className="text-xs font-medium text-gray-600">{task.progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 快捷操作按钮 */}
      {task.status !== "completed" && (
        <div className="flex gap-2 mb-3">
          {task.status === "pending" && (
            <button
              onClick={() => onStatusChange(task.id, "in_progress")}
              className="px-2.5 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition font-medium"
            >
              → 开始
            </button>
          )}
          {task.status === "in_progress" && (
            <button
              onClick={() => onStatusChange(task.id, "completed")}
              className="px-2.5 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition font-medium"
            >
              ✓ 完成
            </button>
          )}
        </div>
      )}

      {/* 底部标签 */}
      <div className="flex items-center gap-2">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
        <span className="ml-auto text-xs text-gray-400">
          {new Date(task.created_at).toLocaleDateString("zh-CN")}
        </span>
      </div>
    </div>
  );
}
