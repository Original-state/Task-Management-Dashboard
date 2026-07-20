/**
 * API 请求工具 - 封装 fetch 调用
 * 所有前后端通信都通过此模块
 */

import type { Task, CreateTaskPayload, UpdateTaskPayload, ApiResponse } from "./types";

// 后端 API 基地址（开发时通过 next.config.js rewrites 代理）
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/** 请求超时时间 (ms) */
const REQUEST_TIMEOUT = 10000;

/** 基础请求封装，10 秒超时 */
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      ...options,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `请求失败 (HTTP ${res.status})`);
    }
    return res.json();
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("请求超时，请检查网络或后端服务");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// ========== 任务 API ==========

/** 获取所有任务 */
export async function fetchTasks(): Promise<Task[]> {
  const data = await request<ApiResponse<Task>>("/api/tasks");
  return data.tasks || [];
}

/** 获取单个任务 */
export async function fetchTask(id: number): Promise<Task> {
  const data = await request<ApiResponse<Task>>(`/api/tasks/${id}`);
  if (!data.task) throw new Error("任务不存在");
  return data.task;
}

/** 创建任务 */
export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const data = await request<ApiResponse<Task>>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!data.task) throw new Error("创建失败");
  return data.task;
}

/** 更新任务 */
export async function updateTask(id: number, payload: UpdateTaskPayload): Promise<Task> {
  const data = await request<ApiResponse<Task>>(`/api/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!data.task) throw new Error("更新失败");
  return data.task;
}

/** 删除任务 */
export async function deleteTask(id: number): Promise<void> {
  await request<{ message: string }>(`/api/tasks/${id}`, {
    method: "DELETE",
  });
}

/** 导出单个任务（返回 JSON 文本，不含图片默认） */
export async function exportTask(id: number, includeImages = false): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const res = await fetch(`${BASE_URL}/api/tasks/${id}/export?include_images=${includeImages}`, {
      signal: controller.signal,
    });
    if (!res.ok) throw new Error("导出失败");
    return res.text();
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("导出超时，请重试");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/** 导入任务（支持单个或多个） */
export async function importTasks(tasks: object[]): Promise<number> {
  const data = await request<{ message: string; count: number }>("/api/tasks/import", {
    method: "POST",
    body: JSON.stringify({ tasks }),
  });
  return data.count;
}
