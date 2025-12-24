import { useEffect, useState, } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar'
import { useAuthStore } from './store/authStore'
import api from './lib/api'
import { LoaderOne } from "@/components/ui/loader";
import { useCategoryStore } from './store/categoryStore'
import { useTransactionStore } from './store/transactionStore'
import axios from 'axios'
import { useBudgetStore } from './store/budgetStore'
import { Satellite } from 'lucide-react'
import { useGoalStore } from './store/goalStore'
import { Toaster } from 'sonner'

function App() {
  const navigate = useNavigate();

  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout)

  const [loaded, setLoaded] = useState(false)
  const [categoryLoaded, setCategoryLoaded] = useState(false)
  const [transactionLoaded, setTransactionLoaded] = useState(false)
  const [budgetLoaded, setBudgetLoaded] = useState(false)
  const [goalsLoaded, setGoalsLoaded] = useState(false)

  const setCategories = useCategoryStore((state) => state.setCategories)
  const setTransactions = useTransactionStore((state) => state.setTransactions)
  const setBudgets = useBudgetStore((state) => state.setBudgets)
  const setGoals = useGoalStore((state) => state.setGoals)

  const fetchTransactionSummary = useTransactionStore((state) => state.fetchTransactionSummary)

  async function fetchSession() {
    try {
      if (!accessToken) {
        const res = await api.post("/refresh")
        setAccessToken(res.data.accessToken);
        const userRes = await api.get("/user-detail");
        setUser(userRes.data);
      }
      else if (!user) {
        const userRes = await api.get("/user-detail");
        setUser(userRes.data);
      }
      setLoaded(true)
    }
    catch (err) {
      await api.post("/logout");
      logout()
      navigate("/login");
    }
  }

  async function fetchCategories() {
    try {
      const res = await api.get("/categories");
      setCategories(res.data)
      setCategoryLoaded(true)
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err?.response?.data?.message || "Failed to fetch categories")
      }
    }
  }

  async function fetchTransactions() {
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data);
      setTransactionLoaded(true)

      await fetchTransactionSummary()

    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err?.response?.data?.message || "Failed to fetch transactions")
      }

    }
  }

  async function fetchBudgets() {
    try {
      const res = await api.get("/budget");
      setBudgets(res.data);
      setBudgetLoaded(true)
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err?.response?.data?.message || "Failed to fetch Budgets")
      }
    }
  }

  async function fetchGoals() {
    try {
      const res = await api.get("/goal");
      setGoals(res.data);
      setGoalsLoaded(true)
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err?.response?.data?.message || "Failed to fetch Goals")
      }
    }
  }

  useEffect(() => {
    if (loaded) {
      fetchTransactions()
      fetchCategories()
      fetchBudgets()
      fetchGoals()
    }
  }, [loaded])


  useEffect(() => {
    fetchSession()
  }, [accessToken, user, setAccessToken, setUser, logout])

  return (
    <>
      <Toaster position="top-right" richColors />
      {
        loaded && categoryLoaded && transactionLoaded && budgetLoaded && goalsLoaded ? (
          <div className='flex flex-col md:flex-row min-h-screen h-screen'>
            <Navbar />

            <main className=' flex-1 h-screen overflow-hidden '>
              <div className="h-full overflow-y-auto">
                <Outlet />
              </div>
            </main>
          </div>
        ) : (
          <div className='w-screen h-screen bg-black flex items-center justify-center'>
            <LoaderOne />
          </div>
        )
      }

    </>

  )
}

export default App
