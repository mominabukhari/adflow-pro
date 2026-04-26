import { supabase } from "./supabase";

// 📦 GET USER PURCHASES
export async function getUserPurchases(userId) {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*, ads(title, media_url, price)")
      .eq("user_id", userId)
      .eq("type", "ad_purchase")
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, data: [] };
    }

    return { success: true, data };
  } catch (err) {
    console.error(err);
    return { success: false, data: [] };
  }
}