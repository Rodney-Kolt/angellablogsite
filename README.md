# kiro daily ✨

> a dreamy digital scrapbook — daily thoughts, tiny joys, and soft moments 🌸

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/kiro-daily&env=AUTH_SECRET,DATABASE_URL,DIRECT_URL,AUTH_RESEND_KEY,BLOB_READ_WRITE_TOKEN&envDescription=Required%20environment%20variables&envLink=https://github.com/yourusername/kiro-daily%23environment-variables)

---

## ✨ Features

- 🌸 **Dreamy pastel design** — blush pinks, lavender, baby blue
- 🔒 **Diary Lock** — certain posts visible only to signed-in readers
- ✏️ **Rich text editor** (TipTap) with image uploads
- 📸 **Polaroid-style gallery** with lightbox
- 🫧 **Vibe Check reactions** — same, felt that, sending hugs
- 💌 **Handwritten-style comments**
- 🎵 **On Repeat playlist** sidebar
- ⏰ **Time Capsule** — "on this day last year" + random post
- 📱 **Fully responsive** mobile + desktop
- 🔐 **Magic link auth** (email) + GitHub OAuth

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/kiro-daily.git
cd kiro-daily
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.local.example .env.local
```

Then fill in each value (see [Environment Variables](#environment-variables) below).

### 3. Set Up the Database

```bash
# Push schema to your database
npm run db:push

# (Optional) Seed with sample data
npm run db:seed
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🌸

---

## 🗄️ Environment Variables

### DATABASE_URL & DIRECT_URL — Neon PostgreSQL

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Go to **Connection Details** → select **Prisma** from the dropdown
4. Copy the `DATABASE_URL` and `DIRECT_URL` values

```env
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### AUTH_SECRET

Generate a secure random secret:

```bash
openssl rand -base64 32
```

```env
AUTH_SECRET="your-generated-secret"
```

### AUTH_RESEND_KEY — Magic Link Email

1. Go to [resend.com](https://resend.com) and create a free account
2. Go to **API Keys** → Create API Key
3. (Optional) Add and verify your domain for a custom `from` address

```env
AUTH_RESEND_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="noreply@yourdomain.com"
```

> **Note:** Without a verified domain, Resend sends from `onboarding@resend.dev` (fine for testing)

### GITHUB_CLIENT_ID & GITHUB_CLIENT_SECRET (optional)

1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Set **Homepage URL**: `https://yourdomain.vercel.app`
4. Set **Authorization callback URL**: `https://yourdomain.vercel.app/api/auth/callback/github`

```env
GITHUB_CLIENT_ID="your-client-id"
GITHUB_CLIENT_SECRET="your-client-secret"
```

### BLOB_READ_WRITE_TOKEN — Image Uploads

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → **Storage** tab → **Create Database** → **Blob**
3. For local dev: click **`.env.local`** tab and copy the token

```env
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxx"
```

---

## 🌸 Making Yourself the Blog Owner

Sign in with **rodynaine@gmail.com** via magic link — you'll receive an email from Resend. Once signed in, run this in your Neon console (or Prisma Studio):

```sql
UPDATE "User" SET "isOwner" = true WHERE email = 'rodynaine@gmail.com';
```

Or use Prisma Studio locally:

```bash
npm run db:studio
```

Then find your user and set `isOwner` to `true`. After that, you'll see the **write** button in the navbar and can access `/dashboard`.

---

## 🎵 Customizing the Playlist

Edit `lib/playlist.ts` to update the sidebar playlist:

```typescript
export const playlist: Song[] = [
  {
    title: "Your Song",
    artist: "Artist Name",
    spotifyUrl: "https://open.spotify.com/track/...",
    emoji: "🎵",
  },
  // ...
];
```

---

## 🚀 Deploy to Vercel

### Option 1: One-Click Deploy

Click the **Deploy with Vercel** button at the top of this README.

### Option 2: Manual Deploy

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repository
4. Add environment variables in the **Environment Variables** section:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon connection string |
| `DIRECT_URL` | Your Neon direct connection string |
| `AUTH_SECRET` | Random 32-char secret |
| `NEXTAUTH_URL` | `https://yourdomain.vercel.app` |
| `AUTH_RESEND_KEY` | Your Resend API key |
| `EMAIL_FROM` | Your from email |
| `BLOB_READ_WRITE_TOKEN` | Auto-added when you add Blob storage |
| `GITHUB_CLIENT_ID` | (optional) GitHub OAuth |
| `GITHUB_CLIENT_SECRET` | (optional) GitHub OAuth |

5. Click **Deploy** 🚀

### After Deploying

Run migrations on your production database:

```bash
# Set DATABASE_URL to your production Neon URL, then:
npx prisma migrate deploy
```

Or just use `db push` (simpler for solo projects):

```bash
DATABASE_URL="your-production-url" npx prisma db push
```

---

## 📁 Project Structure

```
kiro-daily/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # Auth.js handlers
│   │   └── upload/              # Image upload endpoint
│   ├── archive/                 # All posts archive
│   ├── dashboard/               # Owner dashboard
│   │   ├── new/                 # New post
│   │   └── edit/[id]/           # Edit post
│   ├── login/                   # Sign in page
│   ├── posts/[slug]/            # Individual post
│   ├── profile/                 # User profile
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx                 # Homepage
├── components/
│   ├── blog/                    # Blog-specific components
│   ├── dashboard/               # Dashboard components
│   ├── layout/                  # Navbar, Sidebar
│   ├── profile/                 # Profile components
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── actions.ts               # Server actions
│   ├── playlist.ts              # Editable playlist
│   ├── prisma.ts                # Prisma client
│   └── utils.ts                 # Utilities
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Seed data
├── types/
│   └── next-auth.d.ts           # Type extensions
├── auth.ts                      # Auth.js config
├── middleware.ts                # Route protection
└── tailwind.config.ts           # Tailwind + girly theme
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom girly theme
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Auth**: Auth.js v5 (magic link + GitHub)
- **Editor**: TipTap
- **Images**: Vercel Blob
- **UI**: shadcn/ui components
- **Fonts**: Fredoka One + Quicksand + Caveat
- **Icons**: Lucide React
- **Toasts**: react-hot-toast

---

## 💕 Made with love

*every day is a little story worth telling* 🌸
