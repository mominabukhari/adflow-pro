"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Moderator() {
  const [ads, setAds] = useState([]);
  const router = useRouter();

  useEffect(() => {
    checkUser();
    fetchAds();
  }, []);

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.push("/login");
    }
  };

  const fetchAds = async () => {
    const { data, error } = await supabase
      .from("ads")
      .select("*")
      .eq("status", "submitted");

    if (!error) {
      setAds(data);
    }
  };

  const approveAd = async (id) => {
    await supabase
      .from("ads")
      .update({ status: "under_review" })
      .eq("id", id);

    fetchAds();
  };

  const rejectAd = async (id) => {
    await supabase
      .from("ads")
      .update({ status: "rejected" })
      .eq("id", id);

    fetchAds();
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
        Moderator Panel
      </h1>

      {ads.length === 0 ? (
        <p className="text-center text-gray-700 text-lg">
          No ads to review
        </p>
      ) : (
        ads.map((ad) => (
          <div
            key={ad.id}
            className="bg-white p-6 rounded-2xl shadow-lg mb-5 border border-gray-200"
          >
            {/* TITLE */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {ad.title}
            </h2>

            {/* DESCRIPTION */}
            <p className="text-gray-800 mb-4">
              {ad.description}
            </p>

            {/* STATUS */}
            <p className="text-sm text-gray-600 mb-4">
              Status: <span className="font-semibold">{ad.status}</span>
            </p>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={() => approveAd(ad.id)}
                className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Approve
              </button>

              <button
                onClick={() => rejectAd(ad.id)}
                className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}

    </div>
  );
}