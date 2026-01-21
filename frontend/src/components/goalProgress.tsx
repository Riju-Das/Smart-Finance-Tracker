import { Progress2 } from "./ui/progress2"
import { useState, useEffect } from 'react';
import { useGoalStore } from '@/store/goalStore';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form"
import api from '@/lib/api';
import { toast } from 'sonner'

function GoalProgress() {

  interface GoalFormType {
    name: string;
    description: string;
    targetAmount: number;
    startDate: string;
    deadline: string;
  }

  interface ContributionFormType {
    amount: number
  }

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GoalFormType>()

  const {
    register: register1,
    handleSubmit: handleSubmit1,
  } = useForm<ContributionFormType>()

  const goals = useGoalStore((state) => state.goals)
  const fetchGoals = useGoalStore((state) => state.fetchGoals)
  const [editDialogIndex1, setEditDialogIndex1] = useState<number | null>(null);
  const [editDialogIndex2, setEditDialogIndex2] = useState<number | null>(null);
  const [goaltype, setGoalType] = useState("");

  async function handleAddContribution(data: ContributionFormType, id: string) {
    try {
      await api.post(`goal/${id}/contribution`, {
        amount: data.amount
      })
      await fetchGoals()
      setEditDialogIndex2(null)
      reset()
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed updating Goal");
      }
      else {
        toast.error("Failed updating Goal");
      }
    }
  }

  async function handleGoalDelete(id: string) {
    try {
      await api.delete(`goal/${id}`);
      await fetchGoals()
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed updating Goal");
      }
      else {
        toast.error("Failed updating Goal");
      }
    }
  }

  async function onSubmit(data: GoalFormType, id: string) {
    try {
      await api.put(`/goal/${id}`, {
        name: data.name,
        description: data.description,
        targetAmount: Number(data.targetAmount),
        startDate: data.startDate,
        deadline: data.deadline
      })

      await fetchGoals()
      reset()
      setEditDialogIndex1(null)
    }
    catch (err) {
      console.log(err)
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed updating Goal");
      }
      else {
        toast.error("Failed updating Goal");
      }
    }
  }

  return (
    <div>
      <div className="mb-4">
        <select
          value={goaltype}
          onChange={(e) => setGoalType(e.target.value)}
          id="selectSort"
          className="rounded-md border mx-3 border-white/10 bg-gray-950/50 text-white px-3 py-2 w-auto"
        >
          <option className="bg-gray-950 " value="">All Goals</option>
          <option className="bg-gray-950" value="NOT_STARTED">Not Started</option>
          <option className="bg-gray-950" value="IN_PROGRESS">In Progress</option>
          <option className="bg-gray-950" value="COMPLETED">Completed</option>
          <option className="bg-gray-950" value="OVERDUE">Overdue</option>
        </select>
      </div>

      <div className="w-full  flex flex-wrap text-gray-400 gap-3 my-5 rounded-2xl">
        {
          goals.length > 0 ? (
            goals
              .filter(goal => !goaltype || goal.status === goaltype)
              .map((goal, idx) => (
                <div key={goal.id} className="w-full bg-gray-950/50 md:px-8 p-5  text-gray-400 border-1 border-white/10 rounded-2xl ">
                  <div className="flex mb-5 justify-between">
                    <div >
                      <div className=" md:flex gap-5 items-center">
                        <div className="text-white mb-2 md:text-xl text-base">
                          {goal.name}
                        </div>
                        <div className="bg-gray-800 text-center mb-2  border-1 text-xs md:text-base border-gray-900 rounded-4xl px-2">
                          {
                            goal.status === "OVERDUE" && (
                              <>
                                Overdue
                              </>
                            )

                          }
                          {
                            goal.status === "COMPLETED" && (
                              <>
                                Completed
                              </>
                            )

                          }
                          {
                            goal.status === "IN_PROGRESS" && (
                              <>
                                In progress
                              </>
                            )

                          }
                          {
                            goal.status === "NOT_STARTED" && (
                              <>
                                Not Started
                              </>
                            )

                          }
                        </div>
                      </div>
                      <div className=" text-xs md:text-base">
                        {goal.description}
                      </div>
                    </div>
                    <div className="flex md:gap-10 gap-3 text-xs md:text-base ">

                      <Dialog open={editDialogIndex2 === idx} onOpenChange={(open) => setEditDialogIndex2(open ? idx : null)}>

                        <DialogTrigger asChild>
                          <button className="bg-gray-800 border-1 border-gray-900 cursor-pointer hover:bg-gray-900 hover:text-gray-200 md:h-10 h-8 text-white rounded-4xl px-3 md:px-5 py-2"
                            onClick={() => {
                              setEditDialogIndex2(idx)
                            }}
                          >
                            + Contribution
                          </button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[425px] bg-black border-none text-white">

                          <DialogHeader>
                            <DialogTitle>Add Contribution</DialogTitle>
                          </DialogHeader>

                          <form className="my-5 " onSubmit={handleSubmit1((data) => handleAddContribution(data, goal.id))}>


                            <LabelInputContainer className="mb-7">
                              <Label htmlFor="contributionAmount" className="mb-2">Contribution Amount</Label>
                              <Input
                                required
                                id="contributionAmount"
                                placeholder="Contribution Amount"

                                type="number"
                                {...register1("amount")}
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




                      <Dialog open={editDialogIndex1 === idx} onOpenChange={(open) => setEditDialogIndex1(open ? idx : null)}>

                        <DialogTrigger asChild>
                          <button className="md:h-10 h-8 bg-gray-800 cursor-pointer hover:bg-gray-900 hover:text-gray-200 md:px-5 px-3 text-white rounded-4xl"
                            onClick={() => {

                              reset({
                                name: goal.name,
                                description: goal.description,
                                targetAmount: goal.targetAmount,
                                startDate: goal.startDate,
                                deadline: goal.deadline
                              });
                              setEditDialogIndex1(idx)
                            }}

                          >
                            Edit Goal
                          </button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[425px] bg-black border-none text-white">

                          <DialogHeader>
                            <DialogTitle>Edit Goal</DialogTitle>
                          </DialogHeader>

                          <form className="my-5 " onSubmit={handleSubmit((data) => onSubmit(data, goal.id))}>

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
                      <div className="md:h-10 cursor-pointer hover:text-red-600 h-8 "
                        onClick={() => handleGoalDelete(goal.id)}
                      >
                        X
                      </div>
                    </div>

                  </div>


                  <div className="text-xs md:text-base ">
                    <div className="mb-2">
                      <Progress2 value={Math.round((goal.currentAmount / goal.targetAmount) * 100)} className="w-full  bg-gray-700 h-2" />
                    </div>
                    <div>
                      {goal.currentAmount} - {goal.targetAmount}
                    </div>

                  </div>
                </div>
              ))
          ) : (
            <div className="w-full text-center text-gray-500 py-10">
              No goals found.
            </div>
          )
        }
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

export default GoalProgress