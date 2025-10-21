import {create} from "zustand";
import api from "../lib/api";

interface Category {
  id: string;
  userId:string;
  name: string;
  color:string
}

interface CategoryStore{
  categories: Category[] ;
  setCategories: (categories:Category[])=>void;
  fetchCategories: () => Promise<void>
}

export const useCategoryStore = create<CategoryStore>((set)=>({
  categories: [],
  setCategories: (categories)=>set({categories}),
  fetchCategories: async () => {
    const res = await api.get("/categories");
    set({ categories: res.data });
  }
}))