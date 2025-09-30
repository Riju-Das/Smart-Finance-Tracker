const db = require("../db/TransactionQueries")

async function getTransactionByUserId(req, res) {
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

async function createTransaction(req, res) {
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

async function updateTransactionById(req, res) {
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
  catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(500).json({ message: "Couldn't update transaction" })
  }
}

async function deleteTransactionById(req, res) {
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
  catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(500).json({ message: "Couldn't delete Transaction" })
  }
}

async function getTransactionSummary(req, res) {
  try {
    const user = req.user
    const transactions = await db.getTransactionByUserId(user.id);
    let totalIncome = 0
    let totalExpense = 0

    transactions.forEach(transaction=>{
      if(transaction.type==='INCOME'){
        totalIncome += transaction.amount
      }
      else if(transaction.type==='EXPENSE'){
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
  catch(err){
    return res.status(500).json({ message: "Couldn't get Transaction Summary" })
  }
}

module.exports = {
  getTransactionByUserId,
  createTransaction,
  updateTransactionById,
  deleteTransactionById,
  getTransactionSummary
}