"use client";

import { useEffect, useState, useCallback } from "react";
import type { Task } from "@/lib/types";
import { fetchTasks, deleteTask, updateTask } from "@/lib/api";
import TaskCard from "@/components/TaskCard";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 加载任务列表
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "数据加载失败，请重试");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // 删除任务
  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "删除失败");
    }
  };

  // 快捷状态切换（看板上直接操作）
  const handleStatusChange = async (id: number, newStatus: Task["status"]) => {
    // 乐观更新：先改 UI，再等后端确认
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    try {
      await updateTask(id, { status: newStatus });
    } catch (err) {
      // 失败时回滚
      loadTasks();
      alert(err instanceof Error ? err.message : "操作失败");
    }
  };

  // 按状态分组
  const columns = [
    { key: "pending", label: "待处理", color: "bg-yellow-50 border-yellow-200" },
    { key: "in_progress", label: "进行中", color: "bg-blue-50 border-blue-200" },
    { key: "completed", label: "已完成", color: "bg-green-50 border-green-200" },
  ] as const;

  // 加载中
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400">加载中...</p>
      </div>
    );
  }

  // 错误提示
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-red-500">{error}</p>
        <button
          onClick={loadTasks}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
        >
          重新加载
        </button>
      </div>
    );
  }

  // 空状态
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-gray-400 text-lg">暂无任务</p>
        <p className="text-gray-300 text-sm">点击右上角"新建任务"开始使用</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">任务看板</h1>

      {/* 三列看板布局（响应式：小屏堆叠，大屏三列） */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div
              key={col.key}
              className={`rounded-xl border p-3 min-h-[200px] ${col.color} bg-opacity-80 backdrop-blur-sm`}
            >
              <h2 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                {col.label}
                <span className="text-xs font-normal text-gray-400">({colTasks.length})</span>
              </h2>
              <div className="space-y-3">
                {colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 进度条使用提示 */}
      <div className="mt-6 p-4 rounded-xl bg-white/70 border border-gray-200/80 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          💡 进度条说明
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          任务卡片下方的进度条表示当前完成百分比。颜色会随进度变化：
          <span className="inline-flex items-center gap-1 ml-1">
            <span className="w-5 h-1.5 rounded-full bg-red-500 inline-block" />
            <span className="text-xs text-gray-500">&lt;30%</span>
            <span className="w-5 h-1.5 rounded-full bg-yellow-500 inline-block ml-1" />
            <span className="text-xs text-gray-500">30-70%</span>
            <span className="w-5 h-1.5 rounded-full bg-green-500 inline-block ml-1" />
            <span className="text-xs text-gray-500">&gt;70%</span>
          </span>
          。进入任务详情页拖动滑块或上传凭证图片即可更新进度。
        </p>
      </div>
    </div>
  );
}
