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
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-600 p-4">

//       <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">

//         <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
//           Login
//         </h1>

//         <form onSubmit={handleLogin} className="space-y-5">

//           <input
//             type="email"
//             placeholder="Email"
//             className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>

//         </form>

//       </div>
//     </div>
//   );
// }

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
//     <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-4">

//       {/* background glow orbs */}
//       <div className="absolute w-72 h-72 bg-pink-500 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
//       <div className="absolute w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>
//       <div className="absolute w-72 h-72 bg-purple-400 rounded-full blur-3xl opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

//       {/* Glass Card */}
//       <div className="relative w-full max-w-md">

//         <div className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 transform transition duration-500 hover:scale-[1.02]">

//           {/* Title */}
//           <h1 className="text-4xl font-extrabold text-center text-white mb-2 tracking-wide">
//             Welcome Back ✨
//           </h1>

//           <p className="text-center text-white/70 mb-8 text-sm">
//             Login to continue your journey
//           </p>

//           <form onSubmit={handleLogin} className="space-y-5">

//             {/* Email */}
//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-400 transition"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />

//             {/* Password */}
//             <input
//               type="password"
//               placeholder="Enter your password"
//               className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-purple-400 transition"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />

//             {/* Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:shadow-pink-500/40 transform hover:-translate-y-1 transition-all duration-300"
//             >
//               {loading ? "Logging in..." : "Login 🚀"}
//             </button>

//           </form>

//           {/* small footer text */}
//           <p className="text-center text-white/50 text-xs mt-6">
//             Secure login powered by Supabase
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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 p-4">

      {/* background glow orbs (same vibe as dashboard) */}
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-pink-500 rounded-full blur-3xl opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

      {/* Glass Card */}
      <div className="relative w-full max-w-md">

        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 transform transition duration-500 hover:scale-[1.02]">

          {/* Title */}
          <h1 className="text-4xl font-extrabold text-center text-white mb-2 tracking-wide">
            Welcome Back ✨
          </h1>

          <p className="text-center text-white/60 mb-8 text-sm">
            Login to continue your journey
          </p>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-indigo-400 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-indigo-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg hover:shadow-indigo-500/40 transform hover:-translate-y-1 transition-all duration-300"
            >
              {loading ? "Logging in..." : "Login 🚀"}
            </button>

          </form>

          {/* footer */}
          <p className="text-center text-white/40 text-xs mt-6">
            Secure login powered by Supabase
          </p>

        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "../../../lib/supabase";

// export default function Login() {
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) {
//       setLoading(false);
//       alert(error.message);
//       return;
//     }

//     // 👇 GET USER ROLE (from users table)
//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("role")
//       .eq("id", data.user.id)
//       .single();

//     setLoading(false);

//     // 👇 ROLE BASED REDIRECT
//     if (profile?.role === "admin") {
//       router.push("/admin-dashboard");
//     } else {
//       router.push("/dashboard");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 p-4">

//       {/* background glow orbs */}
//       <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
//       <div className="absolute w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>
//       <div className="absolute w-72 h-72 bg-pink-500 rounded-full blur-3xl opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

//       {/* Glass Card */}
//       <div className="relative w-full max-w-md">

//         <div className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 transform transition duration-500 hover:scale-[1.02]">

//           <h1 className="text-4xl font-extrabold text-center text-white mb-2 tracking-wide">
//             Welcome Back ✨
//           </h1>

//           <p className="text-center text-white/60 mb-8 text-sm">
//             Login to continue your journey
//           </p>

//           <form onSubmit={handleLogin} className="space-y-5">

//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-indigo-400 transition"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />

//             <input
//               type="password"
//               placeholder="Enter your password"
//               className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-indigo-400 transition"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg hover:shadow-indigo-500/40 transform hover:-translate-y-1 transition-all duration-300"
//             >
//               {loading ? "Logging in..." : "Login 🚀"}
//             </button>

//           </form>

//           <p className="text-center text-white/40 text-xs mt-6">
//             Secure login powered by Supabase
//           </p>

//         </div>
//       </div>
//     </div>
//   );
// }