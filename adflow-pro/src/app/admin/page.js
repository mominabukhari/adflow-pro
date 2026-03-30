"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Admin() {
  const router = useRouter();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    checkUser();
    fetchPayments();
  }, []);

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.push("/login");
    }
  };

  // 📦 Get all payments
  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from("payments")
      .select("*");

    if (!error) {
      setPayments(data);
    }
  };

  // ✅ VERIFY PAYMENT + PUBLISH AD
  const verifyPayment = async (paymentId, adId) => {
    // 1. payment verify
    await supabase
      .from("payments")
      .update({ status: "verified" })
      .eq("id", paymentId);

    // 2. ad publish
    await supabase
      .from("ads")
      .update({ status: "published" })
      .eq("id", adId);

    alert("Ad Published Successfully 🚀");
    fetchPayments();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
        Admin Panel
      </h1>

      {payments.length === 0 ? (
        <p className="text-center text-gray-600">
          No payments found
        </p>
      ) : (
        payments.map((p) => (
          <div
            key={p.id}
            className="bg-white p-5 rounded-xl shadow mb-4 border"
          >

            <p className="text-gray-800 mb-2">
              💰 Transaction: {p.transaction_ref}
            </p>

            <p className="text-sm text-gray-500 mb-3">
              Status: <b>{p.status}</b>
            </p>

            <button
              onClick={() => verifyPayment(p.id, p.ad_id)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Verify & Publish Ad
            </button>

          </div>
        ))
      )}
    </div>
  );
}