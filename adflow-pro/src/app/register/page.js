"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {
      await supabase.from("users").insert([
        {
          id: data.user.id,
          email: data.user.email,
          role: "client",
        },
      ]);
    }

    alert("Register successful 🎉 Now login");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 p-4">

      {/* background glow orbs (same system as login/dashboard) */}
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-pink-500 rounded-full blur-3xl opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

      {/* CARD */}
      <form
        onSubmit={handleRegister}
        className="relative w-full max-w-md p-10 rounded-3xl 
        bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl"
      >

        {/* TITLE */}
        <h1 className="text-4xl font-extrabold text-white text-center mb-2 tracking-wide">
          Create Account 🚀
        </h1>

        <p className="text-center text-white/60 mb-8 text-sm">
          Join AdFlow Pro and start managing ads
        </p>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl bg-white/5 text-white placeholder-white/40 
          border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 rounded-xl bg-white/5 text-white placeholder-white/40 
          border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl font-bold text-white
          bg-gradient-to-r from-purple-600 to-indigo-600
          hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-1
          transition-all duration-300"
        >
          Register ✨
        </button>

        {/* FOOTER */}
        <p className="text-center text-white/50 text-sm mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-white font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </form>
    </div>
  );
}