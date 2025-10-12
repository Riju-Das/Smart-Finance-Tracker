import * as db from "../db/TransactionQueries"
import type { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import type { Transaction } from "@prisma/client";
import * as dbCategory from '../db/Categoryqueries'
import {format} from "date-fns"
import { IncomingMessage } from "http";

interface AuthenticatedRequest extends Request {
  user?: jwt.JwtPayload | undefined;
}

async function getTransactionByUserId(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ message: "Unauthorized" })
    const transaction = await db.getTransactionByUserId(user.id)
    return res.status(200).json(transaction)
  }
  catch (err) {
    return res.status(500).json({ message: "Couldn't fetch the transactions" })
  }
}

async function createTransaction(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ message: "Unauthorized" });

    const { categoryId, type, amount, description, date } = req.body;

    if (!categoryId) {
      return res.status(400).json({ message: "Category id required" })
    }

    if (!type || (type !== "INCOME" && type !== "EXPENSE")) {
      return res.status(400).json({ message: "Transaction type is required" });
    }

    if (amount === undefined || amount === null || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: "Transaction amount must be a positive number" });
    }

    if (!description || typeof description !== "string") {
      return res.status(400).json({ message: "Proper description is required" });
    }

    if (date && (isNaN(Date.parse(date)))) {
      return res.status(400).json({ message: "Invalid date format" });
    }
    console.log({
      userId: user.id,
      categoryId,
      type,
      amount,
      description,
      date
    });
    const transaction = await db.createTransaction(user.id, categoryId, type, Number(amount), description, date)
    return res.status(201).json(transaction)
  }
  catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Couldn't create transaction" })
  }
}

async function updateTransactionById(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "transaction id required" })
    }

    const { categoryId, type, amount, description, date } = req.body;

    if (!categoryId) {
      return res.status(400).json({ message: "Category id required" })
    }

    if (!type || (type !== "INCOME" && type !== "EXPENSE")) {
      return res.status(400).json({ message: "Transaction type is required" });
    }

    if (amount === undefined || amount === null || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: "Transaction amount must be a positive number" });
    }

    if (!description || typeof description !== "string") {
      return res.status(400).json({ message: "Proper description is required" });
    }


    const TransactionUserId = await db.getUserIdByTransactionId(id)

    if (!TransactionUserId || user.id !== TransactionUserId.userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const transaction = await db.updateTransactionById(id, user.id, categoryId, type, Number(amount), description, date)
    return res.status(200).json(transaction)
  }
  catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(500).json({ message: "Couldn't update transaction" })
  }
}

async function deleteTransactionById(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Transaction id required" })
    }

    const TransactionUserId = await db.getUserIdByTransactionId(id)

    if (!TransactionUserId || user.id !== TransactionUserId.userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const transaction = await db.deleteTransactionById(id);
    return res.status(200).json(transaction)
  }
  catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(500).json({ message: "Couldn't delete Transaction" })
  }
}

async function getTransactionSummary(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    const transactions = await db.getTransactionByUserId(user.id);
    let totalIncome = 0
    let totalExpense = 0

    transactions.forEach((transaction: Transaction) => {
      if (transaction.type === 'INCOME') {
        totalIncome += transaction.amount
      }
      else if (transaction.type === 'EXPENSE') {
        totalExpense += transaction.amount
      }
    })

    const netAmount = totalIncome - totalExpense;

    return res.status(200).json({
      totalIncome,
      totalExpense,
      netAmount
    })

  }
  catch (err) {
    return res.status(500).json({ message: "Couldn't get Transaction Summary" })
  }
}

async function getExpenseByCategory(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    const data = await db.getExpenseByCategory(user.id);
    const categories = await dbCategory.getCategoryByUserId(user.id);
    
    const result = data.map((group)=>{
      const category = categories.find(cat=> cat.id === group.categoryId);
      return {
        color: category? category.color: "#1111",
        categoryId: group.categoryId,
        name: category? category.name: "Unknown",
        amount: group._sum.amount
      }
    })

    return res.status(200).json(result);
    
  }
  catch(err){
    return res.status(500).json({ message: "Couldn't get Expense By Category" })
  }
}

interface chartData{
  date:string;
  income:number;
  expense:number;
  netAmount:number
}

async function getTransactionTimeseries(req:AuthenticatedRequest, res:Response){

  const user = req.user;
  if(!user || !user.id) return res.status(401).json({message:"Unauthorized"});

  const interval = req.query.interval as "day" | "month" | "year"

  const transaction = await db.getTransactionByUserId(user.id);

  if(transaction.length === 0) return res.json({interval, data:[]});

  const group: Record<string , {income:number , expense:number}> = {};

  transaction.forEach(transaction=>{
    let key = "";
    if(interval === "day"){
      key = format(new Date(transaction.date), "yyyy-MM-dd")
    }
    if(interval ==="month"){
      key = format(new Date(transaction.date), "yyyy-MM")
    }
    if(interval ==="year"){
      key = format(new Date(transaction.date), "yyyy");
    }

    if(!group[key]){
      group[key] = {income:0, expense:0};
    }
    if(transaction.type==="INCOME"){
      group[key].income += transaction.amount;
    }
    else if(transaction.type==="EXPENSE"){
      group[key].expense += transaction.amount
    }

  })

  let chartData:chartData[] = [];

  for(const date in group){
    const income = group[date].income;
    const expense = group[date].expense;
    const net = income - expense;
    chartData.push({
      date: date,
      income:income,
      expense:expense,
      netAmount:net,
    })
  }

  const sortData = chartData.sort((a,b)=>a.date.localeCompare(b.date))

  const revisedData= sortData.slice(-7)

  return res.status(200).json({interval, data:revisedData})

}



export {
  getTransactionByUserId,
  createTransaction,
  updateTransactionById,
  deleteTransactionById,
  getTransactionSummary,
  getExpenseByCategory,
  getTransactionTimeseries
}