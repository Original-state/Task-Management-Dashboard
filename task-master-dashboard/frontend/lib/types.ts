/** 任务数据类型 */
export interface Task {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  due_date: string | null;
  progress: number;
  image_proof: string | null;
  created_at: string;
  updated_at: string;
}

/** 创建任务的请求体 */
export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority?: Task["priority"];
  due_date?: string | null;
  progress?: number;
  image_proof?: string | null;
}

/** 更新任务的请求体（全部可选） */
export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: Task["status"];
  priority?: Task["priority"];
  due_date?: string | null;
  progress?: number;
  image_proof?: string | null;
}

/** API 标准响应 */
export interface ApiResponse<T> {
  message?: string;
  error?: string;
  task?: T;
  tasks?: T[];
}
