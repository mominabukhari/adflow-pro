"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function CreateAd() {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    media_url: "",
    type: "basic",
    transaction_id: "",
    payment_screenshot: "",
    city_id: "",
    category_id: "",
  });

  const [loading, setLoading] = useState(false);

  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getUser();
    fetchCities();
    fetchCategories();
  }, []);

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data?.user) {
      alert("⚠️ You are not logged in!");
      router.push("/login");
      return;
    }

    setUser(data.user);
  };

  const fetchCities = async () => {
    const { data, error } = await supabase.from("cities").select("*");

    if (!error) {
      setCities(data || []);
    }
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");

    if (!error) {
      setCategories(data || []);
    }
  };

  const packages = [
    { name: "basic", label: "Basic", days: 7, weight: 1, color: "border-gray-500/40" },
    { name: "standard", label: "Standard", days: 15, weight: 2, color: "border-blue-500/50" },
    { name: "premium", label: "Premium", days: 30, weight: 3, color: "border-purple-500/60" },
  ];

  const priceMap = {
    basic: 100,
    standard: 200,
    premium: 400,
  };

  const createAd = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("User not loaded");
      return;
    }

    setLoading(true);

    const selectedPackage = packages.find(p => p.name === form.type);

    const { data: adData, error: adError } = await supabase
      .from("ads")
      .insert([
        {
          user_id: user.id,
          title: form.title,
          description: form.description,
          media_url: form.media_url,
          type: form.type,
          package_weight: selectedPackage.weight,
          status: "draft",
          price: priceMap[form.type],
          city_id: form.city_id,
          category_id: form.category_id,
          slug: form.title
            ? form.title.toLowerCase().trim().replace(/\s+/g, "-")
            : "ad-" + Date.now(),
          is_featured: false,
          moderator_note: null,
          publish_at: null,
        },
      ])
      .select();

    if (adError) {
      setLoading(false);
      alert(adError.message);
      return;
    }

    const adId = adData[0].id;

    if (form.media_url) {
      await supabase.from("ad_media").insert({
        ad_id: adId,
        media_url: form.media_url,
      });
    }

    await supabase.from("payments").insert({
      ad_id: adId,
      transaction_ref: form.transaction_id,
      payment_screenshot: form.payment_screenshot,
    });

    await supabase.from("ads_status_history").insert({
      ad_id: adId,
      previous_status: null,
      new_status: "draft",
      note: "Ad created",
      created_at: new Date().toISOString(),
    });

    setLoading(false);

    alert("Ad created successfully!");
    router.push("/explore");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 p-6">

      <div className="absolute w-80 h-80 bg-purple-600 rounded-full blur-3xl opacity-20 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-20 bottom-10 right-10 animate-pulse"></div>

      <form
        onSubmit={createAd}
        className="relative w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl p-8"
      >
        <h1 className="text-3xl font-extrabold text-center text-white mb-2">
          Create Ad 🚀
        </h1>

        <p className="text-center text-white/60 text-sm mb-6">
          Fill details to publish your advertisement
        </p>

        <input
          type="text"
          placeholder="Ad Title"
          required
          className="w-full p-3 mb-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-400 transition"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          required
          className="w-full p-3 mb-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-400 transition"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* CATEGORY */}
        <select
          className="w-full p-3 mb-4 rounded-xl bg-black/40 border border-white/10 text-white outline-none"
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
        >
          <option value="" className="text-black">Select Category</option>
          {(categories || []).map(cat => (
            <option key={cat.id} value={cat.id} className="text-black">
              {cat.name}
            </option>
          ))}
        </select>

        {/* CITY */}
        <select
          className="w-full p-3 mb-4 rounded-xl bg-black/40 border border-white/10 text-white outline-none"
          onChange={(e) => setForm({ ...form, city_id: e.target.value })}
        >
          <option value="" className="text-black">Select City</option>
          {(cities || []).map(city => (
            <option key={city.id} value={city.id} className="text-black">
              {city.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Transaction ID"
          className="w-full p-3 mb-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-400 transition"
          onChange={(e) =>
            setForm({ ...form, transaction_id: e.target.value })
          }
        />

        {/* ONLY CHANGE HERE */}
        <input
          type="url"
          placeholder="Payment Screenshot Image URL"
          className="w-full p-3 mb-5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-400 transition"
          onChange={(e) =>
            setForm({ ...form, payment_screenshot: e.target.value })
          }
        />

        <h3 className="mb-3 font-semibold text-white/80">
          Select Package
        </h3>

        {packages.map((pkg) => (
          <label
            key={pkg.name}
            className={`block p-3 mb-3 rounded-xl cursor-pointer border ${pkg.color} bg-white/5 hover:bg-white/10 transition`}
          >
            <input
              type="radio"
              name="package"
              value={pkg.name}
              checked={form.type === pkg.name}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
            />

            <span className="ml-2 font-semibold text-white">
              {pkg.label}
            </span>

            <span className="ml-2 text-sm text-green-300">
              (PKR {priceMap[pkg.name]})
            </span>

            <span className="ml-2 text-sm text-white/60">
              ({pkg.days} days)
            </span>
          </label>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-white
          bg-gradient-to-r from-purple-600 to-indigo-600
          hover:shadow-lg hover:shadow-purple-500/30
          hover:-translate-y-1 transition-all duration-300"
        >
          {loading ? "Creating..." : "Create Ad ✨"}
        </button>
      </form>
    </div>
  );
}
