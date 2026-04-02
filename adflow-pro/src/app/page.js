// export default function Home() {
//   return (
//     <div className="relative min-h-screen flex flex-col justify-center items-center text-center text-white overflow-hidden bg-[#050816]">

//       {/* 🌌 Background */}
//       <div className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
//       <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>

//       {/* ✨ Stars */}
//       <div className="absolute inset-0 opacity-20 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:30px_30px]"></div>

//       {/* 🧍 Animated Character */}
//       <div className="absolute left-10 bottom-10 hidden md:block">
//         <div className="flex flex-col items-center animate-bounce">

//           {/* character */}
//           <div className="text-6xl">
//             🙋‍♀️
//           </div>

//           {/* pointing hand */}
//           <div className="text-4xl animate-pulse">
//             👉
//           </div>

//         </div>
//       </div>

//       {/* MAIN CONTENT */}
//       <div className="relative z-10 px-6">

//         {/* TITLE */}
//         <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight 
//         bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 
//         text-transparent bg-clip-text animate-pulse">
//           🚀 AdFlow Pro
//         </h1>

//         {/* SUBTITLE */}
//         <p className="mt-4 text-lg md:text-xl text-white/80 max-w-xl mx-auto">
//           Smart Ads Platform with Approval Workflow System —  
//           Built for Clients, Moderators & Admins
//         </p>

//         {/* BUTTONS */}
//         <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">

//           <a
//             href="/explore"
//             className="px-6 py-3 rounded-xl font-semibold 
//             bg-green-500 hover:bg-green-600 
//             shadow-lg hover:shadow-green-500/40 
//             transition transform hover:scale-105"
//           >
//             🔍 Explore Ads
//           </a>

//           <a
//             href="/create-ad"
//             className="px-6 py-3 rounded-xl font-semibold 
//             bg-blue-500 hover:bg-blue-600 
//             shadow-lg hover:shadow-blue-500/40 
//             transition transform hover:scale-105"
//           >
//             ➕ Create Ad
//           </a>

//         </div>

//       </div>
//     </div>
//   );
// }

// export default function Home() {
//   return (
//     <div className="relative min-h-screen flex items-center justify-center text-center text-white overflow-hidden bg-[#050816]">

//       {/* 🌈 Animated Background Orbs */}
//       <div className="absolute w-[500px] h-[500px] bg-pink-500 rounded-full blur-[140px] opacity-20 top-[-100px] left-[-100px] animate-pulse"></div>
//       <div className="absolute w-[500px] h-[500px] bg-blue-500 rounded-full blur-[140px] opacity-20 bottom-[-120px] right-[-120px] animate-pulse"></div>
//       <div className="absolute w-[400px] h-[400px] bg-purple-500 rounded-full blur-[140px] opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping"></div>

//       {/* ✨ Star Grid */}
//       <div className="absolute inset-0 opacity-20 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:28px_28px]"></div>

//       {/* MAIN CARD */}
//       <div className="relative z-10 px-6 max-w-3xl">

//         {/* BADGE */}
//         <div className="mb-6 inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 text-sm text-white/80 backdrop-blur">
//           🚀 Smart Ads Workflow System
//         </div>

//         {/* TITLE */}
//         <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-tight">
//           <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-transparent bg-clip-text animate-pulse">
//             AdFlow Pro
//           </span>
//         </h1>

//         {/* SUBTITLE */}
//         <p className="mt-5 text-lg md:text-xl text-white/70 leading-relaxed">
//           A powerful platform where <span className="text-white font-semibold">Clients</span>,
//           <span className="text-white font-semibold"> Moderators</span> and
//           <span className="text-white font-semibold"> Admins</span> work together to manage ads with a clean approval workflow.
//         </p>

//         {/* GLASS FEATURE CARD */}
//         <div className="mt-8 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-lg">
//           <p className="text-white/70 text-sm">
//             ⚡ Fast • 🔐 Secure • 🧠 Smart Approval System • 📊 Admin Controlled
//           </p>
//         </div>

//         {/* BUTTONS */}
//         <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">

//           <a
//             href="/explore"
//             className="px-7 py-3 rounded-xl font-semibold bg-green-500 hover:bg-green-600 
//             shadow-lg hover:shadow-green-500/40 transition transform hover:scale-105"
//           >
//             🔍 Explore Ads
//           </a>

//           <a
//             href="/create-ad"
//             className="px-7 py-3 rounded-xl font-semibold bg-blue-500 hover:bg-blue-600 
//             shadow-lg hover:shadow-blue-500/40 transition transform hover:scale-105"
//           >
//             ➕ Create Ad
//           </a>

//         </div>

//         {/* FLOATING DECOR ELEMENTS */}
//         <div className="absolute -top-10 -left-10 text-6xl opacity-20 animate-bounce">
//           ✨
//         </div>

//         <div className="absolute -bottom-10 -right-10 text-6xl opacity-20 animate-bounce">
//           🚀
//         </div>

//       </div>
//     </div>
//   );
// }
"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase"; 
export default function Home() {
  const router = useRouter();

  const handleCreateAd = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data?.user) {
      alert("⚠️ You haven't registered or logged in yet!");
      router.push("/login");
      return;
    }

    router.push("/create-ad");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-center text-white overflow-hidden bg-[#050816]">

      <div className="absolute w-[500px] h-[500px] bg-pink-500 rounded-full blur-[140px] opacity-20 top-[-100px] left-[-100px] animate-pulse"></div>
      <div className="absolute w-[500px] h-[500px] bg-blue-500 rounded-full blur-[140px] opacity-20 bottom-[-120px] right-[-120px] animate-pulse"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-500 rounded-full blur-[140px] opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping"></div>

      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:28px_28px]"></div>

      <div className="relative z-10 px-6 max-w-3xl">

        <div className="mb-6 inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 text-sm text-white/80 backdrop-blur">
          🚀 Smart Ads Workflow System
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-transparent bg-clip-text animate-pulse">
            AdFlow Pro
          </span>
        </h1>

        <p className="mt-5 text-lg md:text-xl text-white/70 leading-relaxed">
          A powerful platform where <span className="text-white font-semibold">Clients</span>,
          <span className="text-white font-semibold"> Moderators</span> and
          <span className="text-white font-semibold"> Admins</span> work together to manage ads with a clean workflow.
        </p>

        <div className="mt-8 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-lg">
          <p className="text-white/70 text-sm">
            ⚡ Fast • 🔐 Secure • 🧠 Smart Approval System • 📊 Admin Controlled
          </p>
        </div>

        <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">

          <a
            href="/explore"
            className="px-7 py-3 rounded-xl font-semibold bg-green-500 hover:bg-green-600 
            shadow-lg hover:shadow-green-500/40 transition transform hover:scale-105"
          >
            🔍 Explore Ads
          </a>

          <button
            onClick={handleCreateAd}
            className="px-7 py-3 rounded-xl font-semibold bg-blue-500 hover:bg-blue-600 
            shadow-lg hover:shadow-blue-500/40 transition transform hover:scale-105"
          >
            ➕ Create Ad
          </button>

        </div>

        <div className="absolute -top-10 -left-10 text-6xl opacity-20 animate-bounce">
          ✨
        </div>

        <div className="absolute -bottom-10 -right-10 text-6xl opacity-20 animate-bounce">
          🚀
        </div>

      </div>
    </div>
  );
}
