import type { Task } from "@/lib/types";

/** 状态 → 中文映射 & 配色 */
const STATUS_MAP: Record<Task["status"], { label: string; color: string }> = {
  pending: { label: "待处理", color: "bg-yellow-100 text-yellow-800" },
  in_progress: { label: "进行中", color: "bg-blue-100 text-blue-800" },
  completed: { label: "已完成", color: "bg-green-100 text-green-800" },
};

export default function StatusBadge({ status }: { status: Task["status"] }) {
  const { label, color } = STATUS_MAP[status] || { label: status, color: "bg-gray-100 text-gray-800" };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${color}`}>
      {label}
    </span>
  );
}
