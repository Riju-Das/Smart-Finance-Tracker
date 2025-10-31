import { useState, useEffect } from "react";
import api from "@/lib/api";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useBudgetStore } from "@/store/budgetStore";

interface BudgetProgressProps {
  period?: "MONTH" | "DAY" | "WEEK" | "YEAR";
  showSelfPeriod: true | false
}

function AllBudgetTrend({ period, showSelfPeriod }: BudgetProgressProps) {

  interface allBudgets {
    budget: {
      id: string;
      userId: string;
      categoryId: string;
      category: {
        id: string;
        name: string;
        color: string;
      }
      period: "MONTH" | "DAY" | "WEEK" | "YEAR";
      amount: number;
    }
    totalExpense: number;
    budgetPercentage: number;
    date: string
  }



  const budgets = useBudgetStore((state) => state.budgets)

  const [currentPeriod, setCurrentPeriod] = useState<"MONTH" | "DAY" | "WEEK" | "YEAR">("DAY")
  const [categoryId, setCategoryId] = useState<string>(budgets
    .filter((budget) => {
      if (showSelfPeriod === true) {
        return budget.budget.period === currentPeriod
      }
      else {
        return budget.budget.period === period
      }
    }
    )[0]?.budget.categoryId ?? "")
  const [filteredBudget, setFilteredBudget] = useState<allBudgets[]>()

  async function fetchAllBudgets() {
    try {
      if (showSelfPeriod === true) {
        console.log(categoryId)
        const res = await api.get(`/budget/all?period=${currentPeriod}&categoryId=${categoryId}`)
        setFilteredBudget(res.data)

      }
      else if (showSelfPeriod === false) {
        console.log(categoryId)
        const res = await api.get(`/budget/all?period=${period}&categoryId=${categoryId}`)
        console.log(res.data)
        setFilteredBudget(res.data)
      }
    }
    catch (err) {
      console.log(err)
      if (axios.isAxiosError(err)) {
        alert(err?.response?.data?.message)
      }
    }
  }


  useEffect(() => {
    const revbudget = budgets.filter((budget) => budget.budget.categoryId === categoryId && budget.budget.period === (showSelfPeriod === true ? currentPeriod : period))
    if (revbudget.length === 0) {
      setCategoryId(budgets
        .filter((budget) => {
          if (showSelfPeriod === true) {
            return budget.budget.period === currentPeriod
          }
          else {
            return budget.budget.period === period
          }
        }
        )[0]?.budget.categoryId ?? "")
    }
  }, [period, currentPeriod]);

  useEffect(() => {
    if (categoryId) {
      fetchAllBudgets()
    }
  }, [categoryId, currentPeriod, period]);


  return (
    <div className="flex flex-col border-1 border-white/10  md:p-5  p-2 gap-5 rounded-2xl  2xl:h-140 md:h-100 h-80 bg-gray-950">
      <div className=" text-center md:text-start md:text-3xl text-white font-bold ">
        Budget Trends
      </div>
      <div className="">
        {
          showSelfPeriod === true && (
            <select name="interval" className="p-1 px-3 border-1 border-white/10 rounded-2xl mx-3 md:text-base text-white text-xs" id="interval" onChange={e => setCurrentPeriod(e.target.value as any)}>
              <option value="DAY" className="bg-black">Daily</option>
              <option value="MONTH" className="bg-black">Monthly</option>
              <option value="YEAR" className="bg-black">Yearly</option>
              <option value="WEEK" className="bg-black">Weekly</option>
            </select>
          )
        }

        <select name="categorySelector" value={categoryId} className="p-1 px-3 border-1 border-white/10 rounded-2xl text-white md:text-base text-xs" id="categorySelector"
          onChange={(e) => setCategoryId(e.target.value)} >
          {
            budgets.map((budget) => ((showSelfPeriod === true && currentPeriod === budget.budget.period) || (showSelfPeriod === false && period === budget.budget.period)) && (
              <option value={budget.budget.category.id} key={budget.budget.id} className="bg-black">{budget.budget.category.name}</option>
            ))
          }
        </select>
      </div>
      {
        filteredBudget && filteredBudget.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredBudget}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                strokeOpacity={0.3}
              />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={{ stroke: '#4b5563' }}
              />
              <YAxis

                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={{ stroke: '#4b5563' }}
              />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="budget.amount" stroke="#00e571" strokeWidth={1} name="amount" />
              <Line type="monotone" dataKey="totalExpense" stroke="#dc2626" strokeWidth={1} name="Total Expense" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full text-center text-white justify-center items-center">
            Nothing to display
          </div>
        )
      }

    </div>
  )
}

export default AllBudgetTrend