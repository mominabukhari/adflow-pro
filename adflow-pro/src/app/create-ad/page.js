"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function CreateAd() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState("");

  useEffect(() => {
    checkUser();
    fetchPackages();
  }, []);

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data?.user) router.push("/login");
  };

  const fetchPackages = async () => {
    const { data } = await supabase.from("packages").select("*");
    setPackages(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !selectedPackage) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase.from("ads").insert([
      {
        user_id: userData.user.id,
        title,
        description,
        package_id: selectedPackage,
        status: "submitted",
      },
    ]);

    setLoading(false);

    if (error) alert(error.message);
    else {
      alert("Ad submitted 🚀");
      router.push("/explore");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 p-4">

      <form className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-200"
        onSubmit={handleSubmit}
      >

        {/* TITLE FIX (VISIBLE NOW) */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Create Ad
        </h1>

        {/* INPUTS */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Ad Title"
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-blue-500"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter Ad Description"
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg text-gray-900 h-32 focus:outline-blue-500"
        />

        {/* PACKAGE */}
        <select
          value={selectedPackage}
          onChange={(e) => setSelectedPackage(e.target.value)}
          className="w-full mb-5 p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-blue-500"
        >
          <option value="">Select Package</option>

          {packages.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.name} - Rs {pkg.price}
            </option>
          ))}
        </select>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          {loading ? "Submitting..." : "Submit Ad"}
        </button>

      </form>
    </div>
  );
}