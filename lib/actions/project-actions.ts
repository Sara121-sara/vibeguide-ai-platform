"use server";

import { createClient } from '@/lib/supabase/server';
import { 
  createProject, 
  updateProject, 
  getUserById, 
  updateUserCredits,
  getUserProjects,
  getProjectById
} from '@/lib/db/queries';
import { generateQuestions, generateDocuments } from '@/lib/ai/document-generator';
// import { redirect } from 'next/navigation';

export async function generateAIQuestions(projectDescription: string) {
  try {
    const questions = await generateQuestions(projectDescription);
    return { success: true, questions };
  } catch (error) {
    console.error('生成问题失败:', error);
    return { success: false, error: 'AI服务暂时不可用，请稍后重试' };
  }
}

export async function checkUserCredits() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: '用户未登录' };
    }

    // 确保用户记录存在
    let [userData] = await getUserById(user.id);
    if (!userData) {
      const { createUser } = await import('@/lib/db/queries');
      [userData] = await createUser(user.id, user.email || '');
    }

    if (userData.credits < 1) {
      return { success: false, error: '点数不足', needsRecharge: true };
    }

    return { success: true, credits: userData.credits };
  } catch (error) {
    console.error('检查点数失败:', error);
    return { success: false, error: '检查点数失败' };
  }
}

export async function generateAIDocuments(step1Data: string, step2Data: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: '用户未登录' };
    }

    // 确保用户记录存在并检查点数
    let [userData] = await getUserById(user.id);
    if (!userData) {
      const { createUser } = await import('@/lib/db/queries');
      [userData] = await createUser(user.id, user.email || '');
    }

    if (userData.credits < 1) {
      return { success: false, error: '点数不足' };
    }

    // 生成文档
    const documents = await generateDocuments(step1Data, step2Data);

    // 扣除点数
    await updateUserCredits(user.id, userData.credits - 1);

    return { success: true, documents };
  } catch (error: any) {
    console.error('生成文档失败:', error);
    
    // 检查是否是OpenRouter点数不足
    if (error.message === 'OPENROUTER_CREDITS_INSUFFICIENT') {
      return { 
        success: false, 
        error: 'OpenRouter API点数不足，请先充值OpenRouter账户', 
        needsOpenRouterRecharge: true 
      };
    }
    
    return { success: false, error: 'AI服务暂时不可用，请稍后重试' };
  }
}

export async function saveProject(projectData: {
  title: string;
  description: string;
  step1Data: string;
  step2Data: string;
  documents: any;
  projectId?: string;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: '用户未登录' };
    }

    const projectPayload = {
      userId: user.id,
      title: projectData.title || "未命名项目",
      description: projectData.description || projectData.step1Data.slice(0, 100),
      step1Data: projectData.step1Data,
      step2Data: projectData.step2Data,
      documents: projectData.documents,
      status: "completed" as const,
    };

    let savedProject;
    if (projectData.projectId) {
      // 更新现有项目
      const updated = await updateProject(projectData.projectId, projectPayload);
      savedProject = updated[0];
    } else {
      // 创建新项目
      const created = await createProject(projectPayload);
      savedProject = created[0];
    }

    return { success: true, project: savedProject };
  } catch (error) {
    console.error('保存项目失败:', error);
    return { success: false, error: '保存项目失败，请重试' };
  }
}

export async function getCurrentUserProjects() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: '用户未登录' };
    }

    // 确保用户记录存在
    let [userData] = await getUserById(user.id);
    if (!userData) {
      const { createUser } = await import('@/lib/db/queries');
      [userData] = await createUser(user.id, user.email || '');
    }

    const projects = await getUserProjects(user.id);
    return { success: true, projects };
  } catch (error) {
    console.error('获取项目列表失败:', error);
    return { success: false, error: '获取项目列表失败' };
  }
}

export async function getProjectDetails(projectId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: '用户未登录' };
    }

    const [project] = await getProjectById(projectId);
    
    if (!project || project.userId !== user.id) {
      return { success: false, error: '项目不存在或无权限访问' };
    }

    return { success: true, project };
  } catch (error) {
    console.error('获取项目详情失败:', error);
    return { success: false, error: '获取项目详情失败' };
  }
}

export async function createPaymentRecord(paymentData: {
  userId: string;
  amount: string;
  credits: number;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || user.id !== paymentData.userId) {
      return { success: false, error: '用户未登录或权限不匹配' };
    }

    // 确保用户记录存在
    const { createUser, createPayment } = await import('@/lib/db/queries');
    
    // 检查用户是否存在，如果不存在则创建
    const [existingUser] = await getUserById(user.id);
    if (!existingUser) {
      await createUser(user.id, user.email || '');
    }

    const [payment] = await createPayment(paymentData);

    return { success: true, payment };
  } catch (error) {
    console.error('创建支付记录失败:', error);
    return { success: false, error: '创建支付记录失败' };
  }
}