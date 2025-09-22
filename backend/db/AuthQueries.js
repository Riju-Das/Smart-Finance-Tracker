const { PrismaClient } = require('../generated/prisma')

const prisma = new PrismaClient()

async function createUser(username, fullname, email, password) {
  return await prisma.user.create({
    data: {
      username: username,
      fullname: fullname,
      email: email,
      password: password
    }
  })
}

async function findUserByUsername(username) {
  return await prisma.user.findUnique({
    where: {
      username: username
    }
  })
}

async function saveRefreshToken(userId, token) {
  return prisma.user.update({
    where: {
      id: userId
    },
    data: {
      refreshTokens: { push: token }
    }
  })
}

async function removeRefreshToken(userId, token) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      refreshTokens: true
    }
  })
  if (!user) return null;

  const filtered = user.refreshTokens.filter(t => t !== token);

  return await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      refreshTokens: filtered
    }
  })

}

async function findUserByRefreshToken(token) {
  return await prisma.user.findFirst({
      where: {
          refreshTokens: {
              has: token  
          }
      }
  });
}

module.exports = {
  createUser,
  findUserByUsername,
  saveRefreshToken,
  removeRefreshToken,
  findUserByRefreshToken
}