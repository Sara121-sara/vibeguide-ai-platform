# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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