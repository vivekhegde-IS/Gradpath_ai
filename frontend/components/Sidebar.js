// frontend/components/Sidebar.js
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Onboarding", path: "/onboarding", icon: "📝" },
    { name: "AI Chat", path: "/chat", icon: "💬" },
    { name: "Loan Calculator", path: "/loan", icon: "💰" },
  ];

  if (user?.role === "admin") {
    navItems.push({ name: "Admin Panel", path: "/admin", icon: "🛡️" });
  }

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-[calc(100vh-64px)] sticky top-16 z-30">
      <div className="p-6 overflow-y-auto">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">G</div>
          <span className="text-xl font-bold text-white">GradPath AI</span>
        </div>

        <nav className="space-y-1 relative z-40">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium cursor-pointer relative z-50 ${
                pathname === item.path
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800">
        <div className="mb-4">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Logged in as</p>
          <p className="text-sm text-white truncate font-medium">{user?.sub || "User"}</p>
          <p className="text-[10px] text-indigo-400 font-bold uppercase">{user?.role || "Student"}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-2 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-300 text-sm font-bold rounded-lg transition-all border border-slate-700 hover:border-red-500/20"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
