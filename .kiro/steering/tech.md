# Technology Stack & Build System

## Architecture

UniNav follows a **full-stack TypeScript** architecture with separate backend and frontend applications.

## Backend (uninav-backend)

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT + Passport.js (Google OAuth, local auth)
- **File Storage**: Idrive e2 (S3-compatible) with AWS SDK v3
- **Email**: Multi-provider system (Resend, Gmail/Nodemailer, MailerSend, Brevo)
- **Validation**: Class Validator with whitelist approach
- **Security**: Helmet.js, CORS, bcrypt password hashing
- **Testing**: Jest for unit and e2e tests
- **Logging**: Pino for high-performance logging

### Backend Commands

```bash
# Development
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm start:prod            # Start production server

# Database
pnpm run db:generate       # Generate Drizzle migrations
pnpm run db:push          # Push schema to database
pnpm run db:migrate       # Run migrations
pnpm run db:studio        # Open Drizzle Studio
pnpm run db:seed          # Seed initial data

# Testing & Quality
pnpm test                  # Run unit tests
pnpm run test:e2e         # Run e2e tests
pnpm run test:cov         # Generate coverage report
pnpm lint                  # ESLint with auto-fix
pnpm format               # Prettier formatting
```

## Frontend (uninav-frontend-v2)

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC
- **UI Library**: Radix UI + shadcn/ui components
- **Styling**: Tailwind CSS with custom animations
- **State Management**: TanStack Query + SWR for server state
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router DOM
- **Authentication**: Google OAuth integration
- **PDF Handling**: react-pdf, pdfjs-dist, docx-preview

### Frontend Commands

```bash
# Development
pnpm dev                   # Start development server (port 3000)
pnpm build                 # Production build
pnpm build:dev            # Development build
pnpm preview              # Preview production build
pnpm lint                 # ESLint check
```

## Development Requirements

- **Node.js**: v22.16.0+
- **Package Manager**: pnpm v10.14.0+
- **Database**: PostgreSQL
- **Cloud Storage**: Idrive e2 account

## Code Quality Standards

- **TypeScript**: Strict typing enabled
- **ESLint**: Configured for both backend and frontend
- **Prettier**: Consistent code formatting
- **Testing**: Jest for backend, component testing for frontend
- **Git Hooks**: Pre-commit linting and formatting

## Environment Configuration

Both applications use `.env` files for configuration. Check `.env-example` files for required variables including database connections, API keys, and cloud storage credentials.
