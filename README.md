# FRAME OS — Ambassador Waitlist

**Live at:** [waitlist.frameonx.xyz](https://waitlist.frameonx.xyz)  
**Status:** Production — 130+ ambassadors registered

A gamified ambassador waitlist for the FRAME OS / Ambassador Platform. Users authenticate via Twitter (Privy), complete social tasks to earn points, climb a leaderboard, and receive a shareable Identity Card (OG image).

## Features

- **Privy Auth** — Twitter/X OAuth login with embedded Solana wallet creation
- **Social Tasks** — Follow @frameonx, quote a target tweet → verified via Composio/Twitter API → points awarded
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
| Social Verification | Composio API → Twitter API v2 |
| Hosting | Vercel |

## Local Development

```bash
cd waitlist
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Required Environment Variables

```env
NEXT_PUBLIC_PRIVY_APP_ID=
PRIVY_APP_SECRET=
DATABASE_URL=
DIRECT_URL=
COMPOSIO_API_KEY=
COMPOSIO_ENTITY_ID=
COMPOSIO_CONNECTION_ID=
```

## Key Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Landing + waitlist entry (LandingContent) |
| `app/dashboard/page.tsx` | User dashboard (BentoDashboard) |
| `app/leaderboard/page.tsx` | Full leaderboard |
| `app/api/og/route.tsx` | Identity Card OG image generation |
| `lib/auth.ts` | Privy server-side session verification |
| `lib/prisma.ts` | Prisma + pg.Pool adapter |
| `lib/actions/user.ts` | Server actions: sync user, verify tasks, award points |
| `components/BentoDashboard.tsx` | Main dashboard bento grid |
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
