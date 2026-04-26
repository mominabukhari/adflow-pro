"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
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
      alert("Auth failed");
      setLoading(false);
      return;
    }

    const { data: profile, error: roleError } = await supabase
      .from("users")
      .select("role, status")
      .eq("email", user.email)
      .maybeSingle();

    if (roleError) {
      alert(roleError.message);
      setLoading(false);
      return;
    }

    if (!profile) {
      alert("User data not found");
      setLoading(false);
      return;
    }

    if (profile.status === "blocked") {
      alert("Your account is blocked");
      setLoading(false);
      return;
    }

    // 🔥 NEW: WALLET AUTO CREATE (ONLY ADDITION)
    const { data: wallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!wallet) {
      await supabase.from("wallets").insert([
        {
          user_id: user.id,
          balance: 500,
        },
      ]);
    }

    setLoading(false);

    // role-based routing
    if (profile.role === "client") {
      router.push("/dashboard");
    } else if (profile.role === "moderator") {
      router.push("/dashboard");
    } else if (profile.role === "admin") {
      router.push("/dashboard");
    } else if (profile.role === "super_admin") {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  let lastRequestTime = 0;

  const handleForgotPassword = async () => {
    const now = Date.now();

    if (now - lastRequestTime < 30000) {
      alert("Please wait 30 seconds before requesting again");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      alert("Please enter a valid email first");
      return;
    }

    lastRequestTime = now;

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: window.location.origin + "/reset-password",
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Password reset link sent to your email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 p-6 overflow-y-auto">

      <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">

        {/* LEFT SIDE */}
        <div className="hidden md:flex w-1/2 relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white p-10 items-center">

          <div className="absolute left-[-80px] w-[400px] h-[400px] bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-indigo-500 rounded-full opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-800 rounded-full opacity-40"></div>

          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4">WELCOME</h1>
            <p className="text-sm text-white/80 max-w-xs">
              Manage and promote your ads smartly with AdFlow Pro.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 bg-white p-6 md:p-10 flex flex-col justify-center">

          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Sign in
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

          <p
            onClick={handleForgotPassword}
            className="text-right text-sm text-indigo-600 mt-2 cursor-pointer hover:underline"
          >
            Forgot Password?
          </p>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don’t have an account?{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-indigo-600 cursor-pointer font-semibold"
            >
              Register now
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}