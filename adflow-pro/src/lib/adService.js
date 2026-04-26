// import { supabase } from "./supabase";

// export async function buyAd(userId, adId, price) {
//   try {
//     const { data: wallet, error: walletError } = await supabase
//       .from("wallets")
//       .select("*")
//       .eq("user_id", userId)
//       .single();

//     if (walletError || !wallet) {
//       return { success: false, message: "Wallet not found ❌" };
//     }

//     if (wallet.balance < price) {
//       return { success: false, message: "Not sufficient income ❌" };
//     }

//     const { data: ad, error: adError } = await supabase
//       .from("ads")
//       .select("*")
//       .eq("id", adId)
//       .single();

//     if (adError || !ad) {
//       return { success: false, message: "Ad not found ❌" };
//     }

//     if (ad.user_id === userId) {
//       return { success: false, message: "You cannot buy your own ad ❌" };
//     }

//     // deduct buyer balance
//     await supabase
//       .from("wallets")
//       .update({
//         balance: wallet.balance - price,
//       })
//       .eq("user_id", userId);

//     // seller wallet
//     let { data: sellerWallet } = await supabase
//       .from("wallets")
//       .select("*")
//       .eq("user_id", ad.user_id)
//       .single();

//     if (!sellerWallet) {
//       const { data: newSeller } = await supabase
//         .from("wallets")
//         .insert([{ user_id: ad.user_id, balance: 0 }])
//         .select()
//         .single();

//       sellerWallet = newSeller;
//     }

//     // add seller income
//     await supabase
//       .from("wallets")
//       .update({
//         balance: sellerWallet.balance + price,
//       })
//       .eq("user_id", ad.user_id);

//     // mark ad sold
//     await supabase
//       .from("ads")
//       .update({
//         status: "sold",
//         sold_to: userId,
//       })
//       .eq("id", adId);

//     // transaction log
//     await supabase.from("transactions").insert([
//       {
//         user_id: userId,
//         ad_id: adId,
//         amount: price,
//         type: "ad_purchase",
//         created_at: new Date().toISOString(),
//       },
//     ]);

//     return { success: true };

//   } catch (err) {
//     console.log(err);
//     return { success: false };
//   }
// }

// /* =========================
//    ⚡ NEW: BOOST FUNCTION
// ========================= */
// export async function boostAd(userId, adId, price = 100) {
//   try {
//     const { data: wallet } = await supabase
//       .from("wallets")
//       .select("*")
//       .eq("user_id", userId)
//       .single();

//     if (!wallet) {
//       return { success: false, message: "Wallet not found ❌" };
//     }

//     if (wallet.balance < price) {
//       return { success: false, message: "Not sufficient income ❌" };
//     }

//     const { data: ad } = await supabase
//       .from("ads")
//       .select("*")
//       .eq("id", adId)
//       .single();

//     if (!ad) {
//       return { success: false, message: "Ad not found ❌" };
//     }

//     // deduct balance
//     await supabase
//       .from("wallets")
//       .update({
//         balance: wallet.balance - price,
//       })
//       .eq("user_id", userId);

//     // promote ad
//     await supabase
//       .from("ads")
//       .update({
//         is_promoted: true,
//         boost_level: (ad.boost_level || 0) + 1,
//       })
//       .eq("id", adId);

//     // transaction log
//     await supabase.from("transactions").insert([
//       {
//         user_id: userId,
//         ad_id: adId,
//         amount: price,
//         type: "boost",
//         created_at: new Date().toISOString(),
//       },
//     ]);

//     return { success: true };

//   } catch (err) {
//     console.log(err);
//     return { success: false };
//   }
// }
import { supabase } from "./supabase";

export async function buyAd(userId, adId, price) {
  try {
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (walletError || !wallet) {
      return { success: false, message: "Wallet not found ❌" };
    }

    if (wallet.balance < price) {
      return { success: false, message: "Not sufficient income ❌" };
    }

    const { data: ad, error: adError } = await supabase
      .from("ads")
      .select("*")
      .eq("id", adId)
      .single();

    if (adError || !ad) {
      return { success: false, message: "Ad not found ❌" };
    }

    if (ad.user_id === userId) {
      return { success: false, message: "You cannot buy your own ad ❌" };
    }

    // deduct buyer balance
    await supabase
      .from("wallets")
      .update({
        balance: wallet.balance - price,
      })
      .eq("user_id", userId);

    // seller wallet
    let { data: sellerWallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", ad.user_id)
      .single();

    // 🔥 FIX: safer fallback (avoid undefined crash)
    if (!sellerWallet) {
      const { data: newSeller } = await supabase
        .from("wallets")
        .insert([{ user_id: ad.user_id, balance: 0 }])
        .select()
        .single();

      sellerWallet = newSeller;
    }

    // add seller income
    await supabase
      .from("wallets")
      .update({
        balance: (sellerWallet?.balance || 0) + price,
      })
      .eq("user_id", ad.user_id);

    // mark ad sold
    await supabase
      .from("ads")
      .update({
        status: "sold",
        sold_to: userId,
      })
      .eq("id", adId);

    // transaction log
    await supabase.from("transactions").insert([
      {
        user_id: userId,
        ad_id: adId,
        amount: price,
        type: "ad_purchase",
        created_at: new Date().toISOString(),
      },
    ]);

    return { success: true };

  } catch (err) {
    console.log(err);
    return { success: false };
  }
}

/* =========================
   ⚡ NEW: BOOST FUNCTION
========================= */
export async function boostAd(userId, adId, price = 100) {
  try {
    const { data: wallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!wallet) {
      return { success: false, message: "Wallet not found ❌" };
    }

    if (wallet.balance < price) {
      return { success: false, message: "Not sufficient income ❌" };
    }

    const { data: ad } = await supabase
      .from("ads")
      .select("*")
      .eq("id", adId)
      .single();

    if (!ad) {
      return { success: false, message: "Ad not found ❌" };
    }

    // deduct balance
    await supabase
      .from("wallets")
      .update({
        balance: wallet.balance - price,
      })
      .eq("user_id", userId);

    // promote ad
    await supabase
      .from("ads")
      .update({
        is_promoted: true,
        boost_level: (ad.boost_level || 0) + 1,
      })
      .eq("id", adId);

    // transaction log
    await supabase.from("transactions").insert([
      {
        user_id: userId,
        ad_id: adId,
        amount: price,
        type: "boost",
        created_at: new Date().toISOString(),
      },
    ]);

    return { success: true };

  } catch (err) {
    console.log(err);
    return { success: false };
  }
}