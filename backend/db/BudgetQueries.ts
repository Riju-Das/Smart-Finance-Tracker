import { PrismaClient, type BudgetPeriod } from "@prisma/client";

const prisma = new PrismaClient()

interface Budget {
  userId: string
  categoryId: string
  period: BudgetPeriod
  amount: number
  startDate: string,
  endDate?: string
}

async function createBudget(budget: Budget) {
  return await prisma.budget.create({
    data: {
      userId: budget.userId,
      categoryId: budget.categoryId,
      period: budget.period,
      amount: budget.amount,
      startDate: budget.startDate,
      endDate: budget.endDate,
    }
  })
}

async function getBudget(userId:string) {
  return await prisma.budget.findMany({
    where:{
      userId:userId
    }
  })
}

async function updateBudget(id:string ,budget: Budget){
  return await prisma.budget.update({
    where:{
      id:id
    },
    data:{
      categoryId: budget.categoryId,
      period: budget.period,
      amount: budget.amount,
      startDate: budget.startDate,
      endDate: budget.endDate,
    }
  })
}

async function deleteBudget(id:string){
  return await prisma.budget.delete({
    where:{
      id:id
    }
  })
}

export{
  createBudget,
  updateBudget,
  getBudget,
  deleteBudget
}