import * as db from "../db/GoalQueries"
import { Request, Response } from "express"
import * as jwt from "jsonwebtoken"
import { GoalStatus } from "@prisma/client"
import cron from "node-cron"


interface AuthenticatedRequest extends Request {
  user?: jwt.JwtPayload | undefined;
}

export async function createGoal(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ message: "Unauthorized" });

    const { name, description, targetAmount, startDate, deadline } = req.body;

    if (!name) return res.status(400).json({ message: "name is required" });
    if (!description) return res.status(400).json({ message: "goal description is required" });
    if (!targetAmount) return res.status(400).json({ message: "target Amount is required" });
    if (!startDate) return res.status(400).json({ message: "start date is required" });
    if (!deadline) return res.status(400).json({ message: "deadline is required" });

    let status: GoalStatus;

    if (new Date() > new Date(startDate)) {
      status = "IN_PROGRESS"
    }
    else if (new Date() < new Date(startDate)) {
      status = "NOT_STARTED"
    }
    else {
      return res.status(400).json({ message: "Error setting up goal status" })
    }
    const goal = await db.createGoals(user.id, name, description, targetAmount, startDate, deadline, status)

    console.log(goal);

    return res.status(201).json(goal)
  }
  catch (err) {
    return res.status(500).json({ message: "Error creating goals" })
  }
}

export async function createContribution(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ message: "Unauthorized" });
    const { id } = req.params;
    const { amount } = req.body

    if (!id) return res.status(400).json({ message: "goal not found" });
    if (!amount) return res.status(400).json({ message: "contribution amount not found" })

    let goal = await db.getGoalByGoalId(id, user.id)

    if (!goal) return res.status(400).json({ message: "contribution for this goal does not exist" })

    if (goal.status === "OVERDUE") return res.status(400).json({ message: "cannot add contribution as goal is overdue" })


    const contribution = await db.createContribution(id, amount);

    goal = await db.getGoalByGoalId(id, user.id);

    if (goal && goal?.currentAmount >= goal?.targetAmount) {
      const status: GoalStatus = "COMPLETED";
      await db.updateGoalStatus(goal.id, status);
    }


    console.log(contribution);
    return res.status(201).json(contribution)
  }
  catch (err) {
    return res.status(500).json({ message: "Error creating contribution" })
  }
}

export async function updateGoal(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ message: "Unauthorized" });
    const { id } = req.params;
    const { name, description, targetAmount, startDate, deadline } = req.body;

    if (!id) return res.status(400).json({ message: "Goal id is required" })

    if (!name) return res.status(400).json({ message: "name is required" });
    if (!description) return res.status(400).json({ message: "goal description is required" });
    if (!targetAmount) return res.status(400).json({ message: "target Amount is required" });
    if (!startDate) return res.status(400).json({ message: "start date is required" });
    if (!deadline) return res.status(400).json({ message: "deadline is required" });

    const goalTobeUpdated = await db.getGoalByGoalId(id, user.id);

    if (!goalTobeUpdated) return res.status(400).json({ message: "Goal not found that has to be updated" })

    let status: GoalStatus;

    if (new Date() > new Date(startDate) && new Date() <= new Date(deadline)) {
      if (goalTobeUpdated?.currentAmount >= targetAmount) {
        status = "COMPLETED";
      }
      else {
        status = "IN_PROGRESS";
      }
    }
    else if (new Date() < new Date(startDate) && new Date() <= new Date(deadline)) {
      status = "NOT_STARTED"
    }
    else if (new Date() > new Date(deadline)) {
      status = "OVERDUE"
    }
    else {
      return res.status(400).json({ message: "Couldnt update status of ur goal" })
    }

    await db.updateGoals(user.id, id, name, description, targetAmount, startDate, deadline, status);

    return res.status(200).json({ message: "Goal updated successfully" })


  }
  catch (err) {
    return res.status(500).json({ message: "Error updating goal" })
  }
}

export async function getGoals(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ message: "Unauthorized" });

    const goals = await db.getGoalsByUserId(user.id);

    return res.status(200).json(goals);

  }
  catch (err) {
    return res.status(500).json({ message: "Error fetching goals" })
  }

}

export async function deleteGoalsById(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;

    if (!id) return res.status(400).json("Couldnot find the goal id to delete");

    await db.deleteGoalById(id, user.id);

    return res.status(200).json({ message: "Goal deleted successfully" })

  }
  catch (err) {
    return res.status(500).json({ message: "Goal could not be deleted" })
  }
}

export function startGoalCron() {
  cron.schedule("25 1 * * *", async () => {
    try {
      
      const currentDate = new Date();
      const goals = await db.getAllGoals();
      await Promise.all(
        goals.map(async (goal) => {
          if (currentDate > goal.deadline && goal.status !== "COMPLETED" && goal.status !== "OVERDUE") {
            await db.updateGoalStatus(goal.id, "OVERDUE")
          }
        })
      )
      console.log("cron job for goals completed")
    }
    catch (err) {
      console.log("Goal cron error: ",err);
    }
  })
}