# Explore the Unknown — website prototype

Next.js 16 (App Router) site for the "Explore the Unknown" research-discovery concept, with a companion Flask API. The two development servers are started together.

## Toolchain

| Piece | Version | Where it is configured |
| --- | --- | --- |
| Next.js | 16.4.6 | `package.json`, `next.config.js` |
| React | 19 | `package.json` |
| Tailwind CSS | 4.3.4 | `app/globals.css` (`@import "tailwindcss"` + `@config "../tailwind.config.ts"`), `postcss.config.mjs` (`@tailwindcss/postcss` only — Tailwind 4 has no `autoprefixer` entry) |
| ESLint | 10 (flat config) | `eslint.config.mjs`, which spreads `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` |
| TypeScript | 6 | `tsconfig.json` |

`next build` runs its own TypeScript step, so a type error fails the build rather than being reported separately. The shadcn-style primitives under `components/ui/` still read their tokens from `tailwind.config.ts` through the `@config` directive; the CSS entry point, not the config file, is what loads Tailwind 4.

Verify a change with the repository gate (from the repository root):

```bash
./run.sh website     # npm ci once in this directory first
```

This is the same command the `website` job in `.github/workflows/ci.yml` runs. See [`../Docs/RUN_GUIDE.md`](../Docs/RUN_GUIDE.md).


## Pages

- `/` — landing page
- `/chat` — chat interface
- `/discover` — discovery mentor view
- `/methods` — proposed methods (explanatory content)
- `/team` — team page
- `/waitlist` — waitlist signup

## API routes

- Next.js route handlers: `app/api/chat/route.ts`, `app/api/subscribe/route.ts`
- Flask blueprints: `api/index_bp.py`, `api/routes/chat.py`, `api/routes/subscribe.py` (plus `api/chat_inital_version.py`, an older draft)

In development, `next.config.js` rewrites `/api/:path*` to the Flask service; the frontend calls the `/api_ts/:path*` alias for the Next.js route handlers.

## Project layout

- `app/`: App Router pages and route handlers. `app/api/` holds the Next.js handlers; `app/fonts/` holds the local font files.
- `components/`: Shared React components. `components/ui/` holds the shadcn-style primitives; `components/kokonutui/` holds the background component.
- `lib/`: Shared utility helpers.
- `public/`: Static images and served assets.
- `api/`: Flask blueprints and the older `chat_inital_version.py` draft.

## Development

```bash
npm install
npm run dev
```

`npm ci` is the supported install (the lockfile is committed). `npm run dev` starts both servers with `concurrently`:

- Next.js on http://localhost:3000 (`npm run next-dev`)
- Flask on http://localhost:8000 (`npm run flask-dev`)

Python dependencies for the Flask API:

```bash
pip install -r requirements.txt
```

## Environment

The Flask chat route reads `MISTRAL_API_KEY` (see `api/routes/chat.py`). Other integrations (Supabase client, etc.) may require additional keys depending on the feature. Never commit real keys.

This site is a prototype: the `/methods` page and related copy describe the proposed discovery methodology and are not a claim that the computation is implemented in this repository.
