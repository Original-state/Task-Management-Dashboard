markdown

\---

\# 项目核心规约 - AI 编程上下文基准

project\_name: "task-master-dashboard"

project\_type: "Fullstack Web Application"

framework\_frontend: "Next.js 14 (App Router) with TypeScript"

framework\_backend: "Flask 3.x (Python)"

database: "SQLite + SQLAlchemy ORM"

styling: "Tailwind CSS + shadcn/ui (推荐)"

deployment\_target: "Vercel (前端 + Serverless Functions)"

\---



\## 1. 项目目标

开发一个个人任务管理看板（Task Management Dashboard），用于替代传统待办清单，支持任务的增删改查、状态流转和优先级管理。



\## 2. 绝对必须满足的硬性指标（考核用）

\- \*\*前端路由\*\*：必须包含至少 3 个独立页面（见下方路由表）。

\- \*\*后端 API\*\*：必须提供至少 4 个 RESTful 接口（增删改查全量）。

\- \*\*线上可访问\*\*：最终必须部署并提供 URL，或提供本地启动录屏。



\---



\## 3. 目录结构规范（AI 生成代码时请严格遵守）

项目根目录必须按以下结构组织，保持前后端分离清晰：

task-master-dashboard/

├── frontend/ # Next.js 前端源码

│ ├── app/

│ │ ├── layout.tsx # 根布局（包含全局导航）

│ │ ├── page.tsx # 路由: / (任务列表看板)

│ │ ├── tasks/

│ │ │ ├── create/

│ │ │ │ └── page.tsx # 路由: /tasks/create (新建任务)

│ │ │ └── \[id]/

│ │ │ └── page.tsx # 路由: /tasks/\[id] (详情/编辑页)

│ │ └── api/ # (仅用于Next.js重写代理，不在此写后端逻辑)

│ ├── components/ # 可复用UI组件（TaskCard, TaskForm, StatusBadge等）

│ ├── lib/ # 工具函数（axios实例、类型定义 types/index.ts）

│ ├── public/ # 静态资源

│ ├── tailwind.config.js

│ ├── next.config.js # 必须配置 rewrites 代理后端API

│ └── package.json

│

├── backend/ # Flask 后端源码

│ ├── app.py # Flask 主入口 (CORS配置、路由注册)

│ ├── models.py # SQLAlchemy 数据模型 (Task类)

│ ├── db.py # 数据库初始化与连接

│ ├── requirements.txt # 依赖清单 (flask, flask-cors, flask-sqlalchemy)

│ └── instance/ # (自动生成) SQLite数据库文件存放处

│

├── docs/ # 文档与截图

│ ├── api\_documentation.md # API 接口文档 (含请求/响应示例)

│ ├── postman\_screenshots/ # Postman测试截图

│ ├── ai\_prompts/ # Prompt日志截图 (命名: prompt\_1.png, prompt\_2.md)

│ └── ai\_code\_review/ # AI Code Review 建议截图

│

├── .env.local # 前端环境变量 (NEXT\_PUBLIC\_API\_BASE\_URL)

├── .env # 后端环境变量

├── vercel.json # Vercel 部署配置（若前后端同仓库）

├── README.md # 项目介绍、安装运行指南

└── PROJECT\_SPEC.md # (本文件)



text



\---



\## 4. 数据库设计（ORM 模型定义）

\*\*表名\*\*: `tasks`

AI 生成 `backend/models.py` 时，必须包含以下字段：



| 字段名 | 类型 | 约束/说明 |

| :--- | :--- | :--- |

| `id` | Integer | 主键，自增 |

| `title` | String(100) | \*\*必填\*\*，任务标题 |

| `description` | Text | 选填，任务描述 |

| `status` | String(20) | 默认 `'pending'`，可选值：`pending`, `in\_progress`, `completed` |

| `priority` | String(10) | 默认 `'medium'`，可选值：`low`, `medium`, `high` |

| `created\_at` | DateTime | 自动添加创建时间 |

| `updated\_at` | DateTime | 自动更新时间（每次修改刷新） |



\---



\## 5. API 接口合约（前后端严格对齐）

后端路由前缀统一为 `/api/`，返回标准 JSON 格式。



| 方法 | 端点 | 功能 | 请求体 (JSON) | 响应 (JSON) |

| :--- | :--- | :--- | :--- | :--- |

| GET | `/api/tasks` | 获取所有任务列表 | 无 | `{ "tasks": \[ {id, title, description, status, priority, created\_at, updated\_at}, ... ] }` |

| POST | `/api/tasks` | 创建新任务 | `{ "title": "string", "description?": "string", "priority?": "low/mid/high" }` (status默认pending) | `{ "message": "Created", "task": { ...完整对象... } }` |

| GET | `/api/tasks/<int:id>` | 获取单个任务详情 | 无 | `{ "task": { ...完整对象... } }` |

| PUT | `/api/tasks/<int:id>` | 更新任务（支持改状态） | `{ "title?": "string", "description?": "string", "status?": "pending/in\_progress/completed", "priority?": "low/medium/high" }` | `{ "message": "Updated", "task": { ...更新后对象... } }` |

| DELETE | `/api/tasks/<int:id>` | 删除任务 | 无 | `{ "message": "Deleted" }` (若失败返回404) |



> \*\*AI 注意\*\*：生成的 Flask 代码必须包含 `CORS(app)` 允许跨域，且 `PUT` 请求需支持\*\*部分字段更新\*\*（不必全字段传递）。



\---



\## 6. 前端路由与页面功能（UI/UX 规范）



| 路由 (Route) | 文件位置 | 核心交互功能 |

| :--- | :--- | :--- |

| `/` | `frontend/app/page.tsx` | 以\*\*三列看板\*\*或\*\*卡片网格\*\*展示所有任务。每个卡片显示标题、状态徽章、优先级标签。卡片上需有“删除”按钮和点击进入详情的链接。页面顶部有“新建任务”按钮。 |

| `/tasks/create` | `frontend/app/tasks/create/page.tsx` | 包含表单：标题(Input)、描述(Textarea)、优先级(Select下拉)。提交调用 `POST /api/tasks`，成功后使用 `router.push('/')` 跳转。 |

| `/tasks/\[id]` | `frontend/app/tasks/\[id]/page.tsx` | 动态路由。获取 `id` 调用 `GET /api/tasks/\[id]` 回显数据。可编辑标题、描述、\*\*状态\*\*、\*\*优先级\*\*。提供“保存”(PUT) 和“删除”(DELETE) 按钮。 |



\*\*额外 UI 要求（AI 生成时注意）\*\*：

\- 使用 Tailwind CSS 实现响应式设计。

\- 必须包含\*\*加载中（Loading）\*\*状态和\*\*错误提示（Toast/Alert）\*\*（如网络请求失败时提示“数据加载失败，请重试”）。

\- 删除操作需有二次确认弹窗（`window.confirm` 或 shadcn 的 Dialog）。



\---



\## 7. 环境变量与通信配置

\- \*\*前端代理\*\*：在 `frontend/next.config.js` 中配置 `rewrites()`，将 `/api` 请求代理到后端 `http://127.0.0.1:5000`，避免跨域。

\- \*\*环境变量\*\*：

&#x20; - 前端用 `NEXT\_PUBLIC\_API\_BASE\_URL` 作为请求基地址（开发默认为空，生产为部署后端地址）。

&#x20; - 后端通过 `os.getenv('DATABASE\_URL')` 获取数据库路径（生产可替换为 PostgreSQL，但本地保持 SQLite）。



\---



\## 8. 编码与提交规范（AI 协助生成时请遵循）



\### Git Commit 规范 (必须按此格式)：

\- `feat: 新增功能` (例如 `feat: add task list page`)

\- `fix: 修复 bug` (例如 `fix: resolve delete task 404 error`)

\- `docs: 文档更新` (例如 `docs: update README with deployment steps`)

\- `chore: 构建/工具变动` (例如 `chore: configure vercel.json`)



\### 代码风格：

\- \*\*前端\*\*：使用 ESLint + Prettier（默认 Next.js 配置），优先使用箭头函数和 `const`。

\- \*\*后端\*\*：遵循 PEP8，使用 `black` 风格（函数名小写下划线）。

\- \*\*命名约定\*\*：文件名使用 `kebab-case`（如 `task-card.tsx`），组件名使用 `PascalCase`（如 `TaskCard`）。



\---



\## 9. AI 辅助编程专项要求（供 AI 理解）

在生成代码或解答时，请记住：

1\. \*\*Prompt 日志\*\*：用户需要记录我们之间的对话。如果你生成了一段关键代码，我会截图保存。所以你生成时请给出\*\*完整、可直接复制\*\*的代码块，并附上简短注释。

2\. \*\*Code Review\*\*：后续我会挑选一段代码让你进行审查，请从“性能优化”、“安全性（如SQL注入）”、“可读性”三个维度给出建议。

3\. \*\*最佳实践\*\*：推荐使用 `shadcn/ui` 的 Button、Card、Input 组件（通过 `npx shadcn-ui@latest add` 安装），如果无法联网，降级使用纯 Tailwind 样式。



\---



\## 10. 启动与部署命令（AI 生成 README 时参考）

\- \*\*开发模式（前后端同时运行）\*\*：

&#x20; - 终端1 (后端)：`cd backend \&\& python app.py` (监听 5000 端口)

&#x20; - 终端2 (前端)：`cd frontend \&\& npm run dev` (监听 3000 端口)

\- \*\*部署 (Vercel)\*\*：根目录需包含 `vercel.json`，将 `frontend/` 作为输出目录，`backend/` 作为 Serverless Functions 目录。

