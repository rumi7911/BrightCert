import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";

export async function POST(request: NextRequest) {
  try {
    const { assessmentId } = await request.json();

    if (!assessmentId || typeof assessmentId !== "string") {
      return NextResponse.json({ error: "assessmentId is required" }, { status: 400 });
    }

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
      success_url: `${appUrl}/assessment/${assessmentId}/report?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/assessment/${assessmentId}/results`,
      payment_method_types: ["card"],
      billing_address_collection: "required",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Support ?assessmentId= query param for simple links
  const assessmentId = request.nextUrl.searchParams.get("assessmentId");
  if (!assessmentId) {
    return NextResponse.redirect(new URL("/pricing", request.url));
  }

  const body = { assessmentId };
  const json = JSON.stringify(body);

  const response = await fetch(request.url.replace("?assessmentId=" + assessmentId, ""), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: json,
  });

  const data = await response.json();
  if (data.url) {
    return NextResponse.redirect(data.url);
  }

  return NextResponse.redirect(new URL("/pricing", request.url));
}
