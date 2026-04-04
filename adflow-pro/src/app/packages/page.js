// export default function Page() {
//   return (
//     <div>
//       <h1>Packages Page</h1>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function PackagesPage() {
  const router = useRouter();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("packages")
      .select("*");

    if (error) {
      console.log("Packages error:", error);
    }

    setPackages(data || []);
    setLoading(false);
  };

  const selectPackage = (pkg) => {
    localStorage.setItem("selectedPackage", JSON.stringify(pkg));
    alert("Package Selected!");
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-950">
        Loading Packages...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white p-6">

      <h1 className="text-3xl font-bold mb-6">
        AdFlow Pro Packages 🚀
      </h1>

      {packages.length === 0 ? (
        <p className="text-white/60">
          No packages found in database.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white/10 p-5 rounded-xl">

              <h2 className="text-xl font-bold">{pkg.name}</h2>

              <p className="text-white/70 mt-2">
                Price: {pkg.price}
              </p>

              <p className="text-white/70">
                Priority: {pkg.priority}
              </p>

              <p className="text-white/70">
                Duration: {pkg.duration_days} days
              </p>

              <button
                onClick={() => selectPackage(pkg)}
                className="mt-4 bg-purple-600 px-3 py-1 rounded"
              >
                Select Package
              </button>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}