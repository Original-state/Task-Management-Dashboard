# Task Master Dashboard

个人任务管理看板，支持任务的增删改查、三列看板流转、优先级管理和进度追踪。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| 后端 | Flask 3.x + SQLAlchemy + SQLite |
| 部署 | Vercel（前后端双项目，免绑卡） |

## 线上地址

| 项目 | 地址 |
|------|------|
| 前端 | `https://task-management-dashboard-4cye.vercel.app` |
| 后端 API | `https://task-management-dashboard-1mlg.vercel.app` |

> 后端使用 `/tmp` 临时 SQLite 存储，Vercel 实例空闲回收后数据自动清空（重启即清空）。

## 本地开发

### 环境要求

- Node.js ≥ 18
- Python ≥ 3.10

### 启动后端

```bash
cd backend
pip install -r requirements.txt
python app.py
# 监听 http://127.0.0.1:5000
```

### 启动前端

```bash
cd frontend
npm install
npm run dev
# 监听 http://localhost:3000
```

本地开发时前端通过 `next.config.js` rewrites 将 `/api` 代理到后端，无需额外配置。

## 功能清单

- [x] 三列看板（待处理 / 进行中 / 已完成）
- [x] 任务 CRUD（新建、编辑、删除）
- [x] 快捷状态切换（卡片上直接"开始"/"完成"）
- [x] 优先级（低 / 中 / 高）
- [x] 截止日期（过期标红 ⚠）
- [x] 进度追踪（0-100%，三色进度条，自动映射状态）
- [x] 凭证图片上传（Base64 存储）
- [x] 单任务导出/导入（JSON 文件）
- [x] 保存成功 Toast 提示
- [x] 响应式布局

## API 接口

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| GET | `/api/tasks` | 获取所有任务 |
| POST | `/api/tasks` | 创建任务 |
| GET | `/api/tasks/<id>` | 获取单个任务 |
| PUT | `/api/tasks/<id>` | 更新任务（支持部分更新） |
| DELETE | `/api/tasks/<id>` | 删除任务 |
| GET | `/api/tasks/<id>/export` | 导出任务 JSON |
| POST | `/api/tasks/import` | 导入任务 |

## 项目结构

```
task-master-dashboard/
├── frontend/          # Next.js 前端
│   ├── app/           # 页面路由
│   ├── components/    # UI 组件
│   └── lib/           # 类型定义 & API 封装
├── backend/           # Flask 后端
│   ├── app.py         # 主入口
│   ├── models.py      # 数据模型
│   ├── routes.py      # API 路由
│   ├── db.py          # 数据库初始化
│   └── api/index.py   # Vercel 入口
├── README.md
└── PROJECT_STATUS.md
```
