"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function EditAd() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert(error.message);
      } else {
        setTitle(data.title);
        setDescription(data.description);
      }

      setLoading(false);
    };

    if (id) fetchAd();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("ads")
      .update({
        title,
        description,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
    } else {
      alert("Ad updated successfully 🎉");
      router.push("/explore");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <form
        onSubmit={handleUpdate}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg"
      >

        {/* TITLE TEXT */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Edit Ad
        </h1>

        {/* TITLE INPUT */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Title"
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* DESCRIPTION INPUT */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter Description"
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 h-32"
        />

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Update Ad
        </button>

      </form>
    </div>
  );
}