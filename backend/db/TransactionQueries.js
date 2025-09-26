const { PrismaClient } = require('../generated/prisma')

const prisma = new PrismaClient()

async function getTransactionByUserId(id){
  return await prisma.transaction.findMany({
    where:{
      userId:id
    },
    orderBy:{
      date: 'desc'
    },
    include:{
      category:true,
      user:true
    }
  })
}

async function getUserIdByTransactionId(id){
  return await prisma.transaction.findUnique({
    where:{
      id:id
    },
    select:{
      userId:true
    }
  })
}

async function createTransaction(userId, categoryId , type, amount , description , date ){
  return await prisma.transaction.create({
    data:{
      userId:userId,
      categoryId: categoryId,
      type: type,
      amount:amount,
      description:description,
      date: date
    }
  })
}

async function updateTransactionById(id, userId, categoryId , type, amount , description ,date ){
  return await prisma.transaction.update({
    where:{
      id:id
    },
    data:{
      userId:userId,
      categoryId: categoryId,
      type: type,
      amount:amount,
      description:description,
      date:date
    }
  })
}

async function deleteTransactionById(id){
  return await prisma.transaction.delete({
    where:{
      id:id
    }
  })
}

module.exports = {
  getTransactionByUserId,
  getUserIdByTransactionId,
  createTransaction,
  updateTransactionById,
  deleteTransactionById
}