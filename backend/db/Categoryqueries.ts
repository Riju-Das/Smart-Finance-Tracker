import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function getCategoryByUserId(id:string){
  return await prisma.category.findMany({
    where:{
      userId:id
    },
    orderBy:{
      date: 'desc'
    }
  })
}

async function getUserIdByCategoryById(id:string){
  return await prisma.category.findUnique({
    where:{
      id:id
    },
    select:{
      userId:true
    }
  })
}

async function createCategory(id:string,name:string){
  return await prisma.category.create({
    data:{
      name:name,
      userId:id
    }
  })
}

async function updateCategoryById(id:string ,name:string){
  return await prisma.category.update({
    where:{
      id:id
    },
    data:{
      name:name
    }
  })
}

async function deleteCategoryById(id:string){
  return await prisma.category.delete({
    where:{
      id:id
    }
  })
}

export {
  getCategoryByUserId,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  getUserIdByCategoryById
}