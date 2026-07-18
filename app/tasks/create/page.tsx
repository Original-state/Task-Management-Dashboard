"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TaskForm from "@/components/TaskForm";
import { createTask } from "@/lib/api";
import type { CreateTaskPayload } from "@/lib/types";

export default function CreateTaskPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: CreateTaskPayload) => {
    setSubmitting(true);
    try {
      await createTask(data);
      router.push("/");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">新建任务</h1>
      <TaskForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
