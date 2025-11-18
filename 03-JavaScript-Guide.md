# JavaScript Interview Guide - Questions & Answers

JavaScript interview preparation with concise paragraph-style answers and code examples.

---

## 1. What is hoisting?

Hoisting is JavaScript's behavior of moving variable and function declarations to the top of their scope before code execution. Function declarations are fully hoisted (you can call them before they're written), but variables declared with var are hoisted with undefined as initial value. let and const are hoisted but in a "temporal dead zone" until the line where they're declared, throwing an error if accessed early. Function expressions and arrow functions are NOT hoisted like function declarations.

```javascript
// Function declarations are hoisted - works!
greet(); // "Hello"
function greet() {
  console.log("Hello");
}

// var is hoisted but initialized as undefined
console.log(x); // undefined (not error)
var x = 5;
console.log(x); // 5

// let/const are hoisted but in temporal dead zone - throws error!
console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;

// Function expressions are NOT hoisted like declarations
sayHi(); // TypeError: sayHi is not a function
var sayHi = function() {
  console.log("Hi");
};
```

**What's actually happening (how JavaScript sees it):**

```javascript
// JavaScript moves declarations to top:
function greet() {
  console.log("Hello");
}
var x; // Declaration hoisted
var sayHi; // Declaration hoisted

greet(); // Works because function is fully hoisted
console.log(x); // undefined (declared but not assigned yet)
x = 5; // Assignment stays in place
console.log(x); // 5

sayHi(); // Error: sayHi is undefined at this point
sayHi = function() {
  console.log("Hi");
};
```

**Simple rule**: Use function declarations if you need hoisting. Always declare variables at the top of scope to avoid confusion. Use const/let instead of var to catch errors early.

---

## 2. What's the difference between let, const, and var?

var is function-scoped and hoisted, meaning you can use it before declaration and it leaks out of blocks. let and const are block-scoped with a Temporal Dead Zone, so you can't use them before declaration. const prevents reassignment while let allows it. Always use const by default, let when reassignment is needed, and avoid var.

```javascript
if (true) {
  var leaks = 'escapes';
  let blockScoped = 'only here';
}
console.log(leaks); // Works
console.log(blockScoped); // Error
```

---

## 2. How do arrow functions differ from regular functions?

Arrow functions have shorter syntax and lexically bind this from the parent scope instead of having their own. They can't be used as constructors and don't have an arguments object. Use them for callbacks and when you need to preserve this context, but avoid them for object methods where you need dynamic this.

```javascript
const obj = {
  count: 0,
  increment: function() {
    setInterval(() => {
      this.count++; // Arrow inherits this from increment
    }, 100);
  }
};
```

---

## 3. Explain the event loop and execution order.

JavaScript is single-threaded but handles async via the event loop. Synchronous code executes first on the call stack. Then ALL microtasks like Promises run. Finally ONE macrotask like setTimeout runs, and the cycle repeats. Promises always run before setTimeout, even with 0ms delay.

```javascript
console.log('1'); // Sync
setTimeout(() => console.log('2'), 0); // Macrotask
Promise.resolve().then(() => console.log('3')); // Microtask
console.log('4'); // Sync
// Output: 1, 4, 3, 2
```

---

## 4. What are Promises and how do they work?

Promises represent eventual completion or failure of async operations with three states: pending, fulfilled, or rejected. Use then for success, catch for errors, and finally for cleanup. Promise.all waits for all to resolve, Promise.race takes the first to settle, and Promise.allSettled waits for all regardless of outcome.

```javascript
const promise = new Promise((resolve, reject) => {
  if (success) resolve(data);
  else reject(error);
});

Promise.all([p1, p2]); // All must succeed
Promise.race([p1, p2]); // First to finish wins
```

---

## 5. What's the difference between async/await and Promises?

async/await is syntactic sugar over Promises making async code look synchronous. async functions always return Promises. await pauses execution until Promise resolves. Use try/catch for error handling. For parallel requests, use Promise.all with await instead of sequential awaits to improve performance.

```javascript
// Sequential (slow)
const user = await fetch('/user');
const posts = await fetch('/posts');

// Parallel (fast)
const [user, posts] = await Promise.all([fetch('/user'), fetch('/posts')]);
```

---

## 6. Explain closures with an example.

Closures are functions that remember variables from their outer scope even after the outer function finishes. They're created when inner functions reference outer variables. Use closures for data privacy, factory functions, and maintaining state. Common interview question: var in loops creates closure bugs solved with let.

```javascript
function createCounter() {
  let count = 0; // Private
  return {
    increment: () => ++count,
    getCount: () => count
  };
}
```

---

## 7. Why does var in loops cause issues with setTimeout?

var is function-scoped so there's only ONE i variable shared by all iterations. The loop completes immediately with i = 3, then setTimeout callbacks run later and all reference the same i which is now 3. let fixes this because it's block-scoped - each iteration gets its own i that the callback captures.

```javascript
// What happens with var:
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Loop runs: i=0, i=1, i=2, i=3 (loop ends)
// 100ms later, all callbacks run and see i=3
// Output: 3, 3, 3

// What happens with let:
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Each iteration creates NEW i in its own block scope
// Iteration 1: i=0 (callback captures this specific 0)
// Iteration 2: i=1 (callback captures this specific 1)
// Iteration 3: i=2 (callback captures this specific 2)
// Output: 0, 1, 2
```

---

## 8. Explain callbacks and setTimeout execution order.

Callbacks are functions passed as arguments to other functions, executed later. setTimeout schedules a callback to run after a delay. The callback queue waits until the call stack is empty. Even setTimeout with 0ms delay runs after all synchronous code because it's a macrotask.

```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout 1');
}, 0);

setTimeout(() => {
  console.log('Timeout 2');
}, 0);

console.log('End');

// Execution order:
// 1. 'Start' - synchronous
// 2. 'End' - synchronous
// 3. 'Timeout 1' - macrotask (first scheduled)
// 4. 'Timeout 2' - macrotask (second scheduled)
// Output: Start, End, Timeout 1, Timeout 2

// Why? Call stack must be empty before callbacks run!
```

---

## 9. Explain type coercion, operators, and expressions.

Type coercion converts values between types automatically. Expressions combine values and operators to produce results. == coerces types (avoid it), === doesn't. Truthy values (non-zero numbers, non-empty strings, objects) evaluate to true. Falsy values (0, '', null, undefined, false, NaN) evaluate to false. Operators include arithmetic (+, -, *, /), comparison (===, !==, <, >), logical (&&, ||, !), and ternary (condition ? true : false).

```javascript
// Type coercion with ==
'5' == 5;        // true - string coerced to number
0 == false;      // true - false coerced to 0
'' == false;     // true - both coerced to 0
null == undefined; // true - special case

// No coercion with ===
'5' === 5;       // false - different types
0 === false;     // false - different types

// Truthy/Falsy
if ('hello') { }  // true - non-empty string is truthy
if (0) { }        // false - 0 is falsy
if ([]) { }       // true - empty array is truthy!
if ({}) { }       // true - empty object is truthy!

// Logical operators with coercion
'hello' || 'world';  // 'hello' - returns first truthy
0 || 'default';      // 'default' - 0 is falsy
'hi' && 'bye';       // 'bye' - returns last if all truthy
null && 'never';     // null - returns first falsy

// Ternary operator
const result = age >= 18 ? 'adult' : 'minor';

// Addition coercion
5 + '5';         // '55' - number coerced to string
5 - '2';         // 3 - string coerced to number
'5' * '2';       // 10 - both coerced to numbers
```

---

## 10. What are the most common array methods with examples?

Arrays have many built-in methods. map transforms each element returning new array. filter selects elements matching condition. find returns first match or undefined. some checks if any match. every checks if all match. includes checks if value exists. slice copies portion. concat combines arrays. join creates string.

```javascript
const nums = [1, 2, 3, 4, 5];

// map - transform each element
nums.map(x => x * 2);  // [2, 4, 6, 8, 10]

// filter - keep matching elements
nums.filter(x => x > 2);  // [3, 4, 5]

// find - first match
nums.find(x => x > 2);  // 3

// some - at least one matches
nums.some(x => x > 4);  // true

// every - all match
nums.every(x => x > 0);  // true

// includes - value exists
nums.includes(3);  // true

// slice - copy portion [start, end)
nums.slice(1, 3);  // [2, 3]

// concat - combine arrays
[1, 2].concat([3, 4]);  // [1, 2, 3, 4]

// join - create string
nums.join(', ');  // '1, 2, 3, 4, 5'

// reduce - accumulate
nums.reduce((sum, x) => sum + x, 0);  // 15

// Chaining methods
nums
  .filter(x => x > 2)    // [3, 4, 5]
  .map(x => x * 2)       // [6, 8, 10]
  .reduce((sum, x) => sum + x, 0);  // 24
```

---

## 11. How does the this keyword work?

this refers to the execution context and depends on how the function is called. In global scope it's window/global, in object methods it's the object, in arrow functions it's lexically inherited from parent scope. Use call, apply, or bind to explicitly set this. Arrow functions don't have their own this.

```javascript
const obj = {
  name: 'John',
  greet() { console.log(this.name); } // 'John'
};

const greet = obj.greet;
greet(); // undefined - lost context
greet.call(obj); // 'John' - explicit context
```

---

## 12. What's the difference between map and forEach?

map transforms data and returns a new array. forEach performs side effects and returns undefined. Use map when you need the result, forEach for logging or DOM manipulation. In React, always use map for rendering. Never use map if you're ignoring the return value.

```javascript
const doubled = [1, 2, 3].map(x => x * 2); // [2, 4, 6]
[1, 2, 3].forEach(x => console.log(x)); // undefined
```

---

## 13. Explain reduce and when to use it.

reduce accumulates array values into a single result by applying a function to each element with an accumulator. Use it for sums, counting occurrences, grouping by property, building objects from arrays, or flattening. Always provide an initial value for objects/arrays and remember to return the accumulator.

```javascript
const sum = [1, 2, 3].reduce((total, num) => total + num, 0); // 6

const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
```

---

## 14. Which array methods mutate the original array?

Mutating methods: push, pop, shift, unshift, splice, sort, reverse. Non-mutating methods: map, filter, slice, concat, flat, flatMap. Always prefer non-mutating methods for predictable code. Use spread operator to copy before mutating if needed.

```javascript
const arr = [1, 2, 3];
arr.push(4); // Mutates arr
const newArr = [...arr, 4]; // Doesn't mutate
```

---

## 15. What's the spread operator and rest parameters?

Spread (...) expands arrays or objects into individual elements. Rest collects multiple elements into an array. Use spread to copy arrays, merge objects, or pass array elements as function arguments. Use rest to accept variable number of function parameters.

```javascript
const arr = [...arr1, ...arr2]; // Spread
const obj = { ...obj1, name: 'New' }; // Spread

function sum(...numbers) { // Rest
  return numbers.reduce((a, b) => a + b, 0);
}
```

---

## 16. What is destructuring?

Destructuring extracts values from arrays or objects into distinct variables using shorthand syntax. Use it for cleaner code when accessing multiple properties, swapping variables, or destructuring function parameters. Supports default values and renaming.

```javascript
const { name, age = 18 } = user;
const { name: userName } = user; // Rename
const [first, second, ...rest] = [1, 2, 3, 4];
[x, y] = [y, x]; // Swap
```

---

## 17. Explain debounce and throttle.

Debounce delays execution until user stops an action for a specified time. Use for search inputs to wait until typing stops. Throttle executes at most once per interval regardless of how many times triggered. Use for scroll or resize events to limit execution frequency.

```javascript
// Debounce: wait 300ms after last keystroke
const search = debounce((query) => api.search(query), 300);

// Throttle: execute at most once per 100ms
const handleScroll = throttle(() => { /* ... */ }, 100);
```

---

## 18. What are higher-order functions?

Higher-order functions take functions as arguments or return functions. Array methods like map, filter, and reduce are higher-order functions. They enable functional programming patterns like composition and partial application. Common pattern is returning configured functions.

```javascript
const multiplyBy = (n) => (x) => x * n;
const double = multiplyBy(2);
double(5); // 10

[1, 2, 3].map(x => x * 2); // map is HOF
```

---

## 19. What are template literals?

Template literals use backticks for string interpolation with ${} syntax and support multi-line strings without escape characters. Use them for dynamic strings, multi-line text, or HTML templates. They're more readable than concatenation.

```javascript
const greeting = `Hello, ${name}!
  This is multi-line.
  Total: ${price * 1.08}`;
```

---

## 20. Explain optional chaining and nullish coalescing.

Optional chaining (?.) safely accesses nested properties without errors if undefined or null. Nullish coalescing (??) provides default values only for null or undefined, unlike || which triggers on any falsy value including 0, '', or false.

```javascript
const name = user?.profile?.name; // No error if undefined
const result = obj.method?.(args); // Call only if exists

const value = input ?? 'default'; // Only null/undefined
const value = input || 'default'; // Any falsy value
```

---

## 21. What are pure functions?

Pure functions always return the same output for the same input and have no side effects. They don't modify external state, mutate arguments, or perform I/O. Use them for predictable, testable code. Impure functions access or modify external variables or have side effects.

```javascript
// Pure
const add = (a, b) => a + b;

// Impure
let total = 0;
const addToTotal = (x) => total += x;
```

---

## 22. How do you deep clone an object?

Use structuredClone for modern browsers or JSON.parse(JSON.stringify(obj)) as a fallback, though it loses functions, dates, and circular references. For complex cases, use a library like Lodash. Spread operator only creates shallow copies.

```javascript
const clone = structuredClone(obj); // Modern
const clone = JSON.parse(JSON.stringify(obj)); // Fallback
const shallow = { ...obj }; // Only top level
```

---

## 23. What are JavaScript modules?

Modules organize code into separate files with export and import statements. Use export for named exports, export default for main export. import brings in dependencies. Modules have their own scope and load once. Use for code organization and reusability.

```javascript
// module.js
export const name = 'John';
export default function() { }

// app.js
import defaultExport from './module.js';
import { name } from './module.js';
```

---

## Summary

Key JavaScript concepts: let/const over var for block scoping, arrow functions for lexical this, event loop with microtasks before macrotasks, Promises and async/await for async operations, closures for data privacy, var loop issues with setTimeout solved by let, callbacks and execution order with call stack priority, type coercion with truthy/falsy values and == vs ===, common array methods (map, filter, find, some, every, reduce), this keyword context, spread/rest for arrays and objects, destructuring for cleaner code, debounce/throttle for performance, higher-order functions for composition, template literals for strings, optional chaining for safe access, pure functions for predictability, and modules for organization. Always avoid var, use strict equality, handle async properly, and prefer immutable operations.
