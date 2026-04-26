import { supabase } from "./supabase";

// 💰 GET OR CREATE WALLET
export async function getWallet(userId) {
  try {
    let { data, error } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!data) {
      const { data: newWallet } = await supabase
        .from("wallets")
        .insert([
          {
            user_id: userId,
            balance: 500,
          },
        ])
        .select()
        .single();

      data = newWallet;
    }

    return { success: true, wallet: data };
  } catch (err) {
    console.error(err);
    return { success: false, wallet: null };
  }
}

// 💰 UPDATE WALLET
export async function updateWallet(userId, amount) {
  const { data } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!data) return;

  await supabase
    .from("wallets")
    .update({
      balance: amount,
    })
    .eq("user_id", userId);
}