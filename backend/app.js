const express = require("express")
const route = require("./route/route")
require("dotenv").config()
const cors = require('cors');


const app = express()

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,              
}));

app.use(express.json());

app.use("/api",  route)

app.listen(process.env.PORT, ()=>{
  console.log("The app is listening to port", process.env.PORT)
})