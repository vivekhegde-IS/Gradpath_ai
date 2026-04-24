// frontend/app/admin/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import Sidebar from "../../components/Sidebar";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);
      if (payload.role !== "admin") {
        router.push("/dashboard");
        return;
      }
    } catch (e) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [usersRes, statsRes] = await Promise.all([
          apiFetch("/admin/users"),
          apiFetch("/admin/stats"),
        ]);

        if (usersRes.ok) setUsers(await usersRes.json());
        if (statsRes.ok) setStats(await statsRes.json());
      } catch (err) {
        console.error("Admin fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading || role !== "admin") return <div className="flex items-center justify-center h-screen bg-navy text-white">Verifying Admin Access...</div>;

  return (
    <div className="flex min-h-screen bg-navy text-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold">Admin Command Center</h1>
            <p className="text-slate-400">System metrics and user management.</p>
          </div>
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Live System Pulse
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Total Users</p>
            <div className="text-5xl font-bold text-white">{stats?.total_users || 0}</div>
            <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs">
               <span>↑ 12%</span>
               <span className="text-slate-500">vs last month</span>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Profiles Completed</p>
            <div className="text-5xl font-bold text-indigo-400">{stats?.total_profiles || 0}</div>
             <div className="mt-4 flex items-center gap-2 text-slate-500 text-xs">
               <span>{((stats?.total_profiles / stats?.total_users) * 100).toFixed(1)}% Conversion Rate</span>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Avg Academic Score</p>
            <div className="text-5xl font-bold text-white">{stats?.average_gpa || 0}</div>
            <div className="mt-4 flex items-center gap-2 text-slate-500 text-xs">
               <span>On 4.0 Scale</span>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-6 flex justify-between items-center px-2">
            <h2 className="text-xl font-bold">Registered Users</h2>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Showing all records ({users.length})</div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-navy/50 text-xs uppercase text-slate-500 font-bold border-b border-slate-800">
                  <th className="px-8 py-6">User ID</th>
                  <th className="px-8 py-6">Email</th>
                  <th className="px-8 py-6">Role</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30 transition-all">
                    <td className="px-8 py-6 text-slate-500 font-mono">#{user.id}</td>
                    <td className="px-8 py-6 font-medium text-white">{user.email}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.role === "admin" ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/20" : "bg-slate-800 text-slate-400"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-indigo-400 hover:text-white transition-colors font-bold text-xs">VIEW</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
