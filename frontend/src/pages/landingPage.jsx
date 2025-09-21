import { Link } from "react-router-dom";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { SparklesCore } from "@/components/ui/sparkles";

function LandingPage() {
  return (
    <div className=" bg-gradient-to-br from-black via-gray-900 to-black overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-20 py-4 bg-black  shadow-lg border-b border-b-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white tracking-wide">Budget Buddy</span>
        </div>
        <div className="flex gap-8 items-center">
          <Link className="bg-white text-black font-semibold px-5 py-2 rounded-lg shadow hover:bg-gray-100 transition">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className=" flex-1 flex flex-col md:flex-row items-center  justify-between px-8 py-20 w-screen h-200 mx-auto">
        {/* Left: Headline and CTA */}
        <div className="flex-1 flex flex-col justify-center items-center">
          <h1 className="text-5xl md:text-7xl w-[50%] font-bold text-white text-center mb-6 leading-tight">
            Take Control of Your<br />Financial Future
          </h1>
          <p className="text-2xl text-gray-300 mb-8 w-[50%] text-center">
            Advanced analytics and intelligent insights to track expenses, plan budgets, and achieve your financial goals with precision and ease.
          </p>
          <div className="flex gap-4">
            <Link className="bg-white text-black font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-black py-16 flex flex-col itmes-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Powerful Features for Smart Money Management</h2>
          <p className="text-gray-400 text-lg">Everything you need to master your finances in one intelligent platform</p>
        </div>
        <div className=" flex items-center justify-center gap-20 my-10 w-full">

          <CardSpotlight className="p-10 w-96 h-96 flex flex-col items-center ">
            <p className="text-2xl font-bold relative z-20 mt-2 text-white">
              Expense Tracking
            </p>
            <ul className="text-neutral-200 mt-4 relative z-20 list-disc ">
              <li className="my-2">Quickly identify high-spending areas.</li>
              <li className="my-2">Set smarter budgets for each category.</li>
              <li className="my-2">Receive alerts when spending patterns deviate from your goals.</li>
              <li className="my-2">Gain actionable insights to optimize your financial decisions.</li>
            </ul>
          </CardSpotlight>

          <CardSpotlight className="p-10 w-96 h-96 flex flex-col items-center ">
            <p className="text-2xl font-bold relative z-20 mt-2 text-white">
              Budget Planning
            </p>
            <ul className="text-neutral-200 mt-4 relative z-20 list-disc ">
              <li className="my-2">Personalized budgets for every category.</li>
              <li className="my-2">Smart recommendations based on habits.</li>
              <li className="my-2">Receive real-time alerts when nearing your limits.</li>
              <li className="my-2">Track progress with clear insights and visual summaries.</li>
            </ul>
          </CardSpotlight>

          <CardSpotlight className="p-10 w-96 h-96 flex flex-col items-center ">
            <p className="text-2xl font-bold relative z-20 mt-2 text-white">
              Goal Setting
            </p>
            <ul className="text-neutral-200 mt-4 relative z-20 list-disc ">
              <li className="my-2">Define clear, personalized goals.</li>
              <li className="my-2">Track progress with visuals.</li>
              <li className="my-2">Get milestone alerts to stay motivated.</li>
              <li className="my-2">Achieve targets with smart planning support.</li>
            </ul>
          </CardSpotlight>

        </div>
        <div className="w-[100%] h-40 relative flex flex-col itmes-center justify-center">
          {/* Gradients */}
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

          {/* Core component */}
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />

          {/* Radial Gradient to prevent sharp edges */}
          <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]">
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;