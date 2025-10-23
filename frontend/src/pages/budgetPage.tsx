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

import BudgetProgress from "@/components/budgetProgress";

function BudgetPage() {

  interface BudgetFormType {
    categoryId: string;
    period: "MONTH" | "DAY" | "YEAR";
    amount: number;
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

  async function onSubmit(data: BudgetFormType) {
    try {
      const budgets = await api.post("/budget", {
        categoryId: data.categoryId,
        period: data.period,
        amount: Number(data.amount),

      })
      console.log(budgets)
      await fetchBudgets();
      reset();
      setDialogOpen1(false)
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err?.response?.data?.message || "Failed creating a new budget")
      }
      else {
        alert("Failed creating a new budget")
      }
    }
  }

  return (
    <div className="min-h-screen md:p-10 p-3 bg-gradient-to-br from-black via-gray-900 to-black ">
      <h1 className="2xl:text-5xl md:mb-8 xl:text-4xl text-3xl mb-5 font-semibold text-white">
        Budget
      </h1>
      <Dialog open={dialogOpen1} onOpenChange={setDialogOpen1}>

        <DialogTrigger asChild>
          <button className="px-8 py-2 rounded-full relative bg-gray-950 cursor-pointer text-white text-sm hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-600" onClick={() => setDialogOpen1(true)}>
            <div className="absolute inset-x-0 h-px w-1/2 mx-auto   -top-px shadow-2xl  bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
            <span className="relative z-20 text-center flex justify-center items-center">
              <span className='text-xl text-center'>+&nbsp; </span> Budget
            </span>
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] bg-black border-none text-white">

          <DialogHeader>
            <DialogTitle>Add Budget</DialogTitle>
          </DialogHeader>

          <form className="my-5" onSubmit={handleSubmit(onSubmit)}>

            <LabelInputContainer className="flex-1 mb-7">
              <Label htmlFor="category" className="mb-2">Category</Label>
              <select
                id="category"
                {...register("categoryId", { required: true })}
                className="w-full rounded-md border border-white/10 bg-black text-white px-3 py-2"
              >
                <option value="" disabled className="bg-black">Select category</option>
                {
                  categories.map((category) => (

                    <option key={category.id} value={category.id}>{category.name}</option>

                  ))
                }
              </select>
            </LabelInputContainer>

            <LabelInputContainer className="flex-1 mb-7">
              <Label htmlFor="period" className="mb-2">Period</Label>
              <select
                id="period"
                {...register("period", { required: true })}
                className="w-full rounded-md border border-white/10 bg-black text-white px-3 py-2"
              >
                <option value="" disabled className=" bg-black">Select Period</option>
                <option value="MONTH" className="bg-black text-white">Month</option>
                <option value="YEAR" className="bg-black">Year</option>
                <option value="WEEK" className="bg-black">Week</option>
                <option value="DAY" className="bg-black">Day</option>

              </select>
            </LabelInputContainer>

            <LabelInputContainer className="mb-7">
              <Label htmlFor="amount" className="mb-2">Budget Amount</Label>
              <Input
                required
                id="amount"
                placeholder="Write Budget Amount"
                type="number"
                {...register("amount", { required: true })}
              />
            </LabelInputContainer>

            <button
              className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
              type="submit"
            >
              Submit &rarr;
              <BottomGradient />
            </button>


            <div className="mt-5 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          </form>
        </DialogContent>

      </Dialog>

      <div className="">
        <BudgetProgress />
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


export default BudgetPage