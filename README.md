# WellSide Behavioral Health

A single-provider behavioral health telemedicine platform for Wulaimot
Akindele, MSN, APRN, PMHNP, founder of WellSide Behavioral Health.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, NextAuth,
Postgres, and Framer Motion.

## Getting started (local development)

### 1. Create a free Postgres database

This app uses [Neon](https://neon.tech) (serverless Postgres, free tier,
no credit card required) — but any standard Postgres connection string
works.

1. Sign up at [neon.tech](https://neon.tech) and create a new project
2. Copy the connection string it gives you (starts with `postgresql://`)
3. Paste it into `.env` as `DATABASE_URL`

### 2. (Optional but recommended) Set up real email sending

Password reset emails and appointment confirmations use
[Resend](https://resend.com) — free for up to 3,000 emails/month.

1. Sign up at [resend.com](https://resend.com)
2. Create an API key (Dashboard → API Keys)
3. Paste it into `.env` as `RESEND_API_KEY`

Without this, the app still works — password reset requests are logged
to your terminal instead of emailed, so you can copy the reset link from
there during local development. Nothing breaks either way.

### 3. (Optional but recommended) Set up real file storage

Insurance card photo uploads use [Vercel Blob](https://vercel.com/storage/blob).

1. In your Vercel dashboard → your project → **Storage** tab → **Create Database** → **Blob**
2. Once created, Vercel gives you a `BLOB_READ_WRITE_TOKEN` — copy it
3. Paste it into `.env` as `BLOB_READ_WRITE_TOKEN`

Without this, uploads still work in local development — they just save to
a local `public/uploads` folder instead (dev-only; this doesn't work in
production, since Vercel's deployed filesystem is read-only). Once you
deploy, make sure `BLOB_READ_WRITE_TOKEN` is also added to Vercel's
Environment Variables, same as the other secrets.

### 4. Install, migrate, seed, run

```bash
npm install
npm run db:migrate   # creates the tables
npm run db:seed      # creates demo accounts + sample data
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Demo accounts (also shown on the `/login` page)

| Role | Email | Password |
|---|---|---|
| Patient | `jordan@example.com` | `password123` |
| Provider (Wulaimot) | `provider@wellsidebh.com` | `password123` |

Or register a brand new patient account through the real `/book` flow.

## Deploying live (Vercel)

1. Push this project to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → import that repo
3. In the project's Environment Variables settings, add:
   - `DATABASE_URL` — your Neon connection string
   - `NEXTAUTH_SECRET` — generate a real random one (don't reuse the dev
     placeholder): run `openssl rand -base64 32` locally and paste the
     result
   - `NEXTAUTH_URL` — your deployed URL, e.g. `https://your-app.vercel.app`
   - `RESEND_API_KEY` — your Resend API key, so password reset and
     confirmation emails actually send in production
   - `BLOB_READ_WRITE_TOKEN` — your Vercel Blob token, so insurance card
     uploads work in production
4. Deploy
5. Run the migration once against your production database (you can run
   `npm run db:migrate` locally with `DATABASE_URL` temporarily pointed
   at the same Neon database Vercel is using — Neon databases are
   reachable from anywhere, not just from Vercel)

That's it — real login, real data persistence, live on the internet.

## Pages

**Public**
- `/` — Homepage: hero, trust badges, services, meet Wulaimot, telehealth
  overview, why choose us, our approach to care, insurance, FAQ, footer
- `/book` — Five-step guest booking flow: appointment + patient details,
  payment method, insurance verification (skipped for self-pay), cost
  estimate, account creation. Required fields are enforced before you can
  continue to the next step.
- `/login`, `/register` — Real credential-based sign in / patient sign up
- `/privacy`, `/terms`, `/hipaa` — Legal pages (placeholder content — see
  note below)

**Authenticated**
- `/intake` — Patient-only. Dynamic medical/behavioral history form plus
  three typed-name e-signature consents (HIPAA, telehealth, financial
  responsibility)
- `/portal` — Patient-only. Dashboard (with welcome banner and real
  "patient since" date), appointments, messages, insurance, billing,
  documents, profile, logout
- `/admin` — Provider-only. Dashboard (with welcome banner identifying
  Wulaimot as Founder & CEO) with KPIs, appointment management, patients,
  messaging inbox, clinical (SOAP) notes, insurance, billing, scheduling,
  profile, settings, logout
- `/admin/patients/[id]` — Individual patient record: overview, insurance
  (with a front/back card viewer and verify/reject actions), clinical
  history, signed documents, billing

Route access is enforced by `middleware.ts` based on real session role
(patient vs. provider), not just hidden UI.

## Architecture

- **Auth**: NextAuth (credentials provider), bcrypt-hashed passwords,
  JWT sessions. See `lib/auth.ts` and `middleware.ts`.
- **Data**: `lib/db.ts` — a real async Postgres client (via the
  lightweight `postgres` package), with `lib/schema.sql` as the source
  of truth for the schema. Works with Neon, Supabase, Vercel Postgres, or
  any standard Postgres connection string.
- **Mutations**: `lib/actions.ts` — Next.js Server Actions for
  appointments, messages, profile, insurance, intake, and consent.
- **Design tokens**: `app/globals.css` (CSS custom properties) and
  `tailwind.config.ts`. Teal/mint clinical palette (`--primary`,
  `--accent`, `--muted`), Manrope (semibold) for headings, Inter for body
  text — both self-hosted via `@fontsource` (no external font requests).
- **Motion**: Framer Motion throughout, wrapped in a global
  `MotionConfig` that respects `prefers-reduced-motion`.

## What's now real (as of this update)

- **Password reset** — `/forgot-password` → emailed link → `/reset-password`,
  backed by real time-limited tokens in the database.
- **Transactional email** — via Resend: password resets, appointment
  booking confirmations, provider-confirmed notices, and cancellation
  notices all send real email.
- **Returning-patient rebooking** — `/portal/book` lets an already
  signed-in patient book another appointment without re-entering their
  name, DOB, or password. The original guest `/book` flow is unchanged
  for brand-new patients.
- **Real insurance card uploads** — via Vercel Blob (with a local-disk
  fallback for dev before Blob is configured). Wired into the patient
  portal and the returning-patient booking flow. The admin portal shows
  the actual uploaded photos, not just the typed-in data.
- **Demo accounts are no longer publicly exposed** — the login page's
  demo credential hint only renders in local development, never in a
  production build. `npm run db:retire-demo-accounts` permanently
  removes the seeded demo patients (and all their data) from the
  database when you're ready, without touching the real provider account.

## Known limitations / next phase

- **Insurance verification is manual by design right now** — the admin
  portal has "mark verified / reject" actions instead of an automated
  check. A real-time eligibility API (e.g. Stedi, pVerify) was scoped and
  is ready to wire in once a vendor is chosen and a BAA is signed.
- **No real video visit provider wired up** (e.g. Twilio Video, Daily.co)
  — appointments are scheduled but the actual video session isn't
  implemented.
- **The provider account's password should be rotated to something real**
  once demo accounts are retired — use "Forgot password" on the login
  page for `provider@wellsidebh.com` rather than leaving it on the
  shared demo password.
- **Legal pages are placeholder content.** Privacy Policy, Terms of
  Service, and especially the HIPAA Notice of Privacy Practices need
  review by qualified legal/compliance counsel before real patients see
  them.
