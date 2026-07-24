import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { verifyAssessmentOwnership } from "@/lib/auth/assessment-ownership";

async function createCheckoutUrl(assessmentId: string): Promise<string> {
  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

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
    // Stripe dashboard can be entered at checkout.
    allow_promotion_codes: true,
    success_url: `${appUrl}/assessment/${assessmentId}/report?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/assessment/${assessmentId}/results`,
    payment_method_types: ["card"],
    billing_address_collection: "required",
  });

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

  try {
    const url = await createCheckoutUrl(assessmentId);
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.redirect(new URL("/pricing", request.url));
  }
}
