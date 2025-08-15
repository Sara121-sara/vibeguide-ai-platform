# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎉 项目状态 (最后更新: 2025-01-15)

**VibeGuide AI开发文档生成平台 - 已成功上线！**

### 🚀 生产环境信息
- **主域名**: https://vibeguideai.vercel.app
- **部署平台**: Vercel
- **GitHub仓库**: https://github.com/Sara121-sara/vibeguide-ai-platform
- **状态**: ✅ 生产环境运行中，功能完整

### ✅ 已完成功能
1. **用户认证系统** - Supabase认证，自动用户创建
2. **营销首页** - 完整的landing page设计
3. **三步骤项目创建流程** - 项目描述 → AI问题生成 → 文档生成
4. **AI文档生成** - 集成Claude Sonnet 4，生成5类开发文档
5. **用户点数系统** - 基于点数的付费模式
6. **文档下载功能** - Markdown和ZIP批量下载
7. **项目管理** - 项目列表、详情页、编辑功能
8. **个人中心** - 用户信息、点数余额、使用统计

### 🔧 技术栈确认
- Next.js 15 + App Router + TypeScript
- Supabase (认证 + PostgreSQL数据库)
- Drizzle ORM
- TailwindCSS + shadcn/ui
- OpenRouter + Claude Sonnet 4
- Vercel部署 (已配置eslint.ignoreDuringBuilds)

### 💳 支付系统状态
- **ZPay**: ✅ 代码集成完成，需配置真实余额
- **Stripe**: ✅ 代码集成完成，使用测试密钥
- **当前配置**: 使用占位符密钥，功能完整但需真实密钥激活

### 📋 下一步待办
1. 配置ZPay真实余额并测试支付流程
2. 获取Stripe真实API密钥替换占位符  
3. 测试完整的用户注册→充值→使用→下载流程
4. 优化AI文档生成的提示词和质量

## Development Commands

- `pnpm dev` - Start development server with Turbopack (localhost:3000)
- `pnpm build` - Build production version
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate Drizzle migrations
- `pnpm db:push` - Push database schema to Supabase
- `pnpm db:studio` - Open Drizzle Studio for database management

## Architecture Overview

This is a Next.js 15 application with Supabase authentication using the App Router pattern:

### Authentication Flow
- Uses cookie-based authentication via `@supabase/ssr`
- Client-side auth: `lib/supabase/client.ts` for browser components
- Server-side auth: `lib/supabase/server.ts` for server components/actions
- Middleware: `lib/supabase/middleware.ts` handles session refresh across all routes

### Key Patterns
- **Supabase Client Creation**: Always create new server clients in functions (don't use globals for Fluid compute compatibility)
- **Authentication Pages**: Located in `app/auth/` directory with forms in `components/`
- **Protected Routes**: Use `app/projects/` layout for authenticated pages
- **UI Components**: shadcn/ui components in `components/ui/`, custom components in `components/`

### Database Schema
- **users**: User profiles with credits system
- **projects**: User projects with step data and generated documents
- **payments**: Payment history and credit transactions
- Uses Drizzle ORM with PostgreSQL (Supabase)

### Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=[your-supabase-url]
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=[your-anon-key]
DATABASE_URL=[your-supabase-database-url]
OPENROUTER_API_KEY=[your-openrouter-api-key]
STRIPE_SECRET_KEY=[your-stripe-secret-key]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[your-stripe-publishable-key]
STRIPE_WEBHOOK_SECRET=[your-stripe-webhook-secret]
ZPAY_PID=[your-zpay-project-id] # 备用支付方式
ZPAY_PKEY=[your-zpay-private-key] # 备用支付方式  
NEXT_PUBLIC_SITE_URL=[your-site-url]
```

### Tech Stack
- Next.js 15 (App Router)
- Supabase (authentication + database)
- Drizzle ORM (database operations)
- TailwindCSS + shadcn/ui
- TypeScript
- next-themes (theme switching)
- OpenRouter + Claude Sonnet 4 (AI document generation)
- ZPay (payment processing)

## Code Conventions
- Use absolute imports with `@/` prefix
- Components follow shadcn/ui patterns
- Auth forms are separate components for reusability
- Middleware runs on all routes except static assets
- Database queries centralized in `lib/db/queries.ts`
- AI integration in `lib/ai/document-generator.ts`

## Key Features
- **Landing Page**: Marketing homepage with pricing
- **Authentication**: Supabase-based auth with auto user creation
- **Project Management**: 3-step project creation workflow
- **AI Document Generation**: 5 types of development documents
- **Credit System**: Pay-per-project with ZPay integration
- **Document Export**: Markdown/HTML preview and ZIP download