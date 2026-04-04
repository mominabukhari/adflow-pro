"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      const user = data?.user;

      if (!user) {
        alert("User not created");
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase.from("users").insert([
        {
          id: user.id,
          email: user.email,
          role: "client",
          status: "active",
        },
      ]);

      if (insertError) {
        alert(insertError.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      alert("Register successful 🎉 Now login");
      router.push("/login");

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 p-6 overflow-y-auto">

      <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl">

        {/* LEFT FORM SIDE (SAME DESIGN) */}
        <div className="w-full md:w-1/2 p-6 md:p-10 bg-white/10 backdrop-blur-2xl border-r border-white/20">
          
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            Register
          </h1>

          <form onSubmit={handleRegister} className="space-y-5">

            <div className="flex items-center border-b border-white/30 pb-2">
              <span className="text-white mr-2">📧</span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none text-white placeholder-white/50"
                required
              />
            </div>

            <div className="flex items-center border-b border-white/30 pb-2">
              <span className="text-white mr-2">🔒</span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-white placeholder-white/50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 transition-all duration-300"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center text-white/60 text-sm mt-6">
            Already Have Account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-white font-semibold cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>

        {/* RIGHT SIDE (SAME ANIMATED DESIGN) */}
        <div className="hidden md:flex w-1/2 relative items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-black">

          <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-40 animate-pulse top-10 left-10"></div>
          <div className="absolute w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-40 animate-pulse bottom-10 right-10"></div>
          <div className="absolute w-72 h-72 bg-pink-500 rounded-full blur-3xl opacity-30 animate-ping top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

          <div className="relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 px-10 py-8 rounded-3xl text-center text-white animate-bounce">
            <h2 className="text-2xl font-bold mb-2">AdFlow Pro</h2>
            <p className="text-white/70 text-sm">
              Smart Ads. Better Reach. Faster Growth 🚀
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}