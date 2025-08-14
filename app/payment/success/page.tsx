import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">支付成功！</CardTitle>
          <CardDescription>
            您的点数已充值到账，现在可以开始创建项目了
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/projects">
              开始创建项目 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link href="/my">
              查看我的账户
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}