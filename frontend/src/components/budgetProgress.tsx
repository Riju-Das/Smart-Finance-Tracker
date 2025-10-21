import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form"
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useCategoryStore } from '../store/categoryStore';
import { useBudgetStore } from "@/store/budgetStore";
import { Progress } from "@/components/ui/progress";

function BudgetProgress() {
  interface BudgetFormType {
    categoryId: string;
    period: "MONTH" | "DAY" | "YEAR";
    amount: number;
    startDate: string;
    endDate: string
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormType>()

  const budgets = useBudgetStore((state) => state.budgets)
  const [dialogOpen1, setDialogOpen1] = useState(false);
  const categories = useCategoryStore((state) => state.categories)
  const fetchBudgets = useBudgetStore((state) => state.fetchBudgets)




  return (
    <div className='bg-gray-950/50 rounded-xl p-4 w-full  my-8 md:p-6 md:py-4 md:text-xl grid grid-cols-1 gap-6 border  border-gray-900 text-white shadow-xl'>
      <div className='md:text-2xl font-semibold flex w-full justify-between'>
        <span>
          Budget Progress
        </span>
      </div>

      {
        budgets.map((budget) => (
          <div key={budget.budget.id}>
            <div className="mb-2">
              <div className="gap-2">
                <div>
                  <span className="inline-block mr-2 w-2 h-2 rounded-4xl " style={{ backgroundColor: budget.budget.category.color}}></span>
                  {budget.budget.category.name}
                </div>
                <div className="text-stone-400 text-base">
                  ₹{budget.totalExpense} of ₹{budget.budget.amount}
                </div>

              </div>

              <div>

              </div>

            </div>

            <div className="mb-5">
              <div >
                {
                  budget.budgetPercentage > 100 ? (
                    <Progress value={100} className="w-full bg-gray-700 h-2" />
                  ) : (
                    <Progress value={budget.budgetPercentage} className="w-full bg-black h-2" />
                  )
                }

              </div>
              <div className="text-stone-400 my-2 text-base">
                {budget.budgetPercentage}% used
              </div>

            </div>
          </div>
        ))
      }

      <div>

      </div>
    </div>
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};


export default BudgetProgress