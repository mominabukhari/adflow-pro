// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "../../lib/supabase";

// export default function Dashboard() {
//   const router = useRouter();
//   const [user, setUser] = useState(null);

//   // ✅ NEW STATE (added)
//   const [ads, setAds] = useState([]);

//   useEffect(() => {
//     const getUser = async () => {
//       const { data } = await supabase.auth.getUser();

//       if (!data.user) {
//         router.push("/login");
//         return; // ✅ FIX: stop execution after redirect
//       } else {
//         setUser(data.user);

//         // ✅ FETCH USER ADS (added)
//         const { data: adsData } = await supabase
//           .from("ads")
//           .select("*")
//           .eq("user_id", data.user.id);

//         setAds(adsData || []);
//       }
//     };

//     getUser();
//   }, [router]);

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white p-6">

//       {/* background glow (premium feel) */}
//       <div className="absolute w-80 h-80 bg-purple-600 rounded-full blur-3xl opacity-20 top-10 left-10 animate-pulse"></div>
//       <div className="absolute w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-20 bottom-10 right-10 animate-pulse"></div>

//       {/* HEADER */}
//       <div className="mb-10">
//         <h1 className="text-4xl font-extrabold tracking-wide">
//           Hello 👋
//         </h1>

//         <p className="text-white/60 mt-2 break-all">
//           {user.email}
//         </p>
//       </div>

//       {/* MAIN GRID */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//         {/* CARD 1 */}
//         <div className="group bg-white/10 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:scale-105 transition duration-300 hover:bg-white/15">
//           <h2 className="text-xl font-bold mb-2">📢 Create Ads</h2>
//           <p className="text-white/60 text-sm mb-4">
//             Start creating your new advertisement campaigns.
//           </p>
//           <button
//             onClick={() => router.push("/create-ad")}
//             className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600"
//           >
//             Go →
//           </button>
//         </div>

//         {/* CARD 2 */}
//         <div className="group bg-white/10 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:scale-105 transition duration-300 hover:bg-white/15">
//           <h2 className="text-xl font-bold mb-2">🔍 Explore Ads</h2>
//           <p className="text-white/60 text-sm mb-4">
//             View all public ads and discover new content.
//           </p>
//           <button
//             onClick={() => router.push("/explore")}
//             className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600"
//           >
//             Explore →
//           </button>
//         </div>

//         {/* CARD 3 */}
//         <div className="group bg-white/10 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:scale-105 transition duration-300 hover:bg-white/15">
//           <h2 className="text-xl font-bold mb-2">⚡ Activity</h2>
//           <p className="text-white/60 text-sm mb-4">
//             Track your performance and engagement.
//           </p>
//           <div className="text-2xl font-bold">0</div>
//         </div>

//       </div>

//       {/* USER ADS */}
//       <div className="mt-12">
//         <h2 className="text-2xl font-bold mb-4">Your Ads ✏️</h2>

//         <div className="grid md:grid-cols-3 gap-6">
//           {ads.map((ad) => (
//             <div
//               key={ad.id}
//               className="bg-white/10 border border-white/10 rounded-xl p-4 backdrop-blur-xl"
//             >
//               <h3 className="font-semibold">{ad.title}</h3>

//               <p className="text-white/60 text-sm">
//                 {ad.description}
//               </p>

//               {/* EDIT BUTTON */}
//               {ad.status === "draft" && (
//                 <button
//                   onClick={() => router.push(`/edit-ad/${ad.id}`)}
//                   className="mt-3 px-3 py-1 bg-blue-500 text-white rounded"
//                 >
//                   Edit ✏️
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setUser(data.user);

      // ✅ GET ROLE
      const { data: me } = await supabase
        .from("users")
        .select("role")
        .eq("email", data.user.email)
        .single();

      setRole(me?.role || "");

      // ✅ GET ADS
      const { data: adsData } = await supabase
        .from("ads")
        .select("*")
        .eq("user_id", data.user.id);

      setAds(adsData || []);
    };

    getUser();
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white p-6">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold">
          Hello 👋
        </h1>

        <p className="text-white/60 mt-2 break-all">
          {user.email}
        </p>

        <p className="text-white/40 text-sm mt-1">
          Role: {role}
        </p>

        {/* 🔥 ROLE NAVIGATION BUTTONS */}
        <div className="mt-5 flex flex-wrap gap-3">

          {/* MAIN */}
          <button
            onClick={() => router.push("/")}
            className="px-3 py-1 bg-white/10 rounded"
          >
            Main Dashboard
          </button>

          {/* MODERATOR ACCESS */}
          {["moderator", "admin", "super_admin"].includes(role) && (
            <button
              onClick={() => router.push("/moderator")}
              className="px-3 py-1 bg-purple-600 rounded"
            >
              Moderator Panel
            </button>
          )}

          {/* ADMIN ACCESS */}
          {["admin", "super_admin"].includes(role) && (
            <button
              onClick={() => router.push("/admin")}
              className="px-3 py-1 bg-blue-600 rounded"
            >
              Admin Panel
            </button>
          )}

          {/* SUPER ADMIN */}
          {role === "super_admin" && (
            <button
              onClick={() => router.push("/super-admin")}
              className="px-3 py-1 bg-red-600 rounded"
            >
              Super Admin
            </button>
          )}

        </div>
      </div>

      {/* MAIN GRID (UNCHANGED) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white/10 p-6 rounded-2xl">
          <h2 className="font-bold">📢 Create Ads</h2>
          <button onClick={() => router.push("/create-ad")} className="mt-2 bg-blue-600 px-3 py-1 rounded">
            Go
          </button>
        </div>

        <div className="bg-white/10 p-6 rounded-2xl">
          <h2 className="font-bold">🔍 Explore Ads</h2>
          <button onClick={() => router.push("/explore")} className="mt-2 bg-green-600 px-3 py-1 rounded">
            Explore
          </button>
        </div>

        <div className="bg-white/10 p-6 rounded-2xl">
          <h2 className="font-bold">⚡ Activity</h2>
          <div className="text-xl">{ads.length}</div>
        </div>

      </div>

      {/* USER ADS (UNCHANGED) */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Your Ads ✏️</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="bg-white/10 p-4 rounded-xl"
            >
              <h3 className="font-semibold">{ad.title}</h3>
              <p className="text-white/60 text-sm">{ad.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}