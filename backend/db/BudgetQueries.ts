import { PrismaClient, type BudgetPeriod } from "@prisma/client";


const prisma = new PrismaClient()

interface Budget {
  userId: string
  categoryId: string
  period: BudgetPeriod
  amount: number
  startDate: Date
  endDate: Date
}

async function createBudget(budget: Budget) {

  await prisma.budget.updateMany({
    where:{
      userId:budget.userId,
      categoryId:budget.categoryId,
      period:budget.period,
      active:true
    },
    data:{
      active:false
    }
  })

  return await prisma.budget.create({
    data: {
      userId: budget.userId,
      categoryId: budget.categoryId,
      period: budget.period,
      amount: budget.amount,
      startDate: budget.startDate,
      endDate: budget.endDate
    }
  })
}

async function getBudgets(userId:string) {
  return await prisma.budget.findMany({
    where:{
      userId:userId,
      active:true
    },
    orderBy:{
      startDate:"desc"
    },
    include:{
      category:true
    }
  })
}

async function getBudgetOfPeriod(period:BudgetPeriod){
  return await prisma.budget.findMany({
    where:{
      period:period
    }
  })
}

async function updateBudget(id:string,budget: Budget){
  return await prisma.budget.update({
    where:{
      id:id
    },
    data:{
      categoryId: budget.categoryId,
      period: budget.period,
      amount: budget.amount,
      startDate: budget.startDate,
      endDate: budget.endDate
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

async function getUserIdByBudgetId(id:string){
  return await prisma.budget.findUnique({
    where:{
      id:id
    },
    select:{
      userId:true
    }
  })
}

async function getTotalExpenseOfBudget(
  userId: string,
  categoryId: string,
  startDate:string,
  endDate:string

){
  return await prisma.transaction.aggregate({
    _sum:{
      amount:true
    },
    where:{
      userId: userId,
      categoryId: categoryId,
      date:{
        gte: new Date(startDate),
        lt: new Date(endDate)
      }
    }
  })
}


export{
  createBudget,
  updateBudget,
  getBudgets,
  deleteBudget,
  getUserIdByBudgetId,
  getTotalExpenseOfBudget,
  getBudgetOfPeriod,
}