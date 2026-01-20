import { useState, useEffect } from "react";
import api from "@/lib/api";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from 'sonner'
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
        toast.error(err?.response?.data?.message)
      }
    }
  }

  useEffect(() => {
    getExpenseByCategory()
  }, []);


  return (
    <div className="flex flex-col border-1 border-white/10  md:p-5 p-2 gap-5 rounded-2xl  2xl:h-140 md:h-100  h-80 bg-gray-950">
      <div className=" text-center  font-bold md:text-start md:text-3xl text-white">
        Expense By Category
      </div>
      <div className="min-h-[80%] w-full ">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenseByCategory as any}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="85%"
              innerRadius="45%"
              paddingAngle={5}
              strokeWidth={1}
            >
              {expenseByCategory.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
              <Legend layout="vertical" align="right" verticalAlign="bottom"/>
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}

export default ExpenseByCategory