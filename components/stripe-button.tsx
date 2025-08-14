"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

interface StripeButtonProps {
  amount: string;
  credits: number;
  planName: string;
  planId: string;
  className?: string;
}

export function StripeButton({ amount, credits, planName, planId, className }: StripeButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 如果Stripe未配置，显示配置提示
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes('你的Stripe')) {
    return (
      <Button disabled className={className} variant="outline">
        请配置Stripe支付
      </Button>
    );
  }

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.log('No user session found, redirecting to login');
        router.push('/auth/login');
        return;
      }
      
      const user = session.user;

      // 创建Stripe Checkout Session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      // 重定向到Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        throw error;
      }
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