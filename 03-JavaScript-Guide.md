# JavaScript - Modern Interview Guide

## ES6+ Essential Features

### 1. let, const vs var
**Theory**: `var` is function-scoped and hoisted (can use before declaration). `let` and `const` are block-scoped with Temporal Dead Zone (can't use before declaration).

```javascript
// var: function-scoped, hoisted
console.log(x); // undefined
var x = 5;

// let/const: block-scoped, TDZ
console.log(y); // ReferenceError
let y = 5;

// Block scope
if (true) {
  let blockVar = 'only here';
  var leaks = 'escapes block';
}
console.log(leaks); // Works!
// console.log(blockVar); // ReferenceError
```

**Use**: Always use `const` by default, `let` when reassignment needed, avoid `var`.

---

### 2. Arrow Functions
**Theory**: Shorter syntax, lexically binds `this` (inherits from parent scope), can't be used as constructors, no `arguments` object.

```javascript
// Regular vs Arrow
const add = (a, b) => a + b;
const double = x => x * 2;

// Lexical this
const obj = {
  count: 0,
  increment: function() {
    setInterval(() => {
      this.count++; // 'this' refers to obj
    }, 100);
  }
};
```

**When NOT to use**: Object methods, event handlers where you need the element as `this`.

---

### 3. Destructuring
**Theory**: Extract values from arrays/objects into distinct variables.

```javascript
// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4];

// Swapping
[x, y] = [y, x];

// Object destructuring
const { name, age = 18 } = user;

// Renaming
const { name: userName } = user;

// Function params
function greet({ name, age }) {
  console.log(`${name}, ${age}`);
}
```

---

### 4. Spread & Rest Operators
**Theory**: `...` syntax. Spread expands arrays/objects. Rest collects multiple elements.

```javascript
// Spread - expands
const arr = [...arr1, ...arr2];
const obj = { ...obj1, ...obj2 };
Math.max(...numbers);

// Rest - collects
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
```

---

### 5. Template Literals
**Theory**: Backticks for string interpolation and multi-line strings.

```javascript
const name = 'John';
const greeting = `Hello, ${name}!
  This is multi-line.
  Total: ${price * 1.08}`;
```

---

### 6. Default Parameters
```javascript
function greet(name = 'Guest', age = 18) {
  console.log(`${name}, ${age}`);
}
```

---

### 7. Enhanced Object Literals
```javascript
const name = 'John';
const obj = {
  name,                    // Shorthand property
  greet() { },            // Method shorthand
  ['dynamic' + 'Key']: 1  // Computed property names
};
```

---

## Asynchronous JavaScript

### Event Loop - Critical Interview Topic
**Theory**: JavaScript is single-threaded but handles async operations via the event loop.

**How it works**:
1. **Call Stack**: Executes synchronous code
2. **Web APIs**: Browser handles async operations (setTimeout, fetch)
3. **Callback Queue (Macrotasks)**: setTimeout, setInterval callbacks
4. **Microtask Queue**: Promises, queueMicrotask (higher priority)

**Execution order**:
1. Execute all synchronous code
2. Execute ALL microtasks (Promises)
3. Execute ONE macrotask (setTimeout)
4. Repeat

```javascript
console.log('1'); // Sync - runs 1st

setTimeout(() => console.log('2'), 0); // Macrotask - runs LAST

Promise.resolve().then(() => console.log('3')); // Microtask - runs 3rd

console.log('4'); // Sync - runs 2nd

// Output: 1, 4, 3, 2
```

**Key insight**: Promises ALWAYS run before setTimeout, even with 0ms delay!

---

### Promises
**Theory**: Object representing eventual completion/failure of async operation. Three states: pending, fulfilled, rejected.

```javascript
const promise = new Promise((resolve, reject) => {
  if (success) resolve(data);
  else reject(error);
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log('Done'));

// Promise methods
Promise.all([p1, p2]);        // All must resolve
Promise.race([p1, p2]);       // First to settle wins
Promise.allSettled([p1, p2]); // Wait for all (resolved or rejected)
Promise.any([p1, p2]);        // First to resolve (ignores rejections)
```

---

### Async/Await
**Theory**: Syntactic sugar over Promises. Makes async code look synchronous.

```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Sequential vs Parallel
// ❌ Sequential (slow)
const user = await fetch('/user');
const posts = await fetch('/posts');

// ✅ Parallel (fast)
const [user, posts] = await Promise.all([
  fetch('/user'),
  fetch('/posts')
]);
```

---

## Functional Programming Concepts

### Pure Functions
**Theory**: Same input always produces same output, no side effects.

```javascript
// ✅ Pure
const add = (a, b) => a + b;

// ❌ Impure (side effect)
let total = 0;
const addToTotal = (x) => total += x;
```

---

### Higher-Order Functions
**Theory**: Functions that take functions as arguments or return functions.

```javascript
// Takes function as argument
const numbers = [1, 2, 3];
numbers.map(x => x * 2);

// Returns function
const multiplyBy = (n) => (x) => x * n;
const double = multiplyBy(2);
double(5); // 10
```

---

### Immutability
**Theory**: Don't mutate data, create new copies.

```javascript
// ❌ Mutates
const arr = [1, 2, 3];
arr.push(4);

// ✅ Immutable
const newArr = [...arr, 4];

// Objects
const newObj = { ...obj, name: 'New' };
```

---

## Essential Array Methods

```javascript
const arr = [1, 2, 3, 4, 5];

// Transform
arr.map(x => x * 2);              // [2, 4, 6, 8, 10]

// Filter
arr.filter(x => x > 2);           // [3, 4, 5]

// Reduce
arr.reduce((sum, x) => sum + x, 0); // 15

// Find
arr.find(x => x > 2);             // 3
arr.findIndex(x => x > 2);        // 2

// Check
arr.some(x => x > 4);             // true
arr.every(x => x > 0);            // true
arr.includes(3);                  // true

// Flatten
[1, [2, [3]]].flat(2);            // [1, 2, 3]
arr.flatMap(x => [x, x * 2]);     // [1, 2, 2, 4, 3, 6, ...]
```

---

## Closures
**Theory**: Function that remembers variables from its outer scope, even after outer function finishes.

```javascript
function createCounter() {
  let count = 0; // Captured in closure
  return {
    increment: () => ++count,
    getCount: () => count
  };
}

const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
// count is private, only accessible via methods
```

**Common Interview Question - Loop Closure**:
```javascript
// ❌ Problem
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}

// ✅ Solution: use let (block scoped)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}
```

---

## `this` Keyword
**Theory**: Context in which function executes. Depends on HOW function is called.

```javascript
// Global context
console.log(this); // window/global

// Object method
const obj = {
  name: 'John',
  greet() { console.log(this.name); } // 'John'
};

// Arrow function (lexical this)
const obj2 = {
  name: 'Jane',
  greet: () => console.log(this.name) // undefined (inherits parent this)
};

// Binding
const greet = obj.greet;
greet(); // undefined
greet.call(obj); // 'John'
greet.apply(obj); // 'John'
const bound = greet.bind(obj);
bound(); // 'John'
```

---

## Common Patterns

### Debounce
**Theory**: Delays execution until user stops action. Perfect for search inputs.

```javascript
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Usage: only search after user stops typing for 300ms
const search = debounce((query) => api.search(query), 300);
```

---

### Throttle
**Theory**: Executes at most once per interval. Perfect for scroll/resize events.

```javascript
function throttle(func, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Usage: handle scroll at most once per 100ms
const handleScroll = throttle(() => { /* ... */ }, 100);
```

---

### Memoization
**Theory**: Cache function results to avoid recalculation.

```javascript
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
```

---

## Critical Interview Questions

### Q1: Event Loop Execution Order
```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Output: 1, 4, 3, 2
```
**Why**: Sync first (1, 4), then microtasks/promises (3), then macrotasks/setTimeout (2).

---

### Q2: Closure in Loop
See Closures section above.

---

### Q3: `this` in Arrow Functions
Arrow functions don't have their own `this` - they inherit from parent scope.

---

### Q4: Difference between `==` and `===`
- `==`: Loose equality with type coercion (`'5' == 5` is true)
- `===`: Strict equality without coercion (`'5' === 5` is false)

Always use `===`.

---

### Q5: Remove Duplicates from Array
```javascript
const unique = [...new Set(array)];
// or
const unique = array.filter((item, i) => array.indexOf(item) === i);
```

---

### Q6: Flatten Array
```javascript
arr.flat(Infinity);
// or recursively
function flatten(arr) {
  return arr.reduce((acc, val) =>
    Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []
  );
}
```

---

### Q7: Deep Clone Object
```javascript
// Modern way
const clone = structuredClone(obj);

// Manual
const clone = JSON.parse(JSON.stringify(obj)); // Loses functions, dates
```

---

## Modern JavaScript Features

### Optional Chaining
```javascript
const name = user?.profile?.name; // No error if undefined
const result = obj.method?.(args); // Call only if method exists
```

---

### Nullish Coalescing
```javascript
const value = input ?? 'default'; // Only null/undefined trigger default
// vs
const value = input || 'default';  // Falsy values (0, '', false) trigger default
```

---

### Modules
```javascript
// Export
export const name = 'John';
export default function() { }

// Import
import defaultExport from './module.js';
import { name } from './module.js';
import * as module from './module.js';
```

---

## Best Practices

1. Use `const` by default, `let` when needed, never `var`
2. Use strict equality `===`
3. Use arrow functions for callbacks
4. Prefer `map`, `filter`, `reduce` over loops
5. Use `async/await` over `.then()`
6. Handle errors with `try/catch`
7. Avoid mutating data (use spread/rest)
8. Keep functions pure when possible
9. Use destructuring for cleaner code
10. Understand the event loop for async debugging
