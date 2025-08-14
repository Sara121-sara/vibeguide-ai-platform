import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICE_PLANS } from '@/lib/stripe/config';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { planId, userId, userEmail } = await request.json();

    if (!planId || !userId || !userEmail) {
      return NextResponse.json(
        { error: '缺少必要的参数' },
        { status: 400 }
      );
    }

    // 验证用户身份
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || user.id !== userId) {
      return NextResponse.json(
        { error: '用户身份验证失败' },
        { status: 401 }
      );
    }

    // 获取价格配置
    const plan = PRICE_PLANS[planId as keyof typeof PRICE_PLANS];
    if (!plan) {
      return NextResponse.json(
        { error: '无效的套餐' },
        { status: 400 }
      );
    }

    // 创建Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment', // 一次性付费，不是订阅
      payment_method_types: ['card'],
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: 'cny',
            product_data: {
              name: `VibeGuide ${plan.name}`,
              description: `${plan.credits}个项目点数 - ${plan.description}`,
              images: [], // 可以添加产品图片URL
            },
            unit_amount: plan.amount, // 以分为单位
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?canceled=true`,
      metadata: {
        userId,
        planId,
        credits: plan.credits.toString(),
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('创建Stripe Checkout Session失败:', error);
    return NextResponse.json(
      { error: '创建支付会话失败' },
      { status: 500 }
    );
  }
}