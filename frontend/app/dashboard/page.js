// frontend/app/dashboard/page.js
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import Sidebar from "../../components/Sidebar";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [ars, setArs] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, arsRes] = await Promise.all([
          apiFetch("/profile"),
          apiFetch("/ars"),
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);

          // Get matched universities
          const uniRes = await apiFetch("/universities", {
            method: "POST",
            body: JSON.stringify({
              gpa: profileData.gpa,
              budget: profileData.budget,
              country: profileData.target_country,
            }),
          });
          if (uniRes.ok) {
            setUniversities(await uniRes.json());
          }
        }

        if (arsRes.ok) {
          setArs(await arsRes.json());
        }
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <div className="flex items-center justify-center h-screen bg-navy text-white">Loading Dashboard...</div>;

  const getArsColor = (score) => {
    if (score >= 70) return "text-emerald-400";
    if (score >= 40) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <div className="flex min-h-screen bg-navy">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
          <p className="text-slate-400">Welcome back to your academic planning hub.</p>
        </header>

        {!profile && (
          <div className="bg-indigo-600/10 border border-indigo-600/20 p-6 rounded-2xl mb-10 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-indigo-400">Profile Incomplete</h3>
              <p className="text-slate-300">Set up your profile to unlock university matching and AI mentoring.</p>
            </div>
            <Link href="/onboarding" className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 text-white">
              Complete Profile
            </Link>
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">ARS Score</p>
            <div className={`text-5xl font-bold ${getArsColor(ars?.score || 0)}`}>
              {ars ? ars.score.toFixed(1) : "N/A"}
            </div>
            <p className="text-xs text-slate-400 mt-2">Admission Readiness Score</p>
            <div className="absolute top-4 right-4 text-slate-800 text-6xl font-black opacity-10">Score</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Profile Status</p>
            <div className="text-5xl font-bold text-white">
              {profile ? "100%" : "0%"}
            </div>
            <p className="text-xs text-slate-400 mt-2">{profile ? "All set!" : "Awaiting data"}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Matches</p>
            <div className="text-5xl font-bold text-indigo-400">
              {universities.length}
            </div>
            <p className="text-xs text-slate-400 mt-2">Qualified Universities</p>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Top University Matches</h2>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Calculated Real-time</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {universities.length > 0 ? (
              universities.map((uni, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between hover:border-indigo-500/50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {uni.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{uni.name}</h4>
                      <div className="flex gap-4 mt-1">
                        <span className="text-xs text-slate-400 flex items-center gap-1">📍 {uni.country}</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">🎓 {uni.courses.slice(0, 2).join(", ")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Tuition Estimate</p>
                    <p className="text-white font-mono bg-slate-800 px-3 py-1 rounded-lg">Up to ${uni.max_budget.toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl">
                <p className="text-slate-500">No matches found. Try widening your criteria.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
