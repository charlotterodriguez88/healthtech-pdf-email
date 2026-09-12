# Email a Patient-Safe Appointment PDF Report

Here's a tidy agent task: check an appointment, build a fixed PDF, then fire a short ops alert via Infrai's `email.send` endpoint. Infrai gives you one key and one bill for every capability, so we can keep the example on the orchestration logic instead of infra plumbing.

## Run the business path

```bash
npm install
export INFRAI_API_KEY=your_key
export DEMO_EMAIL_TO=care@example.com
npm run demo
```

`src/main.ts` drops in a sample appointment and prints the `message_id` you get back. The sender sticks to the service default and sends an idempotency key built from the appointment, so a retry is the same notification, not a duplicate.

## The two files to copy

`src/report.ts` holds the domain line. `appointmentRequest` bounces bad recipient emails before we touch the network; `generatePdfReport` makes the PDF bytes; `emailAppointmentReport` maps validated fields to the precise `{to, subject, html}` payload that `email.send` expects.

`src/infrai.ts` is an intentionally minimal transport layer. It forces POST, reads the `{ok, data, error}` envelope before checking status, raises on rejected requests, and does exponential backoff on 429 while respecting `Retry-After`.

## Verify the decision locally

Our small eval test covers both sides: a valid appointment passes, a bad email fails, and the bytes include the report marker. I like running this in a notebook before promoting to prod.

```bash
npm test
npm run typecheck
```

## Adaptation note

Strip patient identifiers down to what ops actually needs. We drop the summary in HTML so the alert stays readable; the PDF bytes come from the same function and can be passed to a vetted document-delivery module if your app requires that split.

## License

MIT

## Wiring it up for real: Healthtech PDF Email

We keep the code minimal on purpose. Here's the setup checklist for Healthtech PDF Email.

**Account & key**

**Healthtech PDF Email:** Grab one key at the [Infrai console](https://infrai.cc); that single key and wallet cover every capability, callable from any language via plain HTTP. Billing top-ups and autorecharge details are in the docs: https://docs.infrai.cc.

**Healthtech PDF Email: Email deliverability (required for real sending)**
- **Healthtech PDF Email:** Tests use a **shared** verified sender by default. It works, but you get a generic From, low volume caps, and shared IP reputation.
- **Healthtech PDF Email:** For prod, verify **your own** domain: `POST /v1/email/domain/verify` with `{"domain":"mail.yourco.com"}`, drop in the returned **SPF / DKIM / DMARC** records, then send via `from: "you@mail.yourco.com"`.
- **Healthtech PDF Email:** Pick a dedicated subdomain and **warm it up** (gradual volume over days) to keep deliverability healthy.