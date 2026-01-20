import { useAuthStore } from '../store/authStore'
import { useTransactionStore } from '../store/transactionStore'
import { useBudgetStore } from '../store/budgetStore'
import { useGoalStore } from '../store/goalStore'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Progress2 } from '@/components/ui/progress2'
import ExpenseByCategory from '@/components/ExpenseByCategory'
import MonthlyTransactionAnalytics from '@/components/MonthlyTransactionAnalytics'
import BudgetProgress from '@/components/budgetProgress'

function Dashboard() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Dashboard - Budget Buddy'
  }, [])

  const user = useAuthStore((state) => state.user)
  const transactionSummary = useTransactionStore((state) => state.transactionSummary)
  const transactions = useTransactionStore((state) => state.transactions)
  const goals = useGoalStore((state) => state.goals)

  const recentTransactions = transactions.slice(0, 5)
  const activeGoals = goals.filter((g) => g.status === 'IN_PROGRESS' || g.status === 'NOT_STARTED').slice(0, 3)



  const getGoalProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-3 md:p-6">

      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl xl:text-5xl font-semibold text-white">
          Welcome back, {user?.fullname?.split(' ')[0]}
        </h1>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
        <div className="bg-gray-950/50 border-1 border-white/10 rounded-xl p-4 md:p-6 text-white">
          <p className="text-white text-xs md:text-sm font-medium">Net Balance</p>
          <p className={`text-xl md:text-3xl font-bold mt-2 ${transactionSummary.netAmount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            ₹{transactionSummary.netAmount}
          </p>
        </div>

        <div className="bg-gray-950/50 border-1 border-white/10 rounded-xl p-4 md:p-6 text-white">
          <p className="text-white text-xs md:text-sm font-medium">Total Income</p>
          <p className="text-xl md:text-3xl font-bold mt-2 text-emerald-400">
            ₹{transactionSummary.totalIncome}
          </p>
        </div>

        <div className="bg-gray-950/50 border-1 border-white/10 rounded-xl p-4 md:p-6 text-white">
          <p className="text-white text-xs md:text-sm font-medium">Total Expenses</p>
          <p className="text-xl md:text-3xl font-bold mt-2 text-red-400">
            ₹{transactionSummary.totalExpense}
          </p>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <MonthlyTransactionAnalytics />
        <ExpenseByCategory />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

        <div className="bg-gray-950/50 border-1 border-white/10 rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg md:text-xl">Recent Transactions</h2>
            <button onClick={() => navigate('/transactions')} className="text-xs text-gray-400 hover:text-white transition-colors">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tx.category?.color }}></span>
                    <div>
                      <p className="text-white text-sm font-medium truncate max-w-[120px] md:max-w-[150px]">
                        {tx.description}
                      </p>
                      <p className="text-gray-500 text-xs">{tx.category?.name}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-semibold ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'}₹{tx.amount}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">No transactions yet</div>
            )}
          </div>
        </div>


        <BudgetProgress period="MONTH" showSelfPeriod={false} />


        <div className="bg-gray-950/50 border-1 border-white/10 rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg md:text-xl">Savings Goals</h2>
            <button onClick={() => navigate('/goal')} className="text-xs text-gray-400 hover:text-white transition-colors">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {activeGoals.length > 0 ? (
              activeGoals.map((goal) => {
                const progress = getGoalProgress(goal.currentAmount, goal.targetAmount)
                return (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-white text-sm truncate max-w-[150px]">{goal.name}</span>
                      <span className="text-gray-400 text-xs">{progress}%</span>
                    </div>
                    <Progress2 value={progress} className="h-2 bg-gray-800" />
                    <p className="text-gray-500 text-xs mt-1">
                    ₹{goal.currentAmount} of ₹{goal.targetAmount}
                    </p>
                  </div>
                )
              })
            ) : (
              <div className="text-center text-gray-500 py-8">No active goals</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard