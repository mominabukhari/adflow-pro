"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
      }
    };

    getUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-800">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">

        <h1 className="text-2xl font-bold mb-4 text-gray-900">
          Welcome 🎉
        </h1>

        <p className="text-gray-700 mb-6">
          {user.email}
        </p>

        <div className="flex flex-col gap-3 mb-6">

          <a href="/create-ad">
            <button className="w-full bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
              Create Ad
            </button>
          </a>

          <a href="/explore">
            <button className="w-full bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700">
              Explore Ads
            </button>
          </a>

        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>

      </div>
    </div>
  );
}