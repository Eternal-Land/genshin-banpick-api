# genshin-banpick-api

A NestJS REST API backend for a Genshin Impact ban/pick management system. It handles match sessions with ban/pick mechanics, character and weapon management, user authentication with JWT, role-based access control, real-time communication via WebSockets (Socket.IO), HoYoLAB integration, file uploads via Cloudinary, and scheduled background jobs.

## Tech Stack

- TypeScript

## Frameworks and Libraries

- NestJS 11
- TypeORM 0.3
- MySQL (mysql2)
- typeorm-transactional
- nestjs-cls
- Socket.IO (@nestjs/websockets, @nestjs/platform-socket.io)
- @nestjs/schedule (Cron Jobs)
- JWT (jsonwebtoken)
- bcryptjs
- class-validator
- class-transformer
- @nestjs/swagger (Swagger/OpenAPI)
- Cloudinary
- helmet
- cookie-parser
- dayjs
- builder-pattern
- dotenv
- @faker-js/faker (dev)
- Jest (testing)
- ESLint + Prettier
- Husky + lint-staged
- Commitlint

## Project Structure

| Name | Type | Path | Description |
| ---- | ---- | ---- | ----------- |
| **src** | `folder` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src` | Main source directory containing all application code. |
| **main.ts** | `file` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/main.ts` | Application entry point. Bootstraps the NestJS app, configures CORS, global pipes (ValidationPipe), exception filters, Swagger docs, helmet security, cookie-parser, and starts listening on the configured port. |
| **app.module.ts** | `file` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/app.module.ts` | Root NestJS module. Imports all feature modules (auth, admin, user, socket, etc.), sets up the global AuthGuard, and configures the nestjs-cls context middleware globally. |
| **db** | `folder` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/db` | Database layer. Contains TypeORM entities, custom repositories, migration files, a data seeder, the DataSource configuration (datasource.ts), the DbModule, and db.constants.ts for centralized table/column/index naming. |
| **db/entities** | `folder` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/db/entities` | TypeORM entity definitions for all database tables: Account, Character, Weapon, Match, MatchSession, MatchState, BanPickSlot, CharacterCost, CharacterLevelCost, WeaponCost, CostMilestone, SessionCost, AccountCharacter, StaffRole, StaffRolePermission, Permission, and Notification. |
| **db/repositories** | `folder` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/db/repositories` | Custom TypeORM repository classes (one per entity), each extending Repository<T> and injected with DataSource. Registered in DbModule for use across feature modules. |
| **db/seeder** | `folder` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/db/seeder` | Database seeding scripts used to populate initial data (e.g., admin accounts, permissions). Run via `bun run seed`. |
| **modules** | `folder` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/modules` | Feature modules directory. Organized into admin, user, and shared modules. |
| **modules/auth** | `folder` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/modules/auth` | Authentication module. Handles login, JWT token issuance/validation, and the global AuthGuard. Provides @SkipAuth() and @RequirePermission() decorators for access control. |
| **modules/admin** | `folder` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/modules/admin` | Admin-facing feature modules: character, weapon, staff, role, permission, cost-milestone, character-cost, character-level-cost, weapon-cost, and user management. |
| **modules/user** | `folder` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/modules/user` | User-facing feature modules: character listing, weapon listing, match session management, user profile, and session-cost tracking. |
| **modules/self** | `folder` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/modules/self` | Module for the currently authenticated user to view and manage their own profile data. |
| **modules/account-character** | `folder` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/modules/account-character` | Module for managing the association between user accounts and their owned/selected Genshin Impact characters. |
| **modules/files** | `folder` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/modules/files` | File upload module. Handles uploading assets to Cloudinary. |
| **modules/hoyolab** | `folder` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/modules/hoyolab` | HoYoLAB integration module. Communicates with the official HoYoLAB public API (e.g., for game data retrieval). |
| **modules/socket** | `folder` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/modules/socket` | WebSocket module using Socket.IO. Contains the main gateway (socket.gateway.ts), a socket-specific auth guard, exception filter, and sub-services for real-time match/ban-pick event handling. |
| **modules/notification** | `folder` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/modules/notification` | Notification module for creating and managing in-app notifications pushed to users. |
| **modules/cron** | `folder` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/modules/cron` | Scheduled task (cron job) module using @nestjs/schedule. Handles periodic background operations. |
| **providers** | `folder` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/providers` | Third-party service provider wrappers. Currently contains a Google provider with an OAuth2 sub-module. |
| **providers/google** | `folder` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/providers/google` | Google service provider module, including an OAuth2 sub-module for Google-based authentication flows. |
| **errors** | `folder` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/errors` | Global error definitions. Contains the base ApiError class and ApiValidationError. All module-specific errors extend ApiError. |
| **utils** | `folder` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/utils` | Shared utilities including env.ts (typed environment variables via Env object), genshin-banpick-cls.ts (CLS context type), my-exception.filter.ts (global exception filter), plus sub-folders for decorators, DTOs, enums, types, and constants. |
| **utils/env.ts** | `file` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/utils/env.ts` | Exports the typed Env object for accessing all environment variables throughout the application. Must be updated when new env variables are added. |
| **utils/genshin-banpick-cls.ts** | `file` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/utils/genshin-banpick-cls.ts` | Defines the typed CLS (continuation-local storage) context shape used by nestjs-cls to carry per-request data such as the current authenticated user profile. |
| **utils/my-exception.filter.ts** | `file` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/src/utils/my-exception.filter.ts` | Global NestJS exception filter that catches all errors (including ApiError subclasses) and formats them into a standardized API error response. |
| **.env.example** | `file` | `C:/Works/Personal/genshin-banpick/genshin-banpick-api/.env.example` | Template for the required .env file. Covers server port, CORS origins, database credentials, JWT secrets, cookie settings, Cloudinary credentials, and HoYoLAB API configuration. |

## Scripts

| Name | Description |
| ---- | ----------- |
| `build` | Compiles the NestJS application using the Nest CLI (`nest build`), outputting to the /dist directory. |
| `start` | Starts the application in production mode using the Nest CLI (`nest start`). |
| `start:dev` | Starts the application in development watch mode (`nest start --watch`). Recommended for local development. |
| `start:debug` | Starts the application in debug + watch mode with the Node.js inspector enabled. |
| `start:prod` | Runs the compiled production build directly via Node.js (`node dist/main`). Used in the Docker container. |
| `lint` | Runs ESLint on all TypeScript files in the src/ directory to report linting errors. |
| `lint:fix` | Runs ESLint with the --fix flag to automatically fix linting issues in src/. |
| `prettier` | Checks code formatting of all src/**/*.ts files using Prettier without modifying them. |
| `prettier:fix` | Applies Prettier formatting to all src/**/*.ts files in-place. |
| `prepare` | Installs Husky git hooks. Runs automatically after `bun install`. |
| `test` | Runs the Jest unit test suite. |
| `test:watch` | Runs Jest in interactive watch mode. |
| `test:cov` | Runs Jest and generates a code coverage report in the /coverage directory. |
| `test:debug` | Runs Jest with the Node.js debugger attached, useful for stepping through tests. |
| `test:e2e` | Runs end-to-end tests using the Jest config at ./test/jest-e2e.json. |
| `migration:generate` | Generates a new TypeORM migration file by diffing the current entities against the database schema. Outputs to src/db/migrations/. |
| `migration:run` | Runs all pending TypeORM migrations against the configured database. |
| `seed` | Executes the database seeder script (src/db/seeder/index.ts) to populate initial data such as admin accounts and permissions. |

## Configurations

| Name | Description |
| ---- | ----------- |
| `tsconfig.json` | Root TypeScript configuration. Sets compilation target to ES2021, enables decorator metadata and experimental decorators (required by NestJS/TypeORM), configures path aliases (@utils, @errors, @db, @modules/*, @providers/*) for clean imports, and outputs to /dist. |
| `tsconfig.build.json` | Extends tsconfig.json for production builds. Excludes node_modules, test files, dist, and spec files to produce a clean build artifact. |
| `nest-cli.json` | NestJS CLI configuration. Sets the source root to src/ and enables deleteOutDir to clean the /dist folder before each build. |
| `docker-compose.yaml` | Docker Compose configuration for local development. Spins up a MySQL 8.0 database container (genshin_banpick_mysql) with a persistent volume (genshin_banpick_db_vol) and a dedicated bridge network (genshin_banpick_net). DB credentials and port are sourced from .env. |
| `Dockerfile` | Multi-stage Docker build for the API. The builder stage installs dependencies with Bun and compiles the app. The runner stage creates a lean production image that runs the compiled output via Node.js. |
| `.env.example` | Documents all required environment variables: LISTEN_PORT, CORS_ORIGINS, DB_* (MySQL connection), JWT_AT_SECRET/JWT_AT_EXPIRATION, COOKIE_DOMAIN/COOKIE_SECURE, ENABLE_SWAGGER, ADMIN_EMAIL/ADMIN_PASSWORD, CLOUDINARY_*, and HOYOLAB_*. |
| `.eslintrc.js` | ESLint configuration. Uses @typescript-eslint parser, extends recommended TypeScript and Prettier rules, and relaxes some strict rules (no-explicit-any, no-unused-vars, explicit-function-return-type) for developer convenience. |
| `.prettierrc` | Prettier code style configuration. Enforces tabs for indentation, double quotes, trailing commas, semicolons, and arrow function parentheses. |
| `.commitlintrc.cjs` | Commitlint configuration enforcing Conventional Commits format. Restricts commit types to: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert. Max header length is 100 characters. |
| `changelog.config.js` | Changelog generation configuration for git-cz (commitizen). Defines commit type labels and emoji mappings used when composing commits interactively. |
