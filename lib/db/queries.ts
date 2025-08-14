import { eq } from 'drizzle-orm';
import { db } from './index';
import { users, projects, payments } from './schema';

export async function createUser(id: string, email: string) {
  return await db.insert(users).values({
    id,
    email,
    credits: 2, // 新用户赠送2个免费点数
  }).returning();
}

export async function getUserById(id: string) {
  return await db.select().from(users).where(eq(users.id, id)).limit(1);
}

export async function getUserByEmail(email: string) {
  return await db.select().from(users).where(eq(users.email, email)).limit(1);
}

export async function updateUserCredits(userId: string, credits: number) {
  return await db.update(users)
    .set({ 
      credits,
      updatedAt: new Date()
    })
    .where(eq(users.id, userId))
    .returning();
}

export async function getUserProjects(userId: string) {
  return await db.select().from(projects).where(eq(projects.userId, userId));
}

export async function createProject(data: {
  userId: string;
  title: string;
  description: string;
  step1Data?: string;
  step2Data?: string;
  requirements?: string;
  documents?: any;
}) {
  return await db.insert(projects).values(data).returning();
}

export async function getProjectById(id: string) {
  return await db.select().from(projects).where(eq(projects.id, id)).limit(1);
}

export async function updateProject(id: string, data: Partial<{
  title: string;
  description: string;
  step1Data: string;
  step2Data: string;
  requirements: string;
  documents: any;
  status: string;
}>) {
  return await db.update(projects)
    .set({ 
      ...data,
      updatedAt: new Date()
    })
    .where(eq(projects.id, id))
    .returning();
}

export async function createPayment(data: {
  userId: string;
  amount: string;
  credits: number;
  zpayOrderId?: string;
}) {
  return await db.insert(payments).values(data).returning();
}

export async function updatePaymentStatus(zpayOrderId: string, status: string) {
  return await db.update(payments)
    .set({ 
      status,
      updatedAt: new Date()
    })
    .where(eq(payments.zpayOrderId, zpayOrderId))
    .returning();
}