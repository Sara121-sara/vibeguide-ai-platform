import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { User, CreditCard, ShoppingCart, History } from "lucide-react";
import { getCurrentUserData } from "@/lib/actions/user-actions";
import { redirect } from "next/navigation";

interface MyPageProps {
  searchParams: {
    success?: string;
    error?: string;
  };
}

export default async function MyPage({ searchParams }: MyPageProps) {
  const result = await getCurrentUserData();
  
  if (!result.success) {
    redirect('/auth/login');
  }

  const userData = result.user;

  const { success, error } = await searchParams;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">我的账户</h1>
        <p className="text-muted-foreground mt-2">
          管理您的账户信息和点数余额
        </p>
      </div>

      {/* Success/Error Messages */}
      {success === 'recharge' && (
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-600">
              充值成功
            </Badge>
            <span className="text-green-700 dark:text-green-300">
              点数已成功添加到您的账户！
            </span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Badge variant="destructive">
              错误
            </Badge>
            <span className="text-red-700 dark:text-red-300">
              {error === 'recharge-failed' ? '充值失败，请重试' : '发生错误'}
            </span>
          </div>
        </div>
      )}

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            账户信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">邮箱地址</label>
              <p className="text-lg">{userData.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">用户ID</label>
              <p className="text-sm font-mono text-muted-foreground">{userData.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            项目点数
          </CardTitle>
          <CardDescription>
            每创建一个完整项目消耗1个点数
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">
                {userData.credits || 0}
                <span className="text-lg font-normal text-muted-foreground ml-2">点数</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                可创建 {userData.credits || 0} 个项目
              </p>
            </div>
            
            {(!userData.credits || userData.credits === 0) && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-2">点数不足？</p>
                <Button asChild>
                  <Link href="/pricing">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    获取点数
                  </Link>
                </Button>
              </div>
            )}
          </div>
          
          {userData.credits && userData.credits > 0 && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-600">
                  充足
                </Badge>
                <span className="text-sm text-green-700 dark:text-green-300">
                  点数充足，可以开始创建项目
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            使用统计
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">-</div>
              <div className="text-sm text-muted-foreground">已创建项目</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">-</div>
              <div className="text-sm text-muted-foreground">生成文档数</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">-</div>
              <div className="text-sm text-muted-foreground">下载次数</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>快速操作</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild className="w-full justify-start" variant="outline">
            <Link href="/projects">
              <User className="h-4 w-4 mr-2" />
              查看我的项目
            </Link>
          </Button>
          
          <Button asChild className="w-full justify-start" variant="outline">
            <Link href="/projects/new">
              <CreditCard className="h-4 w-4 mr-2" />
              创建新项目
            </Link>
          </Button>
          
          <Button asChild className="w-full justify-start" variant="outline">
            <Link href="/pricing">
              <ShoppingCart className="h-4 w-4 mr-2" />
              购买点数
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardHeader>
          <CardTitle>需要帮助？</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            如果您在使用过程中遇到任何问题，请联系我们的客服团队。
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              帮助文档
            </Button>
            <Button variant="outline" size="sm">
              联系客服
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}