import  express from "express";
import route from "./route/route";
import { config } from "dotenv";
import  cors from "cors";
import cookieParser from "cookie-parser";
import { startBudgetCrons } from "./controller/budgetController";
import { startGoalCron } from "./controller/GoalController";


config()
startBudgetCrons()
startGoalCron()

const app = express()



app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api", route)

app.listen(process.env.PORT, () => {
  console.log("The app is listening to port", process.env.PORT)
})