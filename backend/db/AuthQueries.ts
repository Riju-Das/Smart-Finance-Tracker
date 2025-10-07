import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function createUser(username: string, fullname: string, email: string, password: string) {
  return await prisma.user.create({
    data: {
      username,
      fullname,
      email,
      password
    }
  });
}

async function findUserByUsername(username: string) {
  return await prisma.user.findUnique({
    where: {
      username
    }
  });
}

async function saveRefreshToken(userId: string, token: string) {
  return prisma.user.update({
    where: {
      id: userId
    },
    data: {
      refreshTokens: { push: token }
    }
  });
}

async function removeRefreshToken(userId: string, token: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      refreshTokens: true
    }
  });
  if (!user) return null;

  const filtered = user.refreshTokens.filter((t: string) => t !== token);

  return await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      refreshTokens: filtered
    }
  });
}

async function findUserByRefreshToken(token: string) {
  return await prisma.user.findFirst({
    where: {
      refreshTokens: {
        has: token
      }
    }
  });
}

export{
  createUser,
  findUserByUsername,
  saveRefreshToken,
  removeRefreshToken,
  findUserByRefreshToken
}