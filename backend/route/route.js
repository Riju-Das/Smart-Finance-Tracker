const express = require("express")
const authenticateToken = require("../config/authenticate")
const AuthController = require("../controller/AuthController")
const route = express.Router()

route.post("/register", AuthController.register);
route.post("/login" , AuthController.login);
route.post("/refresh", AuthController.refresh);
route.post("/logout", authenticateToken, AuthController.logout)


module.exports= route