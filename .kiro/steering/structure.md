# Project Structure & Organization

## Repository Layout

```
uninav/
├── uninav-backend/          # NestJS API server
├── uninav-frontend-v2/      # React frontend application
├── uninav-pitch-videos/     # Marketing materials
├── docs/                    # Documentation
├── scripts/                 # Utility scripts
└── README.md               # Main project overview
```

## Backend Structure (uninav-backend/)

```
uninav-backend/
├── src/
│   ├── modules/            # Feature modules (users, materials, auth, etc.)
│   ├── common/             # Shared utilities, guards, decorators
│   ├── config/             # Configuration files
│   ├── database/           # Database schema and migrations
│   ├── scripts/            # Database seeding and utility scripts
│   └── main.ts            # Application entry point
├── libs/
│   └── common/            # Shared library code
├── migrations/            # Drizzle database migrations
├── test/                  # E2E tests
├── dist/                  # Compiled output
└── temp/                  # Temporary files
```

### Backend Module Organization

- **Feature-based modules**: Each domain (users, materials, blogs, etc.) has its own module
- **Common library**: Shared code in `libs/common/` for reusable components
- **Path aliases**: Use `src/*` and `@app/common` imports configured in tsconfig

## Frontend Structure (uninav-frontend-v2/)

```
uninav-frontend-v2/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui base components
│   │   └── custom/        # Project-specific components
│   ├── pages/             # Route components
│   │   ├── auth/          # Authentication pages
│   │   ├── management/    # Admin/moderator pages
│   │   └── student/       # Student-facing pages
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and configurations
│   ├── types/             # TypeScript type definitions
│   └── assets/            # Static assets
├── public/                # Public static files
└── dist/                  # Build output
```

### Frontend Conventions

- **Component organization**: UI components in `components/ui/`, custom components in `components/custom/`
- **Page routing**: Pages organized by user role and feature area
- **Path aliases**: Use `@/` prefix for src imports (configured in vite.config.ts)
- **Styling**: Tailwind CSS with component-level styles

## Configuration Files

- **Backend**: `nest-cli.json`, `drizzle.config.ts`, `tsconfig.json`
- **Frontend**: `vite.config.ts`, `tailwind.config.ts`, `components.json`
- **Shared**: `.env` files, `package.json`, ESLint/Prettier configs

## Development Workflow

1. **Backend first**: API endpoints and database schema
2. **Frontend integration**: UI components consuming backend APIs
3. **Feature modules**: Self-contained modules with clear boundaries
4. **Testing**: Unit tests for backend, component tests for frontend

## File Naming Conventions

- **Backend**: kebab-case for files, PascalCase for classes
- **Frontend**: kebab-case for files, PascalCase for components
- **Database**: snake_case for table/column names
- **API routes**: kebab-case with RESTful conventions

## Import Organization

- **External libraries** first
- **Internal modules** by relative path depth
- **Type imports** separated when possible
- **Path aliases** preferred over relative imports
