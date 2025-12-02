# UniNav AI Coding Agent Instructions

**UniNav** is a university study materials platform with a NestJS backend, React TypeScript frontend, and PostgreSQL database. Students upload and share academic resources organized by Faculty > Department > Course hierarchy.

## Architecture Overview

**Monorepo Structure:**
- `uninav-backend/` - NestJS API with Drizzle ORM, Idrive e2 storage, multi-provider email system
- `uninav-frontend-v2/` - Vite + React 18 + TypeScript + Tailwind + shadcn/ui components
- Shared domain concepts: Faculty → Department → Course → Materials/Collections

**Key Integration Points:**
- Backend serves `/api` endpoints, frontend calls via `httpClient` (redaxios with `withCredentials: true`)
- JWT auth with cookie sessions - frontend checks `isClientAuthenticated()` before SWR profile fetch
- File storage: Idrive e2 with presigned URLs for secure access to study materials, blog images, ads
- Email: 4-provider fallback system (Resend → Gmail → MailerSend → Brevo) with EJS templates

## Frontend Patterns

**Auth Flow:** 
- `AuthContextProvider` wraps app, manages `loggedIn` state + user profile via SWR
- `<ProtectedRoute>` guards dashboard/management, `<AuthRedirect>` redirects authed users from login pages
- Google One Tap integration with `@react-oauth/google` for seamless signin

**Data Layer:**
- `src/api/*.api.ts` - typed wrappers that normalize errors to `{statusCode, message}` objects
- SWR for singleton auth/profile data, React Query for list/mutation flows (QueryClient configured but underutilized)
- `httpClient` from `src/api/api.ts` handles baseURL from `VITE_API_BASE_URL` env var

**Routing:**
- Nested routes: `/dashboard/*` (student features) and `/management/*` (admin/moderator features)  
- Layout components (`DashboardLayout`, `ManagementLayout`) own structural chrome
- Route-level components in `src/pages/` compose hooks + presentational components

**State Management:**
- Context only for cross-cutting concerns (auth, departments, bookmarks, fullscreen)
- Avoid global state - prefer React Query cache invalidation for data mutations
- Loading states via `authInitializing` - don't add ad-hoc spinners

## Backend Patterns

**Module Organization:**
- Feature modules: `auth`, `user`, `material`, `course`, `blog`, `collection`, `advert`, `review`, `management`, `notifications`
- Each module follows NestJS conventions: controller → service → repository (Drizzle queries)
- Common utilities in `@app/common` library with shared database schema

**Database & Storage:**
- Drizzle ORM with PostgreSQL - schema in `libs/common/src/modules/database/schema/`
- Migrations via `pnpm run db:generate` → `pnpm run db:push` workflow
- File uploads to Idrive e2 buckets: `uninav-docs` (materials), `uninav-media` (images), `uninav-blogs` (content)

**Security:**
- JWT tokens with refresh mechanism, bcrypt + pepper for passwords
- Helmet.js security headers, CORS restricted to authorized domains
- File upload validation, presigned URLs for secure file access
- Role-based access: Student → Moderator → Admin hierarchy

## Development Workflow

**Frontend:**
```bash
cd uninav-frontend-v2
pnpm dev                    # Start Vite dev server
pnpm build                  # Production build
pnpm lint                   # ESLint with flat config
```

**Backend:**
```bash
cd uninav-backend  
pnpm dev                    # NestJS watch mode
pnpm run db:generate        # Generate Drizzle migrations
pnpm run db:push           # Push schema to database
pnpm run db:studio         # Open Drizzle Studio
pnpm run db:seed           # Seed initial data
```

**Required Environment Variables:**
- Frontend: `VITE_API_BASE_URL`, `VITE_GOOGLE_CLIENT_ID`
- Backend: Database URLs, Idrive e2 credentials, email provider keys, JWT secrets

## Code Conventions

**Error Handling:**
- API functions must normalize errors: `throw {statusCode: error.response?.status || 500, message: ...}`
- Use `toast` (sonner) for user-facing errors, avoid leaking raw axios errors
- Frontend components handle normalized error objects from API layer

**Styling:**
- Use `cn()` utility from `src/lib/utils.ts` for conditional Tailwind classes
- Follow existing shadcn/ui + Radix primitive patterns
- Maintain design consistency - reference existing components before creating new ones

**Data Mutations:**
- Invalidate React Query cache on successful mutations: `queryClient.invalidateQueries(['key'])`
- For auth state changes, call `refreshAuthState()` from context to trigger SWR revalidation
- Prefer optimistic updates for better UX

## File Structure Examples

**Adding a new feature (e.g., Announcements):**
1. Backend: Create `src/modules/announcements/` with controller, service, entities
2. Add route to `app.module.ts` imports
3. Frontend: Add API wrapper in `src/api/announcements.api.ts`
4. Create React Query hook in `src/hooks/useAnnouncements.ts`
5. Add page component in `src/pages/dashboard/Announcements.tsx`
6. Update routing in `App.tsx` under protected routes

**Key Files to Reference:**
- Auth patterns: `src/context/authentication/AuthContextProvider.tsx`
- API integration: `src/api/auth.api.ts`, `src/api/api.ts`
- Layout structure: `src/layouts/DashboardLayout.tsx`
- Backend module example: `uninav-backend/src/modules/user/`
- Database schema: `uninav-backend/libs/common/src/modules/database/schema/`

This codebase emphasizes structured data organization, secure file handling, and progressive role-based access. Follow existing patterns for consistency and leverage the established auth/data flow architecture.