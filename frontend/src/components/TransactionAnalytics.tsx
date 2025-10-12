import { useEffect, useState } from "react"
import ExpenseByCategory from "./ExpenseByCategory"
import api from "@/lib/api";
import axios from "axios";
import MonthlyTransactionAnalytics from "./MonthlyTransactionAnalytics"

function TransactionAnalytics() {

  return (
    <div className="w-full gap-5 md:px-10 grid md:grid-cols-2 grid-cols-1 text-white ">
      <div className="w-full h-full">
        <MonthlyTransactionAnalytics />
      </div>
      <div className="w-full h-full">
        <ExpenseByCategory />
      </div>
    </div>

  )
}

export default TransactionAnalytics