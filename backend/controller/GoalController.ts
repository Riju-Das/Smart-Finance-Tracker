import * as db from "../db/GoalQueries"
import { Request, Response } from "express"
import * as jwt from "jsonwebtoken"
import { GoalStatus } from "@prisma/client"


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
    return res.status(500).json({ message: "Error fetching goals" })
  }
}

export async function createContribution(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ message: "Unauthorized" });
    const { goalId } = req.params;
    const { amount } = req.body

    if (!goalId) return res.status(400).json({ message: "goal not found" });
    if (!amount) return res.status(400).json({ message: "contribution amount not found" })

    const goal = await db.getGoalByGoalId(goalId)

    if (!goal) return res.status(400).json({ message: "contribution for this goal does not exist" })

    if (goal.status === "OVERDUE") return res.status(400).json({ message: "cannot add contribution as goal is overdue" })


    const contribution = await db.createContribution(goalId, amount);
    

    console.log(contribution);
    return res.status(201).json(contribution)
  }
  catch (err) {
    return res.status(500).json({ message: "Error fetching goals" })
  }
}

export async function updateGoal(req:AuthenticatedRequest, res:Response){
  try{
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ message: "Unauthorized" });
    const { id } = req.params;
    const { name, description, targetAmount, startDate, deadline } = req.body;

    if(!id) return res.status(400).json({message:"Goal id is required"})

    if (!name) return res.status(400).json({ message: "name is required" });
    if (!description) return res.status(400).json({ message: "goal description is required" });
    if (!targetAmount) return res.status(400).json({ message: "target Amount is required" });
    if (!startDate) return res.status(400).json({ message: "start date is required" });
    if (!deadline) return res.status(400).json({ message: "deadline is required" });

  }
  catch(err){
    return res.status(500).json({message:"Error updating goal"})
  }
}