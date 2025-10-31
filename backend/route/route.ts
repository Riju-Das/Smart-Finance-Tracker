import * as express from "express"
import authenticateToken from "../config/authenticate"
import * as AuthController from "../controller/AuthController"
import * as CategoryController from "../controller/CategoryController"
import * as TransactionController from "../controller/TransactionController"
import * as BudgetController from "../controller/budgetController"

const route = express.Router()

route.post("/register", AuthController.register);
route.post("/login" , AuthController.login);
route.post("/refresh", AuthController.refresh);
route.post("/logout", AuthController.logout)
route.get("/user-detail" , authenticateToken, AuthController.userDetail)

route.get("/categories", authenticateToken, CategoryController.getCategoriesByUserId)
route.post("/categories", authenticateToken, CategoryController.createCategory);
route.put("/categories/:id", authenticateToken, CategoryController.updateCategoryById)
route.delete("/categories/:id", authenticateToken, CategoryController.deleteCategoryById)

route.get("/transactions", authenticateToken, TransactionController.getTransactionByUserId)
route.post("/transactions", authenticateToken, TransactionController.createTransaction);
route.put("/transactions/:id", authenticateToken, TransactionController.updateTransactionById)
route.delete("/transactions/:id", authenticateToken, TransactionController.deleteTransactionById)

route.get("/transactions/summary" , authenticateToken , TransactionController.getTransactionSummary)

route.get("/transactions/expenseByCategory" , authenticateToken , TransactionController.getExpenseByCategory);

route.get("/transactions/timeseries" , authenticateToken , TransactionController.getTransactionTimeseries)

route.get("/budget", authenticateToken, BudgetController.getBudgets )
route.get("/budget/all", authenticateToken, BudgetController.getAllBudgets)
route.get("/totalBudgetAnalytics" , authenticateToken , BudgetController.totalBudgetAnalytics)
route.post("/budget" , authenticateToken , BudgetController.createBudget);
route.put("/budget/:id", authenticateToken, BudgetController.updateBudget)
route.delete("/budget/:id", authenticateToken, BudgetController.deleteBudget)


export default route