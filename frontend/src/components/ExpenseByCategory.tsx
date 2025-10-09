import { useState, useEffect } from "react";
import api from "@/lib/api";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ExpenseByCategory {
  color: string;
  categoryId: string;
  name: string;
  amount: number;
}

function ExpenseByCategory() {

  const [expenseByCategory, setexpenseByCategory] = useState<ExpenseByCategory[]>([])

  async function getExpenseByCategory() {
    try {
      const res = await api.get("/transactions/expenseByCategory")
      setexpenseByCategory(res.data)
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err?.response?.data?.message)
      }
    }
  }

  useEffect(() => {
    getExpenseByCategory()
  }, []);


  return (
    <>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenseByCategory as any}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              label
            >
              {expenseByCategory.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
          </PieChart>
        </ResponsiveContainer>
    </>
  )
}

export default ExpenseByCategory