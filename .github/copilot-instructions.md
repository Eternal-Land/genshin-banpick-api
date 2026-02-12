# Genshin Banpick API - Copilot Instructions

## Project Overview

This is a **NestJS** API backend for a Genshin Impact ban/pick management system. It uses **TypeORM** with MySQL, **nestjs-cls** for request context, and follows a modular architecture.

## Tech Stack

- **Framework**: NestJS 11+
- **Language**: TypeScript 5.x
- **Database**: MySQL with TypeORM 0.3.x
- **Authentication**: JWT with bcryptjs
- **Validation**: class-validator + class-transformer
- **API Documentation**: Swagger (@nestjs/swagger)
- **Transaction Management**: typeorm-transactional
- **File Storage**: Cloudinary
- **Context Management**: nestjs-cls

## Project Structure

```
src/
├── main.ts              # Application entry point
├── app.module.ts        # Root module
├── db/                  # Database layer
│   ├── entities/        # TypeORM entities
│   ├── repositories/    # Custom repositories
│   ├── migrations/      # Database migrations
│   ├── seeder/          # Data seeding
│   ├── db.module.ts     # Database module
│   └── db.constants.ts  # Table/column/index naming constants
├── errors/              # Global error classes
├── modules/             # Feature modules
│   ├── admin/           # Admin-specific modules
│   ├── auth/            # Authentication module
│   ├── files/           # File upload module
│   ├── hoyolab/         # HoYoLAB integration
│   ├── self/            # Current user profile
│   └── user/            # User-facing modules
├── providers/           # External service providers
└── utils/               # Shared utilities
    ├── decorators/      # Custom decorators
    ├── dto/             # Shared DTOs
    ├── enums/           # Enumerations
    ├── types/           # TypeScript types
    └── constants/       # App constants
```

## Path Aliases

Use these path aliases defined in `tsconfig.json`:

```typescript
import { ... } from "@utils";        // src/utils
import { ... } from "@utils/*";      // src/utils/*
import { ... } from "@errors";       // src/errors
import { ... } from "@db";           // src/db
import { ... } from "@db/*";         // src/db/*
import { ... } from "@modules/*";    // src/modules/*
import { ... } from "@providers/*";  // src/providers/*
```

## Coding Conventions

### Entity Definitions

- Use `db.constants.ts` for all table, column, and index names
- Always include `createdAt`, `updatedAt`, `createdById`, `updatedById`, `isActive` for trackable entities
- Use explicit column names via `ColumnNames`
- Set `createForeignKeyConstraints: false` on relations to avoid constraint issues

```typescript
import { ColumnNames, IndexNames, TableNames } from "@db/db.constants";

@Entity(TableNames.Character)
export class CharacterEntity {
	@PrimaryGeneratedColumn("increment", { name: ColumnNames.Character.id })
	id: number;

	@Column({ name: ColumnNames.Character.name })
	name: string;

	@Index(IndexNames.Character.isActive)
	@Column({ name: ColumnNames.Global.isActive, default: true })
	isActive: boolean;

	@ManyToOne(() => AccountEntity, { createForeignKeyConstraints: false })
	@JoinColumn({ name: ColumnNames.Global.createdById })
	createdBy: AccountEntity;
}
```

### Repository Pattern

- Extend TypeORM's `Repository` class
- Inject `DataSource` in constructor
- Register in `db.module.ts`

```typescript
@Injectable()
export class CharacterRepository extends Repository<CharacterEntity> {
	constructor(datasource: DataSource) {
		super(CharacterEntity, datasource.createEntityManager());
	}
}
```

### Module Structure

Each feature module follows this structure:

```
module-name/
├── module-name.controller.ts  # HTTP endpoints
├── module-name.service.ts     # Business logic
├── module-name.module.ts      # Module definition
├── index.ts                   # Barrel exports
├── dto/                       # Request/Response DTOs
│   ├── create-*.request.ts
│   ├── update-*.request.ts
│   ├── *.query.ts
│   ├── *.response.ts
│   └── index.ts
└── errors/                    # Module-specific errors
    ├── *.error.ts
    └── index.ts
```

### DTO Patterns

**Request DTOs** - Use class-validator decorators:

```typescript
export class CreateCharacterRequest {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	key: string;

	@ApiProperty({ enum: CharacterElement })
	@IsEnum(CharacterElement)
	element: CharacterElement;
}
```

**Response DTOs** - Use Builder pattern with `fromEntity` static method:

```typescript
export class CharacterResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;

	static fromEntity(entity: CharacterEntity) {
		return Builder(CharacterResponse).id(entity.id).name(entity.name).build();
	}

	static fromEntities(entities: CharacterEntity[]) {
		return entities.map((entity) => this.fromEntity(entity));
	}
}
```

**Query DTOs** - Extend `PaginationQuery` for list endpoints:

```typescript
export class CharacterQuery extends PaginationQuery {
	@ApiProperty({ required: false })
	search?: string;

	@ApiProperty({ required: false, enum: CharacterElement, isArray: true })
	@IsEnum(CharacterElement, { each: true })
	@IsOptional()
	@TransformToNumberArray()
	element?: CharacterElement[];
}
```

### Controller Patterns

```typescript
@Controller("/admin/characters")
@ApiBearerAuth()
export class CharacterController {
	constructor(private readonly characterService: CharacterService) {}

	@Get()
	@RequirePermission("admin.character.list")
	@SwaggerBaseApiResponse(CharacterResponse, { isArray: true })
	async listCharacters(@Query() query: CharacterQuery) {
		const { characters, total } =
			await this.characterService.listCharacters(query);
		return BaseApiResponse.successWithPagination(
			CharacterResponse.fromEntities(characters),
			PaginationDto.from(query.page, query.take, total),
		);
	}

	@Get(":id")
	@RequirePermission("admin.character.detail")
	@SwaggerBaseApiResponse(CharacterResponse)
	async getCharacter(@Param("id", ParseIntPipe) id: number) {
		const character = await this.characterService.getCharacter(id);
		return BaseApiResponse.success(CharacterResponse.fromEntity(character));
	}
}
```

### Service Patterns

- Use `@Transactional()` for write operations
- Access current user via `ClsService<GenshinBanpickCls>`
- Throw custom `ApiError` subclasses for errors

```typescript
@Injectable()
export class CharacterService {
	constructor(
		private readonly characterRepo: CharacterRepository,
		private readonly cls: ClsService<GenshinBanpickCls>,
	) {}

	@Transactional()
	async createCharacter(dto: CreateCharacterRequest) {
		const currentAccountId = this.cls.get("profile.id");

		const character = this.characterRepo.create({
			...dto,
			createdById: currentAccountId,
		});

		return this.characterRepo.save(character);
	}
}
```

### Error Handling

Create module-specific errors extending `ApiError`:

```typescript
import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class CharacterNotFoundError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.CHARACTER_NOT_FOUND,
			message: "Character not found",
			status: 404,
		});
	}
}
```

When adding new errors:

1. Add error code to `src/utils/enums/error-code.ts`
2. Create error class in module's `errors/` folder
3. Export from `errors/index.ts`

### Authentication & Authorization

- All endpoints require authentication by default
- Use `@SkipAuth()` to make an endpoint public
- Use `@RequirePermission("permission.code")` for role-based access
- Admin users bypass permission checks

```typescript
@Post("/public-endpoint")
@SkipAuth()
async publicEndpoint() { ... }

@Post("/admin-only")
@RequirePermission("admin.character.create")
async adminOnlyEndpoint() { ... }
```

### API Response Format

Always use `BaseApiResponse` wrapper:

```typescript
// Success
return BaseApiResponse.success(data);

// Success with pagination
return BaseApiResponse.successWithPagination(
	data,
	PaginationDto.from(page, take, total),
);

// Success with cursor
return BaseApiResponse.successWithCursor(data, nextCursor);
```

### Environment Variables

Access via the `Env` object from `@utils/env`:

```typescript
import { Env } from "@utils";

const port = Env.LISTEN_PORT;
const secret = Env.JWT_AT_SECRET;
```

When adding new env variables:

1. Add to `.env` file
2. Add to `src/utils/env.ts` with proper type coercion

## Database Commands

```bash
# Generate migration
bun run migration:generate

# Run migrations
bun run migration:run

# Seed database
bun run seed
```

## Naming Conventions

| Type         | Convention                     | Example                          |
| ------------ | ------------------------------ | -------------------------------- |
| Entity       | PascalCase + Entity suffix     | `CharacterEntity`                |
| Repository   | PascalCase + Repository suffix | `CharacterRepository`            |
| Controller   | PascalCase + Controller suffix | `CharacterController`            |
| Service      | PascalCase + Service suffix    | `CharacterService`               |
| Module       | PascalCase + Module suffix     | `CharacterModule`                |
| Error        | PascalCase + Error suffix      | `CharacterNotFoundError`         |
| Request DTO  | PascalCase + Request suffix    | `CreateCharacterRequest`         |
| Response DTO | PascalCase + Response suffix   | `CharacterResponse`              |
| Query DTO    | PascalCase + Query suffix      | `CharacterQuery`                 |
| Table names  | snake_case                     | `character`, `account_character` |
| Column names | snake_case                     | `character_name`, `created_at`   |

## Code Style

- Use tabs for indentation
- Use double quotes for strings
- Always use explicit return types for public methods
- Prefer async/await over raw promises
- Use `Builder` pattern from `builder-pattern` for response DTOs
- Use barrel exports (`index.ts`) in each folder
