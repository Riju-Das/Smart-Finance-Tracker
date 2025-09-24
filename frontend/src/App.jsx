import { useEffect, useState } from 'react'
import { useNavigate,Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar'
import { useAuthStore } from './store/authStore'
import api from './lib/api'
import { LoaderOne } from "@/components/ui/loader";


function App() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout)
  const [loaded, setLoaded] = useState(false)

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

  useEffect(() => {
    fetchSession()
  }, [accessToken, user, setAccessToken, setUser, logout])

  return (
    loaded ? (
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

  )
}

export default App
