const { PrismaClient } = require('../generated/prisma')

const prisma = new PrismaClient()

async function getCategoryByUserId(id){
  return await prisma.category.findMany({
    where:{
      userId:id
    },
    orderBy:{
      date: 'desc'
    }
  })
}

async function getUserIdByCategoryById(id){
  return await prisma.category.findUnique({
    where:{
      id:id
    },
    select:{
      userId:true
    }
  })
}

async function createCategory(id,name){
  return await prisma.category.create({
    data:{
      name:name,
      userId:id
    }
  })
}

async function updateCategoryById(id,name){
  return await prisma.category.update({
    where:{
      id:id
    },
    data:{
      name:name
    }
  })
}

async function deleteCategoryById(id){
  return await prisma.category.delete({
    where:{
      id:id
    }
  })
}

module.exports = {
  getCategoryByUserId,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  getUserIdByCategoryById
}