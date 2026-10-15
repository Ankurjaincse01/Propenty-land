# API Reference

Base URL: `/api`

All responses use a consistent envelope:

```jsonc
// success
{ "success": true, "data": <...>, "meta": { "page": 1, "limit": 12, "total": 8, "totalPages": 1 } }

// error
{ "success": false, "message": "Human readable message", "error": "…only in non-production…" }
```

Authentication (admin routes only): send the JWT either as
`Authorization: Bearer <token>` **or** rely on the HttpOnly `gl_token` cookie set at login.

---

## Public endpoints

### `GET /api/health`
Liveness probe. → `{ success: true, message: "API is healthy" }`

### `GET /api/properties`
Paginated, filterable list of plots.

| Query | Type | Notes |
|-------|------|-------|
| `search` | string | matches title, plot number, locality, city |
| `city` | string | exact (case-insensitive); `all` ignored |
| `propertyType` | `Residential` \| `Commercial` | `all` ignored |
| `status` | `Available` \| `Reserved` \| `Sold` | `all` ignored |
| `facing` | string | e.g. `East` |
| `project` | ObjectId | filter to a project |
| `featured` | `true` | only featured listings |
| `minPrice` / `maxPrice` | number | price range (₹) |
| `minArea` / `maxArea` | number | area range |
| `sort` | `newest` \| `price-asc` \| `price-desc` \| `area-asc` \| `area-desc` | default `newest` |
| `page` | number | default `1` |
| `limit` | number | default `12`, max `60` |

### `GET /api/properties/[slug]`
Single plot by slug, with up to 3 related plots. `404` when not found.

### `GET /api/projects`
All projects (newest first).

### `GET /api/projects/[slug]`
Single project plus its child plots.

### `GET /api/settings`
Public site settings (business name, phone, WhatsApp, address, socials, SEO defaults).

### `POST /api/enquiries`
Create an enquiry. Rate-limited per IP (8 requests / 10 minutes).

```jsonc
{
  "customerName": "Ravi Kumar",
  "phone": "+91 98765 43210",
  "email": "ravi@example.com",          // optional
  "property": "<ObjectId|null>",         // optional
  "project": "<ObjectId|null>",          // optional
  "preferredVisitDate": "2026-11-02",    // optional
  "message": "Please share the price and site-visit slots.",
  "source": "Property Page"              // Property Page|Project Page|Contact Page|Quick Callback|WhatsApp
}
```
→ `201` with the created enquiry. `422` on validation errors, `429` when rate-limited.

---

## Admin endpoints

All admin endpoints require a valid JWT (see above) and return `401`/`403` otherwise.

### Auth
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/admin/auth/login` | `{ email, password }` → sets cookie, returns `{ token, admin }` (rate-limited: 10 attempts / 15 min per IP) |
| `POST` | `/api/admin/auth/logout` | Clears the auth cookie |
| `GET`  | `/api/admin/auth/me` | Current admin profile |

### Dashboard
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/admin/dashboard/stats` | Counts (`totalProperties`, `available`, `reserved`, `sold`, `totalProjects`, `totalEnquiries`, `newEnquiries`) + `recentEnquiries`, `recentProperties` |

### Properties
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/admin/properties` | List; supports `search`, `status`, `propertyType`, `page`, `limit`; `project` populated |
| `POST` | `/api/admin/properties` | Create (validated by `propertySchema`), `201` |
| `GET` | `/api/admin/properties/[id]` | Single property (`project` populated) |
| `PUT` | `/api/admin/properties/[id]` | Partial update (validated) |
| `DELETE` | `/api/admin/properties/[id]` | Delete + clean up now-unused Cloudinary assets |

Property body highlights: `title`, `slug` (auto), `plotNumber`, `description`,
`propertyType`, `project`, `price`, `priceDisplay`, `area`, `areaUnit`, `dimensions`,
`facing`, `isCornerPlot`, `roadWidthFt`, `boundaryWall`, `zoning`, `location`,
`coordinates`, `landmarks`, `images`, `layoutPlanUrl`, **`layoutPosition`**, `amenities`,
`approvals`, `status`, `featured`, `isDemo`, `seo`.

`layoutPosition` places a plot on its project's master layout image (percentage coords):

```jsonc
"layoutPosition": { "x": 24, "y": 32, "polygonPoints": null }  // x/y ∈ [0..100]
```

### Projects
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/admin/projects` | List all projects |
| `POST` | `/api/admin/projects` | Create, `201` |
| `GET` | `/api/admin/projects/[id]` | `{ project, plotCount }` |
| `PUT` | `/api/admin/projects/[id]` | Partial update |
| `DELETE` | `/api/admin/projects/[id]` | Delete; `409` if plots are still linked |

Notable project fields: `name`, `slug` (auto), `description`, `location`,
`coordinates`, `images`, **`masterLayoutImage`**, `amenities`, `plotSizeRange`,
`startingPrice`, `totalPlots`, `projectStatus`, `featured`, `isDemo`.

### Enquiries (admin)
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/admin/enquiries` | List; supports `search`, `status`, `page`, `limit`; `property`/`project` populated |
| `PATCH` | `/api/admin/enquiries/[id]` | Update `followUpStatus` and/or append `note` |
| `DELETE` | `/api/admin/enquiries/[id]` | Delete |

`followUpStatus` ∈ `New` \| `Contacted` \| `Site Visit Scheduled` \| `Qualified` \| `Closed`.

### Settings
| Method | Path | Description |
|--------|------|-------------|
| `PUT` | `/api/admin/settings` | Update the singleton settings (validated by `settingsSchema`) |

### Uploads
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/admin/upload` | `{ file: "<data URI or remote URL>", folder? }` → `{ url, publicId, width?, height? }` |
| `DELETE` | `/api/admin/upload/[publicId]` | Delete an image from Cloudinary |

Accepted types: JPEG, PNG, WebP, AVIF. Max size 6 MB. When Cloudinary is not
configured the file is returned unchanged (data URI) so the app still works locally.

---

## Status codes

| Code | Meaning |
|------|---------|
| `200` | OK |
| `201` | Created |
| `400` | Bad request / invalid id |
| `401` | Unauthorized (missing/expired token) |
| `403` | Forbidden (role) |
| `404` | Not found |
| `409` | Conflict (e.g. delete project with linked plots) |
| `422` | Validation failed (see field errors) |
| `429` | Rate limited |
| `500` | Unexpected error |
