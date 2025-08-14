import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LogoutButton } from "@/components/logout-button";
import { 
  FolderOpen, 
  Plus, 
  User,
  Home
} from "lucide-react";

export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const navItems = [
    {
      href: "/projects",
      label: "我的项目",
      icon: FolderOpen,
    },
    {
      href: "/projects/new",
      label: "新建项目",
      icon: Plus,
    },
    {
      href: "/my",
      label: "我的",
      icon: User,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="w-full border-b border-border/10 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-bold text-xl">
              VibeGuide
            </Link>
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  首页
                </Link>
              </Button>
              <ThemeSwitcher />
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border/10 bg-muted/10 min-h-[calc(100vh-4rem)]">
          <nav className="p-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}