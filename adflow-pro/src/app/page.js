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
    <div className="w-full min-h-screen bg-white overflow-hidden">
      
      {/* ===== HERO ===== */}
      <div className="relative text-white overflow-hidden">
        
        {/* DARK PURPLE BG */}
        <div className="absolute inset-0 bg-[#050816]"></div>

        {/* GLOW */}
        <div className="absolute w-[500px] h-[500px] bg-purple-700 blur-[160px] opacity-40 top-[-120px] left-[-120px] animate-pulse"></div>
        <div className="absolute w-[500px] h-[500px] bg-purple-900 blur-[160px] opacity-40 bottom-[-120px] right-[-120px] animate-pulse"></div>

        {/* GRID */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:28px_28px]"></div>

        {/* CONTENT */}
        <div className="relative z-10 px-6 py-24 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          
          {/* TEXT */}
          <div className="text-center md:text-left max-w-xl">
            <h1 className="text-5xl md:text-7xl font-extrabold">
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
                AdFlow Pro
              </span>
            </h1>

            <p className="mt-6 text-lg text-white/70">
              Smart Advertisement Workflow System for{" "}
              <b>Clients</b>, <b>Moderators</b> and <b>Admins</b>.
            </p>

            <div className="mt-10 flex flex-col md:flex-row gap-4">
              <a
                href="/explore"
                className="px-7 py-3 rounded-xl font-semibold bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-purple-500/50 transition transform hover:scale-105"
              >
                🔍 Explore Ads
              </a>

              <button
                onClick={handleCreateAd}
                className="px-7 py-3 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/50 transition transform hover:scale-105"
              >
                ➕ Create Ad
              </button>
            </div>
          </div>

          {/* ✅ WORKING ASTRONAUT */}
          <div className="mt-16 md:mt-0">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3212/3212608.png"
              alt="astronaut"
              className="w-[260px] md:w-[320px] drop-shadow-[0_0_40px_rgba(168,85,247,0.7)] animate-bounce"
            />
          </div>
        </div>

        {/* WAVE */}
        <div className="absolute bottom-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block w-full h-[120px]"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#ffffff"
              d="M0,224L80,213.3C160,203,320,181,480,186.7C640,192,800,224,960,224C1120,224,1280,192,1360,176L1440,160L1440,320L0,320Z"
            />
          </svg>
        </div>
      </div>

      {/* ===== FEATURES ===== */}
      <div className="bg-white py-20 text-center px-6">
        
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-14">
          Simple steps to manage your ads efficiently
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
          
          {[
            { icon: "👤", text: "Register / Login" },
            { icon: "📝", text: "Create Ad Request" },
            { icon: "🛡️", text: "Moderator Approval" },
            { icon: "🚀", text: "Publish & Manage Ads" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              
              {/* ✅ GLOWING GRADIENT ICONS */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-500 flex items-center justify-center text-white text-2xl shadow-[0_0_30px_rgba(168,85,247,0.6)]">
                {item.icon}
              </div>

              <p className="mt-4 text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-16 text-gray-500 max-w-xl mx-auto">
          AdFlow Pro streamlines your entire ad lifecycle with a structured approval system.
        </p>
      </div>
    </div>
  );
}