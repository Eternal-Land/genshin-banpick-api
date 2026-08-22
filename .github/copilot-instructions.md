# genshin-banpick-api

The current codebase is a NestJS backend for a Genshin Impact ban/pick management system. It includes admin tooling, user-facing session flows, JWT auth, permission checks, Socket.IO event streams, MySQL persistence via TypeORM, Cloudinary uploads, and scheduled background jobs.

## Current architecture snapshot

- App entry: `src/main.ts`
  - Sets `process.env.TZ = "UTC"`
  - Registers a global `/api` prefix
  - Configures CORS from `Env.CORS_ORIGINS`
  - Applies `ValidationPipe` with `ApiValidationError`
  - Uses `MyExceptionFilter`
  - Enables Swagger when `ENABLE_SWAGGER=true`
  - Adds cookie parsing and Helmet
  - Starts listening on `Env.LISTEN_PORT`

- Root module: `src/app.module.ts`
  - Imports `DbModule`, `ClsModule`, `AuthModule`, and all feature modules
  - Registers a global `APP_GUARD` based on `AuthGuard`
  - Includes current feature groups for admin, user, socket, notification, cron, self, files, and Hoyolab

- Database layer: `src/db`
  - `DbModule` registers `TypeOrmModule` using `datasource` and `addTransactionalDataSource`
  - Repositories are provided globally through the module
  - Entities include match/session state, character/weapon cost records, notifications, account data, permissions, and team/session cost models

## Tech stack

- TypeScript
- NestJS 11
- TypeORM 0.3
- MySQL via `mysql2`
- `typeorm-transactional`
- `nestjs-cls`
- Socket.IO (`@nestjs/websockets`, `@nestjs/platform-socket.io`)
- `@nestjs/schedule`
- JWT (`jsonwebtoken`)
- `bcryptjs`
- `class-validator` and `class-transformer`
- `@nestjs/swagger`
- Cloudinary
- `helmet`
- `cookie-parser`
- `dayjs`
- `builder-pattern`
- `dotenv`
- Jest + Supertest
- ESLint + Prettier
- Husky + lint-staged
- Commitlint

## Actual project structure

```text
src/
├── app.module.ts
├── main.ts
├── db/
│   ├── datasource.ts
│   ├── db.module.ts
│   ├── db.constants.ts
│   ├── entities/
│   │   ├── account.entity.ts
│   │   ├── account-character.entity.ts
│   │   ├── ban-pick-slot.entity.ts
│   │   ├── character.entity.ts
│   │   ├── character-cost.entity.ts
│   │   ├── character-level-cost.entity.ts
│   │   ├── cost-milestone.entity.ts
│   │   ├── match.entity.ts
│   │   ├── match-session.entity.ts
│   │   ├── match-state.entity.ts
│   │   ├── notification.entity.ts
│   │   ├── permission.entity.ts
│   │   ├── session-cost.entity.ts
│   │   ├── session-record.entity.ts
│   │   ├── staff-role.entity.ts
│   │   ├── staff-role-permission.entity.ts
│   │   ├── team-cost.entity.ts
│   │   ├── weapon.entity.ts
│   │   └── weapon-cost.entity.ts
│   ├── migrations/
│   ├── repositories/
│   ├── seeder/
│   └── index.ts
├── errors/
│   ├── api-error.ts
│   ├── api-validation-error.ts
│   └── index.ts
├── modules/
│   ├── account-character/
│   ├── admin/
│   │   ├── character/
│   │   ├── character-cost/
│   │   ├── character-level-cost/
│   │   ├── cost-milestone/
│   │   ├── permission/
│   │   ├── role/
│   │   ├── staff/
│   │   ├── users/
│   │   ├── weapon/
│   │   └── weapon-cost/
│   ├── auth/
│   ├── cron/
│   ├── files/
│   ├── hoyolab/
│   ├── notification/
│   ├── self/
│   ├── socket/
│   └── user/
│       ├── character/
│       ├── character-cost/
│       ├── match/
│       ├── session-cost/
│       ├── session-record/
│       ├── session-state/
│       ├── user/
│       ├── weapon/
│       └── weapon-cost/
├── providers/
│   └── google/
├── utils/
│   ├── constants/
│   ├── decorators/
│   ├── dto/
│   ├── entities/
│   ├── enums/
│   ├── env.ts
│   ├── genshin-banpick-cls.ts
│   ├── index.ts
│   ├── my-exception.filter.ts
│   └── types/
└── ...
```

## Feature responsibilities

- `auth`: JWT authentication and protected-route enforcement
- `admin`: CRUD and management for characters, weapons, costs, permissions, roles, staff, and user administration
- `user`: user profile, match/session logic, character and weapon ownership, session costs, session records, and session state flows
- `account-character`: account-to-character ownership/selection association layer
- `socket`: WebSocket gateway and realtime event handling for game/session events
- `notification`: in-app notification creation and delivery
- `cron`: scheduled tasks through `@nestjs/schedule`
- `files`: Cloudinary-based upload handling
- `hoyolab`: integration with HoYoLAB public endpoints
- `self`: authenticated-user profile and self-service endpoints

## Environment and config

The runtime config lives in `src/utils/env.ts`. The app expects values such as:

- `LISTEN_PORT`
- `CORS_ORIGINS`
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_LOGGING`
- `ENABLE_SWAGGER`
- `JWT_AT_SECRET`, `JWT_AT_EXPIRATION`
- `COOKIE_DOMAIN`, `COOKIE_SECURE`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `HOYOLAB_BASE_URL`, `HOYOLAB_LANGUAGE`

The repository uses `.env.example` as the template for local setup.

## Scripts in the current repo

These are the active scripts from `package.json`:

- `npm run build`
- `npm run start`
- `npm run start:dev`
- `npm run start:debug`
- `npm run start:prod`
- `npm run lint`
- `npm run lint:fix`
- `npm run prettier`
- `npm run prettier:fix`
- `npm run prepare`
- `npm run test`
- `npm run test:watch`
- `npm run test:cov`
- `npm run test:debug`
- `npm run test:e2e`
- `npm run migration:generate`
- `npm run migration:run`
- `npm run seed`

Note: this repo is configured for `npm`/Node-based workflows rather than Bun, even though the older docs mentioned Bun in places.

## Build and code conventions

- TypeScript target: ES2021
- Decorators enabled via `experimentalDecorators` and `emitDecoratorMetadata`
- Path aliases configured in `tsconfig.json`:
  - `@utils`, `@utils/*`
  - `@errors`
  - `@db`, `@db/*`
  - `@modules/*`
  - `@providers/*`
- Global validation is done with `ValidationPipe`
- Errors are centralized through `ApiError` and `ApiValidationError`
- Request-scoped context is supported through `nestjs-cls`
- The project uses a global auth guard and explicit permission checks via decorators or guard logic

## Important repo notes

- The project is currently organized as a feature-first API backend rather than a generic template.
- `README.md` still contains some template-style documentation and should not be treated as the source of truth for the current implementation.
- The most reliable references for current work are:
  - `src/app.module.ts`
  - `src/main.ts`
  - `src/db/db.module.ts`
  - `src/utils/env.ts`
  - `package.json`
  - the actual feature folders under `src/modules` and `src/db`
