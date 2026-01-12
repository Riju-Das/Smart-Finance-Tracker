import * as db from "../db/TransactionQueries"
import type { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import type { Transaction } from "@prisma/client";
import * as dbCategory from '../db/Categoryqueries'
import {format} from "date-fns"
import multer from 'multer';
import { parseCSV } from "../utils/csvParser";
import { categorizeTransactions } from "../services/geminiService";


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
  let totalIncome = 0;
  let totalExpense = 0;

  const sortedDates = Object.keys(group).sort();

  for(const date of sortedDates){

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

  
  const revisedData= chartData.slice(-10)

  return res.status(200).json({interval, data:revisedData})

}

const upload = multer({
  storage:multer.memoryStorage(),
  limits:{fileSize: 5 * 1024 * 1024},
  fileFilter:(req,file,cb)=>{
    if(file.mimetype==='text/csv' || file.originalname.endsWith('.csv')){
      cb(null,true);
    }
    else{
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

export const uploadCSVMiddleware = upload.single('file');

export async function importCSVTransactions(req:AuthenticatedRequest, res:Response){
  try{
    if(!req.file)
      return res.status(400).json({message:'No file uploaded'});

    const userId = req.user?.id;
    if(!userId) return res.status(401).json({message:'Unauthorized'});

    const transactions = await parseCSV(req.file.buffer);

    if(transactions.length===0){
      return res.status(400).json({message:'No valid transactions'});
    }

    const categories = await dbCategory.getCategoryByUserId(userId);

    if(categories.length===0){
      return res.status(400).json({message:'Create at least one category before importing '})
    }

    const batchSize = 50;
    const allCategoryIds:string[] =[];

    for(let i = 0; i<transactions.length; i+=batchSize){
      const batch = transactions.slice(i,i+batchSize);
      const descriptions = batch.map(t=>t.description);

      const categoryIds = await categorizeTransactions(descriptions , categories);
      allCategoryIds.push(...categoryIds);
    }

    const created = [];
    const errors = [];

    for(let i =0; i<transactions.length; i++){
      const transaction = transactions[i];
      const categoryId = allCategoryIds[i];
      try{
        const result = await db.createTransaction(
          userId,
          categoryId,
          transaction.type,
          transaction.amount,
          transaction.description,
          transaction.date
        );
        created.push(result);
      }
      catch(error){
        errors.push({
          description: transaction.description,
          error:error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    res.status(200).json({
      message: `Successfully imported ${created.length} out of ${transactions.length} transactions`,
      imported: created.length,
      failed: errors.length,
      errors: errors.length>0?errors: undefined,
      transactions:created
    })
  }
  catch(error){
    console.error('CSV import error:', error);
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Failed to import CSV'
    })
  }
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