# TypeScript Interview Preparation Guide

## What is TypeScript?

**Theory**: TypeScript is a statically-typed superset of JavaScript that compiles to plain JavaScript. It adds type annotations to catch errors at compile-time instead of runtime.

**Key Benefits**:
- **Early error detection** - Catches bugs before runtime
- **Better IDE support** - Autocomplete, refactoring, navigation
- **Self-documenting code** - Types serve as inline documentation
- **Safer refactoring** - Type system ensures changes don't break code
- **Enhanced maintainability** - Easier to understand large codebases

**Use cases**: Large applications, team projects, Next.js/React applications, enterprise software

---

## Primitive Types

**Theory**: Basic building blocks for type annotations. TypeScript infers types when possible.

```typescript
// Explicit types
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;

// Type inference (preferred)
let name = "John";  // TypeScript knows it's string
let age = 30;       // TypeScript knows it's number
```

**Key types**:
- `string`, `number`, `boolean` - Standard primitives
- `null`, `undefined` - Absence of value
- `any` - Opt-out of type checking (avoid!)
- `unknown` - Type-safe version of any (requires type checking)
- `void` - Function returns nothing
- `never` - Function never returns (throws error or infinite loop)

**Arrays**:
```typescript
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ["a", "b"];
```

---

## Interfaces

**Theory**: Define the structure/shape of objects. Interfaces describe what properties an object should have and their types.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;           // Optional property
  readonly createdAt: Date; // Cannot be modified
}

const user: User = {
  id: 1,
  name: "John",
  email: "john@example.com",
  createdAt: new Date()
};
```

**Extending interfaces**:
```typescript
interface Admin extends User {
  role: string;
  permissions: string[];
}
```

**Declaration Merging**: Interfaces with same name automatically merge:
```typescript
interface Window {
  customProperty: string;
}
// Now Window type includes customProperty
```

---

## Type Aliases

**Theory**: Create custom names for any type - primitives, unions, intersections, objects.

```typescript
// Primitive alias
type ID = string | number;

// Union types
type Status = "active" | "inactive" | "pending";

// Intersection types - Combine multiple types
type User = {
  name: string;
  email: string;
};

type Admin = {
  role: string;
  permissions: string[];
};

type AdminUser = User & Admin;  // Has all properties from both
// { name: string; email: string; role: string; permissions: string[] }

// Object type
type Person = {
  id: ID;
  name: string;
  status: Status;
};

// Function type
type Callback = (data: string) => void;
```

---

## Interface vs Type - Critical Interview Topic

**Theory**: Both can define object shapes, but have different capabilities and use cases.

| Feature | Interface | Type |
|---------|-----------|------|
| **Syntax** | `interface User {}` | `type User = {}` |
| **Extend** | `extends` keyword | Intersection `&` |
| **Merge** | ✓ Auto-merges declarations | ✗ Cannot merge |
| **Primitives** | ✗ Objects only | ✓ Can alias any type |
| **Union** | ✗ | ✓ `type A = B \| C` |
| **Computed** | ✗ | ✓ Dynamic properties |

**When to use Interface**:
- Defining object/class shapes
- Need declaration merging (extending browser APIs)
- Building public APIs
- Following team conventions

**When to use Type**:
- Union types (`string | number`)
- Intersections (`A & B`)
- Primitive aliases (`type ID = string`)
- Tuples, mapped types, conditional types

**Example**:
```typescript
// Interface - Object shapes
interface User {
  name: string;
  age: number;
}

// Interface extending
interface Admin extends User {
  role: string;
}

// Type - Unions
type Status = "active" | "inactive";

// Type - Intersections (combine types)
type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

type UserWithTimestamps = User & Timestamps;
// { name: string; age: number; createdAt: Date; updatedAt: Date }
```

**Recommendation**: Use `interface` for objects by default. Use `type` for everything else.

---

## Utility Types - Commonly Used

**Theory**: Built-in TypeScript helpers that transform existing types. Saves time and reduces boilerplate.

**1. Partial<T>** - Make all properties optional:
```typescript
interface User {
  name: string;
  age: number;
  email: string;
}

function updateUser(id: number, updates: Partial<User>) {
  // Can update any subset of User properties
}

updateUser(1, { email: "new@example.com" }); // Valid
```

**2. Pick<T, Keys>** - Select specific properties:
```typescript
type UserPreview = Pick<User, "name" | "email">;
// { name: string; email: string }
```

**3. Omit<T, Keys>** - Remove specific properties:
```typescript
type UserWithoutEmail = Omit<User, "email">;
// { name: string; age: number }
```

**4. Required<T>** - Make all properties required:
```typescript
type RequiredUser = Required<Partial<User>>;
```

**5. Readonly<T>** - Make all properties readonly:
```typescript
type ImmutableUser = Readonly<User>;
```

**6. Record<Keys, Type>** - Create object type with specific keys:
```typescript
type Role = "admin" | "user" | "guest";
type Permissions = Record<Role, string[]>;
// { admin: string[]; user: string[]; guest: string[] }
```

**7. ReturnType<T>** - Extract function return type:
```typescript
function getUser() {
  return { name: "John", age: 30 };
}

type User = ReturnType<typeof getUser>;
// { name: string; age: number }
```

**Why use**: DRY principle - don't repeat type definitions, leverage existing types.

---

## Generics - Critical Interview Topic

**Theory**: Write reusable, type-safe code that works with multiple types. Like function parameters, but for types.

**Problem without generics**:
```typescript
function getFirst(arr: any[]): any {
  return arr[0]; // Returns 'any' - lose type safety
}
```

**Solution with generics**:
```typescript
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const num = getFirst([1, 2, 3]);     // number
const str = getFirst(["a", "b"]);    // string
```

**Generic constraints**: Restrict what types can be used:
```typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): void {
  console.log(item.length);
}

logLength("hello");    // OK - string has length
logLength([1, 2, 3]);  // OK - array has length
logLength(123);        // Error - number doesn't have length
```

**Generic interfaces** (API responses):
```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

const userResponse: ApiResponse<User> = {
  data: { name: "John", age: 30 },
  status: 200,
  message: "Success"
};
```

**When to use generics**:
- Reusable functions/classes that work with multiple types
- API responses
- Data structures (arrays, maps, sets)
- React components
- Custom hooks

---

## TypeScript with React

### Component Props

**Theory**: Define the structure and types of props your component accepts.

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  children?: React.ReactNode;
}

function Button({ label, onClick, variant = "primary", disabled }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}
```

**Generic components**:
```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, i) => <li key={i}>{renderItem(item)}</li>)}
    </ul>
  );
}

// Usage - TypeScript knows items are User[]
<List items={users} renderItem={(user) => <span>{user.name}</span>} />
```

---

### Typing Hooks

**useState**: Type inferred from initial value, or explicit when nullable:
```typescript
const [name, setName] = useState("John");     // string
const [count, setCount] = useState(0);         // number
const [user, setUser] = useState<User | null>(null); // explicit
```

**useRef**: Type for DOM elements:
```typescript
const inputRef = useRef<HTMLInputElement>(null);
```

**useContext**: Type the context value:
```typescript
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
```

**Custom hooks with generics**:
```typescript
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  // ... fetch logic

  return { data, loading };
}

// Usage - data is User[] | null
const { data } = useFetch<User[]>("/api/users");
```

---

### Event Handlers

**Theory**: React event types are different from native DOM events. Use React's synthetic events.

```typescript
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log("Clicked");
};
```

**Common event types**:
- `React.ChangeEvent<HTMLInputElement>` - Input changes
- `React.FormEvent<HTMLFormElement>` - Form submission
- `React.MouseEvent<HTMLButtonElement>` - Mouse clicks
- `React.KeyboardEvent<HTMLInputElement>` - Keyboard events

---

## Advanced Patterns

### Discriminated Unions

**Theory**: Type-safe way to handle different states. Each variant has a unique literal property ("discriminant").

```typescript
type RequestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: string }
  | { status: "error"; error: string };

function handleRequest(state: RequestState) {
  switch (state.status) {
    case "idle":
      return "Not started";
    case "loading":
      return "Loading...";
    case "success":
      return `Data: ${state.data}`; // TypeScript knows data exists
    case "error":
      return `Error: ${state.error}`; // TypeScript knows error exists
  }
}
```

**Benefits**: Type-safe state machines, exhaustive checking, prevents invalid states.

---

### Type Guards

**Theory**: Functions that narrow down types at runtime. Helps TypeScript understand what type a value is.

```typescript
// typeof guard
function processValue(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase(); // TypeScript knows it's string
  }
  return value.toFixed(2); // TypeScript knows it's number
}

// Custom type guard
function isUser(obj: any): obj is User {
  return obj && typeof obj.name === "string" && typeof obj.email === "string";
}

function processData(data: unknown) {
  if (isUser(data)) {
    console.log(data.name); // TypeScript knows it's User
  }
}
```

**Use cases**: API responses, user input validation, runtime type checking.

---

## Interview Questions

### Q: "When would you use `interface` vs `type`?"

**Answer**: "Both define object shapes, but have key differences:

**Use Interface when:**
- Defining object/class shapes - clearer intent
- Need declaration merging (extending Window, etc.)
- Building public APIs
- Most object types

**Use Type when:**
- Creating unions: `type Status = 'active' | 'inactive'`
- Primitive aliases: `type ID = string | number`
- Intersections, tuples, complex types

**Example**:
```typescript
// Interface for objects
interface User {
  name: string;
  age: number;
}

// Type for unions
type Status = 'active' | 'inactive';
type Result = Success | Error;
```

**My approach**: Default to `interface` for objects, use `type` for everything else."

---

### Q: "Explain generics and when you'd use them"

**Answer**: "Generics create reusable, type-safe code that works with multiple types.

**Without generics** - lose type safety:
```typescript
function getFirst(arr: any[]): any {
  return arr[0]; // Returns any
}
```

**With generics** - maintain type safety:
```typescript
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const num = getFirst([1, 2, 3]);  // Returns number
```

**Real-world uses:**
- API responses: `ApiResponse<User>`
- Reusable components: `List<T>`
- Custom hooks: `useFetch<User[]>(url)`
- Data structures

Generics maintain type safety while allowing flexibility."

---

### Q: "What are utility types? Which do you use most?"

**Answer**: "Built-in TypeScript helpers for type transformations:

**Most common:**

**Partial** - Make all properties optional (for updates):
```typescript
function updateUser(id: number, updates: Partial<User>) {}
```

**Pick** - Select specific properties (for DTOs):
```typescript
type UserPreview = Pick<User, 'name' | 'email'>;
```

**Omit** - Remove properties (for security):
```typescript
type UserWithoutPassword = Omit<User, 'password'>;
```

**Record** - Create typed objects:
```typescript
type Permissions = Record<Role, string[]>;
```

These save time and reduce code duplication by leveraging existing types."

---

### Q: "How do you type React components and hooks?"

**Answer**: "Here's my approach:

**Props with interface:**
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  children?: React.ReactNode;
}
```

**Event handlers:**
```typescript
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};
```

**Hooks - let TypeScript infer when possible:**
```typescript
const [name, setName] = useState('John'); // Inferred as string

// Explicit when nullable
const [user, setUser] = useState<User | null>(null);

// useRef for DOM
const inputRef = useRef<HTMLInputElement>(null);
```

**Custom hooks with generics:**
```typescript
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  return { data };
}

const { data } = useFetch<User[]>('/api/users');
```

**Key principle**: Let TypeScript infer when possible, be explicit when necessary."

---

### Q: "Difference between `any` and `unknown`?"

**Answer**: "Both represent uncertain types, but `unknown` is type-safe:

**any** - Opts out of type checking (dangerous):
```typescript
let value: any = "hello";
value.foo.bar(); // No error, crashes at runtime
```

**unknown** - Requires type checking (safe):
```typescript
let value: unknown = "hello";
value.toUpperCase(); // Error - must check type first

if (typeof value === 'string') {
  value.toUpperCase(); // OK
}
```

**Rule**: Always prefer `unknown` over `any`. Use `any` only when absolutely necessary (migrating JS to TS)."

---

### Q: "What is type assertion and when to use it?"

**Answer**: "Type assertion tells TypeScript 'trust me, I know the type.' Two syntaxes:

```typescript
// as syntax (preferred)
const value = response as User;

// angle bracket (avoid in JSX)
const value = <User>response;
```

**When to use:**
- Working with DOM: `const input = document.querySelector('input') as HTMLInputElement`
- Type narrowing when you have more info than TypeScript
- Third-party libraries with poor types

**Warning**: Bypasses type checking - can cause runtime errors. Better approach is type guards:

```typescript
// ❌ Assertion without validation
const user = data as User;

// ✓ Type guard with validation
function isUser(obj: any): obj is User {
  return obj && typeof obj.name === 'string';
}

if (isUser(data)) {
  // Safe to use
}
```

Use sparingly and validate when possible."

---

## Best Practices

1. **Enable strict mode** in tsconfig.json
2. **Avoid `any`** - Use `unknown` if type is uncertain
3. **Let TypeScript infer** - Don't over-annotate
4. **Prefer `interface`** for object shapes
5. **Use utility types** (Partial, Pick, Omit) over manual definitions
6. **Type function parameters** explicitly
7. **Use generics** for reusable code
8. **Validate before type assertions**
9. **Use discriminated unions** for complex state
10. **Keep types DRY** - reuse and compose

---

## Common Mistakes

**❌ Using `any` everywhere**:
```typescript
function process(data: any) { } // Defeats TypeScript purpose
```

**✓ Use proper types or `unknown`**:
```typescript
function process(data: User) { }
// or
function process(data: unknown) {
  if (isUser(data)) { /* safe */ }
}
```

**❌ Not using utility types**:
```typescript
type UpdateUser = {
  name?: string;
  email?: string;
  age?: number;
};
```

**✓ Use Partial**:
```typescript
type UpdateUser = Partial<User>;
```

**❌ Type assertion without validation**:
```typescript
const user = response as User; // Dangerous
```

**✓ Validate first**:
```typescript
if (isUser(response)) {
  // Safe
}
```

---

## Key Concepts Checklist

**Basics:**
- ✓ Primitive types (string, number, boolean)
- ✓ Arrays and object types
- ✓ Type inference

**Core Concepts:**
- ✓ Interfaces vs Types (when to use each)
- ✓ Utility types (Partial, Pick, Omit, Record)
- ✓ Generics (reusable, type-safe code)

**React Integration:**
- ✓ Component props typing
- ✓ Event handler types
- ✓ Hook typing (useState, useRef, custom hooks)

**Advanced:**
- ✓ Discriminated unions
- ✓ Type guards
- ✓ any vs unknown
