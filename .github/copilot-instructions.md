# Genshin Banpick API - Copilot Instructions

## Project Overview

This is a NestJS-based API for the Genshin Banpick application. It uses TypeORM for database management with MySQL, JWT for authentication, and follows a modular architecture with role-based access control (RBAC).

## Tech Stack

- **Framework**: NestJS (v11)
- **Database**: MySQL with TypeORM (v0.3.28)
- **Authentication**: JWT (jsonwebtoken)
- **Runtime**: Node.js with TypeScript
- **Package Manager**: Bun
- **Validation**: class-validator + class-transformer
- **API Documentation**: Swagger/OpenAPI
- **File Storage**: Cloudinary
- **Security**: Helmet, bcryptjs
- **Context Management**: nestjs-cls (ClsModule)

## Project Structure

### Path Aliases

- `@db`: `src/db` - Database entities, repositories, and configurations
- `@modules`: `src/modules` - Feature modules
- `@utils`: `src/utils` - Utilities, decorators, DTOs, enums
- `@errors`: `src/errors` - Error definitions
- `@providers`: `src/providers` - Third-party service integrations

### Module Organization

Each module follows this structure:

```
@modules/
  feature-name/
    feature-name.module.ts
    feature-name.service.ts
    feature-name.controller.ts
    index.ts (exports module, service, controller)
    dto/
      *.request.ts (input DTOs)
      *.response.ts (output DTOs)
      index.ts
    errors/
      *.error.ts (module-specific errors)
      index.ts
```

## Core Patterns & Conventions

### 1. Authentication & Authorization

**Global Authentication**:

- `AuthGuard` is registered globally via `APP_GUARD` in `app.module.ts`
- All routes require authentication by default
- Use `@SkipAuth()` decorator to bypass authentication

**Skip Authentication**:

```typescript
@Get('public')
@SkipAuth()
async getPublicData() {
  // No auth required
}
```

**Permission-Based Authorization**:

```typescript
@Get()
@RequirePermission('admin.staff.list')
async listStaff() {
  // Only accounts with this permission can access
}
```

**Permission Codes**: Defined in `@utils/constants/permissions.ts` as `PERMISSIONS_MAP`

**Account Roles**:

- `ADMIN`: Super admin with all permissions
- `STAFF`: Staff with role-based permissions
- `USER`: Regular user

### 2. Error Handling

**Custom Errors**: All errors must extend `ApiError` class:

```typescript
export class SampleError extends ApiError<DataType> {
	constructor(data?: DataType) {
		super({
			code: ErrorCode.SAMPLE_ERROR,
			message: "Sample Error!",
			detail: data,
			status: 400, // HTTP status code
		});
	}
}
```

**Error Codes**: Define in `@utils/enums/error-code.ts`

**Global Exception Filter**: `MyExceptionFilter` catches all errors and formats responses

### 3. API Response Format

**Success Response**:

```typescript
return BaseApiResponse.success(data, pagination);
```

**Error Response** (handled by exception filter):

```typescript
throw new SampleError(detail);
```

**Response Structure**:

```typescript
{
  code: ErrorCode,
  message: string,
  data?: T,
  error?: any,
  pagination?: PaginationDto
}
```

### 4. Swagger Documentation

**Controller-Level**:

```typescript
@Controller("/admin/staffs")
@ApiBearerAuth() // Require bearer token
export class StaffController {}
```

**Endpoint-Level**:

```typescript
@Get()
@SwaggerBaseApiResponse(StaffResponse, { isArray: true })
async listStaff() {}
```

### 5. Database Entities

**Entity Naming Convention**:

- File: `{name}.entity.ts`
- Class: `{Name}Entity`
- Table name: Use `TableNames` from `@db/db.constants`
- Column names: Use `ColumnNames` from `@db/db.constants`

**Entity Example**:

```typescript
@Entity(TableNames.Sample)
export class SampleEntity {
	@PrimaryGeneratedColumn("uuid", { name: ColumnNames.Sample.id })
	id: string;

	@Column({ name: ColumnNames.Sample.name })
	name: string;

	@CreateDateColumn({ name: ColumnNames.Global.createdAt })
	createdAt: Date;

	@Column({ name: ColumnNames.Global.createdById, nullable: true })
	createdById: string;

	@ManyToOne(() => AccountEntity, {
		createForeignKeyConstraints: false,
		nullable: true,
	})
	@JoinColumn({ name: ColumnNames.Global.createdById })
	createdBy: AccountEntity;
}
```

**Export Entity**: Add to `@db/entities/index.ts`

**Migration Commands**:

```bash
npm run migration:generate  # Generate migration
npm run migration:run       # Apply migration
```

### 6. Repositories

**Create Repository**:

```typescript
// sample.repository.ts
@Injectable()
export class SampleRepository extends Repository<SampleEntity> {
	constructor(private dataSource: DataSource) {
		super(SampleEntity, dataSource.createEntityManager());
	}
}
```

**Export & Register**:

1. Export in `@db/repositories/index.ts`
2. Add to `providers` in `@db/db.module.ts`

### 7. DTOs

**Request DTO** (validation):

```typescript
export class CreateSampleRequest {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsEmail()
	email: string;

	@IsOptional()
	@IsString()
	description?: string;
}
```

**Response DTO** (transformation):

```typescript
export class SampleResponse {
	id: string;
	name: string;
	createdAt: Date;

	static fromEntity(entity: SampleEntity): SampleResponse {
		return {
			id: entity.id,
			name: entity.name,
			createdAt: entity.createdAt,
		};
	}

	static fromEntities(entities: SampleEntity[]): SampleResponse[] {
		return entities.map((e) => this.fromEntity(e));
	}
}
```

### 8. Services

**Service Pattern**:

```typescript
@Injectable()
export class SampleService {
	constructor(
		private readonly sampleRepo: SampleRepository,
		private readonly cls: ClsService<GenshinBanpickCls>,
	) {}

	async create(dto: CreateSampleRequest) {
		const profile = this.cls.get("profile"); // Current user

		const sample = this.sampleRepo.create({
			...dto,
			createdById: profile.id,
		});

		return await this.sampleRepo.save(sample);
	}
}
```

### 9. Controllers

**Controller Pattern**:

```typescript
@Controller("/samples")
@ApiBearerAuth()
export class SampleController {
	constructor(private readonly sampleService: SampleService) {}

	@Get()
	@RequirePermission("sample.list")
	@SwaggerBaseApiResponse(SampleResponse, { isArray: true })
	async list() {
		const samples = await this.sampleService.list();
		return BaseApiResponse.success(SampleResponse.fromEntities(samples));
	}

	@Post()
	@RequirePermission("sample.create")
	@SwaggerBaseApiResponse(SampleResponse)
	async create(@Body() dto: CreateSampleRequest) {
		const sample = await this.sampleService.create(dto);
		return BaseApiResponse.success(SampleResponse.fromEntity(sample));
	}

	@Put(":id")
	@RequirePermission("sample.update")
	@SwaggerBaseApiResponse(SampleResponse)
	async update(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() dto: UpdateSampleRequest,
	) {
		const sample = await this.sampleService.update(id, dto);
		return BaseApiResponse.success(SampleResponse.fromEntity(sample));
	}
}
```

### 10. Environment Variables

**Add New Variable**:

1. Add to `.env` file
2. Add to `Env` object in `@utils/env.ts`:

```typescript
export const Env = {
	NEW_VAR: process.env.NEW_VAR || "",
	// or for numbers:
	NEW_NUMBER: Number(process.env.NEW_NUMBER || "0"),
	// or for booleans:
	NEW_BOOL: process.env.NEW_BOOL === "true",
} as const;
```

### 11. Current User Context

Access current authenticated user via CLS:

```typescript
constructor(private readonly cls: ClsService<GenshinBanpickCls>) {}

async someMethod() {
  const profile = this.cls.get('profile'); // ProfileResponse
  // profile.id, profile.email, profile.role, etc.
}
```

## Development Commands

```bash
bun install              # Install dependencies
bun run start:dev        # Start in watch mode
bun run build            # Build for production
bun run start:prod       # Start production build
bun run lint             # Lint code
bun run lint:fix         # Fix linting issues
bun run prettier         # Check formatting
bun run prettier:fix     # Fix formatting
bun run migration:generate  # Generate migration
bun run migration:run    # Run migrations
```

## Creating New Features

### Step-by-Step Guide

1. **Define Entity** (if needed):
   - Create `{name}.entity.ts` in `@db/entities`
   - Use `TableNames` and `ColumnNames`
   - Export in `@db/entities/index.ts`
   - Run migration commands

2. **Create Repository** (if needed):
   - Create `{name}.repository.ts` in `@db/repositories`
   - Extend `Repository<EntityType>`
   - Export in `@db/repositories/index.ts`
   - Register in `@db/db.module.ts`

3. **Create Module**:
   - Create folder in `@modules/{feature-name}`
   - Create `{feature-name}.module.ts`
   - Create `{feature-name}.service.ts`
   - Create `{feature-name}.controller.ts`
   - Create `index.ts` with exports

4. **Define DTOs**:
   - Create `dto/` folder
   - Add `*.request.ts` for inputs (with validation)
   - Add `*.response.ts` for outputs (with fromEntity methods)
   - Export in `dto/index.ts`

5. **Define Errors** (if needed):
   - Create `errors/` folder
   - Add `*.error.ts` extending `ApiError`
   - Add error code to `@utils/enums/error-code.ts`
   - Export in `errors/index.ts`

6. **Add Permissions** (if needed):
   - Add to `PERMISSIONS_MAP` in `@utils/constants/permissions.ts`
   - Use `@RequirePermission()` decorator in controller

7. **Register Module**:
   - Import in `app.module.ts`

## Best Practices

1. **Always use path aliases** (`@db`, `@modules`, `@utils`, `@errors`, `@providers`)
2. **Use DTOs for validation and transformation** (separate request/response)
3. **Extend ApiError for custom errors** with proper error codes
4. **Use BaseApiResponse.success()** for all successful responses
5. **Apply @ApiBearerAuth()** on protected controllers
6. **Use @SwaggerBaseApiResponse()** for proper API documentation
7. **Use CLS context** to access current user instead of passing through parameters
8. **Follow naming conventions**: entities end with `Entity`, DTOs with `Request`/`Response`
9. **Use builder-pattern** for complex object construction
10. **Export all public items** through `index.ts` files
11. **Use ParseUUIDPipe** for UUID parameters
12. **Keep services thin** - business logic in services, not controllers
13. **Use proper HTTP status codes** in error definitions

## Security Notes

- All routes are protected by default (AuthGuard is global)
- JWT tokens are validated on every request
- Passwords are hashed with bcryptjs (10 rounds)
- CORS is enabled for all origins (configure for production)
- Helmet is configured for security headers
- Admin account is auto-created on first run

## API Documentation

Access Swagger UI at `/api/docs` when `ENABLE_SWAGGER=true`

## Notes

- This project uses Bun as package manager
- MySQL is the primary database
- TypeORM is configured for automatic entity discovery
- Global validation pipe transforms and validates all inputs
- Global exception filter handles all errors consistently
