// frontend/app/loan/page.js
"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { apiFetch } from "../../lib/api";

export default function LoanCalculator() {
  const [params, setParams] = useState({
    amount: 50000,
    rate: 8.5,
    years: 10,
  });
  const [result, setResult] = useState(null);

  useEffect(() => {
    const calc = async () => {
      try {
        const res = await apiFetch(`/loan?amount=${params.amount}&rate=${params.rate}&years=${params.years}`);
        if (res.ok) {
          setResult(await res.json());
        }
      } catch (err) {
        console.error("Loan API error", err);
      }
    };
    calc();
  }, [params]);

  const handleSlider = (e) => {
    const { name, value } = e.target;
    setParams((p) => ({ ...p, [name]: parseFloat(value) }));
  };

  const interestRatio = result ? (result.total_interest / result.total_payable) * 100 : 0;

  return (
    <div className="flex min-h-screen bg-navy text-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold">Smart Loan Estimator</h1>
          <p className="text-slate-400">Plan your finances with accuracy.</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <section className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loan Amount</label>
                <span className="text-2xl font-bold text-indigo-400">${params.amount.toLocaleString()}</span>
              </div>
              <input 
                type="range" name="amount" min="1000" max="100000" step="500"
                value={params.amount} onChange={handleSlider}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Interest Rate (%)</label>
                <span className="text-2xl font-bold text-indigo-400">{params.rate}%</span>
              </div>
              <input 
                type="range" name="rate" min="1" max="20" step="0.1"
                value={params.rate} onChange={handleSlider}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tenure (Years)</label>
                <span className="text-2xl font-bold text-indigo-400">{params.years} Years</span>
              </div>
              <input 
                type="range" name="years" min="1" max="25" step="1"
                value={params.years} onChange={handleSlider}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </section>

          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-indigo-600 border border-indigo-500 p-6 rounded-3xl shadow-xl shadow-indigo-600/20">
                <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-widest mb-1">Monthly EMI</p>
                <div className="text-4xl font-bold text-white">${result?.monthly_emi.toLocaleString()}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Total Payment</p>
                <div className="text-4xl font-bold text-white">${result?.total_payable.toLocaleString()}</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
              <div className="flex justify-between items-end mb-4">
                 <div>
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Interest Breakdown</p>
                    <p className="text-2xl font-bold text-slate-300">${result?.total_interest.toLocaleString()} total interest</p>
                 </div>
                 <div className="text-right">
                    <span className="text-xs font-bold text-indigo-400">{interestRatio.toFixed(1)}% of total</span>
                 </div>
              </div>
              
              <div className="h-6 w-full bg-indigo-600 rounded-xl overflow-hidden flex shadow-inner">
                <div 
                  className="h-full bg-slate-800 border-r border-navy transition-all duration-500" 
                  style={{ width: `${100 - interestRatio}%` }}
                ></div>
                <div 
                  className="h-full transition-all duration-500" 
                  style={{ width: `${interestRatio}%` }}
                ></div>
              </div>
              
              <div className="flex gap-6 mt-6">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 bg-slate-800 rounded"></div>
                   <span className="text-xs text-slate-400">Principal Amount</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 bg-indigo-600 rounded"></div>
                   <span className="text-xs text-slate-400">Interest Payable</span>
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-600/5 border border-indigo-500/20 p-6 rounded-2xl">
              <p className="text-sm text-indigo-300 italic">
                “This estimate is for informational purposes only. Bank rates may vary based on credit history and country-specific policies.”
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
