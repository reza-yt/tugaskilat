import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    // Validate webhook secret (implement based on payment gateway)
    const body = await request.json();

    // TODO: Replace with actual payment gateway webhook handling
    // This is a placeholder for payment gateway integration (e.g., Midtrans, Xendit)
    const { payment_ref, status, user_id, credits_granted, package_id, amount_idr } = body;

    if (!payment_ref || !status) {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    if (status === "paid") {
      // 1. Update payment record
      await supabase
        .from("payments")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
        })
        .eq("payment_ref", payment_ref);

      // 2. Add credits to user
      await supabase.rpc("deduct_credit_atomic", {
        p_user_id: user_id,
        p_task_id: null,
        p_amount: -credits_granted, // negative amount = add credits
        p_description: `Pembelian paket kredit`,
      });

      // 3. Update profile
      await supabase
        .from("profiles")
        .update({
          total_credits_purchased: credits_granted,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user_id);
    } else if (status === "failed") {
      await supabase
        .from("payments")
        .update({ status: "failed" })
        .eq("payment_ref", payment_ref);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
