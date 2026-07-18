"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import TaskForm from "@/components/TaskForm";
import { fetchTask, updateTask, deleteTask } from "@/lib/api";
import type { Task, UpdateTaskPayload } from "@/lib/types";

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchTask(id)
      .then(setTask)
      .catch((err) => setError(err instanceof Error ? err.message : "加载失败"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (data: UpdateTaskPayload) => {
    setSubmitting(true);
    try {
      const updated = await updateTask(id, data);
      setTask(updated);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("确定要删除此任务吗？此操作不可撤销。")) return;
    try {
      await deleteTask(id);
      router.push("/");
    } catch (err) {
      alert(err instanceof Error ? err.message : "删除失败");
    }
  };

  // 加载中
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400">加载中...</p>
      </div>
    );
  }

  // 错误
  if (error) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          ← 返回任务列表
        </Link>
      </div>
    );
  }

  if (!task) return null;

  return (
    <div className="max-w-lg mx-auto">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          ← 返回列表
        </Link>
        <button
          onClick={handleDelete}
          className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
        >
          删除任务
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">编辑任务</h1>
      <TaskForm initialData={task} onSubmit={handleUpdate} submitting={submitting} />
    </div>
  );
}
