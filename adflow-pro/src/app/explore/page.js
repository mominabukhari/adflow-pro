// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "../../lib/supabase";
// import { useRouter } from "next/navigation";

// export default function Explore() {
//   const router = useRouter();

//   const [ads, setAds] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     checkUser();
//   }, []);

//   const checkUser = async () => {
//     const { data } = await supabase.auth.getUser();

//     if (!data?.user) {
//       router.push("/login");
//       return;
//     }

//     fetchAds();
//   };

//   const fetchAds = async () => {
//     setLoading(true);

//     const { data, error } = await supabase.from("ads").select("*");

//     if (error) {
//       console.log(error.message);
//       setAds([]);
//       setLoading(false);
//       return;
//     }

//     setAds(data || []);
//     setLoading(false);
//   };

//   const getStatusColor = (status) => {
//     const s = (status || "").toLowerCase().trim();

//     if (s === "published") return "bg-green-100 text-green-800 border-green-300";
//     if (s === "approved") return "bg-blue-100 text-blue-800 border-blue-300";
//     if (s === "submitted") return "bg-yellow-100 text-yellow-800 border-yellow-300";

//     return "bg-gray-100 text-gray-700 border-gray-300";
//   };

//   const getPackageType = (type) => {
//     if (type === "premium") return "PREMIUM (7 DAYS)";
//     if (type === "standard") return "STANDARD (3 DAYS)";
//     return "BASIC (1 DAY)";
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">

//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">
//           Explore Ads
//         </h1>

//         <button
//           onClick={() => router.push("/create-ad")}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
//         >
//           + Create Ad
//         </button>
//       </div>

//       {loading && (
//         <p className="text-gray-700">Loading ads...</p>
//       )}

//       {!loading && ads.length === 0 && (
//         <p className="text-gray-700">No ads available</p>
//       )}

//       {!loading && ads.length > 0 && (
//         <div className="grid md:grid-cols-2 gap-4">

//           {ads.map((ad) => (
//             <div
//               key={ad.id}
//               className="bg-white p-5 rounded-xl shadow-md border"
//             >

//               {/* TITLE */}
//               <h2 className="text-xl font-bold text-gray-900">
//                 {ad.title}
//               </h2>

//               {/* DESCRIPTION */}
//               <p className="text-gray-700 mt-2">
//                 {ad.description}
//               </p>

//               {/* BADGES */}
//               <div className="flex gap-2 mt-4 flex-wrap">

//                 {/* STATUS */}
//                 <span
//                   className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
//                     ad.status
//                   )}`}
//                 >
//                   {ad.status || "UNKNOWN"}
//                 </span>

//                 {/* PACKAGE TYPE */}
//                 <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-300">
//                   {getPackageType(ad.type)}
//                 </span>

//               </div>

//             </div>
//           ))}

//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Explore() {
  const router = useRouter();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAds(); // ✅ NO LOGIN CHECK (PUBLIC PAGE)
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("ads")
      .select("*")
      .eq("status", "published")
      .order("is_featured", { ascending: false })
      .order("package_weight", { ascending: false });

    if (error) {
      console.log("ERROR:", error.message);
      setAds([]);
      setLoading(false);
      return;
    }

    const validAds = (data || []).filter((ad) => {
      if (!ad.expire_at) return true;
      return new Date(ad.expire_at) > new Date();
    });

    setAds(validAds);
    setLoading(false);
  };

  const getPackageType = (type) => {
    if (type === "premium") return "PREMIUM (30 DAYS)";
    if (type === "standard") return "STANDARD (15 DAYS)";
    return "BASIC (7 DAYS)";
  };

  const filteredAds = ads.filter((ad) =>
    ad.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-purple-600 blur-[160px] opacity-20 top-[-120px] left-[-120px]"></div>
      <div className="absolute w-[500px] h-[500px] bg-blue-600 blur-[160px] opacity-20 bottom-[-120px] right-[-120px]"></div>

      <div className="flex justify-between items-center mb-6 relative z-10">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-transparent bg-clip-text">
          Explore Ads 🔥
        </h1>

        <button
          onClick={() => router.push("/create-ad")}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition shadow-lg"
        >
          + Create Ad
        </button>
      </div>

      <div className="relative z-10 mb-6">
        <input
          type="text"
          placeholder="Search ads..."
          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p className="text-white/70 animate-pulse">Loading ads...</p>}

      {!loading && filteredAds.length === 0 && (
        <p className="text-white/60">No ads available</p>
      )}

      <div className="grid md:grid-cols-3 gap-6 relative z-10">
        {filteredAds.map((ad) => (
          <div key={ad.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-lg hover:scale-[1.03] transition shadow-lg">
            <img src={ad.media_url || "https://via.placeholder.com/300"} className="w-full h-44 object-cover group-hover:scale-110 transition" />
            <div className="p-4">
              <h2 className="text-lg font-bold">{ad.title}</h2>
              <p className="text-white/60 text-sm mt-1">{ad.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}