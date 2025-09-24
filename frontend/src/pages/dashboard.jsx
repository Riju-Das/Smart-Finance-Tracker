import { useAuthStore } from '../store/authStore'
function Dashboard() {
  const user = useAuthStore((state)=>state.user)
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <h1 className="2xl:text-5xl md:mb-10 xl:text-4xl text-xl mb-5 font-semibold text-white">Welcome, {user.fullname}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ">
        <div className="bg-white/10 rounded-xl p-6 text-white shadow">
          <div className="text-lg font-semibold">Total Balance</div>
          <div className="text-2xl font-bold mt-2">₹0</div>
        </div>
        <div className="bg-white/10 rounded-xl p-6 text-white shadow">
          <div className="text-lg font-semibold">Total Income</div>
          <div className="text-2xl font-bold mt-2">₹0</div>
        </div>
        <div className="bg-white/10 rounded-xl p-6 text-white shadow">
          <div className="text-lg font-semibold">Total Expenses</div>
          <div className="text-2xl font-bold mt-2">₹0</div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard