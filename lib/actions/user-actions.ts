"use server";

import { createClient } from '@/lib/supabase/server';
import { getUserById } from '@/lib/db/queries';

export async function getCurrentUserData() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: '用户未登录' };
    }

    const [userData] = await getUserById(user.id);
    
    return { 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        credits: userData?.credits || 0
      }
    };
  } catch (error) {
    console.error('获取用户数据失败:', error);
    return { success: false, error: '获取用户数据失败' };
  }
}