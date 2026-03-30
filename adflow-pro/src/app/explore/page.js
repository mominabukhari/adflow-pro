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

    if (!data.user) {
      router.push("/login");
    } else {
      fetchAds(data.user.id);
    }
  };

  // ✅ Fetch ONLY current user's ads
  const fetchAds = async (userId) => {
    const { data, error } = await supabase
      .from("ads")
      .select("*")
      .eq("user_id", userId);

    if (!error) {
      setAds(data);
    }

    setLoading(false);
  };

  // ✅ Submit Payment
  const submitPayment = async (adId) => {
    const { error } = await supabase.from("payments").insert([
      {
        ad_id: adId,
        transaction_ref: "TXN" + Math.floor(Math.random() * 10000),
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Payment submitted 💰");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          My Ads
        </h1>

        <button
          onClick={() => router.push("/create-ad")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create Ad
        </button>
      </div>

      {/* LOADING */}
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : ads.length === 0 ? (
        <p className="text-center text-gray-600">No ads found</p>
      ) : (
        ads.map((ad) => (
          <div
            key={ad.id}
            className="bg-white p-5 rounded-xl shadow mb-4 border border-gray-200"
          >
            {/* TITLE */}
            <h2 className="text-xl font-bold text-gray-900">
              {ad.title}
            </h2>

            {/* DESCRIPTION */}
            <p className="text-gray-700 mt-2">
              {ad.description}
            </p>

            {/* STATUS */}
            <p className="text-sm text-gray-500 mt-2">
              Status: <span className="font-semibold">{ad.status}</span>
            </p>

            {/* BUTTONS */}
            <div className="mt-4 flex gap-3">

              {/* PAYMENT BUTTON */}
              <button
                onClick={() => submitPayment(ad.id)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
              >
                Submit Payment
              </button>

              {/* OPTIONAL DELETE */}
              <button
                onClick={async () => {
                  await supabase.from("ads").delete().eq("id", ad.id);
                  fetchAds();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
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