import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20', // Use the latest API version
  typescript: true,
});

export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  secretKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
};

// 价格配置
export const PRICE_PLANS = {
  starter: {
    name: '入门套餐',
    amount: 100, // ¥1.00 in cents
    credits: 2,
    description: '适合初次体验用户',
  },
  pro: {
    name: '专业套餐',
    amount: 500, // ¥5.00 in cents
    credits: 12,
    description: '最受欢迎的选择',
  },
} as const;