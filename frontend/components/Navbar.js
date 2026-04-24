"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };
    checkAuth();
    // Listen for storage changes if token is set in another tab
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <nav className="border-b border-slate-800 bg-navy/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">G</div>
          <span className="text-xl font-bold tracking-tight text-white hover:text-indigo-400 transition-colors">GradPath AI</span>
        </Link>
        <div className="flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium hover:text-indigo-400 transition-colors">Dashboard</Link>
              <button onClick={handleLogout} className="text-sm font-medium text-slate-400 hover:text-red-400 transition-colors">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-indigo-400 transition-colors">Login</Link>
              <Link href="/signup" className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 rounded-lg transition-all text-white shadow-md shadow-indigo-600/20 active:scale-95">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
