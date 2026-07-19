"use client";

import { useState, useEffect, useRef } from "react";
import type { Task } from "@/lib/types";

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: any) => Promise<void>;
  submitting: boolean;
}

export default function TaskForm({ initialData, onSubmit, submitting }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [status, setStatus] = useState<Task["status"]>(initialData?.status || "pending");
  const [priority, setPriority] = useState<Task["priority"]>(initialData?.priority || "medium");
  const [dueDate, setDueDate] = useState(initialData?.due_date || "");
  const [progress, setProgress] = useState(initialData?.progress ?? 0);
  const [imageProof, setImageProof] = useState(initialData?.image_proof || "");
  const [imageProofChanged, setImageProofChanged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 编辑模式下，切换任务时同步 initialData
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setStatus(initialData.status);
      setPriority(initialData.priority);
      setDueDate(initialData.due_date || "");
      setProgress(initialData.progress ?? 0);
      setImageProof(initialData.image_proof || "");
      setImageProofChanged(false);
    }
  }, [initialData?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const isEdit = !!initialData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const data: any = {
      title: title.trim(),
      description,
      priority,
      due_date: dueDate || null,
    };
    if (isEdit) {
      data.status = status;
      data.progress = progress;
      data.image_proof = imageProof || null;
    }
    onSubmit(data);
  };

  /** 文件转 Base64 */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 限制 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert("图片不能超过 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageProof(reader.result as string);
      setImageProofChanged(true);
    };
    reader.onerror = () => {
      alert("图片读取失败，请重试");
    };
    reader.readAsDataURL(file);
  };

  /** 进度条颜色 */
  const progressColor =
    progress < 30 ? "bg-red-500" : progress < 70 ? "bg-yellow-500" : "bg-green-500";

  // 获取今天的日期字符串 (YYYY-MM-DD)，用于 min 属性
  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 标题 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          任务标题 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
          disabled={submitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
          placeholder="输入任务标题"
        />
      </div>

      {/* 描述 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          disabled={submitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50 resize-none"
          placeholder="输入任务描述（可选）"
        />
      </div>

      {/* 优先级 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Task["priority"])}
          disabled={submitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
        >
          <option value="low">低</option>
          <option value="medium">中</option>
          <option value="high">高</option>
        </select>
      </div>

      {/* 截止日期 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">截止日期</label>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={!isEdit ? today : undefined}
            disabled={submitting}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
          />
          {dueDate && (
            <button
              type="button"
              onClick={() => setDueDate("")}
              className="text-sm text-gray-400 hover:text-red-500 transition"
              title="清除日期"
            >
              ✕
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {isEdit ? "留空表示不设截止日期" : "可选，留空表示不设截止日期"}
        </p>
      </div>

      {/* 进度滑块 + 图片上传（仅编辑模式） */}
      {isEdit && (
        <>
          {/* 进度滑块 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              完成进度 <span className="text-gray-400 font-normal">({progress}%)</span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              disabled={submitting}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
            />
            {/* 细进度条 */}
            <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* 图片上传 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">凭证图片</label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              disabled={submitting}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
            <p className="text-xs text-gray-400 mt-1">支持 jpg/png/gif，最大 2MB</p>

            {/* 新图片预览（仅当用户重新选择了文件时显示） */}
            {imageProofChanged && imageProof && (
              <div className="mt-2 relative inline-block">
                <img
                  src={imageProof}
                  alt="新凭证预览"
                  className="max-h-32 rounded-lg border border-gray-200 object-contain"
                />
                <button
                  type="button"
                  onClick={() => { setImageProof(""); setImageProofChanged(false); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition"
                  title="取消更换"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* 状态（仅编辑模式） */}
      {isEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Task["status"])}
            disabled={submitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
          >
            <option value="pending">待处理</option>
            <option value="in_progress">进行中</option>
            <option value="completed">已完成</option>
          </select>
        </div>
      )}

      {/* 提交按钮 */}
      <button
        type="submit"
        disabled={submitting || !title.trim()}
        className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {submitting ? "保存中..." : isEdit ? "保存修改" : "创建任务"}
      </button>
    </form>
  );
}
