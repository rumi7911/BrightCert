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

    // checkout.session.completed can fire before payment is actually
    // confirmed for async payment methods — only mark paid once Stripe
    // itself confirms the payment succeeded.
    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const supabase = createAdminClient();

    // Mark assessment as paid, and record the actual payment so `paid`
    // status can be backed by a verified Stripe transaction, not just a flag.
    const { error } = await supabase
      .from("assessments")
      .update({
        status: "paid",
        stripe_session_id: session.id,
        amount_paid: session.amount_total,
        currency: session.currency,
        paid_at: new Date().toISOString(),
      })
      .eq("id", assessmentId);

    if (error) {
      console.error("Failed to update assessment status:", error);
      return NextResponse.json({ error: "Database update failed" }, { status: 500 });
    }

    // Trigger PDF generation (async, fire-and-forget). Internal secret marks
    // this as a trusted server-to-server call — see /api/reports/generate.
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    fetch(`${appUrl}/api/reports/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": process.env.INTERNAL_API_SECRET ?? "",
      },
      body: JSON.stringify({ assessmentId }),
    }).catch((err) => console.error("PDF generation trigger failed:", err));
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object;

    // Stripe sends charge.refunded for partial refunds too. Only a confirmed
    // full refund should remove the customer's paid entitlement.
    if (!charge.refunded) {
      return NextResponse.json({ received: true });
    }

    const paymentIntentId =
      typeof charge.payment_intent === "string"
        ? charge.payment_intent
        : charge.payment_intent?.id;

    if (!paymentIntentId) {
      console.error("No payment intent on fully refunded charge");
      return NextResponse.json({ received: true });
    }

    let session;
    try {
      const sessions = await stripe.checkout.sessions.list({
        payment_intent: paymentIntentId,
        limit: 1,
      });
      session = sessions.data[0];
    } catch (error) {
      console.error("Failed to resolve refunded Checkout Session:", error);
      return NextResponse.json({ error: "Stripe lookup failed" }, { status: 500 });
    }

    const assessmentId = session?.metadata?.assessmentId;
    if (!session || !assessmentId) {
      console.error("No assessment Checkout Session found for fully refunded charge");
      return NextResponse.json({ received: true });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("assessments")
      .update({
        status: "analysed",
        stripe_session_id: null,
        amount_paid: null,
        currency: null,
        paid_at: null,
        // A refunded assessment returns to the analysed paywall. Mark the
        // unlock reminder as handled so the daily cron does not email a
        // customer asking them to pay again immediately after their refund.
        reminder_sent_at: new Date().toISOString(),
      })
      .eq("id", assessmentId)
      .eq("stripe_session_id", session.id)
      .eq("status", "paid");

    if (error) {
      console.error("Failed to revoke refunded assessment entitlement:", error);
      return NextResponse.json({ error: "Database update failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
