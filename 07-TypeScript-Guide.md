# TypeScript Interview Guide - Questions & Answers

TypeScript interview preparation with concise paragraph-style answers and code examples.

---

## 1. What is TypeScript and why use it?

TypeScript is a statically-typed superset of JavaScript that compiles to plain JavaScript. It catches errors at compile-time instead of runtime through type annotations. Benefits include early error detection, better IDE support with autocomplete and refactoring, self-documenting code, safer refactoring, and enhanced maintainability for large codebases. Use it for team projects, large applications, and enterprise software.

---

## 2. What are primitive types in TypeScript?

TypeScript has standard primitives like string, number, boolean, along with null, undefined, void for no return value, and never for functions that never return. There's also any which opts out of type checking (avoid it) and unknown which is a type-safe alternative requiring type checks before use. TypeScript often infers types from initial values, so explicit annotations aren't always needed.

```typescript
let name = "John"; // inferred as string
let user: User | null = null; // explicit when needed
```

---

## 3. What's the difference between interface and type?

Interface defines object shapes and supports extends keyword and declaration merging. Type can alias any type including primitives, unions, intersections, and computed properties but cannot merge. Use interface for object/class shapes and public APIs. Use type for unions, primitive aliases, intersections, and complex types. Most teams default to interface for objects.

```typescript
// ✓ Use INTERFACE for:

// 1. Object/Class shapes
interface User {
  id: number;
  name: string;
  email: string;
}

// 2. Extending other interfaces
interface Admin extends User {
  role: string;
  permissions: string[];
}

// 3. Declaration merging (adding properties later)
interface Window {
  customProperty: string;
}
interface Window {
  anotherProperty: number;
}
// Window now has both properties

// 4. Classes implementing contracts
class UserAccount implements User {
  id: number;
  name: string;
  email: string;
}

// 5. React component props (convention)
interface ButtonProps {
  label: string;
  onClick: () => void;
}

// ✓ Use TYPE for:

// 1. Union types
type Status = "active" | "inactive" | "pending";
type Result = Success | Error;

// 2. Primitive aliases
type ID = string | number;
type Email = string;

// 3. Intersections
type Admin = User & {
  role: string;
  permissions: string[];
};

// WHEN EITHER WORKS:

// Interface version
interface Product {
  name: string;
  price: number;
}

// Type version (equivalent)
type Product = {
  name: string;
  price: number;
};

// Rule of thumb: Use interface for objects, type for everything else
```

---

## 4. Explain generics and when to use them.

Generics create reusable, type-safe code that works with multiple types, like function parameters but for types. Without generics, you'd use any and lose type safety. With generics, TypeScript maintains the correct type through the function. Use them for reusable functions, API responses, data structures, React components, and custom hooks.

```typescript
function getFirst<T>(arr: T[]): T {
  return arr[0];
}
const num = getFirst([1, 2, 3]); // number
const str = getFirst(["a", "b"]); // string
```

---

## 5. What are the most common utility types?

Partial makes all properties optional for updates. Pick selects specific properties for DTOs. Omit removes properties for security. Required makes all optional properties required. Readonly prevents modifications. Record creates typed objects with specific keys. ReturnType extracts function return types. These reduce code duplication by transforming existing types.

```typescript
// Base type for examples
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  age?: number;
}

// 1. Partial<T> - Makes all properties optional
type UserUpdate = Partial<User>;
// { id?: number; name?: string; email?: string; password?: string; age?: number }

// 2. Required<T> - Makes all properties required
type CompleteUser = Required<User>;
// { id: number; name: string; email: string; password: string; age: number }

// 3. Readonly<T> - Makes all properties readonly
type ImmutableUser = Readonly<User>;
// { readonly id: number; readonly name: string; ... }

// 4. Pick<T, K> - Selects specific properties
type UserPreview = Pick<User, "name" | "email">;
// { name: string; email: string }

// 5. Omit<T, K> - Removes specific properties
type SafeUser = Omit<User, "password">;
// { id: number; name: string; email: string; age?: number }

// 6. Record<K, T> - Creates object type with specific keys
type UserRoles = Record<string, User>;
// { [key: string]: User }
type Permissions = Record<"read" | "write" | "delete", boolean>;
// { read: boolean; write: boolean; delete: boolean }

```

---

## 6. How do you type React component props?

Define props with an interface containing property names, types, and optional markers. Use React.ReactNode for children. Generic components use type parameters to work with any data type. Always specify event handler parameter types and return types.

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  children?: React.ReactNode;
}
```

---

## 7. How do you type React hooks?

Let TypeScript infer types from initial values when possible. Be explicit with union types like User | null for nullable state. Use HTMLInputElement for useRef with DOM elements. Custom hooks use generics to return properly typed data. Event handlers need specific React event types.

```typescript
const [name, setName] = useState("John"); // inferred
const [user, setUser] = useState<User | null>(null); // explicit
const inputRef = useRef<HTMLInputElement>(null);
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {};
```

---

## 8. What's the difference between any and unknown?

Any opts out of type checking completely, allowing any operation without errors even if it crashes at runtime. Unknown is type-safe and requires type checking before use. Always prefer unknown over any. Use any only when migrating JavaScript to TypeScript or dealing with truly dynamic data.

```typescript
let x: any = "hello";
x.foo.bar(); // No error, crashes at runtime

let y: unknown = "hello";
if (typeof y === "string") y.toUpperCase(); // Must check first
```


---

## 10. What are discriminated unions?

Discriminated unions are a type-safe way to handle different states where each variant has a unique literal property as a discriminant. TypeScript uses the discriminant in switch statements to narrow types automatically. This prevents invalid states and ensures exhaustive checking.

```typescript
type State =
  | { status: "loading" }
  | { status: "success"; data: string }
  | { status: "error"; error: string };

function handle(state: State) {
  if (state.status === "success") {
    console.log(state.data); // TypeScript knows data exists
  }
}
```

---

## 11. What are type guards?

Type guards are functions that narrow down types at runtime, helping TypeScript understand what type a value is. Built-in guards include typeof and instanceof. Custom type guards use the is keyword. Use them for API responses, user input validation, and runtime type checking.

```typescript
function isUser(obj: any): obj is User {
  return obj && typeof obj.name === "string";
}

if (isUser(data)) {
  console.log(data.name); // TypeScript knows it's User
}
```

---

## 12. How do you use generics with React components?

Generic components accept a type parameter to work with any data type while maintaining type safety. This is useful for lists, tables, or any component that displays dynamic data. The type parameter is inferred from props, so TypeScript knows the exact type throughout the component.

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map((item, i) => <li key={i}>{renderItem(item)}</li>)}</ul>;
}
```

---

## 13. What is type assertion and when should you use it?

Type assertion tells TypeScript "trust me, I know the type" using the as syntax. Use it for DOM manipulation, when you have more information than TypeScript, or with poorly-typed libraries. It bypasses type checking and can cause runtime errors, so use sparingly. Prefer type guards with validation over assertions.

```typescript
const input = document.querySelector("input") as HTMLInputElement;

// Better approach with validation
function isUser(obj: any): obj is User {
  return obj && typeof obj.name === "string";
}
```

---

## 14. How do you extend interfaces vs intersect types?

Interface uses the extends keyword to inherit properties from another interface. Type uses intersection with & to combine multiple types into one. Both achieve similar results, but extends is more explicit for inheritance while intersections are more flexible for combining unrelated types.

```typescript
interface Admin extends User {
  role: string;
}

type AdminUser = User & { role: string };
```

---

## 15. What are generic constraints?

Generic constraints limit what types can be used with a generic by requiring the type to have certain properties or methods. The constraint uses `extends` to say "the type must have at least these properties". This ensures you can safely access those properties inside the function.

```typescript
// Constraint: T must have a length property
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T) {
  console.log(item.length);
}

// ✓ Works - strings have .length property
logLength("hello"); // OK - "hello".length = 5

// ✓ Works - arrays have .length property
logLength([1, 2, 3]); // OK - [1,2,3].length = 3

// ✗ Error - numbers DON'T have .length property
logLength(123); // Error - 123.length doesn't exist

// Why? In JavaScript:
"hello".length;  // 5 - strings have length ✓
[1, 2, 3].length; // 3 - arrays have length ✓
(123).length;     // undefined - numbers don't have length ✗
```

**Key point**: The constraint checks if the type has the required property, not if it matches the value. Strings and arrays have `.length`, numbers don't.

---

## 16. How do you type custom hooks with generics?

Custom hooks use generics to return properly typed data based on the type parameter. This maintains type safety throughout the component using the hook. The generic is passed when calling the hook, and TypeScript infers all return types from it.

```typescript
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  // fetch logic
  return { data, loading };
}

const { data } = useFetch<User[]>("/api/users"); // data is User[] | null
```

---

## 17. What's declaration merging in interfaces?

Declaration merging happens when multiple interface declarations with the same name automatically combine into a single interface. This is useful for extending global types like Window or adding properties to third-party libraries. Types cannot merge, only interfaces can.

```typescript
interface Window {
  customProperty: string;
}
// Now Window type includes both default props and customProperty
```

---

## 17. What are mapped types?

Mapped types transform existing types by iterating over properties. Built-in utility types like Partial, Readonly, and Pick are implemented using mapped types. You can create custom mapped types to transform properties in specific ways.

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

---

## Summary

Key TypeScript concepts: primitive types with inference, interface vs type (objects vs unions), generics for reusable type-safe code, utility types (Partial, Pick, Omit, Record) to transform types, React typing with props interfaces and hook inference, any vs unknown (prefer unknown), discriminated unions for state machines, type guards for runtime checks, generic constraints, custom hooks with generics, and type assertions used sparingly. Always enable strict mode, avoid any, let TypeScript infer when possible, and validate before assertions.
