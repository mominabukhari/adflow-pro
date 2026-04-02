// "use client";

// import { useState, useEffect } from "react";
// import { supabase } from "../../lib/supabase";
// import { useRouter } from "next/navigation";

// export default function CreateAd() {
//   const router = useRouter();

//   const [user, setUser] = useState(null);

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     media_url: "",
//     type: "basic",
//   });

//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     getUser();
//   }, []);

//   const getUser = async () => {
//     const { data } = await supabase.auth.getUser();

//     if (!data?.user) {
//       alert("⚠️ You are not logged in!");
//       router.push("/login");
//       return;
//     }

//     setUser(data.user);
//   };

//   const packages = [
//     { name: "basic", label: "Basic", days: 7, weight: 1, color: "border-gray-500/40" },
//     { name: "standard", label: "Standard", days: 15, weight: 2, color: "border-blue-500/50" },
//     { name: "premium", label: "Premium", days: 30, weight: 3, color: "border-purple-500/60" },
//   ];

//   const createAd = async (e) => {
//     e.preventDefault();

//     if (!user) {
//       alert("User not loaded");
//       return;
//     }

//     setLoading(true);

//     const selectedPackage = packages.find(p => p.name === form.type);

//     const { error } = await supabase.from("ads").insert([
//       {
//         user_id: user.id,
//         title: form.title,
//         description: form.description,
//         media_url: form.media_url,
//         type: form.type,
//         package_weight: selectedPackage.weight,
//         status: "draft",
//       },
//     ]);

//     setLoading(false);

//     if (error) {
//       alert(error.message);
//       return;
//     }

//     alert("Ad created! Now proceed to payment.");
//     router.push("/explore");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 p-6">

//       {/* glow background (premium SaaS feel) */}
//       <div className="absolute w-80 h-80 bg-purple-600 rounded-full blur-3xl opacity-20 top-10 left-10 animate-pulse"></div>
//       <div className="absolute w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-20 bottom-10 right-10 animate-pulse"></div>

//       {/* FORM CARD */}
//       <form

//         onSubmit={createAd}
//         className="relative w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl p-8"
//       >

//         {/* TITLE */}
//         <h1 className="text-3xl font-extrabold text-center text-white mb-2">
//           Create Ad 🚀
//         </h1>

//         <p className="text-center text-white/60 text-sm mb-6">
//           Fill details to publish your advertisement
//         </p>

//         {/* INPUTS */}
//         <input
//           type="text"
//           placeholder="Ad Title"
//           required
//           className="w-full p-3 mb-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-400 transition"
//           onChange={(e) =>
//             setForm({ ...form, title: e.target.value })
//           }
//         />

//         <textarea
//           placeholder="Description"
//           required
//           className="w-full p-3 mb-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-400 transition"
//           onChange={(e) =>
//             setForm({ ...form, description: e.target.value })
//           }
//         />

//         <input
//           type="text"
//           placeholder="Image / YouTube URL"
//           required
//           className="w-full p-3 mb-5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-400 transition"
//           onChange={(e) =>
//             setForm({ ...form, media_url: e.target.value })
//           }
//         />

//         {/* PACKAGE SECTION */}
//         <h3 className="mb-3 font-semibold text-white/80">
//           Select Package
//         </h3>

//         {packages.map((pkg) => (
//           <label
//             key={pkg.name}
//             className={`block p-3 mb-3 rounded-xl cursor-pointer border ${pkg.color} bg-white/5 hover:bg-white/10 transition`}
//           >
//             <input
//               type="radio"
//               name="package"
//               value={pkg.name}
//               checked={form.type === pkg.name}
//               onChange={(e) =>
//                 setForm({ ...form, type: e.target.value })
//               }
//             />

//             <span className="ml-2 font-semibold text-white">
//               {pkg.label}
//             </span>

//             <span className="ml-2 text-sm text-white/60">
//               ({pkg.days} days)
//             </span>
//           </label>
//         ))}

//         {/* BUTTON */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full py-3 rounded-xl font-semibold text-white
//           bg-gradient-to-r from-purple-600 to-indigo-600
//           hover:shadow-lg hover:shadow-purple-500/30
//           hover:-translate-y-1 transition-all duration-300"
//         >
//           {loading ? "Creating..." : "Create Ad ✨"}
//         </button>

//       </form>
//     </div>
//   );
// }

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
    transaction_id: "",              // ✅ added
    payment_screenshot: "",          // ✅ added
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUser();
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

  const packages = [
    { name: "basic", label: "Basic", days: 7, weight: 1, color: "border-gray-500/40" },
    { name: "standard", label: "Standard", days: 15, weight: 2, color: "border-blue-500/50" },
    { name: "premium", label: "Premium", days: 30, weight: 3, color: "border-purple-500/60" },
  ];

  const createAd = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("User not loaded");
      return;
    }

    setLoading(true);

    const selectedPackage = packages.find(p => p.name === form.type);

    const { error } = await supabase.from("ads").insert([
      {
        user_id: user.id,
        title: form.title,
        description: form.description,
        media_url: form.media_url,
        type: form.type,
        package_weight: selectedPackage.weight,
        status: "draft",
        transaction_id: form.transaction_id,        // ✅ added
        payment_screenshot: form.payment_screenshot // ✅ added
      },
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Ad created! Now proceed to payment.");
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
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          required
          className="w-full p-3 mb-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-400 transition"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* <input
          type="text"
          placeholder="Image / YouTube URL"
          required
          className="w-full p-3 mb-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-400 transition"
          onChange={(e) =>
            setForm({ ...form, media_url: e.target.value })
          } */}
        {/* /> */}

        {/* ✅ NEW FIELDS (ONLY ADDITION) */}
        <input
          type="text"
          placeholder="Transaction ID"
          className="w-full p-3 mb-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-400 transition"
          onChange={(e) =>
            setForm({ ...form, transaction_id: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Payment Screenshot URL"
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