"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TaskForm from "@/components/TaskForm";
import Toast from "@/components/Toast";
import { createTask } from "@/lib/api";
import type { CreateTaskPayload } from "@/lib/types";

export default function CreateTaskPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  const handleSubmit = async (data: CreateTaskPayload) => {
    setSubmitting(true);
    try {
      await createTask(data);
      setToast("创建成功");
    } catch (err) {
      alert(err instanceof Error ? err.message : "创建失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {toast && <Toast message={toast} onDone={() => router.push("/")} />}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">新建任务</h1>
      <TaskForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
