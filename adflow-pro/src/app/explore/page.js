"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Explore() {
  const router = useRouter();

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data?.user) {
      router.push("/login");
      return;
    }

    fetchAds();
  };

  // 🔥 DEBUG + SAFE FETCH (MOST IMPORTANT)
  const fetchAds = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("ads")
      .select("*");

    // 👇 DEBUG LOGS (CHECK IN CONSOLE)
    console.log("ADS DATA:", data);
    console.log("ADS ERROR:", error);

    if (error) {
      alert(error.message);
      setAds([]);
      setLoading(false);
      return;
    }

    setAds(data || []);
    setLoading(false);
  };

  // 💰 PAYMENT
  const submitPayment = async (adId) => {
    const { error } = await supabase.from("payments").insert([
      {
        ad_id: adId,
        transaction_ref: "TXN" + Date.now(),
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Payment submitted 💰");
    }
  };

  // 🗑 DELETE
  const deleteAd = async (adId) => {
    const { error } = await supabase
      .from("ads")
      .delete()
      .eq("id", adId);

    if (error) {
      alert(error.message);
    } else {
      fetchAds();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Explore Ads
        </h1>

        <button
          onClick={() => router.push("/create-ad")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Create Ad
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-center text-gray-700">Loading...</p>
      ) : ads.length === 0 ? (
        <p className="text-center text-gray-700">
          No ads found
        </p>
      ) : (
        ads.map((ad) => (
          <div
            key={ad.id}
            className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 shadow-md hover:shadow-lg transition"
          >

            {/* TITLE */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {ad.title}
              </h2>

              {ad.status === "premium" && (
                <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full">
                  ⭐ Featured
                </span>
              )}
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-700 mt-2">
              {ad.description}
            </p>

            {/* STATUS */}
            <p className="text-sm text-gray-500 mt-2">
              Status:{" "}
              <span className="font-semibold">
                {ad.status}
              </span>
            </p>

            {/* PACKAGE (SAFE) */}
            <p className="text-sm text-blue-600 mt-1">
              Package: {ad.package_id || "Basic"}
            </p>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-4">

              <button
                onClick={() => submitPayment(ad.id)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
              >
                Pay
              </button>

              <button
                onClick={() => deleteAd(ad.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>

            </div>

          </div>
        ))
      )}
    </div>
  );
}