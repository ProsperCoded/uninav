# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Repository Structure

This is a **monorepo wrapper** containing two Git submodules:

```
uninav/
├── uninav-frontend-v2/   # React SPA (Vite + TypeScript)
└── uninav-backend/       # NestJS API (TypeScript + Drizzle ORM)
```

All frontend work happens inside `uninav-frontend-v2/`, all backend work inside `uninav-backend/`. The root repo only tracks submodule refs — commits always go into the submodules, then the root is updated to point to the new SHAs.

**Active branches:**
- Frontend: `dev` is the integration branch; `main` is production. Feature branches (e.g. `clubs`) are merged into `dev`.
- Backend: `dev` is the integration branch; `master` is production.

---

## Frontend (`uninav-frontend-v2`)

### Commands
```bash
cd uninav-frontend-v2
npm install          # install deps
npm run dev          # dev server on :3000
npm run build        # production build
npm run lint         # ESLint
```
No test runner is configured on the frontend.

### Architecture

**Routing** (`src/App.tsx`): React Router v6. Two auth wrappers:
- `ProtectedRoute` — redirects unauthenticated users to `/auth/signin`, storing the attempted path in `localStorage` via `setRedirectPath()`. For `/dashboard/folder/:slug` and `/dashboard/material/:slug` it redirects to the public `/view/*` equivalents instead.
- `AuthRedirect` — wraps auth pages; redirects already-authenticated users away (default to `/home`).

**Route layout:**
- `/` — landing page (unauthenticated) or redirect to `/home`
- `/home` — authenticated hub page (standalone layout, no sidebar)
- `/dashboard/*` — materials dashboard (uses `DashboardLayout` with sidebar)
- `/clubs`, `/clubs/:id`, `/clubs/my` — clubs feed (public browsing; `/my` is protected)
- `/guides` — public guides listing
- `/management/*` — admin/moderator panel
- `/auth/*` — auth flows

**Auth flow** (`src/context/authentication/AuthContextProvider.tsx`):
- Auth state is dual-tracked: `localStorage` (key `uninav_auth_state`) for instant redirects + a live `/auth/check` call to verify the session.
- `useAuth()` hook (`src/hooks/useAuth.ts`) exposes `{ user, logIn, logOut, authInitializing, isLoading, isValidating, setUser, refreshAuthState }`.
- The user profile is fetched via SWR at `/user/profile` only when `loggedIn === true`. `authInitializing` is true until the initial server check completes AND the first profile fetch resolves.
- Post-auth redirects: all sign-in/sign-up flows read `getRedirectPath()` from `localStorage` then fall back to `/home`. `SigninForm` also reads `?redirect=` from the URL (internal paths only).
- `SessionTracker` component (mounted in `App.tsx`) writes the last visited tool path to `sessionStorage` (key `uninav_last_tool`) on every route change.

**API layer** (`src/api/`): All calls use `httpClient` from `src/api/api.ts` — a `redaxios` instance with `baseURL = ENV.API_BASE_URL` and `withCredentials: true` (cookie-based auth). One file per backend module.

**State management:**
- Server state: `@tanstack/react-query` for most data; `swr` for the user profile specifically.
- UI/app state: React Context providers in `src/context/` — `AuthContextProvider`, `BookmarkProvider`, `DepartmentProvider`, `FolderProvider`, `FullscreenContext`.

**Component library:** shadcn/ui (`src/components/ui/`) built on Radix primitives. Icons exclusively from `@hugeicons/core-free-icons` + `@hugeicons/react`. Animations via `framer-motion`.

**Design tokens** (in `tailwind.config.ts`):
- Brand color: `bg-brand` / `text-brand` = `#0410A2`
- Dashboard gradient: `from-[theme(colors.dashboard.gradientFrom)] to-[theme(colors.dashboard.gradientTo)]` = `#DCDFFE` → `#E6FAEE`
- Cards follow the `MetricCard` pattern: `rounded-2xl border bg-white hover:shadow-md` with icons in a `border-brand text-brand` bordered square.

**PWA** (`vite.config.ts`): `vite-plugin-pwa` with `generateSW` strategy. Key rule — `/auth/check` and `/user/bookmarks/*` are `NetworkOnly` (never cache auth or user-specific data). Static assets (fonts, faculty/department reference data, materials, courses) use `StaleWhileRevalidate`.

---

## Backend (`uninav-backend`)

### Commands
```bash
cd uninav-backend
pnpm install         # install deps (uses pnpm)
pnpm run dev         # watch mode on :3000 (or $PORT)
pnpm run build       # compile to dist/

# Database (Drizzle ORM → PostgreSQL)
pnpm run db:generate  # generate migration files
pnpm run db:push      # push schema changes directly (dev)
pnpm run db:migrate   # run migration files
pnpm run db:seed      # seed reference data
pnpm run db:studio    # Drizzle Studio UI

# Tests
pnpm run test              # run all unit tests
pnpm run test:watch        # watch mode
pnpm run test:e2e          # e2e tests
```

Schema lives at `libs/common/src/modules/database/schema/schema.ts` (re-exports all individual schema files). Drizzle config uses `DATABASE_URL_DEV` in development and `DATABASE_URL` in production.

### Architecture

**Framework:** NestJS 10 with standard module/controller/service/repository layering. Each domain follows: `*.module.ts` → `*.controller.ts` → `*.service.ts` → `*.repository.ts`.

**Modules** (`src/modules/`): `auth`, `user`, `material`, `folder`, `courses`, `faculty`, `department`, `blog`, `advert`, `gdrive`, `review`, `notifications`, `management`, `error-reports`.

**Shared library** (`libs/common/src/`):
- `guards/roles.guard.ts` — the single auth guard used on all protected endpoints. JWT is read from `req.cookies.authorization` or `Authorization: Bearer` header.
- `decorators/roles.decorator.ts` — `@Roles([], { strict: false })` makes auth optional (guest access). `@Roles([UserRoleEnum.ADMIN])` requires a specific role. Without `@Roles`, `@UseGuards(RolesGuard)` just requires a valid JWT.
- `dto/response.dto.ts` — all endpoints return `ResponseDto`. Use `ResponseDto.createSuccessResponse()`, `ResponseDto.createErrorResponse()`, or `ResponseDto.createPaginatedResponse()`.
- `exceptions/http-exception-filter.ts` — global filter that normalises all HTTP exceptions into `ResponseDto` error shape.

**Auth:** Cookie-based JWT (30-day expiry). Token is set as `authorization` cookie on login. Google OAuth via Passport + `passport-google-oauth20`. Google One Tap via `google-auth-library`.

**Storage:** iDrive E2 (S3-compatible) via `@aws-sdk/client-s3` for materials/PDFs. Cloudinary for images (blog, ads). Preview generation uses `pdf2pic`.

**Queue:** BullMQ backed by Upstash Redis (`REDIS_URL` env var). Redis is also used for caching via `@nestjs/cache-manager`.

**Email:** MailerSend (`MAILSEND_API_KEY`). Template rendering via EJS.

**Critical controller ordering note:** In NestJS, static route decorators must be declared **before** parameterised ones (`@Get(':id')`) within the same controller, otherwise static paths (e.g. `search`, `by-creator`) are swallowed as slug values.

---

## Environment Variables

**Frontend** (`uninav-frontend-v2/.env`):
- `VITE_API_BASE_URL` — backend URL (e.g. `http://localhost:3200` in dev, `https://uninav-backend-v2.onrender.com` in prod)
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_PUBLIC_POSTHOG_KEY` / `VITE_PUBLIC_POSTHOG_HOST`

**Backend** (`uninav-backend/.env.local` or `.env`): See `src/utils/config/env.enum.ts` for the full list. Key ones: `DATABASE_URL_DEV`, `JWT_SECRET`, `IDRIVE_*`, `CLOUDINARY_*`, `MAILSEND_*`, `REDIS_URL`, `GOOGLE_CLIENT_ID/SECRET`, `FRONTEND_URL`, `ROOT_API_KEY`.

---

## Deployment

- Frontend: Vercel (`uninav.live`). Subdomains `material.`, `club.`, `guide.` are handled by `SubdomainRouter` component which redirects to the correct in-app routes.
- Backend: Render (`uninav-backend-v2.onrender.com` or `api.uninav.live`).
- CORS origins are hardcoded in `uninav-backend/src/utils/config/app.config.ts`.
