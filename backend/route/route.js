const express = require("express")
const authenticateToken = require("../config/authenticate")
const AuthController = require("../controller/AuthController")
const CategoryController = require("../controller/CategoryController")
const TransactionController = require("../controller/TransactionController")
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

module.exports= route