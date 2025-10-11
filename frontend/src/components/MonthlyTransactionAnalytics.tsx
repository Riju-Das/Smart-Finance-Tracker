import { useState, useEffect } from "react";
import api from "@/lib/api";
import axios from "axios";
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface MonthlyTransaction {
  type: "INCOME" | "EXPENSE";
  date: string;
  amount: number;
}


function MonthlyTransactionAnalytics() {

  const [monthlyData, setMonthlyData] = useState<MonthlyTransaction[]>([]);

  
  return (
    <>  

    </>
  )
}

export default MonthlyTransactionAnalytics