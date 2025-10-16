import * as db from "../db/BudgetQueries"
import { Request, Response } from "express"
import * as jwt from "jsonwebtoken"


interface AuthenticatedRequest extends Request {
  user?: jwt.JwtPayload | undefined;
}



export async function getBudgets(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) return res.status(400).json({ message: "Unauthorized" });

    const result = await db.getBudgets(user.id);

    const budgets = await Promise.all(
      result.map(async (budget) => {
        const totalExpense = await db.getTotalExpenseOfBudget(budget.userId, budget.categoryId, budget.startDate.toISOString(), budget.endDate?.toISOString())
        return {
          budget,
          totalExpense
        }
      })
    )

    return res.status(200).json(budgets)
  }
  catch (err) {
    return res.status(500).json({ message: "Error fetching budgets" })
  }
}


export async function createBudget(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) return res.status(400).json({ message: "Unauthorized" });

    const { categoryId, period, amount, startDate, endDate } = req.body

    if (!categoryId) return res.status(400).json({ message: "categoryId is required" });
    if (!period) return res.status(400).json({ message: "period is required" });
    if (!amount) return res.status(400).json({ message: "amount is required" });
    if (!startDate) return res.status(400).json({ message: "start date is required" });

    const budget = await db.createBudget({ userId: user.id, categoryId, period, amount, startDate, endDate })

    return res.status(200).json(budget)
  }
  catch (err) {
    return res.status(500).json({ message: "Error creating budget" })
  }
}

export async function updateBudget(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) return res.status(400).json({ message: "Unauthorized" });

    const { id, categoryId, period, amount, startDate, endDate } = req.body

    if (!id) return res.status(400).json({ message: "Category update error" });
    if (!categoryId) return res.status(400).json({ message: "categoryId is required" });
    if (!period) return res.status(400).json({ message: "period is required" });
    if (!amount) return res.status(400).json({ message: "amount is required" });
    if (!startDate) return res.status(400).json({ message: "start date is required" });

    const budgetUserId = await db.getUserIdByBudgetId(id)

    if (budgetUserId !== user.id) {
      return res.status(400).json({ message: "Unauthorized" })
    }

    const budget = await db.updateBudget(id, { userId: user.id, categoryId, period, amount, startDate, endDate })

    return res.status(200).json(budget)
  }
  catch (err) {
    return res.status(500).json({ message: "Error updating budget" })
  }
}

export async function deleteBudget(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) return res.status(400).json({ message: "Unauthorized" });

    const { id } = req.body;

    const budgetUserId = await db.getUserIdByBudgetId(id)

    if (budgetUserId !== user.id) {
      return res.status(400).json({ message: "Unauthorized" })
    }

    const budget = await db.deleteBudget(id)

    return res.status(200).json(budget)

  }
  catch (err) {
    return res.status(500).json({ message: "Error deleting budget" })
  }
}