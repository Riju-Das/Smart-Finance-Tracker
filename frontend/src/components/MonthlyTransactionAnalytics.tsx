import { useState, useEffect } from "react";
import api from "@/lib/api";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from 'sonner'

interface MonthlyTransaction {
  date: string;
  income: number;
  expense: number;
  netAmount: number;
}


function MonthlyTransactionAnalytics() {
  const [interval, setInterval] = useState<"day" | "year" | "month">("month")
  const [intervalData, setIntervalData] = useState<MonthlyTransaction[]>([]);

  async function fetchTimeseries() {
    try {
      const res = await api.get(`/transactions/timeseries?interval=${interval}`)
      setIntervalData(res.data.data)
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err?.response?.data?.message)
      }
    }
  }

  useEffect(() => {
    fetchTimeseries()
  }, [interval]);

  return (
    <div className="flex flex-col border-1 border-white/10  md:p-5  p-2 gap-5 rounded-2xl  2xl:h-140 md:h-100 h-80 bg-gray-950">
      <div className=" text-center md:text-start md:text-3xl font-bold text-white">
        Transaction Trends
      </div>
      <div>
        <select name="interval" className="p-1 px-3 border-1 text-white border-white/10 rounded-2xl md:text-base text-xs" id="interval" onChange={e => setInterval(e.target.value as any)}>
          <option value="month" className="bg-black">Monthly</option>
          <option value="day" className="bg-black">Daily</option>
          <option value="year" className="bg-black">Yearly</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={intervalData}>
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
          <Line type="monotone" dataKey="income" stroke="#00e571" strokeWidth={1} name="Income" />
          <Line type="monotone" dataKey="expense" stroke="#ff4d4f" strokeWidth={1} name="Expense" />
          <Line type="monotone" dataKey="netAmount" stroke="#8884d8" strokeWidth={1} name="Savings" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MonthlyTransactionAnalytics