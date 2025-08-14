import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, FileText, Calendar, ArrowRight } from "lucide-react";
import { getCurrentUserProjects } from "@/lib/actions/project-actions";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { redirect } from "next/navigation";

export default async function ProjectsPage() {
  const result = await getCurrentUserProjects();
  
  if (!result.success) {
    redirect('/auth/login');
  }

  const projects = result.projects;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">我的项目</h1>
          <p className="text-muted-foreground mt-2">
            管理您的所有项目文档
          </p>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="h-4 w-4 mr-2" />
            新建项目
          </Link>
        </Button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">还没有项目</h3>
          <p className="text-muted-foreground mb-6">
            创建您的第一个项目，开始生成专业的开发文档
          </p>
          <Button asChild size="lg">
            <Link href="/projects/new">
              <Plus className="h-4 w-4 mr-2" />
              创建第一个项目
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="mt-2 line-clamp-3">
                      {project.description}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={project.status === 'completed' ? 'default' : 'secondary'}
                    className="ml-2"
                  >
                    {project.status === 'completed' ? '已完成' : '草稿'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {formatDistanceToNow(new Date(project.updatedAt), { 
                      addSuffix: true,
                      locale: zhCN 
                    })}
                  </div>
                  
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/projects/${project.id}`}>
                      查看 <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}