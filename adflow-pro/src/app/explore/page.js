"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Explore() {
  const router = useRouter();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    fetchAds();

    const saved = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setBookmarks(saved);
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

  const toggleBookmark = (adId) => {
    let updated = [];

    if (bookmarks.includes(adId)) {
      updated = bookmarks.filter((id) => id !== adId);
    } else {
      updated = [...bookmarks, adId];
    }

    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  // 🔥 NEW: bookmarked ads first
  const sortedAds = [...ads].sort((a, b) => {
    const aSaved = bookmarks.includes(a.id) ? 1 : 0;
    const bSaved = bookmarks.includes(b.id) ? 1 : 0;

    return bSaved - aSaved;
  });

  const filteredAds = sortedAds.filter((ad) =>
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
          <div
            key={ad.id}
            className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-lg hover:scale-[1.03] transition shadow-lg"
          >
            <img
              src={ad.media_url || "https://via.placeholder.com/300"}
              className="w-full h-44 object-cover group-hover:scale-110 transition"
            />

            <div className="p-4">
              <h2 className="text-lg font-bold">{ad.title}</h2>
              <p className="text-white/60 text-sm mt-1">{ad.description}</p>

              {/* Bookmark moved to bottom */}
              <div className="flex justify-end mt-3">
                <button
                  onClick={() => toggleBookmark(ad.id)}
                  className="text-xl"
                >
                  {bookmarks.includes(ad.id) ? "🔖" : "📑"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}