import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  const stripe = getStripe();
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const assessmentId = session.metadata?.assessmentId;

    if (!assessmentId) {
      console.error("No assessmentId in checkout session metadata");
      return NextResponse.json({ received: true });
    }

    const supabase = createAdminClient();

    // Mark assessment as paid
    const { error } = await supabase
      .from("assessments")
      .update({ status: "paid" })
      .eq("id", assessmentId);

    if (error) {
      console.error("Failed to update assessment status:", error);
      return NextResponse.json({ error: "Database update failed" }, { status: 500 });
    }

    // Trigger PDF generation (async, fire-and-forget)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    fetch(`${appUrl}/api/reports/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assessmentId }),
    }).catch((err) => console.error("PDF generation trigger failed:", err));
  }

  return NextResponse.json({ received: true });
}
