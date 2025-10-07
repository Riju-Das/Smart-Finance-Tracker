import * as express from "express"
import authenticateToken from "../config/authenticate"
import * as AuthController from "../controller/AuthController"
import * as CategoryController from "../controller/CategoryController"
import * as TransactionController from "../controller/TransactionController"


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

export default route