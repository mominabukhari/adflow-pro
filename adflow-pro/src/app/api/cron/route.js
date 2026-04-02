import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  const now = new Date();

  // Expire ads
  await supabase
    .from("ads")
    .update({ status: "expired" })
    .lt("expire_at", now)
    .eq("status", "published");

  // Auto publish
  await supabase
    .from("ads")
    .update({
      status: "published",
      publish_at: now
    })
    .eq("status", "payment_verified");

  return Response.json({ success: true });
}