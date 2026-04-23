import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function initDb() {
  // Ensure database is synced
}

export async function getSettings(userId: string) {
  return await prisma.setting.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
}

export async function saveSettings(userId: string, data: {
  game: string;
  dpi: number;
  sensitivity: number;
  edpi: number;
  cm360: number;
  mouseGrip?: string;
  aimStyle?: string;
  isCurrent?: boolean;
}) {
  if (data.isCurrent) {
    await prisma.setting.updateMany({
      where: { userId, game: data.game },
      data: { isCurrent: false },
    });
  }

  return await prisma.setting.create({
    data: {
      userId,
      game: data.game,
      dpi: data.dpi,
      sensitivity: data.sensitivity,
      edpi: data.edpi,
      cm360: data.cm360,
      mouseGrip: data.mouseGrip,
      aimStyle: data.aimStyle,
      isCurrent: data.isCurrent ?? false,
    },
  });
}

export async function getHistory(userId: string) {
  return await prisma.history.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

export async function addHistory(userId: string, data: {
  game: string;
  dpi: number;
  sensitivity: number;
  edpi: number;
  cm360: number;
}) {
  return await prisma.history.create({
    data: {
      userId,
      game: data.game,
      dpi: data.dpi,
      sensitivity: data.sensitivity,
      edpi: data.edpi,
      cm360: data.cm360,
    },
  });
}

export async function getOrCreateUser(id: string, email?: string | null, name?: string | null, image?: string | null) {
  let user = await prisma.user.findUnique({ where: { id } });
  
  if (!user) {
    user = await prisma.user.create({
      data: { id, email, name },
    });
  }
  
  return user;
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({ where: { id } });
}