"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { buyAd } from "../../lib/adService";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    getUser();

    const pkg = localStorage.getItem("selectedPackage");
    if (pkg) {
      setSelectedPackage(JSON.parse(pkg));
    }
  }, []);

  const getUser = async () => {
    setLoading(true);

    const { data } = await supabase.auth.getUser();

    if (!data?.user) {
      router.push("/login");
      return;
    }

    setUser(data.user);

    const { data: me, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (!error) {
      setRole((me?.role || "").toLowerCase());
    }

    await fetchAds(data.user.id);
    await fetchWallet(data.user.id);

    setLoading(false);
  };

  const fetchAds = async (userId) => {
    const { data } = await supabase
      .from("ads")
      .select("*")
      .eq("user_id", userId);

    setAds(data || []);
  };

  const fetchWallet = async (userId) => {
    let { data } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!data) {
      const { data: newWallet } = await supabase
        .from("wallets")
        .insert([{ user_id: userId, balance: 500 }])
        .select()
        .single();

      data = newWallet;
    }

    setWallet(data);
  };

  const submitAd = async (id) => {
    await supabase
      .from("ads")
      .update({ status: "submitted" })
      .eq("id", id);

    refresh();
  };

  const handleBuy = async (ad) => {
    const res = await buyAd(user.id, ad.id, 300);

    if (res.success) {
      alert("Ad Activated 🚀");
      refresh();
      fetchWallet(user.id);
    } else {
      alert(res.message);
    }
  };

  const deleteAd = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this ad?");
    if (!confirmDelete) return;

    await supabase.from("ads").delete().eq("id", id);

    refresh();
  };

  const refresh = () => {
    if (user) fetchAds(user.id);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white p-6">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Hello 👋</h1>

        <p className="text-white/60 mt-2 break-all">{user.email}</p>
        <p className="text-white/40 text-sm mt-1">Role: {role}</p>

        <div className="mt-3 p-3 bg-green-600/20 border border-green-500 rounded-xl w-fit">
          💰 Balance: <b>{wallet?.balance ?? 0}</b>
        </div>

        {selectedPackage && (
          <div className="mt-4 p-3 bg-white/10 rounded-xl border border-white/20">
            <h2 className="font-bold text-lg">Selected Package 🎯</h2>
            <p className="text-sm">Name: {selectedPackage.name}</p>
            <p className="text-sm">Price: {selectedPackage.price}</p>
            <p className="text-sm">Priority: {selectedPackage.priority}</p>
          </div>
        )}

        {/* NAVIGATION BUTTONS */}
        <div className="mt-4 flex gap-2 flex-wrap">

          <button
            onClick={() => router.push("/wallet")}
            className="px-3 py-1 bg-yellow-600 rounded"
          >
            Wallet
          </button>

          <button
            onClick={() => router.push("/my-purchases")}
            className="px-3 py-1 bg-pink-600 rounded"
          >
            My Purchases
          </button>

        </div>

        {/* ROLE BASED DASHBOARDS */}
        <div className="mt-3 flex gap-2 flex-wrap">

          <button
            onClick={() => router.push("/dashboard")}
            className="px-3 py-1 bg-blue-600 rounded"
          >
            Dashboard
          </button>

          {(role === "moderator" || role === "admin" || role === "super_admin") && (
            <button onClick={() => router.push("/moderator")} className="px-3 py-1 bg-green-600 rounded">
              Moderator Dashboard
            </button>
          )}

          {(role === "admin" || role === "super_admin") && (
            <button onClick={() => router.push("/admin")} className="px-3 py-1 bg-purple-600 rounded">
              Admin Dashboard
            </button>
          )}

          {role === "super_admin" && (
            <button onClick={() => router.push("/super-admin")} className="px-3 py-1 bg-red-600 rounded">
              Super Admin Dashboard
            </button>
          )}

        </div>

      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white/10 p-6 rounded-xl">
          <h2 className="font-bold">Create Ad</h2>
          <button onClick={() => router.push("/create-ad")} className="mt-2 bg-blue-600 px-3 py-1 rounded">
            Go
          </button>
        </div>

        <div className="bg-white/10 p-6 rounded-xl">
          <h2 className="font-bold">Explore Ads</h2>
          <button onClick={() => router.push("/explore")} className="mt-2 bg-green-600 px-3 py-1 rounded">
            Open
          </button>
        </div>

        {/* 
        <div className="bg-white/10 p-6 rounded-xl">
          <h2 className="font-bold">Packages</h2>
          <button onClick={() => router.push("/packages")} className="mt-2 bg-purple-600 px-3 py-1 rounded">
            View
          </button>
        </div>
        */}

        <div className="bg-white/10 p-6 rounded-xl">
          <h2 className="font-bold">Total Ads</h2>
          <div className="text-2xl">{ads.length}</div>
        </div>

      </div>

      {/* ADS */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Your Ads</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {ads.map((ad) => {
            const status = (ad.status || "").toLowerCase();

            return (
              <div key={ad.id} className="bg-white/10 p-4 rounded-xl">

                <h3 className="font-semibold">{ad.title}</h3>
                <p className="text-white/60 text-sm">{ad.description}</p>

                <p className="text-yellow-400 text-xs mt-2">
                  Status: {ad.status}
                </p>

                <div className="flex gap-2 mt-3 flex-wrap">

                  {(status === "draft" || status === "pending" || status === "payment_pending") && (
                    <button onClick={() => submitAd(ad.id)} className="bg-blue-600 px-3 py-1 rounded">
                      Submit
                    </button>
                  )}

                  <button
                    onClick={() => router.push(`/edit-ad/${ad.id}`)}
                    className="bg-yellow-500 px-3 py-1 rounded text-black"
                  >
                    Edit
                  </button>

                  <button onClick={() => deleteAd(ad.id)} className="bg-red-600 px-3 py-1 rounded">
                    Delete
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}