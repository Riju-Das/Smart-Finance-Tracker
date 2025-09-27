import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { SparklesCore } from "@/components/ui/sparkles";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { useAuthStore } from "../store/authStore";
import api from "../lib/api";
import { LoaderOne } from "@/components/ui/loader";

function LandingPage() {
  const navigate = useNavigate()
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const [loaded, setLoaded] = useState(false);

  function handleStartedClick() {
    if (user) {
      navigate("/dashboard")
    }
    else {
      navigate("/register")
    }
  }

  useEffect(() => {
    async function fetchSession() {
      try {
        if (!accessToken) {
          const res = await api.post("/refresh");
          setAccessToken(res.data.accessToken);
          const userRes = await api.get("/user-detail");
          setUser(userRes.data);
        } else if (!user) {
          const userRes = await api.get("/user-detail");
          setUser(userRes.data);
        }
        setLoaded(true);
      } catch (err) {
        if (accessToken || user) {
          try { await api.post("/logout"); } catch {}
          logout();
        }
        setLoaded(true);
      }
    }
    fetchSession();

  }, [accessToken, user, setAccessToken, setUser, logout]);

  if (!loaded) {
    return (
      <div className='w-screen h-screen bg-black flex items-center justify-center'>
        <LoaderOne />
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden min-h-screen">
    
      <nav className="flex items-center justify-between px-4 sm:px-8 md:px-20 py-4 bg-black shadow-lg border-b border-b-white/10 ">
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-bold text-white tracking-wide">Budget Buddy</span>
        </div>
        {
          user ? (
            <div className="flex gap-4 bg-black sm:gap-8 items-center md:text-xl text-white font-semibold px-4 sm:px-5 py-1 ">
              {user?.fullname}
            </div>
          ) : (
            <Link to="/login">
              <div className="flex gap-4 bg-black sm:gap-8 items-center border-gray-300 border-[1px] rounded-3xl hover:text-black text-white font-semibold px-4 sm:px-5 py-1 hover:bg-gray-100">
                Login
              </div>
            </Link>
          )
        }
      </nav>


      < section className=" bg-gradient-to-br from-black via-gray-900 to-black flex-1 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 py-10 sm:py-20 h-[85vh] w-screen mx-auto" >
      
        < div className="flex-1 flex flex-col justify-center items-center" >
          <h1 className="text-3xl sm:text-5xl 2xl:text-7xl xl:text-5xl w-full sm:w-[80%] md:w-[50%] font-bold text-white text-center mb-4 sm:mb-6 leading-tight">
            Take Control of Your<br />Financial Future
          </h1>
          <p className="text-xs 2xl:text-xl xl:text-lg text-gray-300  mb-6 sm:mb-8 w-full sm:w-[80%] md:w-[45%] text-center">
            Advanced analytics and intelligent insights to track expenses, plan budgets, and achieve your financial goals with precision and ease.
          </p>

          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            onClick={handleStartedClick}
            className=" bg-white text-black dark:bg-gray-900 dark:text-white flex    items-center space-x-2 cursor-pointer"
          >
            Get Started
          </HoverBorderGradient>


        </div >
      </section >

      
      < section className="relative bg-black py-10 sm:py-16 flex flex-col items-center justify-center w-full" >
      
        < div className="relative z-10 text-center w-full px-2 sm:px-0" >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Powerful Features for Smart Money Management</h2>
          <p className="text-gray-400 text-base sm:text-lg">Everything you need to master your finances in one intelligent platform</p>
        </div >

    
        < div className="absolute top-0 left-0 z-0 w-full h-full flex flex-col items-center justify-center" >
    
          < div className="absolute inset-x-8 sm:inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-8 sm:inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-24 sm:inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-24 sm:inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

        
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={600}
            className="w-full h-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px]"
            particleColor="#FFFFFF"
          />

        
          <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(700px_200px_at_top,transparent_20%,white)]"></div>
        </div >

      
        < div className="flex flex-col md:flex-row items-center justify-center gap-8 sm:gap-12 md:gap-15 my-8 sm:my-10 w-full px-2" >
          <CardSpotlight className="p-6 sm:p-10 w-full sm:w-96 h-80 sm:h-96 flex flex-col items-center">
            <p className="text-xl sm:text-2xl font-bold relative z-20 mt-2 text-white">
              Expense Tracking
            </p>
            <ul className="text-neutral-200 mt-4 relative z-20 list-disc pl-4">
              <li className="my-2">Quickly identify high-spending areas.</li>
              <li className="my-2">Set smarter budgets for each category.</li>
              <li className="my-2">Receive alerts when spending patterns deviate from your goals.</li>
              <li className="my-2">Gain actionable insights to optimize your financial decisions.</li>
            </ul>
          </CardSpotlight>

          <CardSpotlight className="p-6 sm:p-10 w-full sm:w-96 h-80 sm:h-96 flex flex-col items-center">
            <p className="text-xl sm:text-2xl font-bold relative z-20 mt-2 text-white">
              Budget Planning
            </p>
            <ul className="text-neutral-200 mt-4 relative z-20 list-disc pl-4">
              <li className="my-2">Personalized budgets for every category.</li>
              <li className="my-2">Smart recommendations based on habits.</li>
              <li className="my-2">Receive real-time alerts when nearing your limits.</li>
              <li className="my-2">Track progress with clear insights and visual summaries.</li>
            </ul>
          </CardSpotlight>

          <CardSpotlight className="p-6 sm:p-10 w-full sm:w-96 h-80 sm:h-96 flex flex-col items-center">
            <p className="text-xl sm:text-2xl font-bold relative z-20 mt-2 text-white">
              Goal Setting
            </p>
            <ul className="text-neutral-200 mt-4 relative z-20 list-disc pl-4">
              <li className="my-2">Define clear, personalized goals.</li>
              <li className="my-2">Track progress with visuals.</li>
              <li className="my-2">Get milestone alerts to stay motivated.</li>
              <li className="my-2">Achieve targets with smart planning support.</li>
            </ul>
          </CardSpotlight>
        </div >
      </section >
    </div >
  );
}

export default LandingPage;