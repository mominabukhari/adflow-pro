"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function EditAd() {
  const router = useRouter();

  const params = useParams();
  const id = params?.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert(error.message);
      } else {
        setTitle(data?.title || "");
        setDescription(data?.description || "");
      }

      setLoading(false);
    };

    fetchAd();
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white">
        <div className="animate-pulse text-lg font-semibold">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 p-6 relative overflow-hidden">

      {/* background glow */}
      <div className="absolute w-72 h-72 bg-purple-600 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>

      <form
        onSubmit={handleUpdate}
        className="w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl relative z-10"
      >

        {/* TITLE */}
        <h1 className="text-3xl font-extrabold text-white text-center mb-2">
          Edit Ad ✏️
        </h1>

        <p className="text-center text-white/60 text-sm mb-6">
          Update your advertisement details
        </p>

        {/* TITLE INPUT */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Title"
          className="w-full mb-4 p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* DESCRIPTION INPUT */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter Description"
          className="w-full mb-4 p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
        />

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 transition transform duration-300"
        >
          Update Ad 🚀
        </button>

        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full mt-3 py-2 text-white/70 hover:text-white text-sm"
        >
          ← Go Back
        </button>

      </form>
    </div>
  );
}