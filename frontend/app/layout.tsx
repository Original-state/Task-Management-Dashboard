import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task Master - 任务管理看板",
  description: "个人任务管理看板，支持任务的增删改查、状态流转和优先级管理",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="relative min-h-screen">
        {/* 全屏背景图 */}
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/background.png')" }}
        />
        {/* 白色半透明遮罩，确保内容可读 */}
        <div className="fixed inset-0 -z-10 bg-white/80" />

        {/* 顶部导航 */}
        <header className="bg-white/90 shadow-sm border-b border-gray-200/80 backdrop-blur-sm">
          <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold text-gray-800">
              📋 Task Master
            </Link>
            <Link
              href="/tasks/create"
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
            >
              + 新建任务
            </Link>
          </nav>
        </header>

        {/* 页面内容 */}
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
