"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {
  const router = useRouter();

  const [userRole, setUserRole] = useState("");
  const [users, setUsers] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    checkRole();
  }, []);

  const checkRole = async () => {
    const { data: auth } = await supabase.auth.getUser();

    if (!auth?.user) {
      router.push("/login");
      return;
    }

    const { data: me } = await supabase
      .from("users")
      .select("role")
      .eq("id", auth.user.id)
      .maybeSingle();

    if (!me) {
      router.push("/");
      return;
    }

    if (me.role !== "admin" && me.role !== "super_admin") {
      router.push("/");
      return;
    }

    setUserRole(me.role);
    fetchData();
  };

  const fetchData = async () => {
    const { data: usersData } = await supabase.from("users").select("*");
    const { data: adsData } = await supabase.from("ads").select("*");

    setUsers(usersData || []);
    setAds(adsData || []);
    setLoading(false);
  };

  const addAuditLog = async (adId, action) => {
    const { data: auth } = await supabase.auth.getUser();

    await supabase.from("audit_logs").insert({
      ad_id: adId,
      action,
      performed_by: auth?.user?.email || "unknown",
      timestamp: new Date().toISOString(),
    });
  };

  // ✅ FIXED: publish flow stable (Explore compatible)
  const verifyAndPublish = async (ad) => {
    try {
      setActionLoading(ad.id);

      if (!ad?.id) return;

      if (ad.status !== "payment_submitted") {
        alert("Ad is not ready for publishing");
        return;
      }

      const { data, error } = await supabase
        .from("ads")
        .update({
          status: "published", // ✅ FINAL STATUS (Explore reads this)
          payment_verified: true,
          published_at: new Date().toISOString(),
        })
        .eq("id", ad.id)
        .select();

      if (error) {
        alert("Update failed: " + error.message);
        return;
      }

      if (!data || data.length === 0) {
        alert("No row updated (check RLS or ID)");
        return;
      }

      await addAuditLog(ad.id, "PUBLISHED");

      setAds((prev) =>
        prev.map((item) =>
          item.id === ad.id
            ? {
                ...item,
                status: "published",
                payment_verified: true,
              }
            : item
        )
      );

      alert("Ad successfully published!");

    } catch (err) {
      alert("Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  const publishedAds = ads.filter(a => a.status === "published").length;
  const pendingAds = ads.filter(a => a.status === "payment_submitted").length;
  const scheduledAds = ads.filter(a => a.status === "scheduled").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading Admin Panel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white p-6">

      <div className="flex gap-3 mb-8 flex-wrap">

        <button onClick={() => router.push("/dashboard")} className="px-3 py-1 bg-white/10 rounded">
          Dashboard
        </button>

        <button className="px-3 py-1 bg-blue-600 rounded">
          Admin Panel
        </button>

        <button onClick={() => router.push("/moderator")} className="px-3 py-1 bg-purple-600 rounded">
          Moderator
        </button>

        {userRole === "super_admin" && (
          <button onClick={() => router.push("/super-admin")} className="px-3 py-1 bg-red-600 rounded">
            Super Admin
          </button>
        )}
      </div>

      <h1 className="text-3xl font-bold">Admin Dashboard 🛠️</h1>

      <p className="text-white/60 mt-2">
        Users: {users.length} | Ads: {ads.length} | Published: {publishedAds} | Pending: {pendingAds} | Scheduled: {scheduledAds}
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Users</h2>

      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {users.length === 0 ? (
          <p className="text-white/50">No users found</p>
        ) : (
          users.map(u => (
            <div key={u.id} className="bg-white/10 p-4 rounded-xl">
              <p>{u.email}</p>
              <p className="text-white/60 text-sm">{u.role}</p>
            </div>
          ))
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Payment Pending Ads 💰</h2>

      <div className="grid md:grid-cols-2 gap-6">

        {ads.filter(ad => ad.status === "payment_submitted").length === 0 ? (
          <p className="text-white/50">No pending ads</p>
        ) : (
          ads
            .filter(ad => ad.status === "payment_submitted")
            .map(ad => (
              <div key={ad.id} className="bg-white/10 p-5 rounded-2xl">

                <h3 className="text-xl font-semibold">{ad.title}</h3>

                <p className="text-white/60 text-sm mt-1">
                  {ad.description}
                </p>

                <span className="inline-block mt-3 text-xs px-3 py-1 bg-yellow-500/20 rounded">
                  {ad.status}
                </span>

                <button
                  disabled={actionLoading === ad.id}
                  onClick={() => verifyAndPublish(ad)}
                  className="mt-4 w-full bg-emerald-600 py-2 rounded disabled:opacity-50"
                >
                  {actionLoading === ad.id ? "Processing..." : "Verify & Publish"}
                </button>

              </div>
            ))
        )}

      </div>
    </div>
  );
}