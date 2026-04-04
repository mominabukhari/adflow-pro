// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "../../lib/supabase";
// import { useRouter } from "next/navigation";

// export default function Moderator() {
//   const router = useRouter();
//   const [ads, setAds] = useState([]);
//   const [note, setNote] = useState({});
//   const [role, setRole] = useState("");

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
//       .maybeSingle();

//     if (!data) {
//       router.push("/");
//       return;
//     }

//     // allowed roles
//     if (
//       data.role !== "moderator" &&
//       data.role !== "admin" &&
//       data.role !== "super_admin"
//     ) {
//       router.push("/");
//       return;
//     }

//     setRole(data.role);
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

//     if (!error) fetchAds();
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
//     <div className="min-h-screen bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 p-6 text-white">

//       {/* 🔥 NAVIGATION BAR (NEW) */}
//       <div className="flex gap-3 mb-6">

//         {/* MAIN DASHBOARD */}
//         <button
//           onClick={() => router.push("/dashboard")}
//           className="px-3 py-1 bg-white/10 rounded"
//         >
//           Main Dashboard
//         </button>

//         {/* MODERATOR (current page) */}
//         <button className="px-3 py-1 bg-purple-600 rounded opacity-70">
//           Moderator Panel
//         </button>

//       </div>

//       {/* TITLE */}
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         Moderator Review Panel 🛡️
//       </h1>

//       {/* ADS */}
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

//             <h2 className="text-xl font-bold mt-3">{ad.title}</h2>

//             <p className="text-gray-300 mt-1 text-sm">
//               {ad.description}
//             </p>

//             <p className="text-xs text-gray-400 mt-1">
//               Transaction: {ad.transaction_id}
//             </p>

//             <span className="inline-block mt-2 px-3 py-1 text-xs bg-purple-600/40 rounded">
//               {ad.status}
//             </span>

//             <textarea
//               placeholder="Add note (optional)"
//               className="w-full mt-3 p-2 bg-slate-800/60 border border-purple-500/20 rounded text-sm"
//               onChange={(e) =>
//                 setNote({ ...note, [ad.id]: e.target.value })
//               }
//             />

//             <div className="flex gap-3 mt-4">

//               <button
//                 onClick={() => approveAd(ad.id)}
//                 className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-2 rounded"
//               >
//                 Approve
//               </button>

//               <button
//                 onClick={() => rejectAd(ad.id)}
//                 className="flex-1 bg-rose-600 hover:bg-rose-700 py-2 rounded"
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    checkRole();
  }, []);

  // ========================
  // ROLE CHECK (SAFE FIX)
  // ========================
  const checkRole = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData?.user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (error || !data?.role) {
      router.push("/");
      return;
    }

    const allowedRoles = ["moderator", "admin", "super_admin"];

    if (!allowedRoles.includes(data.role)) {
      router.push("/");
      return;
    }

    setRole(data.role);
    await fetchAds();
    setLoading(false);
  };

  // ========================
  // FETCH ADS (SAFE FIX)
  // ========================
  const fetchAds = async () => {
    setError("");

    const { data, error } = await supabase
      .from("ads")
      .select("*")
      .in("status", ["submitted", "under_review"])
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      setError("Failed to load ads");
      setLoading(false);
      return;
    }

    setAds(data || []);
    setLoading(false);
  };

  // ========================
  // AUDIT LOG
  // ========================
  const addAuditLog = async (adId, action) => {
    const { data: user } = await supabase.auth.getUser();

    await supabase.from("audit_logs").insert({
      ad_id: adId,
      action,
      performed_by: user?.user?.email || "unknown",
      timestamp: new Date().toISOString(),
    });
  };

  // ========================
  // STATUS HISTORY (FIXED TABLE NAME)
  // ========================
  const addStatusHistory = async (adId, oldStatus, newStatus) => {
    await supabase.from("ads_status_history").insert({
      ad_id: adId,
      previous_status: oldStatus,
      new_status: newStatus,
      created_at: new Date().toISOString(),
    });
  };

  // ========================
  // APPROVE
  // ========================
  const approveAd = async (ad) => {
    const oldStatus = ad.status;

    const { error } = await supabase
      .from("ads")
      .update({
        status: "payment_submitted",
      })
      .eq("id", ad.id);

    if (!error) {
      await addAuditLog(ad.id, "APPROVED");
      await addStatusHistory(ad.id, oldStatus, "payment_submitted");
      fetchAds();
    }
  };

  // ========================
  // REJECT
  // ========================
  const rejectAd = async (ad) => {
    const oldStatus = ad.status;

    const { error } = await supabase
      .from("ads")
      .update({
        status: "rejected",
        moderator_note: note[ad.id] || "No reason provided",
      })
      .eq("id", ad.id);

    if (!error) {
      await addAuditLog(ad.id, "REJECTED");
      await addStatusHistory(ad.id, oldStatus, "rejected");
      fetchAds();
    }
  };

  // ========================
  // LOADING
  // ========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading moderator panel...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 p-6 text-white">

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="px-3 py-1 bg-white/10 rounded"
        >
          Main Dashboard
        </button>

        <button className="px-3 py-1 bg-purple-600 rounded opacity-70">
          Moderator Panel ({role})
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">
        Moderator Review Panel 🛡️
      </h1>

      {ads.length === 0 && (
        <p className="text-center text-gray-400">
          No ads to review right now.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {ads.map((ad) => (
          <div
            key={ad.id}
            className="bg-gradient-to-br from-purple-800/60 via-purple-900/60 to-indigo-900/60 backdrop-blur-md border border-purple-500/20 p-5 rounded-xl shadow-lg"
          >
            <img
              src="https://via.placeholder.com/300"
              className="w-full h-40 object-cover rounded"
            />

            <h2 className="text-xl font-bold mt-3">{ad.title}</h2>

            <p className="text-gray-300 mt-1 text-sm">
              {ad.description}
            </p>

            <span className="inline-block mt-2 px-3 py-1 text-xs bg-purple-600/40 rounded">
              {ad.status}
            </span>

            <textarea
              placeholder="Add rejection note (optional)"
              className="w-full mt-3 p-2 bg-slate-800/60 border border-purple-500/20 rounded text-sm"
              onChange={(e) =>
                setNote({ ...note, [ad.id]: e.target.value })
              }
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => approveAd(ad)}
                className="flex-1 bg-emerald-600 py-2 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => rejectAd(ad)}
                className="flex-1 bg-rose-600 py-2 rounded"
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