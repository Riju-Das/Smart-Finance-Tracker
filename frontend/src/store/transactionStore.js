import {create} from "zustand";
import api from "../lib/api";

export const useTransactionStore = create((set)=>({
  transactions: [],
  setTransactions: (transactions)=>set({transactions}),
  fetchTransactions: async () => {
    const res = await api.get("/transactions");
    set({ transactions: res.data });
  }
}))