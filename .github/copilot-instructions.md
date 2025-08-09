# **UniNav - University Study Materials Platform**

## **🏗️ Architecture & Core Patterns**

**NestJS Backend with Drizzle ORM** - Modular architecture using feature-based modules (`auth`, `material`, `faculty`, `department`, etc.). All database operations go through repository pattern with Drizzle ORM and PostgreSQL.

**Key Dependency Injection Symbols:**

- `DRIZZLE_SYMBOL` - Database connection (see `src/utils/config/constants.config.ts`)
- `JWT_SYMBOL` - JWT service for authentication

**Module Structure Pattern:**

```
modules/
  feature-name/
    feature.module.ts     # NestJS module definition
    feature.service.ts    # Business logic
    feature.repository.ts # Database operations
    feature.controller.ts # HTTP endpoints
    dto/                  # Data transfer objects
```

**Event-Driven Architecture** - Uses `@nestjs/event-emitter` for decoupled communication (see `src/utils/events/event.listener.ts` for email notifications, user registration events).

## **🔑 Essential Developer Commands**

```bash
# Backend Development
pnpm dev                    # Start with watch mode
pnpm db:generate           # Generate Drizzle migrations
pnpm db:push              # Push schema to database
pnpm db:seed              # Seed database with test data
pnpm update-course-codes  # Run course code update script

# Database Operations
pnpm db:migrate           # Apply migrations
pnpm db:drop             # Drop database
```

## **📊 Database & ORM Patterns**

**Drizzle ORM Setup** - Database connection configured in `DrizzleModule` with connection pooling and SSL. Schema files are in `src/modules/drizzle/schema/` and re-exported through `schema.ts`.

**Repository Pattern** - All database access goes through repositories that inject `DRIZZLE_SYMBOL`. Example:

```typescript
@Injectable()
export class MaterialRepository {
  constructor(@Inject(DRIZZLE_SYMBOL) private readonly db: DrizzleDB) {}
}
```

**Schema Organization** - Each feature has its own schema file (e.g., `user.schema.ts`, `material.schema.ts`) with relationships defined using Drizzle relations.

## **🔐 Authentication & Authorization**

**JWT + Cookie-based Auth** - Uses dual token strategy: cookies for web clients, Authorization header for sessions. Auth guard checks both (`src/guards/authorization.guard.ts`).

**Role-based Access** - `UserRoleEnum` includes `ADMIN`, `MODERATOR`, `USER`. Auto-approval logic for admin/moderator content submissions.

**Email Verification Flow** - Event-driven email verification using Gmail API via `EventsListeners`.

## **📁 File Storage & External Services**

**AWS S3-compatible (B2) Storage** - `StorageService` handles file uploads to different buckets (`uninav-media`, `uninav-docs`, `uninav-blogs`). Pre-signed URLs for secure access.

**Google APIs Integration** - Gmail for transactional emails, Google Drive API for file storage (legacy/alternative).

## **⚡ Key Development Patterns**

**Environment Configuration** - Uses `ENV` enum for type-safe environment variables. Different database URLs for dev/prod.

**Logging Strategy** - Module-specific loggers (e.g., `materialLogger`) in each feature module.

**Error Handling** - Consistent use of NestJS exceptions (`BadRequestException`, `NotFoundException`, etc.) with descriptive messages.

**Validation** - `class-validator` and `class-transformer` for DTO validation and transformation.

**Cache Control** - Global `CacheControlInterceptor` for HTTP caching headers.

## **🛠️ Package Manager & Dependencies**

**Always use pnpm** - This project uses pnpm workspace. Never use npm or yarn.

**Critical Dependencies:**

- `drizzle-orm` + `drizzle-kit` for database operations
- `@aws-sdk/client-s3` for file storage
- `@nestjs/event-emitter` for event-driven architecture
- `googleapis` for Google integrations
- `bcryptjs` for password hashing
- `moment-timezone` for date handling

## **🔄 Development Workflow**

1. **Schema Changes**: Modify schema files → `pnpm db:generate` → `pnpm db:push`
2. **New Features**: Create module with service/repository/controller pattern
3. **File Uploads**: Use `StorageService` with appropriate bucket constants
4. **Email Notifications**: Emit events that `EventsListeners` handles
5. **Authentication**: Use `AuthorizationGuard` and `RolesGuard` decorators
