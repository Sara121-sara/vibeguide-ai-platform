import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { GetStartedButton } from "@/components/get-started-button";
import { 
  ArrowRight, 
  FileText, 
  Zap, 
  Users, 
  CheckCircle,
  Brain,
  Code,
  Database,
  Layout
} from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="w-full border-b border-border/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-bold text-xl">
              VibeGuide
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/pricing" className="text-sm font-medium hover:text-primary">
                价格
              </Link>
              {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
              智能AI开发文档
              <span className="text-primary block">一键生成平台</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              VibeGuide 帮助编程新手快速生成专业的项目开发文档，包括用户旅程地图、产品需求PRD、前后端设计文档等，让项目规划变得简单高效。
            </p>
            <div className="flex gap-4 justify-center">
              <GetStartedButton />
              <Button variant="outline" size="lg" className="text-lg px-8">
                查看演示
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">强大功能特性</h2>
            <p className="text-xl text-muted-foreground">AI驱动的智能文档生成，让项目规划更专业</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI智能分析</h3>
              <p className="text-muted-foreground">基于Claude Sonnet 4，深度理解项目需求</p>
            </div>
            <div className="text-center p-6">
              <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">多文档生成</h3>
              <p className="text-muted-foreground">一键生成5类专业开发文档</p>
            </div>
            <div className="text-center p-6">
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">快速高效</h3>
              <p className="text-muted-foreground">3步骤流程，快速完成项目规划</p>
            </div>
            <div className="text-center p-6">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">新手友好</h3>
              <p className="text-muted-foreground">专为编程新手设计的智能引导</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">生成文档类型</h2>
            <p className="text-xl text-muted-foreground">覆盖项目开发全流程的专业文档</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border bg-card">
              <Layout className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">用户旅程地图</h3>
              <p className="text-sm text-muted-foreground">完整的用户体验流程设计</p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <FileText className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">产品需求PRD</h3>
              <p className="text-sm text-muted-foreground">详细的产品功能需求文档</p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Code className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">前端设计文档</h3>
              <p className="text-sm text-muted-foreground">UI/UX设计和组件架构</p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Code className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">后端设计文档</h3>
              <p className="text-sm text-muted-foreground">API接口和系统架构设计</p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Database className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">数据库设计</h3>
              <p className="text-sm text-muted-foreground">完整的数据模型和关系设计</p>
            </div>
            <div className="p-6 rounded-lg border bg-card flex items-center justify-center">
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-sm font-medium">批量导出支持</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">准备开始您的项目了吗？</h2>
          <p className="text-xl mb-8 opacity-90">
            加入我们，体验AI驱动的智能开发文档生成
          </p>
          <GetStartedButton variant="secondary" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5+</div>
              <div className="text-muted-foreground">文档类型</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">3</div>
              <div className="text-muted-foreground">简单步骤</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">AI</div>
              <div className="text-muted-foreground">智能驱动</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">常见问题</h2>
          </div>
          <div className="space-y-6">
            <div className="bg-background p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">什么是 VibeGuide？</h3>
              <p className="text-muted-foreground">
                VibeGuide 是一个智能AI开发文档平台，专门帮助编程新手快速生成专业的项目开发文档。
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">如何计费？</h3>
              <p className="text-muted-foreground">
                我们采用点数制，1元可获得2个项目点数，5元可获得12个项目点数。新用户注册即送2个免费点数。
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">支持哪些文档类型？</h3>
              <p className="text-muted-foreground">
                支持用户旅程地图、产品需求PRD、前端设计文档、后端设计文档、数据库设计等5种专业文档。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 VibeGuide. 智能AI开发文档平台.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
