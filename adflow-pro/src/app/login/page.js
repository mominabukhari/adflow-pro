// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "../../lib/supabase";

// export default function Login() {
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     setLoading(false);

//     if (error) {
//       alert(error.message);
//     } else {
//       router.push("/dashboard");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 p-6">

//       <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex">

//         {/* LEFT SIDE */}
//         <div className="hidden md:flex w-1/2 relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white p-10 items-center">

//           {/* Big curved circle */}
//           <div className="absolute left-[-80px] w-[400px] h-[400px] bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full"></div>

//           {/* small circles */}
//           <div className="absolute bottom-10 left-10 w-24 h-24 bg-indigo-500 rounded-full opacity-60"></div>
//           <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-800 rounded-full opacity-40"></div>

//           {/* text */}
//           <div className="relative z-10">
//             <h1 className="text-4xl font-bold mb-4">WELCOME</h1>
//             <p className="text-sm text-white/80 max-w-xs">
//               Manage and promote your ads smartly with AdFlow Pro.
//               Grow faster, reach more audience, and track everything in one place.
//             </p>
//           </div>
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="w-full md:w-1/2 bg-white p-10 flex flex-col justify-center">

//           <h2 className="text-3xl font-semibold text-gray-800 mb-6">
//             Sign in
//           </h2>

//           <form onSubmit={handleLogin} className="space-y-4">

//             {/* Email */}
//             <input
//               type="email"
//               placeholder="User Name / Email"
//               className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />

//             {/* Password */}
//             <input
//               type="password"
//               placeholder="Password"
//               className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />

//             {/* Remember */}
//             <label className="text-sm text-gray-500 flex items-center">
//               <input type="checkbox" className="mr-2" />
//               Remember me
//             </label>

//             {/* Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
//             >
//               {loading ? "Signing in..." : "Sign in"}
//             </button>

//           </form>

//           {/* Footer */}
//           <p className="text-center text-gray-500 text-sm mt-6">
//             Don’t have an account?{" "}
//             <span
//               onClick={() => router.push("/register")}
//               className="text-indigo-600 cursor-pointer font-semibold"
//             >
//               Register now
//             </span>
//           </p>

//         </div>
//       </div>
//     </div>
//   );
// }

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

    // 👤 PROFILE FETCH (NOW SAFE)
    const { data: profile, error: roleError } = await supabase
      .from("users")
      .select("role, status")
      .eq("email", user.email)
      .maybeSingle();

    setLoading(false);

    if (roleError) {
      alert(roleError.message);
      return;
    }

    if (!profile) {
      alert("User data not found");
      return;
    }

    // 🚫 BLOCK CHECK (NOW SAFE)
    if (profile.status === "blocked") {
      alert("Your account is blocked");
      return;
    }

    // 🚀 ROLE ROUTING (SAME LOGIC)
    if (profile.role === "client") {
      router.push("/dashboard");
    } else if (profile.role === "moderator") {
      router.push("/dashboard");
    } else if (profile.role === "admin") {
      router.push("dashboard");
    } else if (profile.role === "super_admin") {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 p-6">

      <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex">

        {/* LEFT SIDE (SAME DESIGN) */}
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

        {/* RIGHT SIDE (SAME DESIGN) */}
        <div className="w-full md:w-1/2 bg-white p-10 flex flex-col justify-center">

          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Sign in
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

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