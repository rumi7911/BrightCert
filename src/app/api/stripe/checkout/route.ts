import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { verifyAssessmentOwnership } from "@/lib/auth/assessment-ownership";

async function createCheckoutUrl(assessmentId: string): Promise<string> {
  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Buckets by assessment + hour so a double-click or two open tabs within
  // the same hour reuse one Checkout Session instead of creating duplicates,
  // without permanently blocking a legitimate retry after a session expires.
  const idempotencyKey = `checkout-${assessmentId}-${new Date().toISOString().slice(0, 13)}`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    currency: "gbp",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "gbp",
          unit_amount: 19900, // £199.00
          product_data: {
            name: "BrightCert Readiness Report",
            description:
              "Full Cyber Essentials readiness report with gap analysis, remediation roadmap, and PDF download.",
          },
        },
      },
    ],
    metadata: {
      assessmentId,
    },
    // Founding-customer offer: promo codes (e.g. FOUNDING10) created in the
    // Stripe dashboard can be entered at checkout. FOUNDING10 is capped at 10
    // redemptions in Stripe, and the site copy states that limit — if the cap
    // changes, update the copy too or we advertise a price nobody can get.
    allow_promotion_codes: true,
    success_url: `${appUrl}/assessment/${assessmentId}/report?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/assessment/${assessmentId}/results`,
    payment_method_types: ["card"],
    billing_address_collection: "required",
  }, { idempotencyKey });

  if (!session.url) throw new Error("Stripe did not return a checkout URL");
  return session.url;
}

export async function POST(request: NextRequest) {
  try {
    const { assessmentId } = await request.json();

    if (!assessmentId || typeof assessmentId !== "string") {
      return NextResponse.json({ error: "assessmentId is required" }, { status: 400 });
    }

    const ownership = await verifyAssessmentOwnership(assessmentId);
    if (!ownership.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: ownership.status });
    }

    // Nothing to buy for a paid assessment — send the caller to the report
    // they already own instead of creating a second Checkout Session.
    if (ownership.assessmentStatus === "paid") {
      return NextResponse.json({ url: `/assessment/${assessmentId}/report` });
    }
    // Nothing to buy yet for a draft — the assessment hasn't been analysed.
    if (ownership.assessmentStatus !== "analysed") {
      return NextResponse.json({ error: "Assessment is not ready for checkout" }, { status: 400 });
    }

    const url = await createCheckoutUrl(assessmentId);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Support ?assessmentId= query param for simple links (sidebar, dashboard,
  // results page all navigate here directly, not via fetch).
  const assessmentId = request.nextUrl.searchParams.get("assessmentId");
  if (!assessmentId) {
    return NextResponse.redirect(new URL("/pricing", request.url));
  }

  const ownership = await verifyAssessmentOwnership(assessmentId);
  if (!ownership.authorized) {
    return NextResponse.redirect(
      new URL(ownership.status === 401 ? "/login" : "/dashboard", request.url)
    );
  }

  // Nothing to buy for a paid assessment — send the caller to the report
  // they already own instead of creating a second Checkout Session.
  if (ownership.assessmentStatus === "paid") {
    return NextResponse.redirect(new URL(`/assessment/${assessmentId}/report`, request.url));
  }
  // Nothing to buy yet for a draft — the assessment hasn't been analysed.
  if (ownership.assessmentStatus !== "analysed") {
    return NextResponse.redirect(new URL(`/assessment/${assessmentId}`, request.url));
  }

  try {
    const url = await createCheckoutUrl(assessmentId);
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.redirect(new URL("/pricing", request.url));
  }
}
