import { PrismaClient } from "@prisma/client";
import type { TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

async function getTransactionByUserId(id: string, page: number = 1, limit: number = 25) {
  
  const skipPage = (page-1)*limit;

  const [transactions,total] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        userId: id
      },

      skip:skipPage,
      take:limit,

      orderBy: {
        date: 'desc'
      },
      include: {
        category: true,
        user: true
      }
    }),
    prisma.transaction.count({
      where: {
        userId: id
      }
    })
  ])

  return {
    transactions,
    pagination:{
      currentPage: page,
      pageSize:limit,
      totalRecords:total,
      totalPages: Math.ceil(total/limit),
      hasNextPage: page< Math.ceil(total/limit),
      hasPreviousPage: page > 1
    }
  }
}

async function getUserIdByTransactionId(id: string) {
  return await prisma.transaction.findUnique({
    where: {
      id: id
    },
    select: {
      userId: true
    }
  });
}

async function getAllTransactionByUserId(id: string){
  return await prisma.transaction.findMany({
    where: {
      userId: id
    },

    orderBy: {
      date: 'desc'
    },
    include: {
      category: true,
      user: true
    }
  })
}

async function createTransaction(
  userId: string,
  categoryId: string,
  type: TransactionType,
  amount: number,
  description: string,
  date: string | Date
) {
  return await prisma.transaction.create({
    data: {
      userId: userId,
      categoryId: categoryId,
      type: type,
      amount: amount,
      description: description,
      date: new Date(date)
    }
  });
}

async function updateTransactionById(
  id: string,
  userId: string,
  categoryId: string,
  type: TransactionType,
  amount: number,
  description: string,
  date: string | Date
) {
  return await prisma.transaction.update({
    where: {
      id: id
    },
    data: {
      userId: userId,
      categoryId: categoryId,
      type: type,
      amount: amount,
      description: description,
      date: new Date(date)
    }
  });
}

async function deleteTransactionById(id: string) {
  return await prisma.transaction.delete({
    where: {
      id: id
    }
  });
}

async function getExpenseByCategory(userId: string) {
  return await prisma.transaction.groupBy({
    by: ['categoryId'],
    where: {
      userId: userId,
      type: 'EXPENSE'
    },
    _sum: {
      amount: true
    }
  })
}



export {
  getTransactionByUserId,
  getAllTransactionByUserId,
  getUserIdByTransactionId,
  createTransaction,
  updateTransactionById,
  deleteTransactionById,
  getExpenseByCategory,

}