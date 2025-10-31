# Forex Broker Review Website

这是一个外汇经纪商评价网站，使用 Next.js 16 + PostgreSQL + TypeScript 构建。

## 功能特性

- 🏆 **经纪商排名展示** - 按评分展示顶级经纪商
- 📊 **详细经纪商信息** - 许可证、账户信息、安全性评估等
- 🔍 **搜索功能** - 支持按经纪商名称搜索
- 📱 **响应式设计** - 支持移动端和桌面端
- ⚡ **高性能** - 使用 Next.js App Router 和静态生成

## 技术栈

- **前端**: Next.js 16, React 18, TypeScript
- **UI组件**: shadcn/ui + Radix UI + Tailwind CSS
- **数据库**: PostgreSQL (postgres.js)
- **部署**: Vercel

## 数据库结构

需要创建 `broker_data_web` 表，包含以下字段：

```sql
CREATE TABLE broker_data_web (
  id SERIAL PRIMARY KEY,
  code VARCHAR(255) UNIQUE NOT NULL,
  broker VARCHAR(255) NOT NULL,
  logo VARCHAR(500),
  total_score DECIMAL(3,1),
  official_link VARCHAR(500),
  license_info TEXT,
  account_info TEXT,
  register_country VARCHAR(255),
  operating_period VARCHAR(255),
  whychose TEXT, -- JSON string
  safe TEXT,     -- JSON string
  pros TEXT,     -- JSON string
  faq TEXT       -- JSON string
);
```

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

复制环境变量模板并配置数据库信息：

```bash
cp env-example.txt .env.local
```

编辑 `.env.local` 文件，填入您的数据库信息：

```env
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_PORT=5432
```

### 3. 启动开发服务器

```bash
pnpm dev
```

项目将在 `http://localhost:3000` 上运行。

### 4. 构建生产版本

```bash
pnpm build
```

## 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 在 Vercel 项目设置中配置环境变量：
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `DB_PORT`

## 项目结构

```
├── app/                    # Next.js App Router 页面
│   ├── api/brokers/       # API 路由
│   ├── broker/[code]/     # 经纪商详情页面
│   └── actions/           # Server Actions
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 组件
│   └── broker-detail/    # 经纪商详情组件
├── lib/                  # 工具函数和类型定义
├── public/              # 静态资源
└── styles/              # 样式文件
```

## 开发说明

- 数据库查询逻辑在 `lib/db.ts` 中
- 数据类型定义在 `lib/types.ts` 中
- Server Actions 在 `app/actions/brokers.ts` 中
- UI 组件使用 shadcn/ui 设计系统

## 注意事项

- 开发环境不支持数据库连接，仅在部署后可用
- 确保 PostgreSQL 数据库可从 Vercel 访问
- 建议使用连接池以提高性能
