import { useState, useEffect } from 'react';
import { useGoalStore } from '@/store/goalStore';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';
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
import api from '@/lib/api';
import { Tabs } from "@/components/ui/tabs";
import GoalProgress from '@/components/goalProgress';
import GoalAnalytics from '@/components/GoalAnalytics';

export default function GoalsPage() {

  const goals = useGoalStore((state) => state.goals);
  const fetchGoals = useGoalStore((state) => state.fetchGoals)


  const activeGoals = goals.filter(g => g.status === 'IN_PROGRESS' || g.status === 'NOT_STARTED');
  const completedGoals = goals.filter(g => g.status === 'COMPLETED');
  const overdueGoals = goals.filter(g => g.status === 'OVERDUE');

  const [dialogOpen1, setDialogOpen1] = useState(false);


  interface GoalFormType {
    name: string;
    description: string;
    targetAmount: number;
    startDate: string;
    deadline: string;
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalFormType>()
  async function onSubmit(data: GoalFormType) {
    try {
      const goals = await api.post("/goal", {
        name: data.name,
        description: data.description,
        targetAmount: Number(data.targetAmount),
        startDate: data.startDate,
        deadline: data.deadline

      })
      console.log(goals)
      await fetchGoals();
      reset();
      setDialogOpen1(false)
      console.log(goals);
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err)
        alert(err?.response?.data || "Failed creating a new budget")
      }
      else {
        alert("Failed creating a new budget")
      }
    }
  }

  const tabs = [
    {
      title: "All Goals",
      value: "All Goals",
      content: (
        <GoalProgress />
      ),
    },
    {
      title: "Analytics",
      value: "Analytics",
      content: (
        <GoalAnalytics/>
      ),
    },
  ];

  return (
    <div className="min-h-screen overflow-auto md:p-10 p-3 bg-gradient-to-br from-black via-gray-900 to-black ">

      <h1 className="2xl:text-5xl md:mb-8 xl:text-4xl text-3xl mb-5 font-semibold text-white">
        Goals
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 md:gap-6 gap-3 my-8 ">
        <div className="bg-gray-950/50 border-1 border-white/10 rounded-xl md:p-6 p-3 px-4 text-white shadow">
          <div className="md:text-lg text-xs font-semibold">Total Goals</div>
          <div className="md:text-2xl text-xs  font-bold md:mt-2">
            {goals.length}
          </div>
        </div>
        <div className="bg-gray-950/50 border-1 border-white/10 rounded-xl md:p-6 p-3 px-4 text-white shadow">
          <div className="md:text-lg text-xs font-semibold">Goals Completed</div>
          <div className="md:text-2xl font-bold text-xs md:mt-2">
            {completedGoals.length}
          </div>
        </div>
        <div className="bg-gray-950/50 border-1 border-white/10 rounded-xl md:p-6 p-3 px-4 text-white shadow">
          <div className="md:text-lg text-xs font-semibold">Active Goals</div>
          <div className="md:text-2xl text-xs font-bold md:mt-2">
            {activeGoals.length}
          </div>
        </div>
        <div className="bg-gray-950/50 border-1 border-white/10 rounded-xl md:p-6 p-3 px-4 text-white shadow">
          <div className="md:text-lg text-xs font-semibold">Goals Overdue</div>
          <div className="md:text-2xl text-xs font-bold md:mt-2">
            {overdueGoals.length}
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen1} onOpenChange={setDialogOpen1}>

        <DialogTrigger asChild>
          <button className="px-8 py-2 mb-8 rounded-full relative bg-gray-950 cursor-pointer text-white text-sm hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-600" onClick={() => setDialogOpen1(true)}>
            <div className="absolute inset-x-0 h-px w-1/2 mx-auto   -top-px shadow-2xl  bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
            <span className="relative z-20 text-center flex justify-center items-center">
              <span className='text-xl text-center'>+&nbsp; </span> Goal
            </span>
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] bg-black border-none text-white">

          <DialogHeader>
            <DialogTitle>Add Goals</DialogTitle>
          </DialogHeader>

          <form className="my-5 " onSubmit={handleSubmit(onSubmit)}>

            <LabelInputContainer className="mb-7">
              <Label htmlFor="name" className="mb-2">Name</Label>
              <Input
                required
                id="name"
                placeholder="Write Goal Name"
                type="text"

                {...register("name",
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
            </LabelInputContainer>

            <LabelInputContainer className="mb-7">
              <Label htmlFor="description" className="mb-2">Description</Label>
              <Input
                required
                id="description"
                placeholder="Goal description"

                type="text"
                {...register("description",
                  {
                    maxLength: { value: 100, message: "Max 100 characters" },
                    minLength: { value: 3, message: "Min 3 characters" },
                    pattern: {
                      value: /^[A-Za-z0-9 .,'&-]{3,50}$/,
                      message: "Start with a letter, only letters and numbers"
                    }
                  })
                }
              />
              {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
            </LabelInputContainer>

            <LabelInputContainer className="mb-7">
              <Label htmlFor="targetAmount" className="mb-2">Target Amount</Label>
              <Input
                required
                id="targetAmount"
                placeholder="Target Amount"

                type="number"
                {...register("targetAmount")}
              />
            </LabelInputContainer>

            <div className='flex flex-wrap md:flex-nowrap md:gap-2'>
              <LabelInputContainer className="mb-7">
                <Label htmlFor="startDate" className="mb-2">Start Date</Label>
                <Input
                  required
                  id="startDate"

                  type="date"
                  {...register("startDate")}
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-7">
                <Label htmlFor="deadline" className="mb-2">Deadline</Label>
                <Input
                  required
                  id="deadline"

                  type="date"
                  {...register("deadline")}
                />
              </LabelInputContainer>
            </div>


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

      <Tabs tabs={tabs}
        contentClassName="w-full bg-black rounded-xl"
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