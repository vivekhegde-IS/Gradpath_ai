// frontend/app/signup/page.js
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login?signup=success");
      } else {
        setError(data.detail || "Signup failed. Try a different email.");
      }
    } catch (err) {
      setError("Connection error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-2">Create Account</h2>
        <p className="text-slate-400 mb-8">Start your international career path today</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Primary Role</label>
            <select
              className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none font-medium"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 active:scale-95"
          >
            {loading ? "Creating Account..." : "Sign Up Free"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account? <Link href="/login" className="text-indigo-400 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}
