# Razorpay live launch runbook

Keep `PAYMENTS_ENABLED=false` until every item below is complete. Never paste a Key
Secret or webhook secret into Git, an issue, a support ticket, or chat.

## Production variables

Set these in Vercel **Production only**, then redeploy because `NEXT_PUBLIC_*` is
compiled into the browser bundle:

| Variable | Production value |
| --- | --- |
| `RAZORPAY_KEY_ID` | New live Key ID from Razorpay, beginning `rzp_live_` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | The same live Key ID |
| `RAZORPAY_KEY_SECRET` | The matching new live Key Secret |
| `RAZORPAY_WEBHOOK_SECRET` | A separate random secret containing at least 32 bytes |
| `RAZORPAY_MODE` | `live` |
| `PAYMENTS_ENABLED` | `false` until the final smoke test |
| `RATE_LIMIT_SALT` | A separate random secret containing at least 32 bytes |
| `CSP_ENFORCE` | `false` until report-only CSP has been reviewed |
| `NEXTAUTH_URL` | `https://wearvine.com` |
| `NEXT_PUBLIC_API_URL` | `https://wearvine.com` |
| `PAYLOAD_CORS_ORIGINS` | `https://wearvine.com` (plus only reviewed aliases, comma-separated) |
| `RESEND_API_KEY` | Existing production Resend API key |
| `EMAIL_FROM` | A sender address verified in the Resend dashboard |
| `EMAIL_FROM_NAME` | `Wear Vine` |

Generate secrets locally with `openssl rand -base64 48`. Test credentials belong
only in Vercel Development/Preview, with `RAZORPAY_MODE=test`.

## Razorpay dashboard

1. Rotate the test key pair and webhook secret previously disclosed in chat.
2. In Live Mode, configure `https://wearvine.com/api/webhooks/razorpay`.
3. Subscribe to `payment.captured`, `payment.failed`, `refund.processed`, and
   `refund.failed`.
4. Enter the same new webhook secret in Razorpay and Vercel.
5. Configure a monitored alert email and automatic capture.
6. Publish real contact information and reviewed privacy, terms, shipping,
   cancellation, and refund policies. The API intentionally blocks live checkout
   while known seed placeholders or unverified claims remain.

## Release gate

1. Back up PostgreSQL. Set the Vercel Build Command to
   `corepack pnpm build:with-migrate` for the deployment that introduces this
   schema, or run `corepack pnpm migrate` once through a controlled release job.
   A migration failure must stop the deployment.
2. Run `corepack pnpm exec tsc --noEmit`, `corepack pnpm test:int`,
   `corepack pnpm test:e2e`, `corepack pnpm build`, and
   `corepack pnpm audit --prod`.
3. Run `corepack pnpm check:live-readiness` against the production database
   environment and resolve every reported CMS-content issue.
4. Deploy Preview with newly rotated test credentials and exercise success,
   failure, dismissal, refresh recovery, webhook replay, and an invalid webhook
   signature.
5. Deploy Production with `PAYMENTS_ENABLED=false`, verify the live webhook, then
   set it to `true` and redeploy.
6. Make one low-value real purchase and refund it. Personally confirm one captured
   Razorpay payment produced exactly one local order and one stock decrement.
7. Confirm an anonymous request to `/api/users` returns no user data.

If checkout returns `503` after live enablement, inspect the server log entry
`Live payments blocked by the business-readiness gate`; it lists the content that
still needs owner review.
