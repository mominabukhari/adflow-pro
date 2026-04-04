// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "../../lib/supabase";

// export default function SuperAdminPage() {
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

//     if (!me || me.role !== "super_admin") {
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

//   const publishedAds = ads.filter(ad => ad.status === "published").length;
//   const pendingAds = ads.filter(ad => ad.status !== "published").length;

//   const admins = users.filter(u => u.role === "admin").length;
//   const moderators = users.filter(u => u.role === "moderator").length;
//   const normalUsers = users.filter(u => u.role === "user").length;

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
//         Loading Super Admin Panel...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white p-6">

//       {/* 🔥 TOP NAVIGATION (NEW) */}
//       <div className="flex flex-wrap gap-3 mb-8">

//         <button
//           onClick={() => router.push("/dashboard")}
//           className="px-3 py-1 bg-white/10 rounded"
//         >
//           Main Dashboard
//         </button>

//         <button
//           onClick={() => router.push("/admin")}
//           className="px-3 py-1 bg-blue-600 rounded"
//         >
//           Admin Panel
//         </button>

//         <button
//           onClick={() => router.push("/moderator")}
//           className="px-3 py-1 bg-purple-600 rounded"
//         >
//           Moderator Panel
//         </button>

//         <button className="px-3 py-1 bg-red-600 rounded opacity-70">
//           Super Admin
//         </button>

//       </div>

//       {/* HEADER */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">Super Admin Panel 🛡️</h1>
//         <p className="text-white/60 mt-2">
//           Full system control dashboard
//         </p>
//       </div>

//       {/* STATS */}
//       <div className="grid md:grid-cols-3 gap-4 mb-10">

//         <div className="bg-white/10 p-4 rounded-xl border border-white/10">
//           <p className="text-white/60">Total Users</p>
//           <h2 className="text-2xl font-bold">{users.length}</h2>
//         </div>

//         <div className="bg-white/10 p-4 rounded-xl border border-white/10">
//           <p className="text-white/60">Total Ads</p>
//           <h2 className="text-2xl font-bold">{ads.length}</h2>
//         </div>

//         <div className="bg-white/10 p-4 rounded-xl border border-white/10">
//           <p className="text-white/60">Published Ads</p>
//           <h2 className="text-2xl font-bold">{publishedAds}</h2>
//         </div>

//         <div className="bg-white/10 p-4 rounded-xl border border-white/10">
//           <p className="text-white/60">Pending Ads</p>
//           <h2 className="text-2xl font-bold">{pendingAds}</h2>
//         </div>

//         <div className="bg-white/10 p-4 rounded-xl border border-white/10">
//           <p className="text-white/60">Admins</p>
//           <h2 className="text-2xl font-bold">{admins}</h2>
//         </div>

//         <div className="bg-white/10 p-4 rounded-xl border border-white/10">
//           <p className="text-white/60">Moderators</p>
//           <h2 className="text-2xl font-bold">{moderators}</h2>
//         </div>

//       </div>

//       {/* USERS */}
//       <h2 className="text-2xl font-bold mb-4">All Users 👤</h2>

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
//       <h2 className="text-2xl font-bold mb-4">All Ads 📢</h2>

//       <div className="grid md:grid-cols-2 gap-6">
//         {ads.map((ad) => (
//           <div
//             key={ad.id}
//             className="bg-white/10 border border-white/10 backdrop-blur-xl p-5 rounded-2xl"
//           >
//             <h3 className="text-xl font-semibold">{ad.title}</h3>

//             <p className="text-white/60 text-sm mt-1">
//               {ad.description}
//             </p>

//             <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-white/10">
//               {ad.status}
//             </span>
//           </div>
//         ))}
//       </div>

//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function SuperAdminPage() {
  const router = useRouter();

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

    const { data: me, error } = await supabase
      .from("users")
      .select("role")
      .eq("email", auth.user.email)
      .maybeSingle();

    if (error || !me || me.role !== "super_admin") {
      router.push("/");
      return;
    }

    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);

    const { data: usersData } = await supabase.from("users").select("*");

    const { data: adsData } = await supabase.from("ads").select(`
      *,
      categories(name),
      cities(name),
      ad_media(url),
      packages(name, price)
    `);

    const { data: statusData } = await supabase
      .from("ad_status_history")
      .select("*");

    const enriched = (adsData || []).map((ad) => {
      const history = (statusData || [])
        .filter((h) => h.ad_id === ad.id)
        .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at));

      return {
        ...ad,
        latest_status: history[0]?.new_status || ad.status,
      };
    });

    setUsers(usersData || []);
    setAds(enriched || []);
    setLoading(false);
  };

  const publishedAds = ads.filter(a => a.latest_status === "published").length;
  const pendingAds = ads.filter(a => a.latest_status !== "published").length;

  const admins = users.filter(u => u.role === "admin").length;
  const moderators = users.filter(u => u.role === "moderator").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Super Admin Panel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white p-6">

      {/* NAV */}
      <div className="flex gap-3 mb-8">
        <button onClick={() => router.push("/dashboard")} className="px-3 py-1 bg-white/10 rounded">
          Main Dashboard
        </button>

        <button onClick={() => router.push("/admin")} className="px-3 py-1 bg-blue-600 rounded">
          Admin
        </button>

        <button onClick={() => router.push("/moderator")} className="px-3 py-1 bg-purple-600 rounded">
          Moderator
        </button>

        <button className="px-3 py-1 bg-red-600 rounded opacity-70">
          Super Admin
        </button>
      </div>

      <h1 className="text-3xl font-bold">Super Admin Panel 🛡️</h1>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4 mt-8 mb-10">
        <div className="bg-white/10 p-4 rounded-xl">Users: <b>{users.length}</b></div>
        <div className="bg-white/10 p-4 rounded-xl">Ads: <b>{ads.length}</b></div>
        <div className="bg-white/10 p-4 rounded-xl">Published: <b>{publishedAds}</b></div>
        <div className="bg-white/10 p-4 rounded-xl">Pending: <b>{pendingAds}</b></div>
        <div className="bg-white/10 p-4 rounded-xl">Admins: <b>{admins}</b></div>
        <div className="bg-white/10 p-4 rounded-xl">Moderators: <b>{moderators}</b></div>
      </div>

      {/* USERS */}
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {users.map(u => (
          <div key={u.id} className="bg-white/10 p-4 rounded-xl">
            <p>{u.email}</p>
            <p className="text-white/60 text-sm">Role: {u.role}</p>
          </div>
        ))}
      </div>

      {/* ADS */}
      <h2 className="text-2xl font-bold mb-4">Ads</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {ads.map(ad => (
          <div key={ad.id} className="bg-white/10 p-5 rounded-2xl">
            <h3 className="text-xl font-semibold">{ad.title}</h3>

            <p className="text-white/60 text-sm mt-1">
              {ad.description}
            </p>

            <div className="text-xs mt-2 text-white/70">
              Category: {ad.categories?.name || "N/A"} <br />
              City: {ad.cities?.name || "N/A"} <br />
              Package: {ad.packages?.name || "N/A"}
            </div>

            <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-white/10">
              {ad.latest_status}
            </span>

            {ad.ad_media?.[0]?.url && (
              <img
                src={ad.ad_media[0].url}
                className="mt-3 rounded-lg w-full h-40 object-cover"
              />
            )}
          </div>
        ))}
      </div>

    </div>
  );
}