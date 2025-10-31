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

interface BudgetProgressProps {
  period?: "MONTH" | "DAY" | "WEEK" | "YEAR";
  showSelfPeriod: true | false
}

function BudgetProgress({ period, showSelfPeriod }: BudgetProgressProps) {


  
  const budgets = useBudgetStore((state) => state.budgets)
  const [currentPeriod, setCurrentPeriod] = useState<"MONTH" | "YEAR" | "DAY" | "WEEK">("MONTH")
  const categories = useCategoryStore((state) => state.categories)
  const fetchBudgets = useBudgetStore((state) => state.fetchBudgets)


  async function handleDeleteBudget(id: string, categoryId: string, period: string) {
    try {
      await api.delete(`/budget/${id}?categoryId=${categoryId}&period=${period}`)
      await fetchBudgets()
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err?.response?.data?.message || "Failed deleting budgets")
        console.log(err)
      }
      else {
        alert("Failed deleting budgets")
      }
    }
  }


  return (
    <div className='bg-gray-950/50 rounded-xl p-4 w-full    md:p-6 md:py-4 md:text-xl grid grid-cols-1 gap-6 border  border-gray-900 text-white shadow-xl'>
      <div className='md:text-2xl font-semibold flex w-full justify-between'>
        <span>
          Budget Progress
        </span>
      </div>
      {
        showSelfPeriod === true && (
          <div>
            <select name="interval" className="p-1 md:text-base text-xs" id="interval" onChange={e => setCurrentPeriod(e.target.value as any)}>
              <option value="MONTH" className="bg-black">Monthly</option>
              <option value="DAY" className="bg-black">Daily</option>
              <option value="YEAR" className="bg-black">Yearly</option>
              <option value="WEEK" className="bg-black">Weekly</option>
            </select>
          </div >
        )
      }
      <div>
        {
          budgets
            .filter(budget => budget.budget.period === currentPeriod).length > 0 ?
            (
              budgets
                .filter(budget => budget.budget.period === (showSelfPeriod === true ? currentPeriod : period))
                .map((budget, idx) =>
                (
                  <div key={budget.budget.id}>
                    <div className="mb-2 flex justify-between">
                      <div className="gap-2">
                        <div>
                          <span className="inline-block mr-2 w-2 h-2 rounded-4xl " style={{ backgroundColor: budget.budget.category.color }}></span>
                          {budget.budget.category.name}
                        </div>
                        <div className="text-stone-400 text-base">
                          ₹{budget.totalExpense} of ₹{budget.budget.amount}
                        </div>

                      </div>

                      <div>
                        <span onClick={() => handleDeleteBudget(budget.budget.id, budget.budget.categoryId, budget.budget.period)}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xl:h-6 xl:w-6 text-gray-300 hover:text-red-500 transition-colors duration-150 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      </div>

                    </div>

                    <div className="">
                      <div >
                        {
                          budget.budgetPercentage > 100 ? (
                            <Progress value={100} className="w-full bg-gray-700 h-2" />
                          ) : (
                            <Progress value={budget.budgetPercentage || 0} className="w-full bg-black h-2" />
                          )
                        }

                      </div>
                      <div className="text-stone-400 my-2 text-base">
                        {budget.budgetPercentage}% used
                      </div>

                    </div>
                  </div>
                )
                )
            ) : (
              <div className="text-center">
                No budget created
              </div>
            )

        }
      </div>


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