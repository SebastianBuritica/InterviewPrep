# NestJS Interview Preparation Guide

## What is NestJS?

**Theory**: NestJS is a progressive Node.js framework for building efficient, scalable server-side applications. It's built with TypeScript and uses Express (or Fastify) under the hood, but adds structure, patterns, and tools on top.

**Key Philosophy**: Heavily inspired by Angular - provides out-of-the-box application architecture with clear separation of concerns.

**Why NestJS exists**: Express is flexible but unstructured. In large applications, developers need conventions for organizing code, handling dependencies, and managing cross-cutting concerns (auth, logging, validation). NestJS provides this structure.

**When to use**:
- Large applications with multiple developers
- Need for testability and maintainability
- TypeScript-first development
- Enterprise applications requiring SOLID principles

---

## Decorators - Foundation of NestJS

**Theory**: Decorators are special TypeScript features that add metadata to classes, methods, and parameters. They're the foundation of how NestJS works - they tell NestJS what each piece of code is and how to use it.

**What decorators do**: They're like labels or tags that NestJS reads at runtime to understand your code's structure and behavior.

### Types of Decorators in NestJS

**Class Decorators** - Define what a class is:
```typescript
@Module()       // "This class organizes related features"
@Controller()   // "This class handles HTTP requests"
@Injectable()   // "This class can be injected as a dependency"
```

**Method Decorators** - Define what a method does:
```typescript
@Get()          // "This method handles GET requests"
@Post()         // "This method handles POST requests"
@UseGuards()    // "This method requires these guards"
@UseInterceptors() // "This method uses these interceptors"
```

**Parameter Decorators** - Extract data from requests:
```typescript
@Param()        // "Get URL parameters"
@Query()        // "Get query string"
@Body()         // "Get request body"
@Headers()      // "Get HTTP headers"
```

**How they connect to route handlers**: When a request comes in, NestJS reads these decorators to:
1. Find the right controller (`@Controller('users')`)
2. Match the HTTP method and path (`@Get(':id')`)
3. Extract parameters (`@Param('id')`)
4. Apply guards, interceptors, pipes
5. Call the handler method

**Example flow**:
```
Request: GET /users/123

NestJS reads decorators:
1. @Controller('users') → Found UsersController
2. @Get(':id') → Found getUser() method
3. @Param('id') → Extract '123' from URL
4. @UseGuards(AuthGuard) → Check authentication first
5. Call getUser(123)
```

**Why decorators**: They're declarative (you describe *what*, not *how*) and keep code clean. Instead of manually registering routes, decorators do it automatically.

---

## Request Lifecycle - How Everything Connects

**Theory**: Every HTTP request flows through multiple layers before reaching your route handler. Understanding this flow is critical for knowing where to put logic.

**Complete Flow**:
```
Incoming Request
    ↓
1. MIDDLEWARE (optional)
    - Runs first, before anything else
    - Has access to req, res, next
    - Can modify request/response objects
    - Examples: Logging, CORS, body parsing
    ↓
2. GUARDS
    - Determines if request should be processed
    - Returns true (continue) or false (403 Forbidden)
    - Examples: Check if user is authenticated/authorized
    ↓
3. INTERCEPTORS (Before)
    - Can transform the request
    - Runs before pipes and handler
    - Examples: Add request timestamp, modify headers
    ↓
4. PIPES
    - Validate and transform incoming data
    - Examples: Validate DTO, transform string "123" to number 123
    ↓
5. ROUTE HANDLER (Controller Method)
    - Your actual business logic
    - Calls services to process request
    ↓
6. INTERCEPTORS (After)
    - Can transform the response
    - Examples: Add response timing, format response structure
    ↓
7. EXCEPTION FILTERS (if error occurred)
    - Catches and formats errors
    - Examples: Transform exceptions to proper HTTP responses
    ↓
Response sent to client
```

**Key Insight**: Each layer has a specific job. This separation means you can add logging, auth, validation, etc. without cluttering your route handlers.

---

## Modules - Application Organization

**Theory**: Modules are containers that group related code together. They're NestJS's way of organizing your application into features.

**What modules contain**:
- **Controllers**: Handle HTTP requests for this feature
- **Providers**: Services and business logic for this feature
- **Imports**: Other modules this module depends on
- **Exports**: Providers this module shares with other modules

**Why modules matter**: Instead of one giant file with all your code, you organize by feature (UserModule, ProductModule, OrderModule). Each module is self-contained.

**Module decorator**:
```typescript
@Module({
  imports: [DatabaseModule],      // Modules we depend on
  controllers: [UsersController],  // Route handlers
  providers: [UsersService],       // Services we provide
  exports: [UsersService]          // Make UsersService available to other modules
})
```

**Types of modules**:

**1. Feature Modules**: One per feature (users, products, orders)
- Contains feature-specific code
- Imported into other modules as needed

**2. Global Modules**: Shared across entire app (config, database)
- Marked with `@Global()` decorator
- Available everywhere without importing

**3. Dynamic Modules**: Configured at runtime
- `forRoot()`: App-wide configuration (called once)
- `forFeature()`: Feature-specific configuration (called per module)

**Connection to route handlers**: Modules register controllers. When request comes in, NestJS uses modules to find which controller handles it.

---

## Controllers - Route Handlers

**Theory**: Controllers are classes that handle incoming HTTP requests and return responses to the client. They're the entry point for your API.

**Responsibilities**:
- Define routes (URL paths)
- Extract request data (params, query, body)
- Delegate work to services
- Return responses

**What controllers should NOT do**:
- Business logic (that's for services)
- Database queries (that's for services/repositories)
- Complex calculations (that's for services)

**Why thin controllers**: Controllers should be "dumb" - just route requests to the right service. This makes testing easier and logic reusable.

**Route definition**:
```typescript
@Controller('users')  // Base path: /users
export class UsersController {

  @Get()           // GET /users
  @Get(':id')      // GET /users/123
  @Post()          // POST /users
  @Put(':id')      // PUT /users/123
  @Delete(':id')   // DELETE /users/123
}
```

**Data extraction decorators**:
```typescript
@Get(':id')
findOne(
  @Param('id') id: string,           // URL parameter
  @Query('include') include: string, // Query string (?include=posts)
  @Headers('auth') auth: string      // Header value
) {}

@Post()
create(@Body() createUserDto: CreateUserDto) {}
```

**Connection to the request lifecycle**: Controllers are where the route handler executes (step 5 in lifecycle). Before reaching controller, request has already passed through middleware, guards, interceptors, and pipes.

---

## Providers - Business Logic Layer

**Theory**: Providers are classes marked with `@Injectable()` that contain your application's business logic. The most common provider is a Service.

**What makes a provider**:
- Marked with `@Injectable()` decorator
- Registered in a module's `providers` array
- Can be injected into other classes via Dependency Injection

**Why separate providers from controllers**:

**1. Separation of Concerns**:
- Controllers handle HTTP (routing, request/response)
- Providers handle business logic

**2. Reusability**:
- Same service can be used by multiple controllers
- Service can be used in scheduled tasks, WebSockets, GraphQL resolvers

**3. Testability**:
- Easy to mock services when testing controllers
- Services can be tested independently

**Example**:
```typescript
@Injectable()
export class UsersService {
  // Business logic here
  findAll() { /* query database */ }
  findOne(id: number) { /* find user */ }
  create(data: CreateUserDto) { /* create user */ }
}
```

**Provider Scopes** - Lifecycle management:

**DEFAULT (Singleton)**:
- One instance shared across entire app
- Lives for application lifetime
- Most common and efficient

**REQUEST**:
- New instance created for each HTTP request
- Destroyed when request completes
- Use when you need request-specific data

**TRANSIENT**:
- New instance created every time it's injected
- Not shared between consumers
- Rarely used

**Connection to route handlers**: Controllers inject services via constructor. When route handler executes, it calls service methods to perform business logic.

```typescript
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}  // Injected

  @Get()
  findAll() {
    return this.usersService.findAll();  // Delegate to service
  }
}
```

---

## Dependency Injection (DI) - Core Pattern

**Theory**: Dependency Injection is a design pattern where classes receive their dependencies from an external source instead of creating them. NestJS has a built-in IoC (Inversion of Control) container that manages this automatically.

**The Problem Without DI**:
```typescript
class UsersController {
  usersService = new UsersService();  // Problems:
  // 1. Tight coupling - hard to change
  // 2. Can't test (can't inject mock)
  // 3. Can't share instance
  // 4. Manual lifecycle management
}
```

**The Solution With DI**:
```typescript
@Controller('users')
class UsersController {
  constructor(private usersService: UsersService) {}  // Injected!
  // NestJS creates UsersService and passes it in
}
```

**How NestJS DI Works**:

**Step 1 - Registration**: Register provider in module
```typescript
@Module({
  providers: [UsersService]  // Tell NestJS "UsersService is available"
})
```

**Step 2 - Injection**: Declare dependency in constructor
```typescript
constructor(private usersService: UsersService) {}
// TypeScript type tells NestJS what to inject
```

**Step 3 - Resolution**: NestJS IoC container:
1. Sees you need UsersService
2. Checks if instance exists (singleton)
3. If not, creates instance
4. Injects instance into your class

**Benefits**:

**1. Loose Coupling**:
- Controller doesn't know/care how service is created
- Easy to swap implementations

**2. Testability**:
```typescript
// In tests, inject mock
const mockService = { findAll: jest.fn() };
const controller = new UsersController(mockService);
```

**3. Lifecycle Management**:
- NestJS handles creation and destruction
- Automatic singleton pattern
- Memory management

**4. Configuration**:
- Same service can have different configs per module
- forRoot() / forFeature() pattern

**Connection to everything**: DI is how all NestJS components connect. Controllers inject services, services inject repositories, guards inject services, etc. It's the glue of the framework.

---

## Middleware - Pre-Processing Layer

**Theory**: Middleware functions execute **before** the route handler and have access to the request and response objects. They can modify requests/responses or end the request-response cycle.

**Where middleware fits**: It's the **first** thing that runs after the request hits your application (step 1 in lifecycle).

**What middleware can do**:
- Execute code
- Modify request/response objects
- End request-response cycle (send response early)
- Call next middleware in stack

**Common use cases**:
- **Logging**: Log every request
- **CORS**: Handle cross-origin requests
- **Body parsing**: Parse JSON bodies
- **Session management**: Attach session to request
- **Rate limiting**: Limit requests per IP
- **Request ID**: Add unique ID to each request

**Middleware signature**:
```typescript
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.url}`);
    next();  // MUST call next() to continue
  }
}
```

**Key points**:
- Has access to `req`, `res`, `next`
- Must call `next()` to continue to next middleware/guard
- Can end request early by sending response
- Doesn't know which route handler will execute

**Connection to route handlers**: Middleware runs **before** NestJS even determines which route handler to call. It sets up the request (logging, parsing, auth setup) before guards and handlers process it.

**Middleware vs Guards vs Interceptors**:
- **Middleware**: Low-level, runs first, doesn't know route
- **Guards**: Knows route, makes yes/no decision
- **Interceptors**: Wraps handler execution, can transform response

---

## Guards - Authorization Layer

**Theory**: Guards determine whether a request should be processed or rejected. They return `true` (allow) or `false` (reject with 403). Guards execute **after middleware** but **before interceptors and pipes**.

**Purpose**: Authentication and authorization. "Should this request be allowed?"

**Where guards fit**: Step 2 in lifecycle - after middleware, before interceptors/pipes.

**What guards can do**:
- Access request object
- Access route metadata (custom decorators)
- Use Dependency Injection
- Access ExecutionContext (knows which route handler will execute)

**Guard interface**:
```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return !!request.user;  // true = allow, false = 403
  }
}
```

**Common guard patterns**:

**1. Authentication Guard**: "Is user logged in?"
```typescript
// Check if JWT token is valid and attach user to request
```

**2. Authorization Guard**: "Does user have permission?"
```typescript
// Check if user.role === 'admin'
```

**3. Feature Flag Guard**: "Is this feature enabled?"
```typescript
// Check if feature is enabled in config
```

**Using guards**:
```typescript
// On entire controller
@Controller('users')
@UseGuards(AuthGuard)
class UsersController {}

// On specific route
@Get('profile')
@UseGuards(AuthGuard, AdminGuard)
getProfile() {}
```

**ExecutionContext**: Guards receive ExecutionContext, which gives them information about:
- Current request
- Route handler that will execute
- Custom metadata from decorators

**Why guards instead of middleware**:
- Guards have **ExecutionContext** - they know which handler executes
- Guards can use **reflection** to read custom decorators
- Guards run **per route** - middleware runs for all routes
- Guards are **declarative** - attach with `@UseGuards()`

**Connection to route handlers**: Guards act as gatekeepers. If guard returns `false`, route handler never executes. If guard returns `true`, request continues to pipes → handler.

---

## Interceptors - Transformation Layer

**Theory**: Interceptors are the most powerful feature in NestJS request lifecycle. They execute **before AND after** the route handler, allowing you to transform requests and responses, add extra logic, or completely change handler behavior.

**Where interceptors fit**: They wrap the entire handler execution (step 3 before, step 6 after in lifecycle).

**What makes interceptors special**:
- Access to ExecutionContext (like guards)
- Access to CallHandler (represents route handler)
- Can run code before handler
- Can run code after handler
- Can transform the response
- Can handle exceptions
- Work with RxJS Observables

**Interceptor structure**:
```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before handler...');

    const now = Date.now();
    return next.handle().pipe(
      tap(() => console.log(`After handler... ${Date.now() - now}ms`))
    );
  }
}
```

**Understanding the flow**:
1. `intercept()` method called
2. Code before `next.handle()` executes (before handler)
3. `next.handle()` calls the route handler
4. Handler returns result
5. RxJS operators transform result (after handler)
6. Transformed result returned

**Common use cases**:

**1. Logging with timing**:
```typescript
// Log how long handler took to execute
const start = Date.now();
return next.handle().pipe(
  tap(() => console.log(`Took ${Date.now() - start}ms`))
);
```

**2. Response transformation**:
```typescript
// Wrap all responses in { data: result, timestamp: ... }
return next.handle().pipe(
  map(data => ({
    data,
    timestamp: new Date().toISOString()
  }))
);
```

**3. Caching**:
```typescript
// Check cache before calling handler
if (cache.has(key)) {
  return of(cache.get(key));  // Return cached value, skip handler
}
return next.handle().pipe(
  tap(response => cache.set(key, response))
);
```

**4. Exception handling**:
```typescript
return next.handle().pipe(
  catchError(err => {
    // Transform error or log it
    throw new HttpException('Custom error', 500);
  })
);
```

**Why RxJS Observables**: Observables allow interceptors to:
- Run async code after handler
- Transform responses
- Handle errors
- Compose multiple operations

**Interceptors vs Middleware vs Guards**:

**Middleware**:
- Runs before routing
- Doesn't know which handler
- Can't transform response (already sent)

**Guards**:
- Binary decision (true/false)
- Can't transform response
- Runs before handler only

**Interceptors**:
- Runs before AND after handler
- Can transform request and response
- Full control over execution

**Connection to route handlers**: Interceptors **wrap** the route handler. They can prevent execution, transform input, transform output, measure performance, cache results, etc. Most powerful tool for cross-cutting concerns.

---

## Pipes - Validation and Transformation Layer

**Theory**: Pipes are classes that transform or validate data **before** it reaches the route handler. They execute after guards and interceptors (before), but before the handler method.

**Where pipes fit**: Step 4 in lifecycle - last step before route handler executes.

**Two main purposes**:

**1. Transformation**: Convert input to desired type
```typescript
// String "123" → Number 123
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {}
// NestJS guarantees id is a number
```

**2. Validation**: Verify input matches requirements
```typescript
// Validate CreateUserDto has correct fields and types
@Post()
create(@Body(ValidationPipe) createUserDto: CreateUserDto) {}
```

**Built-in pipes**:
- `ParseIntPipe`: String → Number
- `ParseBoolPipe`: String → Boolean
- `ParseArrayPipe`: String → Array
- `ValidationPipe`: Validate DTOs with class-validator
- `DefaultValuePipe`: Provide default if undefined

**ValidationPipe** - Most important:
```typescript
@Post()
create(@Body() createUserDto: CreateUserDto) {}
// With ValidationPipe, NestJS validates DTO decorators:

class CreateUserDto {
  @IsEmail()  // Must be valid email
  email: string;

  @MinLength(8)  // Min 8 characters
  password: string;

  @IsInt()
  @Min(18)
  age: number;
}
```

**Global validation**:
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,  // Strip properties not in DTO
  forbidNonWhitelisted: true,  // Throw error if extra fields
  transform: true  // Auto-transform to DTO class instance
}));
```

**Why pipes are important**:

**1. Type Safety**: Ensure parameters are correct type
```typescript
// Without pipe: id might be "123" (string)
// With ParseIntPipe: id is guaranteed number
```

**2. Data Validation**: Prevent invalid data from reaching handler
```typescript
// If email is invalid, handler never executes
// Client gets 400 Bad Request with error details
```

**3. Security**: Whitelist prevents mass assignment attacks
```typescript
// Client sends: { email, password, isAdmin: true }
// With whitelist: { email, password } (isAdmin stripped)
```

**4. Clean Handlers**: Validation logic not in handler
```typescript
// Handler assumes data is valid
create(createUserDto: CreateUserDto) {
  // No need to validate - pipe did it
  return this.service.create(createUserDto);
}
```

**Connection to route handlers**: Pipes are the last line of defense before handler executes. They ensure route handler receives **valid, correctly-typed data**. Handler can trust its input.

---

## DTOs (Data Transfer Objects)

**Theory**: DTOs define the shape and validation rules for data transferred between client and server. They're plain classes with validation decorators.

**Purpose**:

**1. Type Safety**: TypeScript knows data structure
**2. Validation**: Decorators define rules (required, email format, min length)
**3. Documentation**: Clear contract between client and API
**4. Security**: Whitelist allowed fields (prevent extra fields)
**5. Separation**: DTO ≠ Database Entity

**DTO with validation**:
```typescript
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string;

  @IsInt()
  @Min(18)
  @IsOptional()
  age?: number;
}
```

**Why separate DTOs from Entities**:

**DTO (Client → Server)**:
- What client can send
- Has validation rules
- Example: `{ email, password }`

**Entity (Database)**:
- What's stored in database
- Has database columns
- Example: `{ id, email, passwordHash, createdAt, updatedAt }`

**Different shapes, different purposes**. Client shouldn't send `id` or `createdAt` - those are generated.

**Mapped Types** - Reuse DTOs:
```typescript
// Make all properties optional
class UpdateUserDto extends PartialType(CreateUserDto) {}

// Pick specific properties
class UserPreviewDto extends PickType(CreateUserDto, ['email', 'age']) {}

// Omit properties
class SafeUserDto extends OmitType(CreateUserDto, ['password']) {}
```

**Connection to route handlers**: DTOs define what data route handlers accept. Pipes validate DTOs before handlers execute.

---

## Exception Filters - Error Handling Layer

**Theory**: Exception filters catch exceptions thrown anywhere in the request lifecycle and transform them into proper HTTP responses.

**Where filters fit**: Step 7 in lifecycle - catches exceptions from any previous step.

**What filters do**:
- Catch exceptions (all or specific types)
- Format error responses consistently
- Log errors
- Hide internal error details from clients

**Built-in exceptions**:
- `BadRequestException` (400)
- `UnauthorizedException` (401)
- `ForbiddenException` (403)
- `NotFoundException` (404)
- `InternalServerErrorException` (500)

**Why filters**: Without filters, errors might expose:
- Stack traces
- Database errors
- Internal paths
- Sensitive information

**Connection to route handlers**: If route handler (or guards, interceptors, pipes) throws exception, filter catches it and sends formatted response to client.

---

## Interview Questions

### Q: "What is NestJS and why use it?"

**Answer**: "NestJS is a framework built on top of Express/Fastify that provides structure and TypeScript-first development for Node.js applications.

**Why use it**:

**1. Structure**: Enforces organization with modules, controllers, services
- Express is flexible but unstructured
- NestJS provides conventions for large apps

**2. Dependency Injection**: Built-in IoC container
- Automatic lifecycle management
- Easy testing with mocks
- Loose coupling

**3. TypeScript-first**: Full TypeScript support out of the box
**4. Decorators**: Clean, declarative code
**5. Enterprise-ready**: Guards, interceptors, pipes, filters included
**6. Testable**: Designed for unit and E2E testing

**Use NestJS when**: Large application, team collaboration, need maintainability
**Use Express when**: Simple API, small project, need maximum flexibility"

---

### Q: "Explain the request lifecycle"

**Answer**: "Every request flows through multiple layers:

**1. Middleware**: Runs first, modifies req/res, doesn't know route
**2. Guards**: Determines if request allowed (auth/authz), returns true/false
**3. Interceptors (before)**: Can transform request
**4. Pipes**: Validate and transform parameters/body
**5. Route Handler**: Your controller method executes
**6. Interceptors (after)**: Can transform response
**7. Exception Filters**: Catches errors from any step
**8. Response**: Sent to client

**Why this structure**: Separation of concerns. Each layer has one job:
- Middleware: Setup (logging, CORS)
- Guards: Security (who can access)
- Interceptors: Cross-cutting (timing, formatting)
- Pipes: Validation (data integrity)
- Handler: Business logic
- Filters: Error handling

This means route handlers stay clean - they don't need validation, auth checks, logging, etc."

---

### Q: "What is Dependency Injection and why use it?"

**Answer**: "DI is a pattern where classes receive dependencies instead of creating them. NestJS's IoC container manages this automatically.

**Without DI** (manual creation):
```typescript
class Controller {
  service = new Service();  // Problems:
  // - Tight coupling
  // - Can't test with mocks
  // - Manual lifecycle management
}
```

**With DI** (injection):
```typescript
@Controller()
class Controller {
  constructor(private service: Service) {}  // Injected!
}
```

**How NestJS DI works**:
1. Register provider in module: `providers: [Service]`
2. Declare dependency in constructor: `constructor(private service: Service)`
3. NestJS creates and injects automatically

**Benefits**:
- **Loose coupling**: Controller doesn't know how service is created
- **Testability**: Easy to inject mocks in tests
- **Lifecycle**: NestJS manages creation/destruction
- **Reusability**: Same service instance shared across app

**Connection to architecture**: DI is how all NestJS components connect. Controllers inject services, services inject repositories, guards inject services, etc."

---

### Q: "Difference between Middleware, Guards, and Interceptors?"

**Answer**: "They all run during request lifecycle but have different purposes and capabilities:

**Middleware**:
- **When**: First, before routing decision
- **Purpose**: Request preprocessing (logging, CORS, body parsing)
- **Access**: req, res, next
- **Knows route?**: No - doesn't know which handler will execute
- **Transform response?**: No - can't access handler result

**Guards**:
- **When**: After middleware, before interceptors
- **Purpose**: Authorization (yes/no decision)
- **Returns**: boolean (true = allow, false = 403)
- **Access**: ExecutionContext (knows route handler)
- **Transform response?**: No - binary decision only

**Interceptors**:
- **When**: Before AND after handler execution
- **Purpose**: Transform request/response, add logic
- **Returns**: Observable (wraps handler execution)
- **Access**: ExecutionContext + CallHandler
- **Transform response?**: Yes - can modify handler result

**Order**: Middleware → Guards → Interceptors (before) → Pipes → Handler → Interceptors (after)

**Example use cases**:
- **Middleware**: Log all requests, parse JSON
- **Guards**: Check if user is logged in
- **Interceptors**: Add response timing, transform format"

---

### Q: "What are decorators and how do they work?"

**Answer**: "Decorators are TypeScript features that add metadata to classes, methods, and parameters. They're the foundation of NestJS.

**What they do**: Tell NestJS what each piece of code is and how to use it.

**Types**:

**Class decorators**:
- `@Module()`: Organizes features
- `@Controller()`: Handles HTTP requests
- `@Injectable()`: Can be injected

**Method decorators**:
- `@Get()`, `@Post()`: Define routes
- `@UseGuards()`: Apply guards
- `@UseInterceptors()`: Apply interceptors

**Parameter decorators**:
- `@Param()`: Extract URL parameters
- `@Body()`: Extract request body
- `@Query()`: Extract query string

**How they connect to route handlers**:

When request comes in, NestJS:
1. Reads `@Controller('users')` to find controller
2. Reads `@Get(':id')` to match route
3. Reads `@Param('id')` to extract parameter
4. Reads `@UseGuards()` to apply security
5. Calls the handler method

**Example**:
```
Request: GET /users/123

NestJS uses decorators to:
- Find UsersController (@Controller)
- Match getUser() method (@Get(':id'))
- Extract 123 (@Param('id'))
- Apply AuthGuard (@UseGuards)
- Call handler
```

Decorators make code declarative - you describe what you want, NestJS handles how."

---

### Q: "Explain Providers and their role"

**Answer**: "Providers are classes marked with `@Injectable()` that contain business logic. They're the core of NestJS's Dependency Injection system.

**What makes a provider**:
- `@Injectable()` decorator
- Registered in module's `providers` array
- Can be injected into other classes

**Why separate from controllers**:

**Controllers**: Handle HTTP (routing, req/res)
**Providers**: Handle business logic (database, calculations, external APIs)

**Benefits of separation**:
1. **Reusability**: Same service used by multiple controllers
2. **Testability**: Mock services when testing controllers
3. **Separation of concerns**: Each class has one job
4. **Maintainability**: Business logic in one place

**Provider scopes**:
- **Singleton** (default): One instance app-wide, shared
- **Request**: New instance per HTTP request
- **Transient**: New instance every injection

**Connection to route handlers**:
```
Request → Controller (injects Service) → Service (business logic) → Repository (database)
```

Route handlers delegate work to services instead of doing it themselves. This keeps handlers thin and logic reusable."

---

### Q: "How do Guards work and when to use them?"

**Answer**: "Guards determine if a request should proceed. They return `true` (allow) or `false` (deny with 403).

**Purpose**: Authentication and authorization - answering 'should this request be allowed?'

**When guards run**: After middleware, before interceptors and pipes

**What guards can access**:
- Request object (headers, user, etc.)
- ExecutionContext (knows which route handler)
- Custom metadata from decorators
- Can use Dependency Injection

**Common use cases**:
- **Authentication**: Is user logged in? (check JWT token)
- **Authorization**: Does user have permission? (check role)
- **Feature flags**: Is feature enabled?

**Why guards instead of middleware**:
- Guards have **ExecutionContext** - know which handler executes
- Can read **custom decorators** via reflection
- **Declarative** - attach with `@UseGuards()` per route
- **Route-specific** - different guards for different routes

**Example flow**:
```
Request to GET /admin/users
→ Middleware (setup)
→ AuthGuard (is user logged in?) → Yes
→ AdminGuard (is user admin?) → Yes
→ Route handler executes
```

If any guard returns `false`, handler never executes and client gets 403."

---

### Q: "What are Interceptors used for?"

**Answer**: "Interceptors wrap route handler execution, running code before AND after the handler. Most powerful tool in NestJS.

**What makes them special**:
- Run before handler (can transform request)
- Run after handler (can transform response)
- Work with RxJS Observables
- Can prevent handler execution
- Can handle exceptions

**Common use cases**:

**1. Logging with timing**:
```
Before: Record start time
After: Log execution time
```

**2. Response transformation**:
```
Handler returns: { id: 1, name: 'John' }
Interceptor wraps: { data: { id: 1, name: 'John' }, timestamp: '...' }
```

**3. Caching**:
```
Before: Check cache, return if exists
After: Store result in cache
```

**4. Error handling**:
```
Catch errors from handler, transform to custom format
```

**How they work**:
```typescript
intercept(context, next) {
  // Code here runs BEFORE handler

  return next.handle().pipe(
    // Code here runs AFTER handler
    // Can transform response with RxJS operators
  );
}
```

**Interceptors vs others**:
- **Middleware**: Can't transform response
- **Guards**: Can't transform, only true/false
- **Interceptors**: Full control before and after

Perfect for cross-cutting concerns that need to wrap handler execution."

---

### Q: "What are Pipes and why are they important?"

**Answer**: "Pipes validate and transform data before it reaches the route handler. Last step before handler executes.

**Two purposes**:

**1. Transformation**: Convert to desired type
```
String '123' → Number 123
```

**2. Validation**: Verify data meets requirements
```
Email must be valid format
Password must be 8+ characters
```

**Why important**:

**1. Type safety**:
Handler receives guaranteed types (number not string)

**2. Data integrity**:
Invalid data caught before handler (400 Bad Request)

**3. Security**:
Whitelist prevents mass assignment attacks

**4. Clean handlers**:
No validation logic in handler - pipe handles it

**ValidationPipe** - Most common:
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

**Global configuration**:
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,  // Strip unknown properties
  forbidNonWhitelisted: true,  // Error if extra fields
  transform: true  // Auto-transform to DTO class
}));
```

**Connection to route handlers**: Pipes are gatekeepers. They ensure handlers receive valid, correctly-typed data. Handler can trust its input is safe and correct."

---

## Key Concepts Checklist

**Architecture**:
- ✓ Modular structure (organize by feature)
- ✓ Request lifecycle (8 steps)
- ✓ Dependency Injection (IoC container)
- ✓ Decorators (metadata for classes/methods/parameters)

**Request Pipeline**:
- ✓ Middleware (first, request setup)
- ✓ Guards (auth/authz, true/false)
- ✓ Interceptors (before & after, transform)
- ✓ Pipes (validation, transformation)
- ✓ Exception Filters (error handling)

**Core Components**:
- ✓ Modules (organize related code)
- ✓ Controllers (route handlers)
- ✓ Providers (business logic)
- ✓ DTOs (data validation)

**Understanding**:
- ✓ How components connect to route handlers
- ✓ When each layer executes
- ✓ Why separation of concerns matters
- ✓ How DI enables testing and loose coupling
