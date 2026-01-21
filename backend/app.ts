import express from "express";
import route from "./route/route";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { startBudgetCrons } from "./controller/budgetController";
import { startGoalCron } from "./controller/GoalController";
import rateLimit from "express-rate-limit";


config()
startBudgetCrons()
startGoalCron()

const app = express()

const generalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 500,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: 'Too many requests',
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: false,
  skipSuccessfulRequests: false,
})

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 50,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: 'Too many auth attempts. Try again after 15mins',
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
})

const csvUploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: 'Too many file uploads. try again later',
    });
  },
  standardHeaders: true,
  legacyHeaders: false,

})


app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use("/api/login", authLimiter);
app.use("/api/register", authLimiter);
app.use("/api/transaction/upload-csv", csvUploadLimiter);
app.use("/api", generalLimiter);

app.use("/api", route)

app.listen(process.env.PORT, () => {
  console.log("The app is listening to port", process.env.PORT)
})