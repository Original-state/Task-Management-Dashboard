"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import TaskForm from "@/components/TaskForm";
import Toast from "@/components/Toast";
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
  const [toast, setToast] = useState("");

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
      setToast("保存成功");
    } catch (err) {
      alert(err instanceof Error ? err.message : "保存失败");
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
      {toast && <Toast message={toast} onDone={() => router.push("/")} />}
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

      {/* 已上传凭证图片展示 */}
      {task.image_proof && (
        <div className="mb-6 p-4 rounded-xl border border-gray-200 bg-white/90">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            📷 已上传凭证
          </h2>
          <img
            src={task.image_proof}
            alt="任务凭证"
            className="w-full max-h-64 object-contain rounded-lg border border-gray-100 bg-gray-50"
            onClick={() => window.open(task.image_proof!, "_blank")}
            title="点击查看原图"
          />
          <p className="text-xs text-gray-400 mt-2 text-center">点击图片可在新标签页查看原图</p>
        </div>
      )}

      <TaskForm initialData={task} onSubmit={handleUpdate} submitting={submitting} />
    </div>
  );
}
