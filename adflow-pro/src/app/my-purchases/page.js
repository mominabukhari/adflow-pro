"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function MyPurchase() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setPurchases([]);
        setLoading(false);
        return;
      }

      // ✅ FIX: remove broken relation, use manual safe fetch
      const { data: transactions, error } = await supabase
        .from("transactions")
        .select("id, amount, created_at, ad_id, type")
        .eq("user_id", user.id)
        .in("type", ["ad_purchase", "ad_buy", "boost"])
        .order("created_at", { ascending: false });

      if (error || !transactions) {
        console.log(error);
        setPurchases([]);
        setLoading(false);
        return;
      }

      // ✅ FIX: manually attach ads (100% reliable)
      const enriched = await Promise.all(
        transactions.map(async (t) => {
          const { data: ad } = await supabase
            .from("ads")
            .select("id, title, media_url, price")
            .eq("id", t.ad_id)
            .single();

          return {
            ...t,
            ads: ad || null,
          };
        })
      );

      setPurchases(enriched);

    } catch (err) {
      console.log(err);
      setPurchases([]);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">
      <h1 className="text-3xl font-bold mb-6">My Purchases 🛒</h1>

      {purchases.length === 0 ? (
        <p className="text-white/60">No purchases yet</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {purchases.map((p) => (
            <div key={p.id} className="bg-white/10 p-4 rounded-xl">

              {/* 🔥 TYPE BADGE */}
              <div className="text-xs mb-2">
                {p.type === "boost" ? (
                  <span className="text-purple-400">⚡ Boost</span>
                ) : (
                  <span className="text-green-400">🛒 Purchase</span>
                )}
              </div>

              <h2 className="font-bold">
                {p.ads?.title || "Ad not found"}
              </h2>

              {p.ads?.media_url && (
                <img
                  src={p.ads.media_url}
                  className="w-full h-32 object-cover mt-2 rounded"
                />
              )}

              <p className="text-green-400 mt-2">
                Amount: {p.amount}
              </p>

              <p className="text-blue-400 text-sm">
                Price: {p.ads?.price || "N/A"}
              </p>

              <p className="text-white/50 text-sm">
                Date: {p.created_at
                  ? new Date(p.created_at).toLocaleString()
                  : "N/A"}
              </p>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}