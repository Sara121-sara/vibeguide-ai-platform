import { NextRequest, NextResponse } from 'next/server';
import { updatePaymentStatus, updateUserCredits, getUserById } from '@/lib/db/queries';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    
    // 验证ZPay回调签名
    const isValidSign = verifyZPaySign(data);
    if (!isValidSign) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    
    const {
      out_trade_no: paymentId,
      trade_status,
      param
    } = data;
    
    if (trade_status === 'TRADE_SUCCESS') {
      // 解析参数
      const paramData = JSON.parse(param as string);
      const { userId, credits } = paramData;
      
      // 更新支付状态
      await updatePaymentStatus(paymentId as string, 'completed');
      
      // 获取用户当前点数
      const [user] = await getUserById(userId);
      if (user) {
        // 增加用户点数
        await updateUserCredits(userId, user.credits + credits);
      }
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Payment not successful' }, { status: 400 });
    
  } catch (error) {
    console.error('ZPay callback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function verifyZPaySign(data: Record<string, any>): boolean {
  // 实现ZPay签名验证逻辑
  // 这里需要根据ZPay文档实现具体的验证算法
  return true; // 暂时返回true，需要实际实现
}