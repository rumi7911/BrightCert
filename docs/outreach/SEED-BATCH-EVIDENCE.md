# Single internal seed-batch evidence

> **VERIFIED — SINGLE SEED BATCH COMPLETE**

This is the one permitted pre-T0 internal/friendly seed batch. It contains
exactly three individually sent messages to controlled, permissioned inboxes.
It is not prospect outreach, does not count in the 150-prospect campaign, and
must not be repeated to compensate for a failure.

Do not record recipient names or addresses in this tracked file. Keep any
address-level evidence in the controlled inboxes.

## Batch record

| Record | Value |
|---|---|
| Owner/sender | Muhammad Sohaib Roomi |
| From | `muhammad@brightcert.co.uk` |
| Reply-To | `muhammad@brightcert.co.uk` |
| Planned total | 3 messages |
| Recipient A | Controlled Gmail inbox A |
| Recipient B | Controlled Gmail inbox B |
| Recipient C | Controlled business-domain inbox |
| Send date/time | 26 July 2026, late evening BST; exact per-recipient timestamps retained in the controlled inboxes |
| Sending interface/provider | Gmail interface using ImprovMX SMTP/forwarding |
| Open tracking | Disabled |
| Batch decision | ☒ verified ☐ paused/failed |
| Owner sign-off/date | Final evidence confirmed by Muhammad Sohaib Roomi on 27 July 2026 after the required 24-hour follow-up |

## Pre-send controls

- [x] All three recipients are controlled or have explicitly agreed to receive
  this technical test.
- [x] Each message is composed and sent separately. Do not use To, CC, or BCC
  for multiple recipients.
- [x] The sender and reply address both show
  `muhammad@brightcert.co.uk`.
- [x] Plain-text mode is used; no image, attachment, tracking pixel, shortened
  URL, booking link, or tracked redirect is present.
- [x] The only URL is `https://brightcert.co.uk/privacy`.
- [x] The total is exactly three and no other seed message has been sent under
  this clean restart.
- [x] The sending provider/domain showed no active warning before the batch.

## Message A — Gmail, SME Touch 1 layout

Subject:

```text
seed test: sme baseline
```

Body:

```text
[Controlled BrightCert seed test — no marketing action is required.]

Hi Seed tester,

Your published tender notice lists Cyber Essentials as a supplier requirement.

I can guide Fictitious Components Ltd through a free Cyber Essentials readiness baseline, then review the action plan with you so the next steps are clear.

Would a short outline be useful?

Muhammad
Founder, BrightCert
muhammad@brightcert.co.uk

BrightCert is a readiness service, not a Certification Body. Privacy: https://brightcert.co.uk/privacy. You can object to direct marketing at any time: reply “no thanks” and I will stop.

For this controlled test, please reply with: SEED A RECEIVED
```

## Message B — Gmail, MSP Touch 1 layout

Subject:

```text
seed test: msp pilot
```

Body:

```text
[Controlled BrightCert seed test — no marketing action is required.]

Hi Seed tester,

Your public service page says your team supports UK SMEs with Cyber Essentials.

I am testing a partner-assisted BrightCert pilot with MSPs: one suitable UK SME client, a guided Cyber Essentials readiness baseline, and founder support for the reviewed action plan.

Would a one-client outline be useful?

Muhammad
Founder, BrightCert
muhammad@brightcert.co.uk

BrightCert is a readiness service, not a Certification Body. Privacy: https://brightcert.co.uk/privacy. You can object to direct marketing at any time: reply “no thanks” and I will stop.

For this controlled test, please reply with: SEED B RECEIVED
```

## Message C — business domain, SME pricing layout

Subject:

```text
seed test: pricing layout
```

Body:

```text
[Controlled BrightCert seed test — no marketing action is required.]

Hi Seed tester,

Your published tender notice lists Cyber Essentials as a supplier requirement.

After the free guided baseline and reviewed action plan, the optional permanent report and evidence-workspace unlock is £99 including VAT with the existing £100 FOUNDING10 discount from £199. Founder support is included through the pilot.

Would you like me to send the baseline steps?

Muhammad
Founder, BrightCert
muhammad@brightcert.co.uk

BrightCert is a readiness service, not a Certification Body. Privacy: https://brightcert.co.uk/privacy. You can object to direct marketing at any time: reply “no thanks” and I will stop.

For this controlled test, please reply with: SEED C RECEIVED
```

## Recipient evidence

Complete this table without adding addresses, names, message IDs, or other
personal data.

| Check | Gmail A | Gmail B | Business domain |
|---|---|---|---|
| Sent individually at | 26 Jul 2026; inbox timestamp retained | 26 Jul 2026; inbox timestamp retained | 26 Jul 2026; inbox timestamp retained |
| Delivered without bounce | ☒ | ☒ | ☒ |
| Inbox placement | ☒ inbox ☐ spam | ☒ inbox ☐ spam | ☒ inbox ☐ spam |
| Plain-text line breaks readable | ☒ | ☒ | ☒ |
| No raw template variables | ☒ | ☒ | ☒ |
| Price/VAT/discount correct where present | n/a | n/a | ☒ |
| Privacy URL opens successfully | ☒ | ☒ | ☒ |
| From correct | ☒ | ☒ | ☒ |
| Reply-To correct | ☒ | ☒ | ☒ |
| Reply returned to founder inbox | ☒ | ☒ | ☒ |
| SPF result | ☒ pass ☐ fail | ☒ pass ☐ fail | `PERMERROR` on the ImprovMX forwarding path; see note below |
| DKIM result | ☒ pass ☐ fail | ☒ pass ☐ fail | ☒ pass ☐ fail |
| DMARC result | ☒ pass ☐ fail | ☒ pass ☐ fail | ☒ pass ☐ fail |

For Gmail, use **More → Show original** and record only the displayed
SPF/DKIM/DMARC pass/fail results. For the business-domain inbox, inspect the
equivalent original/raw message headers. Do not paste raw headers into Git.

The business-domain recipient also uses ImprovMX forwarding. Its final-hop
header reported SPF `PERMERROR` for ImprovMX IP `51.158.91.229`, while DKIM and
DMARC passed. Both direct Gmail deliveries passed SPF, DKIM and DMARC. Current
BrightCert DNS publishes one SPF record including `spf.improvmx.com`, whose
published `51.158.91.224/28` range contains the observed IP. The exception is
therefore retained transparently as forwarding-path evidence rather than
rewritten as an SPF pass.

## Batch-level evidence

- [x] All three expected replies arrived in `muhammad@brightcert.co.uk`.
- [x] No hard bounce was received during the same-day check.
- [x] No spam complaint was generated during the same-day check.
- [x] No sending-provider, inbox, DNS, or domain-reputation warning appeared
  during the same-day check.
- [x] No recipient address was exposed to another recipient.
- [x] The privacy page returned successfully from each recipient environment.
- [x] The same-day delayed-bounce/provider-warning check passed.
- [x] The follow-up check at least 24 hours after the latest send found no
  delayed bounce, complaint, provider or domain warning.
- [x] The owner reviewed and confirmed the same-day evidence.
- [x] The owner selected the final decision below after the 24-hour check.

## Decision

Select one:

- ☒ **Verified:** all three messages passed, all replies routed correctly,
  authentication passed, and no warning appeared. Do not run another seed
  batch.
- ☐ **Paused/failed:** one or more checks failed. Stop all outreach, preserve
  the controlled evidence, and repair the cause. Do not send a replacement
  seed batch.

| Sign-off | Value |
|---|---|
| Result | Verified |
| Owner/reviewer | Muhammad Sohaib Roomi |
| Decision timestamp | 27 July 2026; owner-confirmed after the required 24-hour interval |
| Follow-up check timestamp | 27 July 2026; no delayed bounce, complaint, provider or domain warning observed |
| Non-PII notes | Clean plain-text rendering confirmed visually; all three replies returned. Business forwarding path recorded SPF `PERMERROR`, with DKIM/DMARC pass and direct Gmail SPF/DKIM/DMARC pass. The forwarding-path exception remains recorded and was not rewritten as a pass |
