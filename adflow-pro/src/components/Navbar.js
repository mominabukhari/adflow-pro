"use client";

import Link from "next/link";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">

      {/* LEFT SIDE */}
      <div className="font-bold text-xl text-purple-600">
        MyApp
      </div>

      {/* RIGHT SIDE */}
      <div className="flex gap-4 items-center">

        <Link href="/dashboard" className="text-gray-700 hover:text-purple-600">
          Dashboard
        </Link>

        <Link href="/login" className="text-gray-700 hover:text-purple-600">
          Login
        </Link>

        <Link href="/register" className="text-gray-700 hover:text-purple-600">
          Register
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}