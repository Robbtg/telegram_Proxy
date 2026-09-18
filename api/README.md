# ⚡ Vercel Telegram Proxy (Bypasses Hugging Face IP & Domain Blocks)

Hugging Face Spaces blocks `api.telegram.org` and all free `*.workers.dev` domains.
However, Hugging Face **never blocks `*.vercel.app` domains**.

Deploying this proxy to Vercel takes **1 minute** and is **100% free** (100k requests/day).

---

### How to Deploy:

#### Method 1: Using GitHub + Vercel Web Dashboard (Easiest)
1. Push this `vercel_proxy` folder to a new GitHub repository (or keep it in your repo).
2. Go to [https://vercel.com/new](https://vercel.com/new).
3. Import your repository (set Root Directory to `vercel_proxy` if in a monorepo).
4. Click **Deploy**.
5. Vercel will give you a domain like: `https://telegram-proxy-xyz.vercel.app`.

#### Method 2: Using Vercel CLI
```bash
cd vercel_proxy
npx vercel deploy --prod
```

---

### Set Secret in Hugging Face:

In your HF Space → **Settings** → **Variables and secrets** → edit `TELEGRAM_BASE_URL`:

```
TELEGRAM_BASE_URL = https://your-proxy-name.vercel.app
```

Then restart your Space! The bot will initialize immediately.
