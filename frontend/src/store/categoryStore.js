import {create} from "zustand";
import api from "../lib/api";

export const useCategoryStore = create((set)=>({
  categories: [],
  setCategories: (categories)=>set({categories}),
  fetchCategories: async () => {
    const res = await api.get("/categories");
    set({ categories: res.data });
  }
}))