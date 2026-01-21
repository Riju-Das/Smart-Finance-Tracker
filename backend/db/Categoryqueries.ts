import prisma from "./prisma";

async function getCategoryByUserId(id: string) {
  return await prisma.category.findMany({
    where: {
      userId: id
    },
    orderBy: {
      date: 'desc'
    }
  })
}

async function getUserIdByCategoryById(id: string) {
  return await prisma.category.findUnique({
    where: {
      id: id
    },
    select: {
      userId: true
    }
  })
}

async function createCategory(id: string, name: string, color: string) {
  return await prisma.category.create({
    data: {
      name: name,
      userId: id,
      color: color
    }
  })
}

async function updateCategoryById(id: string, name: string, color: string) {
  return await prisma.category.update({
    where: {
      id: id
    },
    data: {
      name: name,
      color: color
    }
  })
}

async function deleteCategoryById(id: string) {
  return await prisma.category.delete({
    where: {
      id: id
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