
import { Link } from "react-router-dom";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { SparklesCore } from "@/components/ui/sparkles";


function LandingPage() {
  return (
    <div className=" overflow-x-hidden  min-h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 sm:px-8 md:px-20 py-4 bg-black shadow-lg border-b border-b-white/10 ">
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-bold text-white tracking-wide">Budget Buddy</span>
        </div>
        <div className="flex gap-4 sm:gap-8 items-center">
          <Link to="/login" className="bg-white text-black font-semibold px-4 sm:px-5 py-2 rounded-lg shadow hover:bg-gray-100 transition">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className=" bg-gradient-to-br from-black via-gray-900 to-black flex-1 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 py-10 sm:py-20 h-[85vh] w-screen mx-auto">
        {/* Left: Headline and CTA */}
        <div className="flex-1 flex flex-col justify-center items-center">
          <h1 className="text-3xl sm:text-5xl 2xl:text-7xl xl:text-5xl w-full sm:w-[80%] md:w-[50%] font-bold text-white text-center mb-4 sm:mb-6 leading-tight">
            Take Control of Your<br />Financial Future
          </h1>
          <p className="text-lg 2xl:text-2xl xl:text-xl sm:text-2xl text-gray-300  mb-6 sm:mb-8 w-full sm:w-[80%] md:w-[50%] text-center">
            Advanced analytics and intelligent insights to track expenses, plan budgets, and achieve your financial goals with precision and ease.
          </p>
          <div className="flex gap-2 sm:gap-4">
            <Link to="/register" className="bg-white text-black font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow hover:bg-gray-100 transition">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative bg-black py-10 sm:py-16 flex flex-col items-center justify-center w-full">
        {/* Features Section Text Above Sparkles */}
        <div className="relative z-10 text-center w-full px-2 sm:px-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Powerful Features for Smart Money Management</h2>
          <p className="text-gray-400 text-base sm:text-lg">Everything you need to master your finances in one intelligent platform</p>
        </div>

        {/* Sparkles Effect */}
        <div className="absolute top-0 left-0 z-0 w-full h-full flex flex-col items-center justify-center">
          {/* Gradients */}
          <div className="absolute inset-x-8 sm:inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-8 sm:inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-24 sm:inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-24 sm:inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

          {/* Core component */}
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={600}
            className="w-full h-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px]"
            particleColor="#FFFFFF"
          />

          {/* Radial Gradient to prevent sharp edges */}
          <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(700px_200px_at_top,transparent_20%,white)]"></div>
        </div>

        {/* Card Components*/}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 sm:gap-12 md:gap-15 my-8 sm:my-10 w-full px-2">
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
        </div>
      </section>
    </div>
  );
}

export default LandingPage;