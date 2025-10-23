import { create } from "zustand";
import api from "@/lib/api";

interface Budget {
  budget: {
    id: string;
    userId: string;
    categoryId: string;
    category: {
      id: string;
      name: string;
      color: string;
    }
    period: string;
    amount: number;
  }
  totalExpense: number;
  budgetPercentage: number
}

interface BudgetStore {
  budgets: Budget[];
  setBudgets: (budgets: Budget[]) => void
  fetchBudgets: () => Promise<void>
}

export const useBudgetStore = create<BudgetStore>((set)=>({
  budgets: [],
  
  setBudgets: (budgets)=>set({budgets}),

  fetchBudgets: async ()=>{
    const res = await api.get("/budget");
    set({budgets: res.data})
  }
}))