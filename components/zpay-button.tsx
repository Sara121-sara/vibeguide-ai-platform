"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface ZPayButtonProps {
  amount: string;
  credits: number;
  planName: string;
  className?: string;
}

export function ZPayButton({ amount, credits, planName, className }: ZPayButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // 创建支付记录
      const paymentData = {
        userId: user.id,
        amount,
        credits,
      };

      const { createPaymentRecord } = await import('@/lib/actions/project-actions');
      const result = await createPaymentRecord(paymentData);
      
      if (!result.success) {
        alert(result.error);
        return;
      }
      
      const payment = result.payment;
      
      // 构造ZPay支付参数
      const zpayParams = {
        pid: process.env.NEXT_PUBLIC_ZPAY_PID,
        out_trade_no: payment.id,
        notify_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/zpay/callback`,
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`,
        name: `VibeGuide ${planName}`,
        money: amount,
        clientip: window.location.hostname,
        device: 'pc',
        param: JSON.stringify({ 
          userId: user.id, 
          credits,
          paymentId: payment.id 
        })
      };

      // 生成签名（这里需要根据ZPay文档实现签名算法）
      const sign = generateZPaySign(zpayParams);
      
      // 重定向到ZPay支付页面
      const zpayUrl = new URL('https://api.zpay.im/payment');
      Object.entries({ ...zpayParams, sign }).forEach(([key, value]) => {
        zpayUrl.searchParams.append(key, value as string);
      });
      
      window.location.href = zpayUrl.toString();
      
    } catch (error) {
      console.error('支付失败:', error);
      alert('支付失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment}
      disabled={loading}
      className={className}
    >
      {loading ? '处理中...' : `购买 ${planName}`}
    </Button>
  );
}

// 简化的签名生成函数（需要根据ZPay实际文档实现）
function generateZPaySign(params: Record<string, string | number>): string {
  // 这里应该根据ZPay的签名算法实现
  // 通常是将参数按字典序排列，拼接后用密钥做MD5或SHA1签名
  const sortedKeys = Object.keys(params).sort();
  // const signStr = sortedKeys
  //   .map(key => `${key}=${params[key]}`)
  //   .join('&') + process.env.NEXT_PUBLIC_ZPAY_PKEY;
  
  // 这里需要实际的签名实现，暂时返回一个占位符
  return 'placeholder_sign';
}