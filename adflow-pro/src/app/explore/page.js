// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "../../lib/supabase";
// import { useRouter } from "next/navigation";
// import { buyAd, boostAd } from "../../lib/adService";

// export default function Explore() {
//   const router = useRouter();
//   const [ads, setAds] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [bookmarks, setBookmarks] = useState([]);

//   useEffect(() => {
//     fetchAds();

//     const saved = JSON.parse(localStorage.getItem("bookmarks") || "[]");
//     setBookmarks(saved);
//   }, []);

//   const fetchAds = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from("ads")
//       .select("*")
//       .eq("status", "published")
//       .order("is_featured", { ascending: false })
//       .order("package_weight", { ascending: false });

//     if (error) {
//       console.log("ERROR:", error.message);
//       setAds([]);
//       setLoading(false);
//       return;
//     }

//     const validAds = (data || []).filter((ad) => {
//       if (!ad.expire_at) return true;
//       return new Date(ad.expire_at) > new Date();
//     });

//     setAds(validAds);
//     setLoading(false);
//   };

//   const getPackageType = (type) => {
//     if (type === "premium") return "PREMIUM (30 DAYS)";
//     if (type === "standard") return "STANDARD (15 DAYS)";
//     return "BASIC (7 DAYS)";
//   };

//   const toggleBookmark = (adId) => {
//     let updated = [];

//     if (bookmarks.includes(adId)) {
//       updated = bookmarks.filter((id) => id !== adId);
//     } else {
//       updated = [...bookmarks, adId];
//     }

//     setBookmarks(updated);
//     localStorage.setItem("bookmarks", JSON.stringify(updated));
//   };

//   const sortedAds = [...ads].sort((a, b) => {
//     const aSaved = bookmarks.includes(a.id) ? 1 : 0;
//     const bSaved = bookmarks.includes(b.id) ? 1 : 0;
//     return bSaved - aSaved;
//   });

//   const filteredAds = sortedAds.filter((ad) =>
//     ad.title.toLowerCase().includes(search.toLowerCase())
//   );

//   const handleBuy = async (adId) => {
//     const { data: { user } } = await supabase.auth.getUser();

//     if (!user) return alert("Login required");

//     const ad = ads.find((a) => a.id === adId);

//     const price =
//       ad.price ??
//       (ad.type === "basic"
//         ? 100
//         : ad.type === "standard"
//         ? 200
//         : 400);

//     const res = await buyAd(user.id, adId, price);

//     if (res.success) {
//       alert("Ad Purchased Successfully 🛒");
//       fetchAds();
//     } else {
//       alert(res.message);
//     }
//   };

//   const handleBoost = async (adId) => {
//     const { data: { user } } = await supabase.auth.getUser();

//     if (!user) return alert("Login required");

//     const res = await boostAd(user.id, adId, 100);

//     if (res.success) {
//       alert("Ad Boosted Successfully ⚡");
//       fetchAds();
//     } else {
//       alert(res.message);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#050816] text-white p-6 relative overflow-hidden">
//       <div className="absolute w-[500px] h-[500px] bg-purple-600 blur-[160px] opacity-20 top-[-120px] left-[-120px]"></div>
//       <div className="absolute w-[500px] h-[500px] bg-blue-600 blur-[160px] opacity-20 bottom-[-120px] right-[-120px]"></div>

//       <div className="flex justify-between items-center mb-6 relative z-10">
//         <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-transparent bg-clip-text">
//           Explore Ads 🔥
//         </h1>

//         <button
//           onClick={() => router.push("/create-ad")}
//           className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition shadow-lg"
//         >
//           + Create Ad
//         </button>
//       </div>

//       <div className="relative z-10 mb-6">
//         <input
//           type="text"
//           placeholder="Search ads..."
//           className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {loading && <p className="text-white/70 animate-pulse">Loading ads...</p>}

//       {!loading && filteredAds.length === 0 && (
//         <p className="text-white/60">No ads available</p>
//       )}

//       <div className="grid md:grid-cols-3 gap-6 relative z-10">
//         {filteredAds.map((ad) => (
//           <div
//             key={ad.id}
//             className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-lg hover:scale-[1.03] transition shadow-lg"
//           >
//             <img
//               src={ad.media_url || "https://via.placeholder.com/300"}
//               className="w-full h-44 object-cover group-hover:scale-110 transition"
//             />

//             {/* ✅ PAYMENT IMAGE FIX */}
//             {ad.payment_screenshot && (
//               <img
//                 src={ad.payment_screenshot}
//                 className="w-full h-32 object-cover mt-2 rounded-lg"
//                 alt="Payment Screenshot"
//               />
//             )}

//             <div className="p-4">
//               <h2 className="text-lg font-bold">{ad.title}</h2>
//               <p className="text-white/60 text-sm mt-1">{ad.description}</p>

//               <div className="flex gap-2 mt-3">
//                 <button
//                   onClick={() => handleBoost(ad.id)}
//                   className="px-3 py-1 text-sm bg-purple-600/40 hover:bg-purple-600 rounded-lg transition"
//                 >
//                   ⚡ Boost
//                 </button>

//                 <button
//                   onClick={() => handleBuy(ad.id)}
//                   className="px-3 py-1 text-sm bg-green-600/40 hover:bg-green-600 rounded-lg transition"
//                 >
//                   🛒 Buy
//                 </button>
//               </div>

//               <div className="flex justify-end mt-3">
//                 <button
//                   onClick={() => toggleBookmark(ad.id)}
//                   className="text-xl"
//                 >
//                   {bookmarks.includes(ad.id) ? "🔖" : "📑"}
//                 </button>
//               </div>
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
import { buyAd, boostAd } from "../../lib/adService";

export default function Explore() {
  const router = useRouter();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bookmarks, setBookmarks] = useState([]);

  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchAds();
    fetchMeta();

    const saved = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setBookmarks(saved);
  }, []);

  // ✅ load cities + categories
  const fetchMeta = async () => {
    const { data: cityData } = await supabase.from("cities").select("*");
    const { data: catData } = await supabase.from("categories").select("*");

    setCities(cityData || []);
    setCategories(catData || []);
  };

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

  // 🔥 helper functions (ID → name)
  const getCityName = (id) => {
    return cities.find((c) => c.id === id)?.name || "";
  };

  const getCategoryName = (id) => {
    return categories.find((c) => c.id === id)?.name || "";
  };

  const toggleBookmark = (adId) => {
    let updated = bookmarks.includes(adId)
      ? bookmarks.filter((id) => id !== adId)
      : [...bookmarks, adId];

    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  const sortedAds = [...ads].sort((a, b) => {
    return (
      (bookmarks.includes(b.id) ? 1 : 0) -
      (bookmarks.includes(a.id) ? 1 : 0)
    );
  });

  // 🔥 SEARCH FIX (title + transaction + category + city)
  const filteredAds = sortedAds.filter((ad) => {
    const q = search.toLowerCase();

    return (
      (ad.title || "").toLowerCase().includes(q) ||
      (ad.transaction_id || "").toLowerCase().includes(q) ||
      getCategoryName(ad.category_id).toLowerCase().includes(q) ||
      getCityName(ad.city_id).toLowerCase().includes(q)
    );
  });

  const handleBuy = async (adId) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return alert("Login required");

    const ad = ads.find((a) => a.id === adId);

    const price =
      ad.price ??
      (ad.type === "basic" ? 100 : ad.type === "standard" ? 200 : 400);

    const res = await buyAd(user.id, adId, price);

    if (res.success) {
      alert("Ad Purchased Successfully 🛒");
      fetchAds();
    } else {
      alert(res.message);
    }
  };

  const handleBoost = async (adId) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return alert("Login required");

    const res = await boostAd(user.id, adId, 100);

    if (res.success) {
      alert("Ad Boosted Successfully ⚡");
      fetchAds();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6 relative overflow-hidden">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Explore Ads 🔥</h1>

        <button
          onClick={() => router.push("/create-ad")}
          className="px-4 py-2 bg-purple-600 rounded-lg"
        >
          + Create Ad
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search ads..."
        className="w-full p-3 mb-6 bg-white/10 rounded-lg"
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p>Loading...</p>}

      <div className="grid md:grid-cols-3 gap-4">
        {filteredAds.map((ad) => (
          <div key={ad.id} className="p-4 bg-white/10 rounded-xl">

            <img
              src={ad.media_url || "https://via.placeholder.com/300"}
              className="w-full h-40 object-cover rounded-lg"
            />

            {ad.payment_screenshot && (
              <img
                src={ad.payment_screenshot}
                className="w-full h-24 mt-2 rounded"
              />
            )}

            <h2 className="font-bold mt-2">{ad.title}</h2>

            {/* ✅ CATEGORY + CITY FIX */}
            <p className="text-sm text-gray-300">
              {getCategoryName(ad.category_id)} • {getCityName(ad.city_id)}
            </p>

            <p className="text-xs text-gray-400">
              TXN: {ad.transaction_id || "N/A"}
            </p>

            <p className="text-sm mt-2">{ad.description}</p>

            <div className="flex gap-2 mt-3">
              <button onClick={() => handleBoost(ad.id)} className="bg-purple-600 px-2 py-1 rounded">
                Boost
              </button>

              <button onClick={() => handleBuy(ad.id)} className="bg-green-600 px-2 py-1 rounded">
                Buy
              </button>
            </div>

            <button
              onClick={() => toggleBookmark(ad.id)}
              className="mt-2"
            >
              {bookmarks.includes(ad.id) ? "🔖 Saved" : "📑 Save"}
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}