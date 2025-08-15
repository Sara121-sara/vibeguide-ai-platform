import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { updateUserCredits, getUserById, createUser } from '@/lib/db/queries';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Missing webhook signature or secret');
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id);
        break;
      
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: { metadata: any; customer_email?: string }) {
  const { userId, planId, credits } = session.metadata;

  if (!userId || !credits) {
    console.error('Missing required metadata in session:', session.metadata);
    return;
  }

  try {
    // 确保用户记录存在
    let [userData] = await getUserById(userId);
    if (!userData) {
      // 如果用户不存在，创建用户记录（这种情况不应该发生，但作为安全措施）
      console.log(`Creating user record for ${userId}`);
      [userData] = await createUser(userId, session.customer_email || '');
    }

    // 添加点数
    const newCredits = (userData.credits || 0) + parseInt(credits);
    await updateUserCredits(userId, newCredits);

    console.log(`Added ${credits} credits to user ${userId}. New balance: ${newCredits}`);

    // 这里可以添加额外的逻辑，比如：
    // - 发送确认邮件
    // - 记录交易日志
    // - 触发其他业务逻辑
    
  } catch (error) {
    console.error('Error updating user credits:', error);
    throw error;
  }
}