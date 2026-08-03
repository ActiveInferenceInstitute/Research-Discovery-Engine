# Explore the Unknown — website prototype

Next.js 14 (App Router) site for the "Explore the Unknown" research-discovery concept, with a companion Flask API. The two development servers are started together.

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

## Development

```bash
npm install
npm run dev
```

`npm run dev` starts both servers with `concurrently`:

- Next.js on http://localhost:3000 (`npm run next-dev`)
- Flask on http://localhost:8000 (`npm run flask-dev`)

Python dependencies for the Flask API:

```bash
pip install -r requirements.txt
```

## Environment

The Flask chat route reads `MISTRAL_API_KEY` (see `api/routes/chat.py`). Other integrations (Supabase client, etc.) may require additional keys depending on the feature. Never commit real keys.

This site is a prototype: the `/methods` page and related copy describe the proposed discovery methodology and are not a claim that the computation is implemented in this repository.
