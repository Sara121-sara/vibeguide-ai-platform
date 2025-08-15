import { createUser, getUserById } from '@/lib/db/queries';

export async function ensureUserExists(supabaseUser: { id: string; email?: string }) {
  if (!supabaseUser) return null;

  try {
    // 先检查用户是否已存在
    const existingUsers = await getUserById(supabaseUser.id);
    
    if (existingUsers.length > 0) {
      return existingUsers[0];
    }

    // 如果不存在，创建新用户记录
    const newUsers = await createUser(supabaseUser.id, supabaseUser.email);
    return newUsers[0];
  } catch (error) {
    console.error('Failed to ensure user exists:', error);
    return null;
  }
}