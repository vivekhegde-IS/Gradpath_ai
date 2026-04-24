// frontend/app/page.js
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center pt-24 px-4 overflow-hidden">
      {/* Hero Section */}
      <div className="max-w-4xl text-center space-y-8 relative">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-600/20 blur-[120px]"></div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
          Your AI Journey to <br />
          <span className="text-indigo-500">Global Excellence</span>
        </h1>
        
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          GradPath AI utilizes advanced intelligence to match your profile with elite universities 
          worldwide. Get personalized mentoring, loan estimates, and career roadmaps.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/signup" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-lg font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95 text-white">
            Sign Up Free
          </Link>
          <Link href="/login" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-lg font-bold rounded-2xl transition-all border border-slate-700 active:scale-95 text-white">
            Access Dashboard
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <section className="mt-40 max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 pb-40">
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
          <div className="w-12 h-12 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-400 font-bold">01</div>
          <h3 className="text-xl font-bold">University Matcher</h3>
          <p className="text-slate-400 leading-relaxed">
            Instant filtering against a global dataset based on your GPA, budget, and test scores.
          </p>
        </div>
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
          <div className="w-12 h-12 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-400 font-bold">02</div>
          <h3 className="text-xl font-bold">AI Career Mentor</h3>
          <p className="text-slate-400 leading-relaxed">
            Powered by Gemini, our mentor provides actionable insights tailored to your academic profile.
          </p>
        </div>
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
          <div className="w-12 h-12 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-400 font-bold">03</div>
          <h3 className="text-xl font-bold">ARS Scoring</h3>
          <p className="text-slate-400 leading-relaxed">
            The Admission Readiness Score quantifies your probability of success for target programs.
          </p>
        </div>
      </section>
    </main>
  )
}
