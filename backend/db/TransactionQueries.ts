import { PrismaClient } from "@prisma/client";
import type { TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

async function getTransactionByUserId(id: string) {
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
  });
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
  getUserIdByTransactionId,
  createTransaction,
  updateTransactionById,
  deleteTransactionById,
  getExpenseByCategory,

}