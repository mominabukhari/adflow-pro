"use client";

import Link from "next/link";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react"; // ✅ added

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false); // ✅ added

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="relative z-50">

      <div className="h-[2px] w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-pulse"></div>

      <div className="backdrop-blur-xl bg-white/70 shadow-lg px-6 py-3 flex justify-between items-center border-b border-white/20">

        <div className="font-extrabold text-xl tracking-wide bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-transparent bg-clip-text animate-pulse">
          ✨ AdFlow Pro
        </div>

        <button
          className="md:hidden text-gray-700 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex gap-6 items-center text-sm font-medium">

          <Link
            href="/dashboard"
            className="relative text-gray-700 hover:text-purple-600 transition group"
          >
            Dashboard
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-500 transition-all group-hover:w-full"></span>
          </Link>

          <Link
            href="/login"
            className="relative text-gray-700 hover:text-purple-600 transition group"
          >
            Login
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-500 transition-all group-hover:w-full"></span>
          </Link>

          <Link
            href="/register"
            className="relative text-gray-700 hover:text-purple-600 transition group"
          >
            Register
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-500 transition-all group-hover:w-full"></span>
          </Link>

          <button
            onClick={handleLogout}
            className="relative px-4 py-1 rounded-lg text-white font-semibold bg-gradient-to-r from-red-500 to-pink-500 hover:scale-105 transition shadow-md"
          >
            Logout
          </button>

        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 py-4 bg-white/90 backdrop-blur-xl border-b border-white/20 text-sm font-medium">

          <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>

          <Link href="/login" onClick={() => setMenuOpen(false)}>
            Login
          </Link>

          <Link href="/register" onClick={() => setMenuOpen(false)}>
            Register
          </Link>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-red-500 to-pink-500"
          >
            Logout
          </button>

        </div>
      )}

    </nav>
  );
}