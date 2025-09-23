const express = require("express")
const route = require("./route/route")
require("dotenv").config()

const app = express()

app.use("/api",  route)

app.listen(process.env.PORT, ()=>{
  console.log("The app is listening to port", process.env.PORT)
})