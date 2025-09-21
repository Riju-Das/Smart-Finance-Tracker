

function LandingPage() {
  return (
    <div className=" bg-gradient-to-br from-black via-gray-900 to-black overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-20 py-4 bg-black  shadow-lg border-b border-b-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white tracking-wide">Budget Buddy</span>
        </div>
        <div className="flex gap-8 items-center">
          <button className="bg-white text-black font-semibold px-5 py-2 rounded-lg shadow hover:bg-gray-100 transition">Login</button>
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
            <button className="bg-white text-black font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-black py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Powerful Features for Smart Money Management</h2>
          <p className="text-gray-400 text-lg">Everything you need to master your finances in one intelligent platform</p>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;