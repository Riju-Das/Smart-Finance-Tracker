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


function BudgetPage() {

  interface BudgetFormType {
    categoryId: string;
    period: string;
    amount: string;
    startDate: string;
    endDate: string
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormType>()


  return (
    <div className="min-h-screen md:p-10 p-3 bg-gradient-to-br from-black via-gray-900 to-black ">
      <h1 className="2xl:text-5xl md:mb-8 xl:text-4xl text-3xl mb-5 font-semibold text-white">
        Budget
      </h1>

    </div>
  )
}

export default BudgetPage