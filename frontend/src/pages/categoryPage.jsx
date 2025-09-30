import { useCategoryStore } from '../store/categoryStore';
import { useTransactionStore } from '../store/transactionStore';
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

function CategoryPage() {
  const navigate = useNavigate()
  const categories = useCategoryStore((state) => state.categories)
  const [dialogOpen1, setDialogOpen1] = useState(false);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);
  const [editDialogIndex, setEditDialogIndex] = useState(null);
  const [searchCategory, setSearchCategory] = useState("")
  const transactionSummary = useTransactionStore((state)=>state.transactionSummary)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    formState: { errors: errors2 },
  } = useForm()

  async function onSubmit(data) {

    try {
      await api.post("/categories", {
        name: data.category
      })
      await fetchCategories()
      reset()
      setDialogOpen1(false);
    }
    catch (err) {
      console.log(err);
      alert(err?.response?.message || "Failed creating a new category")
    }
  }

  async function handleUpdateCategory(id, data) {
    try {
      await api.put(`/categories/${id}`, {
        name: data.category
      })
      await fetchCategories()
      reset2()
      setEditDialogIndex(null)
    }
    catch (err) {
      console.log(err);
      alert(err?.response?.message || "Failed updating category")
    }
  }

  async function handleDeleteCategory(id) {
    try {
      await api.delete(`/categories/${id}`)
      await fetchCategories()
    }
    catch (err) {
      console.log(err);
      alert(err?.response?.message || "Failed deleting category")
    }
  }

  return (
    <div className="min-h-screen md:p-10 p-3 bg-gradient-to-br from-black via-gray-900 to-black ">


      <h1 className="2xl:text-5xl md:mb-8 xl:text-4xl text-3xl mb-5 font-semibold text-white">
        Category
      </h1>
      <div>

        <Dialog open={dialogOpen1} onOpenChange={setDialogOpen1}>

          <DialogTrigger asChild>
            <button className="px-8 py-2 rounded-full relative bg-gray-950 cursor-pointer text-white text-sm hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-600" onClick={() => setDialogOpen1(true)}>
              <div className="absolute inset-x-0 h-px w-1/2 mx-auto   -top-px shadow-2xl  bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
              <span className="relative z-20 text-center flex justify-center items-center">
                <span className='text-xl text-center'>+&nbsp; </span>  Category
              </span>
            </button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px] bg-black border-none text-white">

            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>

            <form className="my-5" onSubmit={handleSubmit(onSubmit)}>

              <LabelInputContainer className="mb-7">
                <Input
                  required
                  id="category"
                  placeholder="Write Category Name"
                  type="text"
                  {...register("category",
                    {
                      maxLength: { value: 20, message: "Max 20 characters" },
                      minLength: { value: 3, message: "Min 3 characters" },
                      pattern: {
                        value: /^[A-Za-z]+$/,
                        message: "Start with a letter, only letters and numbers"
                      }
                    })
                  }
                />
                {errors.category && <span className="text-red-500 text-xs">{errors.category.message}</span>}
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

      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 md:gap-6 gap-3 my-8 ">
        <div className="bg-gray-950/50 border-1 border-white/10 rounded-xl md:p-6 p-3 px-4 text-white shadow">
          <div className="md:text-lg text-xs font-semibold">Total Categories</div>
          <div className="md:text-2xl text-xs  font-bold md:mt-2">{categories.length}</div>
        </div>
        <div className="bg-gray-950/50 border-1 border-white/10 rounded-xl md:p-6 p-3 px-4 text-white shadow">
          <div className="md:text-lg text-xs font-semibold">Total Income</div>
          <div className="md:text-2xl font-bold text-xs md:mt-2">₹{transactionSummary.totalIncome}</div>
        </div>
        <div className="bg-gray-950/50 border-1 border-white/10 rounded-xl md:p-6 p-3 px-4 text-white shadow">
          <div className="md:text-lg text-xs font-semibold">Total Expenses</div>
          <div className="md:text-2xl text-xs font-bold md:mt-2">₹{transactionSummary.totalExpense}</div>
        </div>
        <div className="bg-gray-950/50 border-1 border-white/10 rounded-xl md:p-6 p-3 px-4 text-white shadow">
          <div className="md:text-lg text-xs font-semibold">Most Used</div>
          <div className="md:text-2xl text-xs font-bold md:mt-2">Food</div>
        </div>
      </div>

      <div className='grid grid-cols-1  gap-6 my-8 '>

        <div className='bg-gray-950/50 rounded-xl p-4  md:p-6 md:py-4 md:text-xl grid grid-cols-1 gap-6 border  border-gray-900 text-white shadow-xl'>
          <div className='md:text-2xl font-semibold flex w-full justify-between'>
            <span>
              Category Management
            </span>

            <input type="text" name="" id="" className='rounded-3xl border-2 border-white/10 px-2 md:px-5  md:text-base text-xs font-normal h-8 md:h-10' placeholder='Search' onChange={(e) => setSearchCategory((e.target.value).toLowerCase())} />

          </div>
          <div className='flex flex-col items-center w-full gap-3'>
            {
              categories.length > 0 ? (
                categories.filter(category =>
                  category.name.toLowerCase().includes(searchCategory)
                ).map((category, idx) => (
                  <div key={category.id} className='w-full flex md:px-7 flex-row px-4 rounded-xl py-3 sm:px-6 2xl:py-3 bg-gray-900   items-center shadow-lg '>

                    <div className='w-1/2 flex items-center h-full text-white  text-xs 2xl:text-lg xl:text-md  '>
                      <span className="inline-block mr-2 w-2 h-2 rounded-4xl bg-gray-700"></span>
                      {category.name}
                    </div>
                    <div className='w-1/2 flex justify-end gap-3 md:gap-10'>





                      <Dialog open={editDialogIndex === idx} onOpenChange={(open) => setEditDialogIndex(open ? idx : null)}>

                        <DialogTrigger asChild>
                          <span onClick={() => {
                            setDialogOpen1(false);

                            setEditDialogIndex(idx)
                          }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xl:h-6 xl:w-6 text-gray-300 hover:text-white transition-colors duration-150 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V17h4" />
                            </svg>
                          </span>


                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[425px] bg-black border-none text-white">

                          <DialogHeader>
                            <DialogTitle>Update Category</DialogTitle>
                          </DialogHeader>

                          <form className="my-5" onSubmit={handleSubmit2((data) => handleUpdateCategory(category.id, data))}>

                            <LabelInputContainer className="mb-7">
                              <Input
                                required
                                id="category"
                                placeholder="Write Category Name"
                                type="text"
                                {...register2("category",
                                  {
                                    maxLength: { value: 20, message: "Max 20 characters" },
                                    minLength: { value: 3, message: "Min 3 characters" },
                                    pattern: {
                                      value: /^[A-Za-z]+$/,
                                      message: "Start with a letter, only letters and numbers"
                                    }
                                  })
                                }
                              />
                              {errors2.category && <span className="text-red-500 text-xs">{errors2.category.message}</span>}
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



                      <span onClick={() => handleDeleteCategory(category.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xl:h-6 xl:w-6 text-gray-300 hover:text-red-500 transition-colors duration-150 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </span>

                    </div>
                  </div>
                ))
              ) : (
                <div className='text-gray-500 mb-3 md:text-base text-xs'>

                  Create your first category
                </div>
              )
            }





          </div>
        </div>
      </div>
    </div >

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
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export default CategoryPage