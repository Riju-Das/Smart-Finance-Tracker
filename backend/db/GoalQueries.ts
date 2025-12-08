import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient()



export async function createGoals(
  userId: string,
  name: string,
  description: string,
  targetAmount: number,
  startDate: Date,
  deadline: Date,
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE"
) {
  return await prisma.goal.create({
    data: {
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

export async function updateGoals(
  userId: string,
  goalId:string,
  name?: string,
  description?: string,
  targetAmount?: number,
  startDate?: Date,
  deadline?: Date,
  status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE"
) {
  return await prisma.goal.update({
    where:{
      userId:userId,
      id: goalId
    },
    data: {
      name,
      description,
      targetAmount,
      startDate,
      deadline,
      status
    }
  })
}

export async function updateGoalStatus(goalId:string, status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE"){
  return await prisma.goal.update({
    where:{
      id:goalId
    },
    data:{
      status:status
    }
  })
}

export async function createContribution(
  goalId: string,
  amount: number,

) {
  return await prisma.$transaction(async (tx)=>{
    const newContribution = await tx.contribution.create({
      data: {
        goalId,
        amount,
      }
    });
    const totalContribution = await tx.contribution.aggregate({
      where: {
        goalId: goalId
      },
      _sum: {
        amount: true
      }
    });
  
    if (totalContribution._sum.amount) {
      await tx.goal.update({
        where: {
          id: goalId
        },
        data: {
          currentAmount: totalContribution._sum.amount
        }
      })
    }
    return newContribution;
  })
}

export async function getGoalsByUserId(userId: string) {
  return await prisma.goal.findMany({
    where: {
      userId: userId
    }
  })
}

export async function getGoalByGoalId(id: string, userId:string) {
  return await prisma.goal.findUnique({
    where: {
      id: id,
      userId:userId
    }
  })
}

export async function getAllGoals() {
  return await prisma.goal.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function deleteGoalById(id:string, userId:string){
  return await prisma.goal.delete({
    where:{
      id:id,
      userId:userId
    }
  })
}