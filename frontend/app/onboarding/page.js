// frontend/app/onboarding/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import Sidebar from "../../components/Sidebar";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    gpa: 3.5,
    test_score: 1200,
    budget: 30000,
    target_country: "",
    preferred_course: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("token")) router.push("/login");
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/profile", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          gpa: parseFloat(formData.gpa),
          test_score: parseInt(formData.test_score),
          budget: parseInt(formData.budget),
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.detail || "Failed to save profile.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-navy text-white">
      <Sidebar />
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-xl">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 px-1">
              <span className={step >= 1 ? "text-indigo-400" : ""}>Academics</span>
              <span className={step >= 2 ? "text-indigo-400" : ""}>Financials</span>
              <span className={step >= 3 ? "text-indigo-400" : ""}>Review</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl"></div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={(e) => e.preventDefault()}>
              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Academic Profile</h2>
                    <p className="text-slate-400 text-sm">Based on international grading scales.</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-4">
                        <label className="text-sm font-medium text-slate-300">Cumulative GPA (4.0 Scale)</label>
                        <span className="text-indigo-400 font-bold">{formData.gpa}</span>
                      </div>
                      <input
                        type="range"
                        name="gpa"
                        min="0"
                        max="4.0"
                        step="0.1"
                        value={formData.gpa}
                        onChange={handleInputChange}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Target Test Score (SAT/GRE/Equiv)</label>
                      <input
                        type="number"
                        name="test_score"
                        className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. 1200 or 310"
                        value={formData.test_score}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Preferences & Budget</h2>
                    <p className="text-slate-400 text-sm">Help us narrow down your options.</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Annual Tuition Budget (USD)</label>
                      <select
                        name="budget"
                        className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none font-medium"
                        value={formData.budget}
                        onChange={handleInputChange}
                      >
                        <option value="5000">Below $10,000</option>
                        <option value="20000">$10,000 - $30,000</option>
                        <option value="45000">$30,000 - $60,000</option>
                        <option value="70000">$60,000+</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Target Country</label>
                      <input
                        type="text"
                        name="target_country"
                        className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. Germany, USA, UK"
                        value={formData.target_country}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Course</label>
                      <input
                        type="text"
                        name="preferred_course"
                        className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. Computer Science"
                        value={formData.preferred_course}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 text-center">
                  <div>
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl">✓</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Review Profile</h2>
                    <p className="text-slate-400 text-sm">Everything looking correct?</p>
                  </div>

                  <div className="bg-slate-800/50 p-6 rounded-2xl space-y-4 text-left">
                    <div className="flex justify-between border-b border-slate-700 pb-2">
                      <span className="text-slate-400">Academic Score:</span>
                      <span className="font-bold">{formData.gpa} GPA / {formData.test_score} Test</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-700 pb-2">
                      <span className="text-slate-400">Budget Limit:</span>
                      <span className="font-bold">${parseInt(formData.budget).toLocaleString()}/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Goal:</span>
                      <span className="font-bold">{formData.preferred_course} in {formData.target_country}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-12 flex gap-4">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-4 bg-slate-800 text-slate-300 font-bold rounded-2xl hover:bg-slate-750 border border-slate-700 transition-all uppercase text-xs tracking-widest"
                  >
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-[2] py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 uppercase text-xs tracking-widest"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleSubmit}
                    className="flex-[2] py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 uppercase text-xs tracking-widest disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Submit Profile"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
