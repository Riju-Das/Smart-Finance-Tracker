import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();


const DEFAULT_CATEGORIES = [

  { name: "Food & Dining", color: "#FF6B6B" },
  { name: "Transportation", color: "#4ECDC4" },
  { name: "Housing", color: "#45B7D1" },
  { name: "Shopping", color: "#FFA07A" },
  { name: "Healthcare", color: "#98D8C8" },
  { name: "Entertainment", color: "#F7DC6F" },
  { name: "Education", color: "#BB8FCE" },
  { name: "Bills & Utilities", color: "#85C1E2" },
  { name: "Travel", color: "#F8B739" },

  { name: "Salary", color: "#52B788" },
  { name: "Freelance", color: "#74C69D" },
  { name: "Other Income", color: "#95D5B2" },
];

async function createUser(username: string, fullname: string, email: string, password: string) {
  const user= await prisma.user.create({
    data: {
      username,
      fullname,
      email,
      password
    }
  });

  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES.map(cat=>({
      name:cat.name,
      color: cat.color,
      userId: user.id 
    }))
  });
  return user;
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