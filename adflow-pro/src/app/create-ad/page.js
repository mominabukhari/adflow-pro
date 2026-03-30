"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function CreateAd() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ STEP 1: PROTECT PAGE (login required)
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.push("/login");
    }
  };

  // ✅ STEP 2: CREATE AD WITH USER + STATUS
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    // 👇 current logged-in user
    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase.from("ads").insert([
      {
        user_id: userData.user.id,   // ✅ IMPORTANT (paper requirement)
        title,
        description,
        status: "submitted",         // ✅ IMPORTANT (workflow start)
      },
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Ad submitted for review 🚀");
      router.push("/explore");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-4">

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl"
      >

        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Create Ad
        </h1>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Title"
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter Description"
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg text-gray-900 h-32 focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Submitting..." : "Submit Ad"}
        </button>

      </form>
    </div>
  );
}