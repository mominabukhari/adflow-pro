// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "../../lib/supabase";
// import { useRouter } from "next/navigation";

// export default function Moderator() {
//   const router = useRouter();
//   const [ads, setAds] = useState([]);
//   const [note, setNote] = useState({});

//   useEffect(() => {
//     checkRole();
//   }, []);

//   const checkRole = async () => {
//     const { data: userData } = await supabase.auth.getUser();

//     if (!userData?.user) {
//       router.push("/login");
//       return;
//     }

//     const { data } = await supabase
//       .from("users")
//       .select("role")
//       .eq("email", userData.user.email)
//       .maybeSingle(); // ✅ FIX

//     if (!data) {
//       router.push("/");
//       return;
//     }

//     if (data.role !== "moderator" && data.role !== "admin" && data.role !== "super_admin") {
//       router.push("/");
//       return;
//     }

//     fetchAds();
//   };

//   const fetchAds = async () => {
//     const { data } = await supabase
//       .from("ads")
//       .select("*")
//       .in("status", ["submitted", "under_review"]);

//     setAds(data || []);
//   };

//   const approveAd = async (id) => {
//     const { error } = await supabase
//       .from("ads")
//       .update({
//         status: "payment_submitted",
//       })
//       .eq("id", id);

//     if (error) return;

//     fetchAds();
//   };

//   const rejectAd = async (id) => {
//     await supabase
//       .from("ads")
//       .update({
//         status: "rejected",
//         moderator_note: note[id] || "No reason provided",
//       })
//       .eq("id", id);

//     fetchAds();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 p-6">

//       <h1 className="text-3xl font-bold mb-6 text-center text-white">
//         Moderator Review Panel 🛡️
//       </h1>

//       <div className="grid md:grid-cols-2 gap-6">

//         {ads.map((ad) => (
//           <div
//             key={ad.id}
//             className="bg-gradient-to-br from-purple-800/60 via-purple-900/60 to-indigo-900/60 backdrop-blur-md border border-purple-500/20 p-5 rounded-xl shadow-lg hover:shadow-purple-500/40 transition"
//           >

//             <img
//               src={ad.media_url || "https://via.placeholder.com/300"}
//               className="w-full h-40 object-cover rounded"
//             />

//             <h2 className="text-xl font-bold mt-3 text-white">
//               {ad.title}
//             </h2>

//             <p className="text-gray-300 mt-1 text-sm">
//               {ad.description}
//             </p>

//             <p className="text-xs text-gray-400 mt-1">
//               Transaction: {ad.transaction_id}
//             </p>

//             <span className="inline-block mt-2 px-3 py-1 text-xs bg-purple-600/40 text-white rounded">
//               {ad.status}
//             </span>

//             <textarea
//               placeholder="Add note (optional)"
//               className="w-full mt-3 p-2 bg-slate-800/60 border border-purple-500/20 rounded text-sm text-white placeholder-gray-400"
//               onChange={(e) =>
//                 setNote({ ...note, [ad.id]: e.target.value })
//               }
//             />

//             <div className="flex gap-3 mt-4">

//               <button
//                 onClick={() => approveAd(ad.id)}
//                 className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded"
//               >
//                 Approve
//               </button>

//               <button
//                 onClick={() => rejectAd(ad.id)}
//                 className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2 rounded"
//               >
//                 Reject
//               </button>

//             </div>

//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Moderator() {
  const router = useRouter();
  const [ads, setAds] = useState([]);
  const [note, setNote] = useState({});
  const [role, setRole] = useState("");

  useEffect(() => {
    checkRole();
  }, []);

  const checkRole = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData?.user) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("users")
      .select("role")
      .eq("email", userData.user.email)
      .maybeSingle();

    if (!data) {
      router.push("/");
      return;
    }

    // allowed roles
    if (
      data.role !== "moderator" &&
      data.role !== "admin" &&
      data.role !== "super_admin"
    ) {
      router.push("/");
      return;
    }

    setRole(data.role);
    fetchAds();
  };

  const fetchAds = async () => {
    const { data } = await supabase
      .from("ads")
      .select("*")
      .in("status", ["submitted", "under_review"]);

    setAds(data || []);
  };

  const approveAd = async (id) => {
    const { error } = await supabase
      .from("ads")
      .update({
        status: "payment_submitted",
      })
      .eq("id", id);

    if (!error) fetchAds();
  };

  const rejectAd = async (id) => {
    await supabase
      .from("ads")
      .update({
        status: "rejected",
        moderator_note: note[id] || "No reason provided",
      })
      .eq("id", id);

    fetchAds();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 p-6 text-white">

      {/* 🔥 NAVIGATION BAR (NEW) */}
      <div className="flex gap-3 mb-6">

        {/* MAIN DASHBOARD */}
        <button
          onClick={() => router.push("/dashboard")}
          className="px-3 py-1 bg-white/10 rounded"
        >
          Main Dashboard
        </button>

        {/* MODERATOR (current page) */}
        <button className="px-3 py-1 bg-purple-600 rounded opacity-70">
          Moderator Panel
        </button>

      </div>

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        Moderator Review Panel 🛡️
      </h1>

      {/* ADS */}
      <div className="grid md:grid-cols-2 gap-6">

        {ads.map((ad) => (
          <div
            key={ad.id}
            className="bg-gradient-to-br from-purple-800/60 via-purple-900/60 to-indigo-900/60 backdrop-blur-md border border-purple-500/20 p-5 rounded-xl shadow-lg hover:shadow-purple-500/40 transition"
          >

            <img
              src={ad.media_url || "https://via.placeholder.com/300"}
              className="w-full h-40 object-cover rounded"
            />

            <h2 className="text-xl font-bold mt-3">{ad.title}</h2>

            <p className="text-gray-300 mt-1 text-sm">
              {ad.description}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Transaction: {ad.transaction_id}
            </p>

            <span className="inline-block mt-2 px-3 py-1 text-xs bg-purple-600/40 rounded">
              {ad.status}
            </span>

            <textarea
              placeholder="Add note (optional)"
              className="w-full mt-3 p-2 bg-slate-800/60 border border-purple-500/20 rounded text-sm"
              onChange={(e) =>
                setNote({ ...note, [ad.id]: e.target.value })
              }
            />

            <div className="flex gap-3 mt-4">

              <button
                onClick={() => approveAd(ad.id)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-2 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => rejectAd(ad.id)}
                className="flex-1 bg-rose-600 hover:bg-rose-700 py-2 rounded"
              >
                Reject
              </button>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
}