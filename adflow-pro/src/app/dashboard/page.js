// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "../../lib/supabase";

// export default function Dashboard() {
//   const router = useRouter();

//   const [user, setUser] = useState(null);
//   const [role, setRole] = useState("");
//   const [ads, setAds] = useState([]);

//   useEffect(() => {
//     const getUser = async () => {
//       const { data } = await supabase.auth.getUser();

//       if (!data.user) {
//         router.push("/login");
//         return;
//       }

//       setUser(data.user);

//       // ✅ GET ROLE
//       const { data: me } = await supabase
//         .from("users")
//         .select("role")
//         .eq("email", data.user.email)
//         .single();

//       setRole(me?.role || "");

//       // ✅ GET ADS
//       const { data: adsData } = await supabase
//         .from("ads")
//         .select("*")
//         .eq("user_id", data.user.id);

//       setAds(adsData || []);
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

//       {/* HEADER */}
//       <div className="mb-10">
//         <h1 className="text-4xl font-extrabold">
//           Hello 👋
//         </h1>

//         <p className="text-white/60 mt-2 break-all">
//           {user.email}
//         </p>

//         <p className="text-white/40 text-sm mt-1">
//           Role: {role}
//         </p>

//         {/* 🔥 ROLE NAVIGATION BUTTONS */}
//         <div className="mt-5 flex flex-wrap gap-3">

//           {/* MAIN */}
//           <button
//             onClick={() => router.push("/")}
//             className="px-3 py-1 bg-white/10 rounded"
//           >
//             Main Dashboard
//           </button>

//           {/* MODERATOR ACCESS */}
//           {["moderator", "admin", "super_admin"].includes(role) && (
//             <button
//               onClick={() => router.push("/moderator")}
//               className="px-3 py-1 bg-purple-600 rounded"
//             >
//               Moderator Panel
//             </button>
//           )}

//           {/* ADMIN ACCESS */}
//           {["admin", "super_admin"].includes(role) && (
//             <button
//               onClick={() => router.push("/admin")}
//               className="px-3 py-1 bg-blue-600 rounded"
//             >
//               Admin Panel
//             </button>
//           )}

//           {/* SUPER ADMIN */}
//           {role === "super_admin" && (
//             <button
//               onClick={() => router.push("/super-admin")}
//               className="px-3 py-1 bg-red-600 rounded"
//             >
//               Super Admin
//             </button>
//           )}

//         </div>
//       </div>

//       {/* MAIN GRID (UNCHANGED) */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//         <div className="bg-white/10 p-6 rounded-2xl">
//           <h2 className="font-bold">📢 Create Ads</h2>
//           <button onClick={() => router.push("/create-ad")} className="mt-2 bg-blue-600 px-3 py-1 rounded">
//             Go
//           </button>
//         </div>

//         <div className="bg-white/10 p-6 rounded-2xl">
//           <h2 className="font-bold">🔍 Explore Ads</h2>
//           <button onClick={() => router.push("/explore")} className="mt-2 bg-green-600 px-3 py-1 rounded">
//             Explore
//           </button>
//         </div>

//         <div className="bg-white/10 p-6 rounded-2xl">
//           <h2 className="font-bold">⚡ Activity</h2>
//           <div className="text-xl">{ads.length}</div>
//         </div>

//       </div>

//       {/* USER ADS (UNCHANGED) */}
//       <div className="mt-12">
//         <h2 className="text-2xl font-bold mb-4">Your Ads ✏️</h2>

//         <div className="grid md:grid-cols-3 gap-6">
//           {ads.map((ad) => (
//             <div
//               key={ad.id}
//               className="bg-white/10 p-4 rounded-xl"
//             >
//               <h3 className="font-semibold">{ad.title}</h3>
//               <p className="text-white/60 text-sm">{ad.description}</p>
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
  }, []);

  // 🔵 GET USER + ROLE + ADS
  const getUser = async () => {
    setLoading(true);

    const { data } = await supabase.auth.getUser();

    if (!data?.user) {
      router.push("/login");
      return;
    }

    setUser(data.user);

    // ✅ SAFE ROLE FETCH
    const { data: me, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (!error) {
      setRole(me?.role || "");
    }

    await fetchAds(data.user.id);

    setLoading(false);
  };

  // 🔵 FETCH ADS
  const fetchAds = async (userId) => {
    const { data } = await supabase
      .from("ads")
      .select("*")
      .eq("user_id", userId);

    setAds(data || []);
  };

  // 🔵 SUBMIT AD
  const submitAd = async (id) => {
    await supabase
      .from("ads")
      .update({ status: "submitted" })
      .eq("id", id);

    refresh();
  };

  // 🔵 PAYMENT
  const submitPayment = async (adId) => {
    const transaction = prompt("Enter Transaction ID");
    const screenshot = prompt("Enter Screenshot URL");

    if (!transaction || !screenshot) return;

    await supabase.from("payments").insert([
      {
        ad_id: adId,
        transaction_ref: transaction,
        screenshot_url: screenshot,
        status: "submitted",
      },
    ]);

    await supabase
      .from("ads")
      .update({ status: "payment_submitted" })
      .eq("id", adId);

    refresh();
  };

  const refresh = () => {
    if (user) fetchAds(user.id);
  };

  // 🔵 LOADING STATE (FIXED)
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white p-6">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Hello 👋</h1>

        <p className="text-white/60 mt-2 break-all">
          {user.email}
        </p>

        <p className="text-white/40 text-sm mt-1">
          Role: {role}
        </p>

        {/* ROLE BUTTONS */}
        <div className="mt-5 flex flex-wrap gap-3">

          <button
            onClick={() => router.push("/")}
            className="px-3 py-1 bg-white/10 rounded"
          >
            Main
          </button>

          <button
            onClick={() => router.push("/moderator")}
            className="px-3 py-1 bg-purple-600 rounded"
          >
            Moderator
          </button>

          <button
            onClick={() => router.push("/admin")}
            className="px-3 py-1 bg-blue-600 rounded"
          >
            Admin
          </button>

          <button
            onClick={() => router.push("/super-admin")}
            className="px-3 py-1 bg-red-600 rounded"
          >
            Super Admin
          </button>

        </div>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white/10 p-6 rounded-xl">
          <h2 className="font-bold">Create Ad</h2>
          <button
            onClick={() => router.push("/create-ad")}
            className="mt-2 bg-blue-600 px-3 py-1 rounded"
          >
            Go
          </button>
        </div>

        <div className="bg-white/10 p-6 rounded-xl">
          <h2 className="font-bold">Explore Ads</h2>
          <button
            onClick={() => router.push("/explore")}
            className="mt-2 bg-green-600 px-3 py-1 rounded"
          >
            Open
          </button>
        </div>

        <div className="bg-white/10 p-6 rounded-xl">
          <h2 className="font-bold">Total Ads</h2>
          <div className="text-2xl">{ads.length}</div>
        </div>

      </div>

      {/* ADS */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Your Ads</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div key={ad.id} className="bg-white/10 p-4 rounded-xl">

              <h3 className="font-semibold">{ad.title}</h3>
              <p className="text-white/60 text-sm">{ad.description}</p>

              <p className="text-yellow-400 text-xs mt-2">
                Status: {ad.status}
              </p>

              {ad.status === "draft" && (
                <button
                  onClick={() => submitAd(ad.id)}
                  className="mt-3 bg-blue-600 px-3 py-1 rounded"
                >
                  Submit
                </button>
              )}

              {ad.status === "payment_pending" && (
                <button
                  onClick={() => submitPayment(ad.id)}
                  className="mt-3 bg-green-600 px-3 py-1 rounded"
                >
                  Pay Now
                </button>
              )}

              {ad.status === "rejected" && (
                <p className="text-red-400 mt-2 text-sm">
                  Rejected: {ad.moderator_note || "No reason"}
                </p>
              )}

              {ad.status === "published" && (
                <p className="text-green-400 mt-2 text-sm">
                  Published 🚀
                </p>
              )}

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}