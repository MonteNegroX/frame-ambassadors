# FRAME OS — Ambassador Waitlist

**Live at:** [waitlist.frameonx.xyz](https://waitlist.frameonx.xyz)  
**Status:** Production — 130+ ambassadors registered

A gamified ambassador waitlist for the FRAME OS / Ambassador Platform. Users authenticate via Twitter (Privy), complete social tasks to earn points, climb a leaderboard, and receive a shareable Identity Card (OG image).

## Features

- **Privy Auth** — Twitter/X OAuth login with embedded Solana wallet creation
- **Social Tasks** — Follow @frameonx, quote a target tweet → **Local AI Verification (QVAC)** → points awarded
- **Referral System** — Unique referral link per user; referrals add bonus points
- **Leaderboard** — Real-time ranking with Frame Score, regional breakdown
- **Identity Card** — Personalized 1200×630px OG image generated per user (`/api/og`)
- **Share Modal** — Copy identity card to clipboard, share on X

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript, TailwindCSS) |
| Auth | Privy (`@privy-io/react-auth`, `@privy-io/server-auth`) |
| Database | Supabase PostgreSQL via Prisma ORM + `pg` pool |
| OG Images | `@vercel/og` (Satori) with IBMPlexMono font |
| AI Oracle | **QVAC Local AI** (Qwen3-600M LLM via @qvac/sdk) |
| Hosting | Vercel |

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the AI Verification Server:**
   ```bash
   node qvac-server.mjs
   ```
   *Wait for `✅ Model ready!` (requires ~1GB free RAM).*

3. **Start the Next.js app:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

### Required Environment Variables

```env
NEXT_PUBLIC_PRIVY_APP_ID=
PRIVY_APP_SECRET=
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_QVAC_URL=http://localhost:3001
```

## Key Files

| File | Purpose |
|------|---------|
| `qvac-server.mjs` | **Local AI Inference Server** (handles tweet moderation) |
| `app/api/qvac/verify/route.ts` | AI moderation proxy + tweet scraper |
| `app/page.tsx` | Landing + waitlist entry (LandingContent) |
| `app/dashboard/page.tsx` | User dashboard (BentoDashboard) |
| `app/leaderboard/page.tsx` | Full leaderboard |
| `app/api/og/route.tsx` | Identity Card OG image generation |
| `lib/auth.ts` | Privy server-side session verification |
| `lib/prisma.ts` | Prisma + pg.Pool adapter |
| `lib/actions/user.ts` | Server actions: award points after AI verification |
| `components/BentoDashboard.tsx` | Main dashboard with social task buttons |
| `components/ShareImageModal.tsx` | Copy-to-clipboard + tweet share modal |

## Administration Utilities

Scripts in `scratch/` for Privy ↔ Supabase sync issues.

### 1. Find missing users
Users who logged in via Privy but didn't reach the dashboard and weren't saved to Supabase:

```bash
npx tsx scratch/find-missing-users.ts
```

Output saved to `scratch/missing-users.json`.

### 2. Manual user sync
Force-sync a specific user by Privy ID:

```bash
npx tsx scratch/manual-sync.ts did:privy:YOUR_USER_ID
```

Fetches Twitter data from Privy and writes to the `users` table.

## Design System

- **Color palette**: Black & Gold (#FFD507), Zinc/Slate accents
- **Typography**: IBMPlexMono (cinematic/tech aesthetic)
- **OG Image**: 1200×630px, safe zone 1000×520px, symmetrical Identity Hub layout
