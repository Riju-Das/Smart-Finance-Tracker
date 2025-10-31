import * as db from "../db/BudgetQueries"
import { Request, Response } from "express"
import * as jwt from "jsonwebtoken"
import cron from "node-cron"
import { format } from "date-fns";


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

        const totalExpenseResult: any = await db.getTotalExpenseOfBudget(budget.userId, budget.startDate.toString(), budget.endDate.toString(), budget.categoryId) || { _sum: { amount: 0 } };
        const total = Number(totalExpenseResult._sum.amount) || 0
        const budgetPercentage = budget.amount > 0 ? Math.round((total / budget.amount) * 100) : 0;
        return {
          budget,
          totalExpense: total,
          budgetPercentage
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

    const { categoryId, period, amount } = req.body

    if (!categoryId) return res.status(400).json({ message: "categoryId is required" });
    if (!period) return res.status(400).json({ message: "period is required" });
    if (!amount) return res.status(400).json({ message: "amount is required" });

    let startDate: Date;
    let endDate: Date;
    const now = new Date();

    if (period === "MONTH") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1,);
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1)
    }
    else if (period === "YEAR") {
      startDate = new Date(now.getFullYear(), 0, 1,);
      endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    else if (period === "DAY") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(),);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1)
    }
    else if (period === "WEEK") {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(now.getFullYear(), now.getMonth(), diff,);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7)
    }
    else {
      return res.status(400).json({ message: "Invalid Period" })
    }

    const budget = await db.createBudget({ userId: user.id, categoryId, period, amount, startDate: new Date(startDate), endDate: new Date(endDate) })

    console.log(budget)

    return res.status(200).json(budget)
  }
  catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Error creating budget" })
  }
}

export async function updateBudget(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) return res.status(400).json({ message: "Unauthorized" });

    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "invalid id" })
    const { categoryId, period, amount } = req.body

    if (!categoryId) return res.status(400).json({ message: "categoryId is required" });
    if (!period) return res.status(400).json({ message: "period is required" });
    if (!amount) return res.status(400).json({ message: "amount is required" });


    const budgetUserId = await db.getUserIdByBudgetId(id)

    if (!budgetUserId || budgetUserId.userId !== user.id) {
      return res.status(400).json({ message: "Unauthorized" })
    }

    let startDate: Date;
    let endDate: Date;
    const now = new Date();

    if (period === "MONTH") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1)
    }
    else if (period === "YEAR") {
      startDate = new Date(now.getFullYear(), 0, 1,);
      endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    else if (period === "DAY") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1)
    }
    else if (period === "WEEK") {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(now.getFullYear(), now.getMonth(), diff);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7)
    }
    else {
      return res.status(400).json({ message: "Invalid Period" })
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


    const { id } = req.params;

    const { categoryId, period } = req.query

    if (!id) return res.status(400).json({ message: "invalid id" });

    if (!categoryId || typeof categoryId !== "string") return res.status(400).json({ message: "error deleting budget" });

    if (period !== "MONTH" && period !== "DAY" && period !== "WEEK" && period !== "YEAR") {
      return res.status(400).json({ message: "error deleting budget" });
    }


    const budgetUserId = await db.getUserIdByBudgetId(id)

    if (!budgetUserId || budgetUserId.userId !== user.id) {
      return res.status(400).json({ message: "Unauthorized" })
    }

    const budget = await db.deleteBudget(user.id, categoryId, period)

    return res.status(200).json(budget)

  }
  catch (err) {
    return res.status(500).json({ message: "Error deleting budget" })
  }
}


export async function totalBudgetAnalytics(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) return res.status(400).json({ message: "Unauthorized" });

    const { period } = req.query

    if (period !== "MONTH" && period !== "DAY" && period !== "WEEK" && period !== "YEAR") {
      return res.status(400).json({ message: "error fetching total budget analytics due to wrong period" });
    }

    const budgets = await db.getBudgets(user.id, period)

    const result = await db.getTotalBudgetAmount(user.id, period);

    const TotalBudgetAmount = Number(result._sum.amount) || 0;

    let totalExpense = 0;

    for (const budget of budgets) {
      const totalExpenseResult = await db.getTotalExpenseOfBudget(
        user.id, budget.startDate.toString(),
        budget.endDate.toString(),
        budget.categoryId);

      totalExpense += Number(totalExpenseResult._sum.amount) || 0
    }

    const TotalBudgetPercentage = TotalBudgetAmount > 0 ? Math.round((totalExpense / TotalBudgetAmount) * 100) : 0;

    res.status(200).json({
      TotalBudgetAmount,
      totalExpense,
      TotalBudgetPercentage
    })
  }
  catch (err) {
    return res.status(500).json({ message: "Error fetching total budget analytics" })
  }
}




export async function getAllBudgets(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) return res.status(400).json({ message: "Unauthorized" });


    const { period, categoryId } = req.query

    if (period !== "MONTH" && period !== "DAY" && period !== "WEEK" && period !== "YEAR") {
      return res.status(400).json({ message: "error fetching total budget analytics due to wrong period" });
    }

    if (!categoryId || typeof categoryId !== "string") {
      return res.status(400).json({ message: "error fetching category for the analytics" });
    }

    const result = await db.getAllBudgets(user.id, categoryId, period);

    const budgets = await Promise.all(
      result.map(async (budget) => {

        const totalExpenseResult: any = await db.getTotalExpenseOfBudget(
          budget.userId,
          budget.startDate.toString(),
          budget.endDate.toString(),
          budget.categoryId
        ) || { _sum: { amount: 0 } };

        const total = Number(totalExpenseResult._sum.amount) || 0
        const budgetPercentage = budget.amount > 0 ? Math.round((total / budget.amount) * 100) : 0;

        let date:string;
        const startDate = new Date(budget.startDate);

        switch (period) {
          case "DAY":
            date = format(startDate, "MMM dd, yyyy");
            break;
          case "WEEK":
            const endDate = new Date(budget.endDate);
            date = `${format(startDate, "MMM dd")} - ${format(endDate, "MMM dd")}`
            break;
          case "YEAR":
            date = format(startDate, "yyyy");
            break;
          case "MONTH":
            date = format(startDate, "MMM")
            break;
        }

        return {
          budget,
          totalExpense: total,
          budgetPercentage,
          date
        }
      })
    )

    return res.status(200).json(budgets)
  }
  catch (err) {
    return res.status(500).json({ message: "Error fetching All the budgets" })
  }
}


export function startBudgetCrons() {

  cron.schedule("55 1 1 * *", async () => {
    try {
      const monthlyBudgets = await db.getBudgetOfPeriod("MONTH");
      console.log(monthlyBudgets)
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(startDate)
      endDate.setMonth(endDate.getMonth() + 1)
      for (const budget of monthlyBudgets) {
        await db.createBudget({
          userId: budget.userId,
          categoryId: budget.categoryId,
          period: budget.period,
          amount: budget.amount,
          startDate: startDate,
          endDate: endDate
        })

        await db.cleanupOldBudgets(budget.userId, budget.categoryId, budget.period)

      }
    }
    catch (err) {
      console.log(err)
    }
  })

  cron.schedule("40 1 * * *", async () => {
    try {
      const dailyBudgets = await db.getBudgetOfPeriod("DAY");
      console.log("cron running")
      console.log(dailyBudgets)
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 1)
      console.log(startDate)

      for (const budget of dailyBudgets) {
        await db.createBudget({
          userId: budget.userId,
          categoryId: budget.categoryId,
          period: budget.period,
          amount: budget.amount,
          startDate: startDate,
          endDate: endDate
        })

        await db.cleanupOldBudgets(budget.userId, budget.categoryId, budget.period)

      }
    }
    catch (err) {
      console.log(err)
    }

  })

  cron.schedule("0 0 1 1 *", async () => {
    try {
      const yearlyBudgets = await db.getBudgetOfPeriod("YEAR");
      const now = new Date();
      const startDate = new Date(now.getFullYear(), 0, 1);
      const endDate = new Date(startDate)
      endDate.setFullYear(endDate.getFullYear() + 1)
      for (const budget of yearlyBudgets) {
        await db.createBudget({
          userId: budget.userId,
          categoryId: budget.categoryId,
          period: budget.period,
          amount: budget.amount,
          startDate: startDate,
          endDate: endDate
        })

        await db.cleanupOldBudgets(budget.userId, budget.categoryId, budget.period)

      }
    }
    catch (err) {
      console.log(err)
    }
  })


  cron.schedule("0 0 * * 1", async () => {
    try {
      const weeklyBudgets = await db.getBudgetOfPeriod("WEEK");
      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      const startDate = new Date(now.getFullYear(), now.getMonth(), diff);
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 7)
      for (const budget of weeklyBudgets) {
        await db.createBudget({
          userId: budget.userId,
          categoryId: budget.categoryId,
          period: budget.period,
          amount: budget.amount,
          startDate: startDate,
          endDate: endDate
        });

        await db.cleanupOldBudgets(budget.userId, budget.categoryId, budget.period)

      }
    }
    catch (err) {
      console.log(err)
    }

  });
}