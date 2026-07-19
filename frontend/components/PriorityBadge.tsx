import type { Task } from "@/lib/types";

/** 优先级 → 中文映射 & 配色 */
const PRIORITY_MAP: Record<Task["priority"], { label: string; color: string }> = {
  low: { label: "低", color: "bg-gray-100 text-gray-600" },
  medium: { label: "中", color: "bg-orange-100 text-orange-700" },
  high: { label: "高", color: "bg-red-100 text-red-700" },
};

export default function PriorityBadge({ priority }: { priority: Task["priority"] }) {
  const { label, color } = PRIORITY_MAP[priority] || { label: priority, color: "bg-gray-100 text-gray-800" };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${color}`}>
      {label}
    </span>
  );
}
