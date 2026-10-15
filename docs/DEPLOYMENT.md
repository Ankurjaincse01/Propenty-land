# Deployment Checklist

Target: **Vercel** (Next.js app + API) + **MongoDB Atlas** + **Cloudinary**.

---

## 1. Before you deploy

- [ ] Run `npm run build` locally — it must pass with **0 type errors**.
- [ ] Run `npm run lint` — must be clean.
- [ ] Run `npm test` — all unit tests green.
- [ ] Confirm no secrets are committed. `.env.local` is git-ignored; only
      `.env.example` (placeholders) is tracked.

## 2. Database (MongoDB Atlas)

- [ ] Create a cluster and a database user with a strong password.
- [ ] Restrict **Network Access** to your app's egress (or Vercel IPs / `0.0.0.0/0`
      during setup, then tighten).
- [ ] Copy the SRV connection string into `MONGODB_URI`.

## 3. Cloudinary (recommended for production)

- [ ] Create a Cloudinary account and note the cloud name, API key and API secret.
- [ ] Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- [ ] Never expose the API secret to the client (it is only used server-side in
      `/api/admin/upload`).

## 4. Environment variables (Vercel → Project → Settings → Environment Variables)

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Atlas SRV string |
| `JWT_SECRET` | long random string (`openssl rand -hex 32`) |
| `ADMIN_NAME` | e.g. `Admin` |
| `ADMIN_EMAIL` | the real admin login email |
| `ADMIN_PASSWORD` | a strong password |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` |
| `CLIENT_URL` | `https://your-domain.com` |
| `WHATSAPP_NUMBER` | digits with country code, e.g. `919876543210` |
| `CLOUDINARY_*` | from step 3 (optional) |

## 5. First deploy

- [ ] Push to your Git provider and import the repo in Vercel (framework preset:
      **Next.js**; build `npm run build`, install `npm install`).
- [ ] Deploy.
- [ ] Run the seed **once** against the production database. Either:
      - run `npm run seed` locally with a temporary `.env.local` pointing at the
        production DB (with `ADMIN_*` set), **or**
      - run it from a one-off job/build step. The seed is idempotent for demo data
        and will not overwrite an existing admin.
- [ ] Sign in at `/admin/login` and verify the dashboard loads.

## 6. Post-deploy hardening

- [ ] `JWT_SECRET` is unique per environment and not the example value.
- [ ] Change the seeded admin password (or seed with a strong one and keep it secret).
- [ ] Update **Admin → Site settings** with the real business name, phone, WhatsApp
      number, address and social links (the seed uses placeholders).
- [ ] Add a real logo and replace demo/master-layout imagery.
- [ ] Verify SEO: `robots.txt`, `sitemap.xml` and per-page metadata point at the
      production domain (`NEXT_PUBLIC_SITE_URL`).
- [ ] Enable HTTPS only (Vercel provides it by default; the auth cookie is
      `secure` in production).
- [ ] Set up database backups in Atlas.

## 7. Rate limiting note

The app ships with an **in-memory** fixed-window limiter (`lib/rateLimit.ts`),
which resets on redeploy and is per-instance. For multi-instance/serverless
production, swap it for a **Redis-backed** limiter (e.g. Upstash) behind the same
`rateLimit()` signature.

## 8. Smoke test after deploy

- [ ] `/` loads; featured sections render.
- [ ] `/plots` filters, sorts and paginates.
- [ ] A property page gallery, unit converter and enquiry form work; a new enquiry
      appears in **Admin → Enquiries**.
- [ ] A project page shows the interactive master-layout map with coloured pins.
- [ ] Admin can create/edit a property, place a pin, and upload an image.
- [ ] `GET /api/health` returns `{ success: true }`.

## 9. Rollback

- [ ] Vercel keeps immutable deployments — promote the previous one if needed.
- [ ] Because schema changes are additive, a rollback does not require a DB
      migration.

---

### Custom domain
- [ ] Add the domain in Vercel and point DNS.
- [ ] Update `NEXT_PUBLIC_SITE_URL` and `CLIENT_URL` to the final HTTPS URL and
      redeploy.
