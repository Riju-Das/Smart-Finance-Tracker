import * as db from "../db/Categoryqueries"
import type { Request, Response } from "express";
import * as jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request{
  user?:  jwt.JwtPayload | undefined;
}


async function getCategoriesByUserId(req:AuthenticatedRequest, res:Response) {
  try {
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ message: "Unauthorized" })
    const categories = await db.getCategoryByUserId(user.id)
    return res.status(200).json(categories)
  }
  catch (err) {
    return res.status(500).json({ message: "Couldn't fetch the categories" })
  }
}

async function createCategory(req:AuthenticatedRequest, res:Response) {
  try {
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ message: "Unauthorized" });

    const { name , color } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }
    
    if (!color || typeof color !== "string" || !color.trim()) {
      return res.status(400).json({ message: "Category color is required" });
    }
    const category = await db.createCategory(user.id, name.trim(), color.trim())
    return res.status(201).json(category)
  }
  catch (err) {
    return res.status(500).json({ message: "Couldn't create the category" })
  }
}

async function updateCategoryById(req:AuthenticatedRequest, res:Response) {
  try {
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Category id required" })
    }

    const { name,color } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Category name is required for update" })
    }
    if (!color || typeof color !== "string" || !color.trim()) {
      return res.status(400).json({ message: "Category color is required" });
    }

    const CategoryUserId = await db.getUserIdByCategoryById(id)

    if (!CategoryUserId || user.id !== CategoryUserId.userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const category = await db.updateCategoryById(id, name.trim(),color.trim())
    return res.status(200).json(category)
  }
  catch (err:any) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(500).json({ message: "Couldn't update the category" })
  }
}

async function deleteCategoryById(req:AuthenticatedRequest, res:Response) {
  try {
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Category id required" })
    }

    const CategoryUserId = await db.getUserIdByCategoryById(id)

    if (!CategoryUserId || user.id !== CategoryUserId.userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const category = await db.deleteCategoryById(id);
    return res.status(200).json(category)
  }
  catch (err:any) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(500).json({ message: "Couldn't delete the category" })
  }
}

export{
  getCategoriesByUserId,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
}