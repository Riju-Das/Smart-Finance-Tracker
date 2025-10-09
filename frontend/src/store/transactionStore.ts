import { create } from "zustand";
import api from "../lib/api";

interface Transaction {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  description: string;
  date: string;
  category: {
    id: string;
    name: string;
    color:string;
  };
}

interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
}

interface TransactionStore {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  fetchTransactions: () => Promise<void>;
  transactionSummary: TransactionSummary;
  setTransactionSummary: (summary: TransactionSummary) => void;
  fetchTransactionSummary: () => Promise<void>;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  setTransactions: (transactions) => set({ transactions }),
  fetchTransactions: async () => {
    const res = await api.get("/transactions");
    set({ transactions: res.data });
  },
  transactionSummary: { totalIncome: 0, totalExpense: 0, netAmount: 0 },
  setTransactionSummary: (transactionSummary) => set({ transactionSummary }),
  fetchTransactionSummary: async () => {
    const res = await api.get("/transactions/summary");
    set({ transactionSummary: res.data })
  }
}))