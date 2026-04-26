"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function MyAds() {
  const [user, setUser] = useState(null);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchMyAds();
    }
  }, [user]);

  const fetchMyAds = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("ads")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error.message);
      setAds([]);
      setLoading(false);
      return;
    }

    setAds(data);
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="text-white p-6">
        Loading user...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-white p-6">
        Loading ads...
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <div className="text-white p-6">
        No ads found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        My Ads 📢
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {ads.map((ad) => (
          <div
            key={ad.id}
            className="bg-white/5 border border-white/10 rounded-2xl p-4"
          >
            <img
              src={ad.media_url || "https://via.placeholder.com/300"}
              className="w-full h-40 object-cover rounded-xl"
            />

            <h2 className="text-lg font-bold mt-2">
              {ad.title}
            </h2>

            <p className="text-white/60 text-sm">
              {ad.description}
            </p>

            <div className="mt-2 text-sm">
              Status:{" "}
              <span className="text-yellow-400">
                {ad.status}
              </span>
            </div>

            <div className="text-sm">
              Promoted:{" "}
              <span className="text-green-400">
                {ad.is_promoted ? "Yes" : "No"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}