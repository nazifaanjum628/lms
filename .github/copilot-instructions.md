# Copilot Workspace Instructions

This repository contains a small learning-management system split into two independent Node projects:
- `client/` — React 19 + Vite frontend
- `server/` — Express 5 backend with MongoDB, Clerk auth, Stripe, Cloudinary, and webhook handling

## Key project conventions

- There is no root `package.json`; package management is per-subproject.
- `client/` is the UI app and uses Vite, Tailwind, React Router, and Clerk.
- `server/` is the API app, built with Express, Mongoose, Clerk middleware, Stripe checkout/webhooks, and Cloudinary uploads.
- `.gitignore` ignores `node_modules` and `.env` files.

## How to run

### Frontend
```bash
cd client
npm install
npm run dev
```

Build production assets:
```bash
cd client
npm run build
```

### Backend
```bash
cd server
npm install
npm run server
```

The backend listens on `PORT` or `5000`.

## Important environment variables

### Backend (`server/`)
- `MONGODB_URI`
- `CLOUDINARY_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_SECRET_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `CLERK_WEBHOOKS_SECRET`
- `CURRENCY`
- `PORT`

### Frontend (`client/`)
- `VITE_BACKEND_URL`
- `VITE_CURRENCY`
- `VITE_CLERK_PUBLISHABLE_KEY`

## Useful file locations

- `client/src/main.jsx` — Clerk provider and publishable key injection
- `client/src/context/AppContext.jsx` — backend API URL, auth token handling, and app data fetching
- `server/server.js` — Express entrypoint and route wiring
- `server/configs/mongodb.js` — MongoDB connection
- `server/configs/cloudinary.js` — Cloudinary config
- `server/controller/` — business logic for courses, educators, users, and webhooks
- `server/routes/` — API route definitions and auth protections
- `server/middlewares/authMiddleware.js` — educator role protection

## What to avoid

- Do not add secrets or actual `.env` values to the repo.
- Do not assume a shared root package manager or monorepo tooling.
- Do not treat `client/README.md` as authoritative; it is the default Vite starter README.
- Do not change backend routes without updating client API paths if the frontend depends on them.

## Agent guidance

When making changes:
- Prefer targeted edits inside `client/` for UI and frontend behavior.
- Prefer targeted edits inside `server/` for API, auth, payments, or database logic.
- Validate changes by starting the corresponding app and checking the relevant route or page.

## Example prompts

- "Update the `client/` login flow so Clerk auth errors show a toast message instead of failing silently."
- "Add server-side validation to `server/routes/educatorRoutes.js` and return proper 400 responses for missing course fields."
- "Fix the Stripe webhook handler in `server/controller/webhooks.js` to safely handle missing metadata."

If you need to make broader workspace guidance later, create a separate `AGENTS.md` or expand these instructions with section-specific rules for `client/` and `server/`.