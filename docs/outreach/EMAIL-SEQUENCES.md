# Founder email sequences

These are approved-copy candidates, not permission to send. Complete
[LAUNCH-GATE.md](./LAUNCH-GATE.md), use a current
`ready_manual_send` queue row, and run the human checklist below for every
touch.

All messages are plain text and sent manually by
`muhammad@brightcert.co.uk`. Keep one question/CTA per touch. Every opening
must state a verified trigger, not generic praise. Any reply or opt-out stops
the sequence immediately.

BrightCert helps with readiness preparation; it does not issue official Cyber
Essentials certification or guarantee a pass.

## SME sequence: business days 1, 6, and 12

### Touch 1 — relevant baseline

Choose one short lower-case subject:

- `cyber essentials timing`
- `your readiness baseline`
- `the tender requirement`

Use only the choice that accurately fits the verified trigger.

```text
Hi {{first_name}},

{{verified_trigger_sentence}}.

I can guide {{company_name}} through a free Cyber Essentials readiness baseline, then review the action plan with you so the next steps are clear.

Would a short outline be useful?

Muhammad
Founder, BrightCert
muhammad@brightcert.co.uk

BrightCert is a readiness service, not a Certification Body. Privacy: https://brightcert.co.uk/privacy. You can object to direct marketing at any time: reply “no thanks” and I will stop.
```

### Touch 2 — evidence before actions, business day 6

Reply in the same thread; do not add a new subject.

```text
Hi {{first_name}},

{{verified_trigger_sentence}}.

One useful way to prepare is to separate evidence already in place from actions that still need an owner. The free guided baseline covers the five Cyber Essentials control areas and I review the resulting action plan with you.

Would that evidence-first view help with {{trigger_short}}?

Muhammad
Founder, BrightCert
muhammad@brightcert.co.uk

BrightCert is a readiness service, not a Certification Body. Privacy: https://brightcert.co.uk/privacy. You can object to direct marketing at any time: reply “no thanks” and I will stop.
```

### Touch 3 — keep the work, business day 12

Reply in the same thread; do not add a new subject.

```text
Hi {{first_name}},

{{verified_trigger_sentence}}.

After the free guided baseline and reviewed action plan, the optional permanent report and evidence-workspace unlock is £199, or £99 including VAT with the existing £100 FOUNDING10 discount, which is limited to the first 10 customers. Founder support is included through the pilot.

Would you like me to send the baseline steps?

Muhammad
Founder, BrightCert
muhammad@brightcert.co.uk

BrightCert is a readiness service, not a Certification Body. Privacy: https://brightcert.co.uk/privacy. You can object to direct marketing at any time: reply “no thanks” and I will stop.
```

Stop after Touch 3. Do not send a separate “break-up” email.

## MSP sequence: business days 1, 7, and 14

### Touch 1 — one-client pilot

Choose one short lower-case subject:

- `one client pilot`
- `client evidence workflow`
- `cyber essentials readiness`

```text
Hi {{first_name}},

{{verified_trigger_sentence}}.

I am testing a partner-assisted BrightCert pilot with MSPs: one suitable UK SME client, a guided Cyber Essentials readiness baseline, and founder support for the reviewed action plan.

Would a one-client outline be useful?

Muhammad
Founder, BrightCert
muhammad@brightcert.co.uk

BrightCert is a readiness service, not a Certification Body. Privacy: https://brightcert.co.uk/privacy. You can object to direct marketing at any time: reply “no thanks” and I will stop.
```

### Touch 2 — reusable evidence workflow, business day 7

Reply in the same thread; do not add a new subject.

```text
Hi {{first_name}},

{{verified_trigger_sentence}}.

The practical pilot question is whether your team can collect a client's answers and evidence once, review gaps against the five control areas, and keep a clear owner/action trail rather than rebuilding it across documents.

Would that workflow be useful for one client?

Muhammad
Founder, BrightCert
muhammad@brightcert.co.uk

BrightCert is a readiness service, not a Certification Body. Privacy: https://brightcert.co.uk/privacy. You can object to direct marketing at any time: reply “no thanks” and I will stop.
```

### Touch 3 — founder review, business day 14

Reply in the same thread; do not add a new subject.

```text
Hi {{first_name}},

{{verified_trigger_sentence}}.

For the one-client pilot, I would guide the baseline, review the action plan with your team, and capture where the evidence workflow helps or gets in the way. The client still applies separately through a Certification Body for official certification.

Would you like the pilot steps in one reply?

Muhammad
Founder, BrightCert
muhammad@brightcert.co.uk

BrightCert is a readiness service, not a Certification Body. Privacy: https://brightcert.co.uk/privacy. You can object to direct marketing at any time: reply “no thanks” and I will stop.
```

Stop after Touch 3.

## Variable glossary

| Variable | Rule | Safe pattern |
|---|---|---|
| `{{first_name}}` | Derive from the reviewed named contact; check spelling | `Casey` in a fictitious `.test` example |
| `{{company_name}}` | Use the reviewed trading/registered name accurately | `Fictitious Components Ltd` |
| `{{verified_trigger_sentence}}` | One factual sentence grounded in `trigger_evidence_url`; no question mark, flattery, inference, or private detail | `Your published tender notice lists Cyber Essentials as a supplier requirement` |
| `{{trigger_short}}` | Short noun phrase that completes the CTA accurately | `the tender response` |

Do not expose raw template braces to a recipient. If a field is awkward or
uncertain, block the send rather than improvise.

## Human pre-send checklist

- [ ] Current queue row is `ready_manual_send` for the correct step.
- [ ] Recipient is a named, verified corporate contact and not a role account.
- [ ] The trigger sentence is supported by the cited source today and relevant
  to the recipient's role.
- [ ] Segment, touch, subject, company name, and template version match the
  canonical row.
- [ ] Follow-up stays in the original thread and adds the stated new insight.
- [ ] Message is plain text, short, and has exactly one question/CTA.
- [ ] Reply is the CTA; there is no unverified booking URL or tracked redirect.
- [ ] Footer contains sender identity, privacy URL, and clear “reply no thanks”
  objection route.
- [ ] Message does not claim certification, guaranteed readiness/pass,
  completed remediation in around two hours, artificial scarcity, or an
  unverified cohort/customer count.
- [ ] SME price, if present, is exactly £99 including VAT through the existing
  £100 `FOUNDING10` discount from £199, and states that the code is limited to
  the first 10 customers. That cap is a real Stripe limit, not a scarcity
  device, and quoting the price without it risks advertising a price the
  recipient can no longer obtain.
- [ ] Inbox, suppression store, and event history show no reply, objection,
  bounce, customer, loss, or closure.
- [ ] Daily cap and pause rules in [SOP.md](./SOP.md) still permit the send.

## Links and attribution

The privacy URL is informational, not a second CTA. Do not add open tracking.
If a BrightCert product link is later shared after a positive reply, use the
non-PII UTM convention in [SOP.md](./SOP.md); campaign attribution is captured
only under the site's consent controls.
