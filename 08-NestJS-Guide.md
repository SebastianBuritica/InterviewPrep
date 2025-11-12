# NestJS Interview Preparation Guide

## What is NestJS?

**Theory**: Progressive Node.js framework for building scalable server-side applications. Built with TypeScript, uses Express/Fastify under the hood, adds structure and patterns on top.

**Key Philosophy**: Angular-inspired architecture with clear separation of concerns.

**Why NestJS exists**: Express is flexible but unstructured. Large applications need conventions for organizing code, handling dependencies, and managing cross-cutting concerns. NestJS provides this structure.

**When to use**: Large applications, team projects, need testability/maintainability, TypeScript-first development, enterprise applications.

---

## Decorators - Foundation of NestJS

**Theory**: TypeScript features that add metadata to classes, methods, and parameters. They tell NestJS what each piece of code is and how to use it.

**Types**:

**Class Decorators**:
- `@Module()` - Organizes related features
- `@Controller()` - Handles HTTP requests
- `@Injectable()` - Can be injected as dependency

**Method Decorators**:
- `@Get()`, `@Post()` - Define routes
- `@UseGuards()`, `@UseInterceptors()` - Apply middleware-like features

**Parameter Decorators**:
- `@Param()`, `@Query()`, `@Body()`, `@Headers()` - Extract request data

**How they connect to route handlers**:
```
Request: GET /users/123

NestJS reads decorators:
1. @Controller('users') → Find UsersController
2. @Get(':id') → Match getUser() method
3. @Param('id') → Extract '123'
4. @UseGuards(AuthGuard) → Apply security
5. Call handler
```

**Why decorators**: Declarative (describe *what*, not *how*), keep code clean, automatic registration.

---

## Request Lifecycle - How Everything Connects

**Theory**: Every HTTP request flows through multiple layers before reaching your route handler. Understanding this flow is critical.

**Complete Flow**:
```
Incoming Request
    ↓
1. MIDDLEWARE (optional) - Logging, CORS, body parsing
    ↓
2. GUARDS - Authentication/authorization (true/false decision)
    ↓
3. INTERCEPTORS (Before) - Transform request
    ↓
4. PIPES - Validate/transform data
    ↓
5. ROUTE HANDLER - Controller → Service
    ↓
6. INTERCEPTORS (After) - Transform response
    ↓
7. EXCEPTION FILTERS - Catch and format errors
    ↓
Response sent to client
```

**Key Insight**: Each layer has a specific job - separation means you can add logging, auth, validation, etc. without cluttering route handlers.

---

## Dependency Injection (DI) - Core Pattern

**Theory**: Pattern where classes receive dependencies from external source instead of creating them. NestJS IoC container manages this automatically.

**Problem without DI**:
```typescript
class Controller {
  service = new Service();  // Tight coupling, can't test, manual lifecycle
}
```

**Solution with DI**:
```typescript
@Controller()
class Controller {
  constructor(private service: Service) {}  // Injected automatically
}
```

**How it works**:
1. Register in module: `providers: [Service]`
2. Declare in constructor: `constructor(private service: Service)`
3. NestJS creates and injects automatically

**Benefits**:
- **Loose coupling**: Controller doesn't know how service is created
- **Testability**: Easy to inject mocks
- **Lifecycle management**: NestJS handles creation/destruction
- **Reusability**: Same instance shared across app

**Connection to everything**: DI is how all NestJS components connect. Controllers inject services, guards inject services, services inject repositories, etc.

---

## Modules - Application Organization

**Theory**: Containers that group related code (controllers, services) by feature.

**Module structure**:
```typescript
@Module({
  imports: [DatabaseModule],      // Modules we depend on
  controllers: [UsersController],  // Route handlers
  providers: [UsersService],       // Services/business logic
  exports: [UsersService]          // Share with other modules
})
```

**Types**:
- **Feature Modules**: One per feature (UsersModule, ProductsModule)
- **Global Modules**: `@Global()` - available everywhere (ConfigModule)
- **Dynamic Modules**: `forRoot()` (app-wide), `forFeature()` (per-module)

**Connection to route handlers**: Modules register controllers and their dependencies.

---

## Controllers - Route Handlers

**Theory**: Handle HTTP requests, extract data, delegate to services, return responses.

**Keep controllers thin** - no business logic, just routing.

```typescript
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}  // DI

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);  // Delegate to service
  }
}
```

**Connection to lifecycle**: Controllers are step 5 - by the time handler executes, request has passed through middleware, guards, interceptors, pipes.

---

## Providers - Business Logic Layer

**Theory**: Classes with `@Injectable()` that contain business logic. Can be injected via DI.

**Why separate from controllers**:
- **Separation of concerns**: Controllers handle HTTP, Providers handle logic
- **Reusability**: Same service used by multiple controllers
- **Testability**: Easy to mock

**Provider Scopes**:
- **Singleton** (default): One instance app-wide
- **Request**: New instance per request
- **Transient**: New instance every injection

**Connection**: Controllers inject and call service methods for business logic.

---

## Middleware - Pre-Processing Layer

**Theory**: Functions that execute **before** route handler, have access to req/res/next. First thing that runs (step 1).

**What middleware does**:
- Execute code before routing
- Modify request/response objects
- End request early or call next()

**Common use cases**: Logging, CORS, body parsing, session management, rate limiting.

```typescript
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.url}`);
    next();  // MUST call next()
  }
}
```

**Key points**:
- Runs before NestJS determines which route handler
- Doesn't know which handler will execute
- Can't transform response

**Connection to route handlers**: Sets up request (logging, parsing) before guards and handlers process it.

---

## Guards - Authorization Layer

**Theory**: Determine if request should proceed. Return `true` (allow) or `false` (403). Execute after middleware, before interceptors/pipes (step 2).

**Purpose**: Authentication and authorization - "Should this request be allowed?"

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return !!request.user;  // true = allow, false = 403
  }
}
```

**Common patterns**:
- **Authentication**: Is user logged in? (check JWT)
- **Authorization**: Does user have permission? (check role)
- **Feature flags**: Is feature enabled?

**Why guards instead of middleware**:
- Have **ExecutionContext** - know which handler executes
- Can read **custom decorators** via reflection
- **Route-specific** - different guards per route
- **Declarative** - attach with `@UseGuards()`

**Connection**: Guards are gatekeepers. If guard returns `false`, handler never executes.

---

## Interceptors - Transformation Layer

**Theory**: Execute **before AND after** route handler. Most powerful feature in NestJS. Work with RxJS Observables.

**What makes them special**:
- Run code before handler
- Run code after handler
- Transform request/response
- Can prevent handler execution
- Handle exceptions

**Structure**:
```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    const start = Date.now();

    return next.handle().pipe(
      tap(() => console.log(`After... ${Date.now() - start}ms`))
    );
  }
}
```

**Flow**:
1. Code before `next.handle()` runs before handler
2. `next.handle()` calls route handler
3. RxJS operators transform result after handler

**Common use cases**:
- **Logging with timing**: Measure handler execution time
- **Response transformation**: Wrap all responses in `{ data, timestamp }`
- **Caching**: Check cache before handler, store after
- **Error handling**: Catch and transform exceptions

**vs Middleware/Guards**:
- **Middleware**: Can't transform response
- **Guards**: Binary decision only
- **Interceptors**: Full control before and after

**Connection**: Interceptors **wrap** the route handler - can prevent, transform, measure, cache.

---

## Pipes - Validation and Transformation Layer

**Theory**: Transform or validate data **before** it reaches route handler. Last step before handler executes (step 4).

**Two purposes**:
1. **Transformation**: `"123"` → `123` (string to number)
2. **Validation**: Verify data meets requirements

**ValidationPipe** - Most important:
```typescript
class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}

@Post()
create(@Body() dto: CreateUserDto) {
  // Handler assumes dto is valid
  // If invalid, pipe threw error, handler never runs
}
```

**Global validation**:
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,              // Strip unknown properties
  forbidNonWhitelisted: true,   // Throw error if extra fields
  transform: true               // Auto-transform to DTO class
}));
```

**Why pipes are important**:
- **Type safety**: Handler receives correct types
- **Data integrity**: Invalid data caught before handler (400 error)
- **Security**: Whitelist prevents mass assignment attacks
- **Clean handlers**: No validation logic in handler

**Connection**: Pipes are gatekeepers ensuring handlers receive valid, correctly-typed data.

---

## DTOs (Data Transfer Objects)

**Theory**: Define data shape and validation rules for requests.

**Purpose**:
1. **Type safety**: TypeScript knows structure
2. **Validation**: Decorators define rules
3. **Security**: Whitelist allowed fields
4. **Separation**: DTO ≠ Database Entity

**Why separate**:
- **DTO** (client → server): `{ email, password }` - what client sends
- **Entity** (database): `{ id, email, passwordHash, createdAt }` - what's stored

**Mapped Types** - Reuse DTOs:
```typescript
class UpdateUserDto extends PartialType(CreateUserDto) {}  // All optional
class UserPreviewDto extends PickType(CreateUserDto, ['email']) {}  // Select fields
```

**Connection**: DTOs define what route handlers accept. Pipes validate DTOs before handlers execute.

---

## Exception Filters - Error Handling Layer

**Theory**: Catch exceptions from anywhere in request lifecycle, transform to proper HTTP responses (step 7).

**Built-in exceptions**:
- `BadRequestException` (400)
- `UnauthorizedException` (401)
- `NotFoundException` (404)

**Why filters**: Without them, errors expose stack traces, database errors, sensitive information.

**Connection**: If route handler (or guards, interceptors, pipes) throws exception, filter catches and formats response.

---

## Interview Questions

### Q: "What is NestJS and why use it?"

**Answer**: "NestJS is a framework built on Express/Fastify that adds structure and TypeScript-first development.

**Why use it**:
- **Structure**: Enforces organization with modules, controllers, services
- **Dependency Injection**: Built-in IoC container for loose coupling
- **TypeScript-first**: Full support out of the box
- **Enterprise-ready**: Guards, interceptors, pipes, filters included
- **Testable**: Designed for unit and E2E testing

Use NestJS for large applications with teams. Use Express for simple APIs needing flexibility."

---

### Q: "Explain the request lifecycle"

**Answer**: "Every request flows through layers:

1. **Middleware**: Setup (logging, CORS)
2. **Guards**: Security check (true/false)
3. **Interceptors (before)**: Transform request
4. **Pipes**: Validate/transform data
5. **Route Handler**: Business logic
6. **Interceptors (after)**: Transform response
7. **Exception Filters**: Handle errors

**Why this structure**: Separation of concerns. Each layer has one job, so route handlers stay clean - no validation, auth checks, logging in handler."

---

### Q: "What is Dependency Injection and why use it?"

**Answer**: "DI is where classes receive dependencies instead of creating them. NestJS IoC container manages this.

**Without DI**: `service = new Service()` - tight coupling, can't test
**With DI**: `constructor(private service: Service)` - injected automatically

**How it works**:
1. Register in module: `providers: [Service]`
2. Declare in constructor
3. NestJS creates and injects

**Benefits**: Loose coupling, easy testing with mocks, automatic lifecycle, shared instances.

DI is how all NestJS components connect - controllers inject services, services inject repositories."

---

### Q: "Difference between Middleware, Guards, and Interceptors?"

**Answer**:

**Middleware**:
- **When**: First, before routing
- **Purpose**: Request preprocessing
- **Can transform response?**: No
- **Example**: Logging, CORS

**Guards**:
- **When**: After middleware
- **Purpose**: Authorization (true/false)
- **Can transform response?**: No
- **Example**: Check if logged in

**Interceptors**:
- **When**: Before AND after handler
- **Purpose**: Transform request/response
- **Can transform response?**: Yes
- **Example**: Response formatting, timing

**Order**: Middleware → Guards → Interceptors (before) → Pipes → Handler → Interceptors (after)"

---

### Q: "What are decorators and how do they work?"

**Answer**: "Decorators add metadata to classes, methods, parameters. They're the foundation of NestJS.

**Types**:
- **Class**: `@Module()`, `@Controller()`, `@Injectable()`
- **Method**: `@Get()`, `@Post()`, `@UseGuards()`
- **Parameter**: `@Param()`, `@Body()`, `@Query()`

**How they connect to route handlers**:

When request comes in, NestJS:
1. Reads `@Controller('users')` to find controller
2. Reads `@Get(':id')` to match route
3. Reads `@Param('id')` to extract parameter
4. Reads `@UseGuards()` to apply security
5. Calls handler

Decorators make code declarative - you describe what you want, NestJS handles how."

---

### Q: "How do Guards work and when to use them?"

**Answer**: "Guards determine if request should proceed. Return `true` (allow) or `false` (403).

**Purpose**: Authentication and authorization

**When guards run**: After middleware, before interceptors

**Common use cases**:
- **Authentication**: Is user logged in? (check JWT)
- **Authorization**: Does user have permission? (check role)
- **Feature flags**: Is feature enabled?

**Why guards instead of middleware**:
- Have ExecutionContext - know which handler executes
- Can read custom decorators
- Route-specific - different guards per route

If guard returns `false`, handler never executes."

---

### Q: "What are Interceptors used for?"

**Answer**: "Interceptors wrap route handler execution - run before AND after handler. Most powerful tool in NestJS.

**Common use cases**:
- **Logging with timing**: Measure execution time
- **Response transformation**: Wrap responses in `{ data, timestamp }`
- **Caching**: Check cache before handler, store after
- **Error handling**: Catch and transform exceptions

**How they work**:
```typescript
intercept(context, next) {
  // Code before handler
  return next.handle().pipe(
    // Code after handler - can transform response
  );
}
```

**vs others**:
- Middleware: Can't transform response
- Guards: Only true/false
- Interceptors: Full control before and after"

---

### Q: "What are Pipes and why are they important?"

**Answer**: "Pipes validate and transform data before it reaches route handler.

**Two purposes**:
1. **Transformation**: `'123'` → `123`
2. **Validation**: Verify data meets requirements

**Why important**:
- **Type safety**: Handler receives correct types
- **Data integrity**: Invalid data caught before handler (400 error)
- **Security**: Whitelist prevents mass assignment
- **Clean handlers**: No validation in handler

**ValidationPipe** - most common:
```typescript
class CreateUserDto {
  @IsEmail()
  email: string;
}

@Post()
create(@Body() dto: CreateUserDto) {
  // Handler assumes dto is valid
}
```

Pipes ensure handlers receive valid, correctly-typed data."

---

## Best Practices

1. **Keep controllers thin** - Delegate to services
2. **Use DTOs** with validation
3. **Global ValidationPipe** with whitelist
4. **Guards** for auth/authz
5. **Interceptors** for response formatting
6. **Never use 'new'** - Use DI
7. **One module per feature**
8. **Exception filters** for consistent error handling

---

## Key Concepts Checklist

**Architecture**:
- ✓ Modular structure (organize by feature)
- ✓ Request lifecycle (7 steps)
- ✓ Dependency Injection (IoC container)
- ✓ Decorators (metadata)

**Request Pipeline**:
- ✓ Middleware (setup)
- ✓ Guards (auth, true/false)
- ✓ Interceptors (before & after, transform)
- ✓ Pipes (validation)
- ✓ Exception Filters (errors)

**Core Components**:
- ✓ Modules (organize)
- ✓ Controllers (route handlers)
- ✓ Providers (business logic)
- ✓ DTOs (data validation)

**Understanding**:
- ✓ How components connect to route handlers
- ✓ When each layer executes
- ✓ Why separation of concerns matters
