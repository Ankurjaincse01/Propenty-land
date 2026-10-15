# GreenLand Estates — Premium Plot Selling Website

A production-ready full-stack website for an Indian property dealer to showcase
residential & commercial plots, run an interactive township master-layout map,
capture enquiries, and manage everything from a built-in admin dashboard.

Built with **Next.js 14 (App Router) + TypeScript + MongoDB (Mongoose)**.

---

## Features

### Public website
- **Home** — hero, quick search, featured plots/projects, process timeline, trust section.
- **Plots explorer** (`/plots`) — search + filter by city, type, status, facing, budget and
  area; sort by price/area/newest; pagination; shareable URL query state.
- **Property detail** (`/properties/[slug]`) — image gallery with lightbox, **interactive
  area unit converter** (sq.ft / sq.yd (gaj) / sq.m / guntha / acre), Indian price
  formatting (`₹18.50 Lakhs`, `₹1.25 Cr`), plot facing, corner-plot & road-width details,
  amenities, approvals (only when real data exists), landmarks, location map, and an
  enquiry form + WhatsApp / call CTAs.
- **Projects** (`/projects`, `/projects/[slug]`) — plotted developments with an
  **Interactive Township Master Layout Map**: zoom/pan the master layout, status-coloured
  plot pins, status filter pills, and a plot-inspector drawer with price, unit conversion
  and 1-click WhatsApp.
- **About, Contact, FAQ, Privacy, Terms**, custom 404, `sitemap.xml`, `robots.txt`.

### Admin dashboard (`/admin`)
- JWT auth (HttpOnly cookie **and** Bearer/localStorage flow).
- Dashboard with live counts and recent activity.
- Full CRUD for **properties** and **projects**, including an
  **admin plot-pin picker** to place each plot on the project's master layout image.
- **Enquiries** inbox: search/filter, follow-up status pipeline, internal notes,
  call/WhatsApp shortcuts.
- **Site settings**: business name, phone, WhatsApp, address, social links, SEO defaults.
- Cloudinary image uploads with reorder/alt text (graceful local fallback).

---

## Tech Stack

| Layer     | Choice |
|-----------|--------|
| Framework | Next.js 14 (App Router, Route Handlers) |
| Language  | TypeScript |
| Styling   | Tailwind CSS (custom forest/navy/gold design tokens) |
| Forms     | React Hook Form + Zod |
| Database  | MongoDB + Mongoose |
| Auth      | JWT (`jsonwebtoken`) + `bcryptjs` |
| Images    | Cloudinary (`cloudinary`) with local data-URI fallback |
| Maps      | React Leaflet / Leaflet |
| Icons     | lucide-react |
| Toasts    | react-hot-toast |
| Tests     | Node built-in test runner via `tsx` |

---

## Getting Started

### 1. Prerequisites
- Node.js 18.18+ (tested on Node 20 / 24)
- A MongoDB database (local or MongoDB Atlas)

### 2. Install
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env.local   # Windows: copy .env.example .env.local
```
Then edit `.env.local`:

| Variable | Required | Notes |
|----------|----------|-------|
| `MONGODB_URI` | ✅ | Mongo connection string |
| `JWT_SECRET` | ✅ | long random string (`openssl rand -hex 32`) |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | ✅ (for seed) | first admin created by `npm run seed` |
| `NEXT_PUBLIC_SITE_URL` | recommended | used for metadata/sitemap |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | optional | leave blank for local data-URI uploads |
| `WHATSAPP_NUMBER` | optional | digits only, with country code |

> Cloudinary is optional. Without it, uploaded images are stored as inline data
> URIs — fine for local demos, **not** for production volume. Configure Cloudinary
> before going live.

### 4. Seed demo data
```bash
npm run seed
```
Creates a settings document, one admin (from `.env.local`), **2 demo projects** and
**8 demo plots** with realistic layout coordinates. All listings are clearly marked
`[Demo …]` / `isDemo: true` and never invent RERA/DTCP/NA numbers or testimonials.

Re-running the seed clears only `isDemo` content and recreates it, so your own
listings are preserved.

### 5. Run
```bash
npm run dev      # http://localhost:3000
```
Admin: **http://localhost:3000/admin/login** (use the seeded credentials).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (type-checks) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (`next/core-web-vitals`) |
| `npm test` | Unit tests (validation, utils, auth) |
| `npm run test:integration` | End-to-end API tests (spins up an in-memory MongoDB) |
| `npm run seed` | Seed admin + demo projects/plots + settings |

### Testing

- `npm test` runs fast unit tests (no database needed).
- `npm run test:integration` boots an **in-memory MongoDB** (`mongodb-memory-server`),
  then calls the real route handlers to verify auth, CRUD, filtering, pagination,
  enquiries and the dashboard. The first run downloads a `mongod` binary, so it needs
  a network connection once.

### Troubleshooting

- **`Cannot find module for page: /_document` or missing `vendor-chunks/*` during build**
  — this happens when `next dev` and `next build` write to the same `.next` folder at
  the same time (or a previous Next process is still running). Stop the dev server (and
  any stray `node` processes) before running `npm run build`. A clean rebuild fixes it:
  `Remove-Item -Recurse -Force .next` (PowerShell) then `npm run build`.

---

## Project Structure

```
app/
  (site)/            # Public pages (own Navbar/Footer shell)
  admin/             # Admin dashboard (login, dashboard, CRUD pages)
  api/               # Route handlers (public + /api/admin)
  globals.css
components/
  admin/             # AdminShell, forms, ImageUploader, PlotPinPicker
  forms/             # EnquiryForm
  home/              # Home page sections
  layout/            # Navbar, Footer, FloatingWhatsApp
  map/               # Leaflet map wrappers
  plots/             # PlotsExplorer
  projects/          # InteractivePlotMap
  ui/                # PropertyCard, gallery, pagination, converter, etc.
lib/                 # utils, http, auth, validation, mongoose, cloudinary, api
middleware/          # requireAdmin / requireRole guards
models/              # Property, Project, Enquiry, Admin, SiteSettings
scripts/seed.ts      # Demo seed
tests/               # Unit tests
```

---

## Documentation

- [API reference](docs/API.md)
- [Deployment checklist](docs/DEPLOYMENT.md)

---

## Notes on data integrity

- Prices are formatted using the Indian numbering system (Lakhs/Crores).
- Area units: `sq.ft`, `sq.yd` (gaj), `sq.m`, `guntha`, `acre` (conversion base = sq.ft).
- Approval strings, testimonials and legal identifiers are **rendered only when real
  data is present** — nothing is fabricated.
- The seeded WhatsApp number is a placeholder (`91XXXXXXXXXX`); replace it in
  **Admin → Site settings** with the real business number.
