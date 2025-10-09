import { useEffect, useState } from "react"
import ExpenseByCategory from "./ExpenseByCategory"
import api from "@/lib/api";
import axios from "axios";

function TransactionAnalytics() {

  return (
    <div className="w-full h-100 border-2 grid md:grid-cols-2 grid-cols-1 text-white border-white/10">
      <div className="w-full h-full flex items-center justify-center">
        
        <div className="w-full h-full">
          <ExpenseByCategory />
        </div>
      </div>
    </div>
  )
}

export default TransactionAnalytics