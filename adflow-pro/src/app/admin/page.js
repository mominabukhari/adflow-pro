// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "../../lib/supabase";

// export default function AdminPage() {
//   const router = useRouter();

//   const [users, setUsers] = useState([]);
//   const [ads, setAds] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     checkRole();
//   }, []);

//   const checkRole = async () => {
//     const { data: auth } = await supabase.auth.getUser();

//     if (!auth?.user) {
//       router.push("/login");
//       return;
//     }

//     const { data: me } = await supabase
//       .from("users")
//       .select("role")
//       .eq("email", auth.user.email)
//       .maybeSingle();

//     if (!me || (me.role !== "admin" && me.role !== "super_admin")) {
//       router.push("/");
//       return;
//     }

//     fetchData();
//   };

//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       const { data: usersData } = await supabase
//         .from("users")
//         .select("*");

//       const { data: adsData } = await supabase
//         .from("ads")
//         .select("*");

//       setUsers(usersData || []);
//       setAds(adsData || []);
//     } catch (err) {
//       console.log("Error:", err);
//       setUsers([]);
//       setAds([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ PUBLISH FUNCTION (MAIN FIX)
//   const publishAd = async (id) => {
//     const { error } = await supabase
//       .from("ads")
//       .update({
//         status: "published",
//       })
//       .eq("id", id);

//     if (!error) {
//       fetchData();
//     }
//   };

//   const publishedAds = ads.filter(ad => ad.status === "published").length;
//   const pendingAds = ads.filter(ad => ad.status !== "published").length;

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white p-6">

//       {/* HEADER */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">Admin Dashboard 🛠️</h1>

//         <p className="text-white/60 mt-2">
//           Users: {users.length} | Ads: {ads.length} | Published Ads: {publishedAds} | Pending Ads: {pendingAds}
//         </p>
//       </div>

//       {/* USERS */}
//       <h2 className="text-2xl font-bold mb-4">Users 👤</h2>

//       <div className="grid md:grid-cols-2 gap-4 mb-10">
//         {users.map((u) => (
//           <div
//             key={u.id}
//             className="bg-white/10 border border-white/10 p-4 rounded-xl"
//           >
//             <p className="font-semibold">{u.email}</p>
//             <p className="text-white/60 text-sm">Role: {u.role}</p>
//           </div>
//         ))}
//       </div>

//       {/* ADS */}
//       <h2 className="text-2xl font-bold mb-4">Ads for Publishing 📢</h2>

//       <div className="grid md:grid-cols-2 gap-6">

//         {ads
//           .filter(ad => ad.status === "payment_submitted") // ✅ ONLY ADS WAITING FOR ADMIN
//           .map((ad) => (
//             <div
//               key={ad.id}
//               className="bg-white/10 border border-white/10 backdrop-blur-xl p-5 rounded-2xl"
//             >
//               <h3 className="text-xl font-semibold">{ad.title}</h3>

//               <p className="text-white/60 text-sm mt-1">
//                 {ad.description}
//               </p>

//               <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-yellow-500/20">
//                 {ad.status}
//               </span>

//               {/* ✅ PUBLISH BUTTON */}
//               <button
//                 onClick={() => publishAd(ad.id)}
//                 className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 py-2 rounded"
//               >
//                 Publish Ad
//               </button>
//             </div>
//           ))}

//       </div>

//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {
  const router = useRouter();

  const [userRole, setUserRole] = useState("");
  const [users, setUsers] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkRole();
  }, []);

  const checkRole = async () => {
    const { data: auth } = await supabase.auth.getUser();

    if (!auth?.user) {
      router.push("/login");
      return;
    }

    const { data: me } = await supabase
      .from("users")
      .select("role")
      .eq("email", auth.user.email)
      .maybeSingle();

    if (!me || (me.role !== "admin" && me.role !== "super_admin")) {
      router.push("/");
      return;
    }

    setUserRole(me.role);
    fetchData();
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const { data: usersData } = await supabase
        .from("users")
        .select("*");

      const { data: adsData } = await supabase
        .from("ads")
        .select("*");

      setUsers(usersData || []);
      setAds(adsData || []);
    } catch (err) {
      console.log("Error:", err);
      setUsers([]);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  const publishAd = async (id) => {
    const { error } = await supabase
      .from("ads")
      .update({ status: "published" })
      .eq("id", id);

    if (!error) {
      fetchData();
    }
  };

  const publishedAds = ads.filter(ad => ad.status === "published").length;
  const pendingAds = ads.filter(ad => ad.status === "payment_submitted").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white p-6">

      {/* 🔥 TOP NAVIGATION (NEW FEATURE) */}
      <div className="flex flex-wrap gap-3 mb-8">

        {/* MAIN DASHBOARD */}
        <button
          onClick={() => router.push("/dashboard")}
          className="px-3 py-1 bg-white/10 rounded"
        >
          Main Dashboard
        </button>

        {/* MODERATOR ACCESS (admin + super_admin) */}
        {(userRole === "admin" || userRole === "super_admin") && (
          <button
            onClick={() => router.push("/moderator")}
            className="px-3 py-1 bg-purple-600 rounded"
          >
            Moderator Page
          </button>
        )}

        {/* ADMIN PAGE (current) */}
        <button className="px-3 py-1 bg-blue-600 rounded opacity-60">
          Admin Page
        </button>

        {/* SUPER ADMIN ACCESS */}
        {userRole === "super_admin" && (
          <button
            onClick={() => router.push("/super-admin")}
            className="px-3 py-1 bg-red-600 rounded"
          >
            Super Admin
          </button>
        )}

      </div>

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard 🛠️</h1>

        <p className="text-white/60 mt-2">
          Users: {users.length} | Ads: {ads.length} | Published Ads: {publishedAds} | Pending Ads: {pendingAds}
        </p>
      </div>

      {/* USERS */}
      <h2 className="text-2xl font-bold mb-4">Users 👤</h2>

      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-white/10 border border-white/10 p-4 rounded-xl"
          >
            <p className="font-semibold">{u.email}</p>
            <p className="text-white/60 text-sm">Role: {u.role}</p>
          </div>
        ))}
      </div>

      {/* ADS */}
      <h2 className="text-2xl font-bold mb-4">Ads for Publishing 📢</h2>

      <div className="grid md:grid-cols-2 gap-6">

        {ads
          .filter(ad => ad.status === "payment_submitted")
          .map((ad) => (
            <div
              key={ad.id}
              className="bg-white/10 border border-white/10 backdrop-blur-xl p-5 rounded-2xl"
            >
              <h3 className="text-xl font-semibold">{ad.title}</h3>

              <p className="text-white/60 text-sm mt-1">
                {ad.description}
              </p>

              <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-yellow-500/20">
                {ad.status}
              </span>

              <button
                onClick={() => publishAd(ad.id)}
                className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 py-2 rounded"
              >
                Publish Ad
              </button>
            </div>
          ))}

      </div>

    </div>
  );
}