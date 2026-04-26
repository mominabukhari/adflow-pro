// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "../../lib/supabase";

// export default function Wallet() {
//   const [user, setUser] = useState(null);
//   const [wallet, setWallet] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [amount, setAmount] = useState("");
//   const [ads, setAds] = useState([]);

//   useEffect(() => {
//     getUser();
//   }, []);

//   const getUser = async () => {
//     setLoading(true);

//     const { data } = await supabase.auth.getUser();

//     if (!data?.user) {
//       setLoading(false);
//       return;
//     }

//     setUser(data.user);

//     await fetchWallet(data.user.id);
//     await fetchAds();

//     setLoading(false);
//   };

//   const fetchWallet = async (userId) => {
//     let { data } = await supabase
//       .from("wallets")
//       .select("*")
//       .eq("user_id", userId)
//       .maybeSingle();

//     if (!data) {
//       const { data: newWallet } = await supabase
//         .from("wallets")
//         .insert([{ user_id: userId, balance: 500 }])
//         .select()
//         .maybeSingle();

//       data = newWallet;
//     }

//     setWallet(data);
//   };

//   // 🔥 SHOW ADS WITH PRICE (EXTRA FEATURE YOU WANTED)
//   const fetchAds = async () => {
//     const { data } = await supabase
//       .from("ads")
//       .select("*")
//       .eq("status", "published");

//     setAds(data || []);
//   };

//   const addBalance = async () => {
//     if (!amount || isNaN(amount)) {
//       alert("Enter valid amount");
//       return;
//     }

//     const newBalance = (wallet?.balance || 0) + Number(amount);

//     const { error } = await supabase
//       .from("wallets")
//       .update({ balance: newBalance })
//       .eq("user_id", user.id);

//     if (error) {
//       alert(error.message);
//       return;
//     }

//     setAmount("");
//     fetchWallet(user.id);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
//         Loading wallet...
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
//         Please login to view wallet
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#050816] text-white p-6">

//       {/* HEADER */}
//       <h1 className="text-3xl font-bold mb-2">💰 My Wallet</h1>
//       <p className="text-white/60 mb-6">{user.email}</p>

//       {/* BALANCE */}
//       <div className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-6 backdrop-blur-md">
//         <p className="text-sm text-white/60">Current Balance</p>
//         <h2 className="text-4xl font-bold text-green-400">
//           Rs {wallet?.balance || 0}
//         </h2>
//       </div>

//       {/* ADD MONEY */}
//       <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
//         <h3 className="text-lg font-semibold mb-3">Add Money</h3>

//         <input
//           type="number"
//           placeholder="Enter amount"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           className="w-full p-3 rounded-lg bg-black/40 border border-white/20 mb-3"
//         />

//         <button
//           onClick={addBalance}
//           className="bg-green-600 px-4 py-2 rounded-lg hover:scale-105 transition"
//         >
//           + Add Balance
//         </button>
//       </div>

//       {/* 🛒 ADS PRICES SECTION (NEW FEATURE) */}
//       <h2 className="text-xl font-bold mb-4">🔥 Available Ads & Prices</h2>

//       <div className="grid md:grid-cols-3 gap-4">
//         {ads.map((ad) => (
//           <div
//             key={ad.id}
//             className="bg-white/5 border border-white/10 rounded-xl p-4"
//           >
//             <h3 className="font-semibold">{ad.title}</h3>

//             <p className="text-white/60 text-sm mt-1">
//               {ad.description}
//             </p>

//             {/* 💰 PRICE DISPLAY */}
//             <p className="text-yellow-400 mt-2 font-bold">
//               💰 Price: {ad.price || 200} PKR
//             </p>

//             <p className="text-xs text-white/40 mt-1">
//               Status: {ad.status}
//             </p>
//           </div>
//         ))}
//       </div>

//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Wallet() {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [ads, setAds] = useState([]);

  // ✅ NEW STATES
  const [method, setMethod] = useState("jazzcash");
  const [trxId, setTrxId] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    setLoading(true);

    const { data } = await supabase.auth.getUser();

    if (!data?.user) {
      setLoading(false);
      return;
    }

    setUser(data.user);

    await fetchWallet(data.user.id);
    await fetchAds();

    setLoading(false);
  };

  const fetchWallet = async (userId) => {
    let { data } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!data) {
      const { data: newWallet } = await supabase
        .from("wallets")
        .insert([{ user_id: userId, balance: 500 }])
        .select()
        .maybeSingle();

      data = newWallet;
    }

    setWallet(data);
  };

  const fetchAds = async () => {
    const { data } = await supabase
      .from("ads")
      .select("*")
      .eq("status", "published");

    setAds(data || []);
  };

  // ✅ UPDATED LOGIC (REAL-WORLD STYLE)
  const addBalance = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Enter valid amount");
      return;
    }

    if (!trxId) {
      alert("Enter transaction ID");
      return;
    }

    const { error } = await supabase
      .from("payments")
      .insert([
        {
          user_id: user.id,
          amount: Number(amount),
          method: method,
          transaction_id: trxId,
          status: "pending", // not added to wallet yet
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Payment submitted. It will be verified ✅");

    setAmount("");
    setTrxId("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
        Loading wallet...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
        Please login to view wallet
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-2">💰 My Wallet</h1>
      <p className="text-white/60 mb-6">{user.email}</p>

      {/* BALANCE */}
      <div className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-6 backdrop-blur-md">
        <p className="text-sm text-white/60">Current Balance</p>
        <h2 className="text-4xl font-bold text-green-400">
          Rs {wallet?.balance || 0}
        </h2>
      </div>

      {/* ADD MONEY */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-3">Add Money</h3>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 rounded-lg bg-black/40 border border-white/20 mb-3"
        />

        {/* ✅ PAYMENT METHOD */}
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full p-3 rounded-lg bg-black/40 border border-white/20 mb-3"
        >
          <option value="jazzcash">JazzCash</option>
          <option value="easypaisa">EasyPaisa</option>
          <option value="bank">Bank Transfer</option>
        </select>

        {/* ✅ TRANSACTION ID */}
        <input
          type="text"
          placeholder="Enter Transaction ID"
          value={trxId}
          onChange={(e) => setTrxId(e.target.value)}
          className="w-full p-3 rounded-lg bg-black/40 border border-white/20 mb-3"
        />

        <button
          onClick={addBalance}
          className="bg-green-600 px-4 py-2 rounded-lg hover:scale-105 transition"
        >
          Submit Payment
        </button>

        <p className="text-xs text-white/40 mt-2">
          💡 Balance will update after payment verification
        </p>
      </div>

      {/* ADS */}
      <h2 className="text-xl font-bold mb-4">🔥 Available Ads & Prices</h2>

      <div className="grid md:grid-cols-3 gap-4">
        {ads.map((ad) => (
          <div
            key={ad.id}
            className="bg-white/5 border border-white/10 rounded-xl p-4"
          >
            <h3 className="font-semibold">{ad.title}</h3>

            <p className="text-white/60 text-sm mt-1">
              {ad.description}
            </p>

            <p className="text-yellow-400 mt-2 font-bold">
              💰 Price: {ad.price || 200} PKR
            </p>

            <p className="text-xs text-white/40 mt-1">
              Status: {ad.status}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}