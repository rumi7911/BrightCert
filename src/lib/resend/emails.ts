import { getResend, FROM_EMAIL } from "./client";

const NAVY = "#0F2044";
const EMERALD = "#047857";
const SLATE = "#475569";
const BORDER = "#E2E8F0";
const BG = "#F8FAFC";

function baseTemplate(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BG};font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:${NAVY};border-radius:12px 12px 0 0;padding:24px 32px;">
            <span style="color:${EMERALD};font-size:13px;font-weight:700;letter-spacing:1px;">BRIGHTCERT</span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:32px;border-left:1px solid ${BORDER};border-right:1px solid ${BORDER};">
            ${body}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:${BG};border:1px solid ${BORDER};border-top:none;border-radius:0 0 12px 12px;padding:20px 32px;">
            <p style="margin:0;font-size:11px;color:#94A3B8;line-height:1.6;">
              BrightCert is a trading name of Cognumi Ltd. This service provides readiness assessments only —
              it does not issue official Cyber Essentials certification. Official certification must be completed
              through an IASME-licensed Certification Body.
            </p>
            <p style="margin:8px 0 0;font-size:11px;color:#94A3B8;">
              brightcert.co.uk · hello@brightcert.co.uk
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendWelcomeEmail(email: string, orgName: string): Promise<void> {
  const resend = getResend();

  const body = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:${NAVY};">Welcome to BrightCert</h1>
    <p style="margin:0 0 24px;font-size:15px;color:${SLATE};line-height:1.6;">
      Hi${orgName ? ` from ${orgName}` : ""},<br><br>
      Your account is set up and you're ready to start your Cyber Essentials readiness assessment.
    </p>
    <p style="margin:0 0 12px;font-size:14px;color:${SLATE};line-height:1.6;">Here's what happens next:</p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="padding:6px 0;vertical-align:top;">
          <span style="display:inline-block;width:20px;height:20px;background:${EMERALD};color:#fff;border-radius:50%;font-size:11px;font-weight:700;text-align:center;line-height:20px;margin-right:10px;">1</span>
        </td>
        <td style="padding:6px 0;font-size:14px;color:${SLATE};line-height:1.5;">Answer ~60 questions across 5 Cyber Essentials control areas</td>
      </tr>
      <tr>
        <td style="padding:6px 0;vertical-align:top;">
          <span style="display:inline-block;width:20px;height:20px;background:${EMERALD};color:#fff;border-radius:50%;font-size:11px;font-weight:700;text-align:center;line-height:20px;margin-right:10px;">2</span>
        </td>
        <td style="padding:6px 0;font-size:14px;color:${SLATE};line-height:1.5;">Get an AI-powered gap analysis with your readiness score</td>
      </tr>
      <tr>
        <td style="padding:6px 0;vertical-align:top;">
          <span style="display:inline-block;width:20px;height:20px;background:${EMERALD};color:#fff;border-radius:50%;font-size:11px;font-weight:700;text-align:center;line-height:20px;margin-right:10px;">3</span>
        </td>
        <td style="padding:6px 0;font-size:14px;color:${SLATE};line-height:1.5;">Unlock your full PDF report and remediation roadmap for £199</td>
      </tr>
    </table>
    <a href="https://brightcert.co.uk/dashboard"
       style="display:inline-block;background:${EMERALD};color:#ffffff;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none;">
      Start your assessment →
    </a>`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Welcome to BrightCert: start your Cyber Essentials assessment",
    html: baseTemplate(body),
  });
}

export async function sendReportReadyEmail(
  email: string,
  orgName: string,
  reportUrl: string,
  overallScore: number,
): Promise<void> {
  const resend = getResend();

  const body = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:${NAVY};">Your report is ready</h1>
    <p style="margin:0 0 24px;font-size:15px;color:${SLATE};line-height:1.6;">
      Hi${orgName ? ` ${orgName}` : ""},<br><br>
      Your Cyber Essentials readiness report has been generated. Your overall readiness score is:
    </p>
    <div style="background:${BG};border:1px solid ${BORDER};border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
      <span style="font-size:48px;font-weight:700;color:${EMERALD};">${overallScore}%</span>
      <p style="margin:4px 0 0;font-size:14px;color:${SLATE};">Overall readiness score</p>
    </div>
    <p style="margin:0 0 20px;font-size:14px;color:${SLATE};line-height:1.6;">
      Your report includes a full gap analysis, prioritised remediation roadmap (P1/P2/P3), and step-by-step
      guidance for each Cyber Essentials control area.
    </p>
    <a href="${reportUrl}"
       style="display:inline-block;background:${EMERALD};color:#ffffff;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none;margin-bottom:16px;">
      View &amp; download your report →
    </a>
    <p style="margin:16px 0 0;font-size:12px;color:#94A3B8;">
      This link expires in 7 days. Log in to brightcert.co.uk to regenerate it at any time.
    </p>`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Your BrightCert report is ready: ${overallScore}% readiness score`,
    html: baseTemplate(body),
  });
}

export async function sendUnlockReminderEmail(
  email: string,
  orgName: string,
  assessmentId: string,
  overallScore: number,
): Promise<void> {
  const resend = getResend();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  // ?ref=unlock_reminder lets the results page fire a one-off reminder_clicked
  // GA4 event, so this channel is measurable separately from organic visits.
  const resultsUrl = `${appUrl}/assessment/${assessmentId}/results?ref=unlock_reminder`;

  const body = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:${NAVY};">Your gap analysis is waiting</h1>
    <p style="margin:0 0 24px;font-size:15px;color:${SLATE};line-height:1.6;">
      Hi${orgName ? ` ${orgName}` : ""},<br><br>
      You finished your Cyber Essentials readiness assessment, but haven't unlocked your full report yet.
      Your readiness score is:
    </p>
    <div style="background:${BG};border:1px solid ${BORDER};border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
      <span style="font-size:48px;font-weight:700;color:${EMERALD};">${overallScore}%</span>
      <p style="margin:4px 0 0;font-size:14px;color:${SLATE};">Overall readiness score</p>
    </div>
    <p style="margin:0 0 12px;font-size:14px;color:${SLATE};line-height:1.6;">
      Unlock the full report for £199 to see your prioritised remediation roadmap (P1/P2/P3) and
      step-by-step guidance for each control area.
    </p>
    <p style="margin:0 0 20px;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:${EMERALD};">
      First 10 customers: £99 with code FOUNDING10
    </p>
    <a href="${resultsUrl}"
       style="display:inline-block;background:${EMERALD};color:#ffffff;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none;">
      View your results &amp; unlock report →
    </a>`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Your Cyber Essentials readiness score: ${overallScore}%`,
    html: baseTemplate(body),
  });
}
