import { create } from 'zustand';
import api from '@/lib/api';

interface Goal{
  id:string;
  name:string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  deadline: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
}

interface GoalStore{
  goals: Goal[];
  setGoals: (goals:Goal[])=>void;
  fetchGoals: ()=>Promise<void>
}

export const useGoalStore = create<GoalStore>((set)=>({
  goals: [],
  setGoals: (goals)=>set({goals:goals}),
  fetchGoals: async () => {
    const res = await api.get("/goal");
    set({ goals: res.data });
  }
}))