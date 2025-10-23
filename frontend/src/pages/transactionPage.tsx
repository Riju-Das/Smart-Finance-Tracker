import { useTransactionStore } from "../store/transactionStore"
import { Tabs } from "@/components/ui/tabs";
import { useCategoryStore } from "../store/categoryStore";
import TransactionAnalytics from "@/components/TransactionAnalytics";
import api from "../lib/api";
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
import { useState } from "react";
import AllTransactions from "../components/AllTransactions";
import axios from "axios";
import { useBudgetStore } from '@/store/budgetStore';

function TransactionPage() {


  const fetchTransactionSummary = useTransactionStore((state) => state.fetchTransactionSummary)
  const transactionSummary = useTransactionStore((state) => state.transactionSummary)
  const [dialogOpen1, setDialogOpen1] = useState<boolean>(false);
  const transactions = useTransactionStore((state) => state.transactions)
  const categories = useCategoryStore((state) => state.categories)
  const fetchTransactions = useTransactionStore((state) => state.fetchTransactions)
  const fetchBudgets = useBudgetStore((state) => state.fetchBudgets)

  interface TransactionFormType {
    amount: number;
    type: "INCOME" | "EXPENSE";
    description: string;
    date: string;
    category: string
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormType>()


  async function onSubmit(data: TransactionFormType) {

    try {
      await api.post("/transactions", {
        description: data.description,
        type: data.type,
        date: data.date,
        categoryId: data.category,
        amount: data.amount
      })
      await fetchTransactions()
      await fetchTransactionSummary()
      await fetchBudgets()

      reset()
      setDialogOpen1(false);
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err?.response?.data?.message || "Failed creating a new Transaction")
      }
    }
  }

  const tabs = [
    {
      title: "All transactions",
      value: "All transactions",
      content: (
        <AllTransactions />
      ),
    },
    {
      title: "Analytics",
      value: "Analytics",
      content: (
        <TransactionAnalytics />
      ),
    },
  ];

  return (
    <div className="min-h-screen overflow-auto  md:p-10 p-3 bg-gradient-to-br from-black via-gray-900 to-black ">
      <h1 className="2xl:text-5xl md:mb-8 xl:text-4xl text-3xl mb-5 font-semibold text-white">
        Transaction
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 md:gap-6 gap-3 my-8  ">
        <div className="bg-gray-950/50 border-1 border-white/10 rounded-xl md:p-6 p-3 px-4 text-white shadow">
          <div className="md:text-lg text-xs font-semibold">Total Income</div>
          <div className="md:text-2xl font-bold text-xs md:mt-2">₹{transactionSummary.totalIncome.toLocaleString()}</div>
        </div>
        <div className="bg-gray-950/50 border-1 border-white/10 rounded-xl md:p-6 p-3 px-4 text-white shadow">
          <div className="md:text-lg text-xs font-semibold">Total Expenses</div>
          <div className="md:text-2xl text-xs font-bold md:mt-2">₹{transactionSummary.totalExpense.toLocaleString()}</div>
        </div>
        <div className="bg-gray-950/50 border-1 border-white/10 rounded-xl md:p-6 p-3 px-4 text-white shadow">
          <div className="md:text-lg text-xs font-semibold">Net Amount</div>
          {
            transactionSummary.netAmount > 0 ? (
              <div className="md:text-2xl text-xs text-green-500 font-bold md:mt-2">₹{transactionSummary.netAmount}</div>
            ) : (
              <div className="md:text-2xl text-xs text-red-600 font-bold md:mt-2">₹{transactionSummary.netAmount}</div>
            )
          }

        </div>
        <div className="bg-gray-950/50 border-1 border-white/10 rounded-xl md:p-6 p-3 px-4 text-white shadow">
          <div className="md:text-lg text-xs font-semibold">Total Transactions</div>
          <div className="md:text-2xl text-xs  font-bold md:mt-2">{transactions.length}</div>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap  gap-3">


        <Dialog open={dialogOpen1} onOpenChange={setDialogOpen1}>

          <DialogTrigger asChild>

            <button className="md:px-8 md:py-2 px-5 py-1 rounded-full   relative bg-gray-950 cursor-pointer text-white md:text-sm text-xs hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-600" onClick={() => setDialogOpen1(true)} >
              <div className="absolute inset-x-0 h-px w-1/2 mx-auto   -top-px shadow-2xl  bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
              <span className="relative z-20 text-center flex justify-center items-center">
                <span className='text-xl text-center'>+&nbsp; </span>  transaction
              </span>
            </button>

          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px] bg-black border-none text-white">

            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
            </DialogHeader>

            <form className="my-5" onSubmit={handleSubmit(onSubmit)}>
              <LabelInputContainer className="mb-7">
                <Label htmlFor="description">Description</Label>
                <Input
                  required
                  id="description"
                  placeholder="Transaction description"
                  type="text"
                  {...register("description",
                    {
                      maxLength: { value: 20, message: "Max 20 characters" },
                      minLength: { value: 3, message: "Min 3 characters" },
                      pattern: {
                        value: /^[A-Za-z0-9 .,'&-]{3,50}$/,
                        message: "Start with a letter, only letters and numbers"
                      }
                    })
                  }
                />
                {errors.category && <span className="text-red-500 text-xs">{errors.category.message}</span>}
              </LabelInputContainer>
              <div className="grid md:grid-cols-2 grid-col-1 gap-6">
                <LabelInputContainer className="flex-1 mb-7">
                  <Label htmlFor="type" className="mb-1">Type</Label>
                  <select
                    id="type"
                    {...register("type", { required: true })}
                    className="w-full rounded-md border border-white/10 bg-black text-white px-3 py-2"
                  >
                    <option className="bg-black" value="INCOME">Income</option>
                    <option className="bg-black" value="EXPENSE">Expense</option>
                  </select>

                </LabelInputContainer>

                <LabelInputContainer className="flex-1 mb-7">
                  <Label htmlFor="category" className="mb-1">Category</Label>
                  <select
                    id="category"
                    {...register("category", { required: true })}
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

              </div>
              <LabelInputContainer className="flex-1 mb-7  ">
                <Label htmlFor="date" className="mb-1">Date:</Label>
                <Input
                  type="date"
                  id="date"
                  className="w-full "
                  {...register("date", { required: true })}
                />
              </LabelInputContainer>

              <LabelInputContainer className="mb-7">
                <Label htmlFor="amount">₹Amount</Label>
                <Input
                  required
                  id="amount"
                  placeholder="Amount"
                  type="number"
                  {...register("amount")}
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






        <button className="md:px-5 py-2 px-5 flex items-center justify-center  rounded-lg relative bg-gray-950 cursor-pointer text-white md:text-sm text-xs hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-600 text-center">
          <span className='text-xs text-center flex justify-center items-center'>
            <svg fill="#ffffff" width="20" height="20" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg" data-iconid="export" data-svgname="Export">
              <path d="M8.71,7.71,11,5.41V15a1,1,0,0,0,2,0V5.41l2.29,2.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42l-4-4a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-4,4A1,1,0,1,0,8.71,7.71ZM21,14a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V15a1,1,0,0,0-2,0v4a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V15A1,1,0,0,0,21,14Z" />
            </svg>
            &nbsp;
          </span>  Import
        </button>

        <button className="md:px-5 py-2 px-5 flex items-center justify-center  rounded-lg relative bg-gray-950 cursor-pointer text-white md:text-sm text-xs hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-600 text-center">
          <span className='text-xs text-center flex justify-center items-center'>
            <svg fill="#ffffff" width="20" height="20" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg" data-iconid="import" data-svgname="Import">
              <path d="M21,14a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V15a1,1,0,0,0-2,0v4a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V15A1,1,0,0,0,21,14Zm-9.71,1.71a1,1,0,0,0,.33.21.94.94,0,0,0,.76,0,1,1,0,0,0,.33-.21l4-4a1,1,0,0,0-1.42-1.42L13,12.59V3a1,1,0,0,0-2,0v9.59l-2.29-2.3a1,1,0,1,0-1.42,1.42Z" />
            </svg>


            &nbsp;
          </span>  Export
        </button>

      </div>

      <Tabs tabs={tabs}
        contentClassName="w-full bg-black rounded-xl"
      />
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

export default TransactionPage