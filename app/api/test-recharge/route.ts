import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateUserCredits, getUserById, createUser } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const credits = parseInt(searchParams.get('credits') || '0');
    
    if (credits <= 0) {
      return NextResponse.redirect(new URL('/pricing?error=invalid-credits', request.url));
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // 确保用户记录存在
    let [userData] = await getUserById(user.id);
    if (!userData) {
      [userData] = await createUser(user.id, user.email || '');
    }

    // 增加点数
    const newCredits = (userData.credits || 0) + credits;
    await updateUserCredits(user.id, newCredits);

    // 重定向到个人中心，显示充值成功
    return NextResponse.redirect(new URL('/my?success=recharge', request.url));
  } catch (error) {
    console.error('测试充值失败:', error);
    return NextResponse.redirect(new URL('/pricing?error=recharge-failed', request.url));
  }
}