import { create } from "zustand";
import api from "../lib/api";

interface Transaction {
  id: string;
  userId: string
  amount: number;
  type: "INCOME" | "EXPENSE";
  description: string;
  date: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
}

interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
}

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface TransactionStore {
  transactions: Transaction[];
  pagination: PaginationInfo;
  setTransactions: (transactions: Transaction[]) => void;
  fetchTransactions: (page?: number, limit?: number) => Promise<void>;
  transactionSummary: TransactionSummary;
  setTransactionSummary: (summary: TransactionSummary) => void;
  fetchTransactionSummary: () => Promise<void>;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  pagination: {
    currentPage: 1,
    pageSize: 25,
    totalRecords: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  },
  setTransactions: (transactions) => set({ transactions }),
  fetchTransactions: async (page = 1, limit = 25) => {
    const res = await api.get(`/transactions?page=${page}&limit=${limit}`);
    set({
      transactions: res.data.transactions,
      pagination: res.data.pagination
    });
  },
  transactionSummary: { totalIncome: 0, totalExpense: 0, netAmount: 0 },
  setTransactionSummary: (transactionSummary) => set({ transactionSummary }),
  fetchTransactionSummary: async () => {
    const res = await api.get("/transactions/summary");
    set({ transactionSummary: res.data })
  }
}))