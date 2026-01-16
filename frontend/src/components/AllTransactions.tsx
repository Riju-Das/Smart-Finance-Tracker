import { useTransactionStore } from "../store/transactionStore"
import { useCategoryStore } from "../store/categoryStore";
import api from "../lib/api";
import axios from "axios";
import TransactionPagination from "./TransactionPagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { toast } from 'sonner'

function AllTransactions() {
  interface TransactionFormData {
    description: string;
    type: "INCOME" | "EXPENSE";
    category: string;
    date: string;
    amount: number
  }
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>()

  const fetchTransactionSummary = useTransactionStore((state) => state.fetchTransactionSummary)
  const transactions = useTransactionStore((state) => state.transactions)
  const pagination = useTransactionStore((state) => state.pagination)
  const categories = useCategoryStore((state) => state.categories)
  const fetchTransactions = useTransactionStore((state) => state.fetchTransactions)
  const [categorySort, setCategorySort] = useState<string>("")
  const [typeSort, setTypeSort] = useState<string>("")
  const [searchDesc, setSearchDesc] = useState<string>("")
  const [editDialogIndex, setEditDialogIndex] = useState<number | null>(null);

  async function onSubmit(data: TransactionFormData, id: string) {
    try {
      await api.put(`/transactions/${id}`, {
        description: data.description,
        type: data.type,
        date: data.date,
        categoryId: data.category,
        amount: data.amount
      })
      await fetchTransactions()
      await fetchTransactionSummary()
      reset()
      setEditDialogIndex(null)
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed updating Transaction");
      }
      else {
        toast.error("Failed updating Transaction");
      }
    }
  }

  async function handleDeleteTransaction(id: string) {
    try {
      await api.delete(`/transactions/${id}`)
      await fetchTransactions()
      await fetchTransactionSummary()
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err?.response?.data?.message || "Failed deleting Transaction")
      }
      else {
        toast.error("Failed deleting Transaction")
      }
    }
  }

  return (
    <div>
      <div className="w-full  flex flex-wrap text-gray-400 gap-3 my-5 rounded-2xl">

        <div className="flex flex-col">
          <input type="text" name="descSearch" id="descSearch" className='rounded-3xl border-2 border-white/10 px-2 md:px-5 mx-3 md:text-base text-xs font-normal h-8 md:h-10' placeholder='Search' value={searchDesc} onChange={(e) => setSearchDesc((e.target.value).toLowerCase())} />
        </div>
        <div>
          <LabelInputContainer className=" ">
            <select
              value={typeSort}
              onChange={(e) => setTypeSort(e.target.value)}
              id="selectSort"
              className=" rounded-md border mx-3 border-white/10 bg-gray-950/50 text-white px-3 py-2"
            >
              <option className="bg-gray-950" value="">All Type</option>
              <option className="bg-gray-950" value="INCOME">Income</option>
              <option className="bg-gray-950" value="EXPENSE">Expense</option>
            </select>

          </LabelInputContainer>
        </div>
        <div>
          <LabelInputContainer className=" ">
            <select
              value={categorySort}
              onChange={(e) => setCategorySort(e.target.value)}
              id="selectCategory"
              className=" rounded-md border mx-3 border-white/10 bg-gray-950/50 text-white px-3 py-2"
            >
              <option className="bg-gray-950" value="">All Categories</option>
              {
                categories.map(category => (
                  <option key={category.id} value={category.id} className="bg-gray-950">
                    {category.name}
                  </option>
                ))
              }
            </select>

          </LabelInputContainer>
        </div>
      </div>


      <div className="w-full bg-gray-950/50 md:px-8 p-5 text-gray-400 border-1 border-white/10 rounded-2xl ">
        <div className='md:text-2xl text-white font-semibold flex w-full justify-between'>
          <span>
            Transactions
          </span>

        </div>
        <Table className=" rounded-2xl ">
          <TableHeader >
            <TableRow className="text-xs md:text-base   ">
              <TableHead >Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-center">Description</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          {
            transactions.length > 0 && (
              <TableBody>
                {
                  transactions
                    .filter(transaction => transaction.description.toLowerCase().includes(searchDesc))
                    .filter(transaction => !typeSort || transaction.type === typeSort)
                    .filter(transaction => !categorySort || transaction.category.id === categorySort)
                    .map((transaction, idx) => (
                      <TableRow key={transaction.id} className="text-xs md:text-base">
                        <TableCell className="font-medium">{new Date(transaction.date).toLocaleDateString()}</TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell className="text-center">{transaction.description}</TableCell>
                        <TableCell className="text-center">{transaction.category.name}</TableCell>
                        <TableCell className="text-right">₹{transaction.amount}</TableCell>
                        <TableCell className="justify-end md:gap-10 gap-2 flex">

                          <Dialog open={editDialogIndex === idx} onOpenChange={(open) => setEditDialogIndex(open ? idx : null)}>

                            <DialogTrigger asChild>
                              <span onClick={() => {

                                reset({
                                  description: transaction.description,
                                  type: transaction.type,
                                  category: transaction.category.id,
                                  date: transaction.date.slice(0, 10),
                                  amount: transaction.amount,
                                });
                                setEditDialogIndex(idx)
                              }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xl:h-6 xl:w-6 text-gray-300 hover:text-white transition-colors duration-150 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V17h4" />
                                </svg>
                              </span>



                            </DialogTrigger>

                            <DialogContent className="sm:max-w-[425px] bg-black border-none text-white">

                              <DialogHeader>
                                <DialogTitle>Update Transaction</DialogTitle>
                              </DialogHeader>

                              <form className="my-5" onSubmit={handleSubmit((data) => onSubmit(data, transaction.id))} >
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

                          <span onClick={() => handleDeleteTransaction(transaction.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xl:h-6 xl:w-6 text-gray-300 hover:text-red-500 transition-colors duration-150 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </span>


                        </TableCell>
                      </TableRow>
                    )
                    )
                }
              </TableBody>
            )
          }

        </Table>
        {
          transactions.length === 0 && (
            <div className="w-full text-center m-5">
              No transactions made yet
            </div>
          )
        }
      </div>

      <TransactionPagination
        pagination={pagination}
        onPageChange={(page) => fetchTransactions(page)}
      />
    </div>
  );
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

export default AllTransactions