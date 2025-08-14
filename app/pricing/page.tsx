import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Check, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ZPayButton } from "@/components/zpay-button";
import { StripeButton } from "@/components/stripe-button";

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const plans = [
    {
      id: "starter",
      name: "入门套餐",
      price: "¥1",
      credits: 2,
      description: "适合初次体验用户",
      features: [
        "2个项目点数",
        "所有文档类型",
        "Markdown 导出",
        "基础客服支持"
      ],
      popular: false
    },
    {
      id: "pro",
      name: "专业套餐", 
      price: "¥5",
      credits: 12,
      description: "最受欢迎的选择",
      features: [
        "12个项目点数",
        "所有文档类型",
        "Markdown + HTML 导出",
        "批量ZIP下载",
        "优先客服支持",
        "更快生成速度"
      ],
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="w-full border-b border-border/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-bold text-xl">
              VibeGuide
            </Link>
            <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              返回首页
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">选择您的套餐</h1>
          <p className="text-xl text-muted-foreground">
            选择适合您需求的套餐，开始创建专业的开发文档
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    最受欢迎
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">一次性付费</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  获得 {plan.credits} 个项目点数
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-2">
                {user ? (
                  <>
                    <StripeButton 
                      amount={plan.price.replace('¥', '')}
                      credits={plan.credits}
                      planName={plan.name}
                      planId={plan.id}
                      className="w-full"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full text-xs"
                      asChild
                    >
                      <Link href={`/api/test-recharge?credits=${plan.credits}`}>
                        🧪 测试充值（开发模式）
                      </Link>
                    </Button>
                  </>
                ) : (
                  <Button asChild className="w-full">
                    <Link href="/auth/login">
                      登录后购买
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-8">常见问题</h2>
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">点数如何使用？</h3>
              <p className="text-sm text-muted-foreground">
                每创建一个完整项目消耗1个点数。项目包含5种类型的专业文档。
              </p>
            </div>
            
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">点数会过期吗？</h3>
              <p className="text-sm text-muted-foreground">
                点数永久有效，不会过期。您可以随时使用已购买的点数。
              </p>
            </div>
            
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">支持退款吗？</h3>
              <p className="text-sm text-muted-foreground">
                由于AI生成服务的特殊性，我们不支持退款。建议先使用免费点数体验服务。
              </p>
            </div>
            
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">如何联系客服？</h3>
              <p className="text-sm text-muted-foreground">
                您可以通过邮箱联系我们，专业套餐用户享有优先客服支持。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}