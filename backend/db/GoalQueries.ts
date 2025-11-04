import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface goals {
  userId: string
  name: string
  description: string
  targetAmount: number
  startDate: Date
  deadline: Date
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE"
}

interface contribution{
  goalId:string,
  amount: number,
  date: Date
}

export async function createGoals(
  userId: string,
  name: string,
  description: string,
  targetAmount: number,
  startDate:Date,
  deadline: Date,
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE"
) {
  return await prisma.goal.create({
    data:{
      userId,
      name,
      description,
      targetAmount,
      startDate,
      deadline,
      status
    }
  })
}

export async function createContribution(
  goalId:string,
  amount: number,
  date: Date
){
  return await prisma.contribution.create({
    data:{
      goalId,
      amount,
      date
    }
  })
}

export async function getGoals(userId:string){
  return await prisma.goal.findMany({
    where:{
      userId:userId
    }
  })
}

export async function totalContributionOfAGoal(goalId:string){
  return await prisma.contribution.aggregate({
    where:{
      goalId:goalId
    },
    _sum:{
      amount:true
    }
  })
}