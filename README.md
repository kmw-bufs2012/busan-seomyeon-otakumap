# busan-seomyeon-otakumap

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_uJ5GHiT7f6yUAuCdgBjg4hXnTmQh)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## NAVER Maps (NCP) setup — REQUIRED for `/map`

The map page (`/map`) loads the NAVER Cloud Platform Maps SDK. Two things must
be configured or you will see a "지도를 불러올 수 없습니다 / Failed to load the
map" error in the UI plus an `authFailure` log in the browser console.

### 1. Vercel environment variable

Vercel → Project → Settings → Environment Variables → **Add New**:

| Name                          | Value                              |
| ----------------------------- | ---------------------------------- |
| `VITE_NAVER_MAP_CLIENT_ID`    | Your NCP Maps **API Key ID** (Client ID for Web Dynamic Map) |

After saving, redeploy: Deployments → ⋯ → **Redeploy**. Vite env vars are
inlined at build time, so a `.env.local` file alone never reaches production.

For local dev, create `.env.local` in the repo root:

```bash
VITE_NAVER_MAP_CLIENT_ID=your_ncp_key_id_here
```

### 2. NCP console — register every domain that calls the SDK

NCP console → Maps → Application → **Web 서비스 URL**. Add ALL of:

```
https://anibus.org
https://www.anibus.org
http://localhost:3000
http://localhost:8080
```

(plus any preview domains, e.g. `https://*-yourteam.vercel.app`).
Changes can take **5–10 minutes** to propagate. If the key or any of these
domains is wrong, the SDK calls `window.navermap_authFailure()` and the page
shows the localized "map_error" message.

### How the loader detects failures

`src/components/map/useNaverMapsLoader.ts` installs a
`window.navermap_authFailure` callback that flips loader state to `error` and
logs `[v0] NAVER Maps auth failure …`. The script URL uses the **post-2024**
parameter `ncpKeyId` — do not use the deprecated `ncpClientId`.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

<a href="https://v0.app/chat/api/kiro/clone/kmw-bufs2012/busan-seomyeon-otakumap" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>
