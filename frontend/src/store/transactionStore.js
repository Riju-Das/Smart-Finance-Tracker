import {create} from "zustand";
import api from "../lib/api";

export const useTransactionStore = create((set)=>({
  transactions: [],
  setTransactions: (transactions)=>set({transactions}),
  fetchTransactions: async () => {
    const res = await api.get("/transactions");
    set({ transactions: res.data });
  },
  transactionSummary: {totalIncome:0 , totalExpense:0, netAmount:0},
  setTransactionSummary: (transactionSummary)=>set({transactionSummary}),
  fetchTransactionSummary: async ()=>{
    const res = await api.get("/transactions/summary");
    set({transactionSummary:res.data})
  }
}))