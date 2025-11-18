# Friday Interview Simulation - React & Performance Focus

Complete interview preparation based on actual interview questions. 2 hours 30 minutes simulation.

---

## Part 1: JavaScript Fundamentals (15-20 minutes)

### Q1: Explain closures and give a practical example.

**Answer**: Closures are functions that remember variables from their outer scope even after the outer function has finished executing. They're created when an inner function references outer variables.

```javascript
function createCounter() {
  let count = 0; // Private variable
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.getCount();  // 2
// count is private, can't access directly
```

**Practical use**: Data privacy, factory functions, event handlers maintaining state.

---

### Q2: What's the difference between var, let, and const?

**Answer**: var is function-scoped and hoisted with undefined initialization. let and const are block-scoped with Temporal Dead Zone. const prevents reassignment but objects/arrays can be mutated.

```javascript
// var - function scoped, hoisted
console.log(x); // undefined
var x = 5;

// let - block scoped, TDZ
console.log(y); // ReferenceError
let y = 5;

// const - block scoped, no reassignment
const obj = { name: 'John' };
obj.name = 'Jane'; // ✓ OK - mutation allowed
obj = {};          // ✗ Error - reassignment not allowed
```

---

### Q3: Explain the event loop and async execution.

**Answer**: JavaScript is single-threaded with a call stack for synchronous code. The event loop processes the callback queue. Microtasks (Promises) run before macrotasks (setTimeout). This enables non-blocking async operations.

```javascript
console.log('1'); // Sync - runs first
setTimeout(() => console.log('2'), 0); // Macrotask - runs last
Promise.resolve().then(() => console.log('3')); // Microtask - runs third
console.log('4'); // Sync - runs second

// Output: 1, 4, 3, 2
// Order: Sync code → Microtasks → Macrotasks
```

---

### Q4: Explain the "this" keyword.

**Answer**: The `this` keyword is a reference to the execution context in which a function is invoked. Its value is determined dynamically at runtime based on how the function is called, not where it's defined. Understanding `this` requires knowing the invocation context.

**Four binding rules (in order of precedence):**

**1. Method Invocation** - When a function is called as a method of an object, `this` refers to that object.

```javascript
const person = {
  name: 'John',
  greet() {
    console.log(this.name); // this refers to person object
  }
};
person.greet(); // Output: "John"
```

**2. Function Invocation** - When a function is called standalone, `this` refers to the global object (window in browsers) or `undefined` in strict mode.

```javascript
function sayHi() {
  console.log(this); // global object (window) or undefined in strict mode
}
sayHi();
```

**3. Arrow Function Lexical Binding** - Arrow functions don't have their own `this` binding. They lexically inherit `this` from the enclosing scope at the time they're defined.

```javascript
const person = {
  name: 'Jane',
  greet: () => {
    console.log(this.name); // this refers to global scope, not person
  }
};
person.greet(); // Output: undefined (this is not person)

// Correct usage - arrow functions in callbacks
const person2 = {
  name: 'Alice',
  greet() {
    setTimeout(() => {
      console.log(this.name); // Arrow function inherits this from greet method
    }, 100);
  }
};
person2.greet(); // Output: "Alice"
```

**4. Context Loss** - When a method is extracted from its object and called independently, it loses its context.

```javascript
const person = {
  name: 'Bob',
  greet() {
    console.log(this.name);
  }
};

const greetFn = person.greet; // Extract method
greetFn(); // Output: undefined (this is now global object)

// Solutions:
// 1. bind()
const boundGreet = person.greet.bind(person);
boundGreet(); // Output: "Bob"

// 2. Arrow function wrapper
const arrowGreet = () => person.greet();
arrowGreet(); // Output: "Bob"

// 3. call() or apply()
greetFn.call(person); // Output: "Bob"
```

**Key Principles**:
- `this` is determined by invocation, not declaration
- Method calls: `this` = calling object
- Standalone functions: `this` = global object/undefined
- Arrow functions: `this` = lexically inherited from parent scope
- Explicit binding: use `bind()`, `call()`, or `apply()`

---

### Q5: What are JavaScript classes?

**Answer**: Classes are blueprints for creating objects with shared properties and methods. They're syntactic sugar over JavaScript's prototype system but provide cleaner syntax. Use `class` keyword, `constructor` for initialization, and methods for behavior.

```javascript
class User {
  // Constructor runs when creating new instance
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  // Method - shared by all instances
  greet() {
    return `Hello, I'm ${this.name}`;
  }

  // Static method - called on class itself, not instances
  static compareUsers(user1, user2) {
    return user1.name === user2.name;
  }
}

// Create instances
const user1 = new User('John', 'john@example.com');
const user2 = new User('Jane', 'jane@example.com');

console.log(user1.greet()); // "Hello, I'm John"
console.log(User.compareUsers(user1, user2)); // false

// Inheritance with extends
class Admin extends User {
  constructor(name, email, role) {
    super(name, email); // Call parent constructor
    this.role = role;
  }

  // Override parent method
  greet() {
    return `Hello, I'm ${this.name}, an ${this.role}`;
  }

  // New method only on Admin
  deleteUser() {
    return `${this.name} can delete users`;
  }
}

const admin = new Admin('Bob', 'bob@example.com', 'admin');
console.log(admin.greet()); // "Hello, I'm Bob, an admin"
console.log(admin.deleteUser()); // "Bob can delete users"
```

**Key points**:
- `constructor` initializes properties
- Methods defined inside class are shared
- `extends` creates child classes
- `super` calls parent class
- `static` methods belong to class, not instances

---

### Q6: What are callbacks and what is callback hell?

**Answer**: Callbacks are functions passed as arguments to other functions, executed later. Callback hell is when callbacks are nested deeply, making code hard to read and maintain. Modern solution: use Promises or async/await.

```javascript
// Simple callback
function fetchData(callback) {
  setTimeout(() => {
    callback({ id: 1, name: 'John' });
  }, 1000);
}

fetchData((user) => {
  console.log(user); // { id: 1, name: 'John' }
});

// CALLBACK HELL - nested callbacks (hard to read!)
getUserData(userId, (user) => {
  getOrders(user.id, (orders) => {
    getOrderDetails(orders[0].id, (details) => {
      getPaymentInfo(details.paymentId, (payment) => {
        processPayment(payment, (result) => {
          console.log('Done!');
        });
      });
    });
  });
});

// SOLUTION 1: Promises (cleaner)
getUserData(userId)
  .then(user => getOrders(user.id))
  .then(orders => getOrderDetails(orders[0].id))
  .then(details => getPaymentInfo(details.paymentId))
  .then(payment => processPayment(payment))
  .then(result => console.log('Done!'))
  .catch(err => console.error(err));

// SOLUTION 2: async/await (cleanest!)
async function processUserOrder(userId) {
  try {
    const user = await getUserData(userId);
    const orders = await getOrders(user.id);
    const details = await getOrderDetails(orders[0].id);
    const payment = await getPaymentInfo(details.paymentId);
    const result = await processPayment(payment);
    console.log('Done!');
  } catch (err) {
    console.error(err);
  }
}
```

**Problems with callback hell**:
- Hard to read (pyramid of doom)
- Difficult error handling
- Can't use try/catch
- Hard to maintain

**Modern approach**: Always prefer Promises or async/await over nested callbacks.

---

### Q7: Code output exercises - What will these print?

**Exercise 1: Event loop basics**
```javascript
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');

// Output: A, D, C, B
// Why:
// 1. A - synchronous, runs immediately
// 2. D - synchronous, runs immediately
// 3. C - microtask (Promise), runs after sync code
// 4. B - macrotask (setTimeout), runs last
```

**Exercise 2: var vs let in loops**
```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Output: 3, 3, 3
// Why: var is function-scoped, only ONE i shared by all callbacks

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0);
}
// Output: 0, 1, 2
// Why: let is block-scoped, each iteration gets its OWN j
```

**Exercise 3: Closure with setTimeout**
```javascript
function test() {
  for (var i = 1; i <= 3; i++) {
    setTimeout(function() {
      console.log(i);
    }, i * 1000);
  }
}
test();

// Output after 1s, 2s, 3s: 4, 4, 4
// Why: Loop completes (i=4), THEN timeouts execute
// All three callbacks see the same i = 4

// Fix with IIFE (Immediately Invoked Function Expression)
function testFixed() {
  for (var i = 1; i <= 3; i++) {
    (function(num) {
      setTimeout(function() {
        console.log(num);
      }, num * 1000);
    })(i);
  }
}
testFixed();
// Output after 1s, 2s, 3s: 1, 2, 3
// Why: IIFE creates new scope for each iteration
```

**Exercise 4: Promise vs setTimeout**
```javascript
setTimeout(() => console.log('1'), 0);
Promise.resolve().then(() => console.log('2'));
Promise.resolve().then(() => setTimeout(() => console.log('3'), 0));
Promise.resolve().then(() => console.log('4'));
setTimeout(() => console.log('5'), 0);

// Output: 2, 4, 1, 5, 3
// Why:
// Sync code first (none here)
// All microtasks: 2, 4 (Promise callbacks)
// Then macrotasks in order: 1 (first setTimeout), 5 (second setTimeout)
// 3 comes last (setTimeout inside Promise callback)
```

**Exercise 5: this context**
```javascript
const obj = {
  name: 'Object',
  regular: function() {
    console.log(this.name);
  },
  arrow: () => {
    console.log(this.name);
  }
};

obj.regular(); // "Object" - this = obj
obj.arrow();   // undefined - arrow has no this, uses window

const regularFunc = obj.regular;
regularFunc(); // undefined - lost context, this = window
```

---

### Q8: What are Promises and async/await?

**Answer**: Promises represent eventual completion or failure of async operations with three states: pending, fulfilled, rejected. async/await is syntactic sugar making async code look synchronous. async functions always return Promises.

```javascript
// Promise
fetch('/api/users')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// async/await
async function getUsers() {
  try {
    const res = await fetch('/api/users');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

// Parallel requests
const [users, posts] = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/posts').then(r => r.json())
]);
```

---

## Part 2: React Fundamentals (25-30 minutes)

### Q5: Explain the Virtual DOM and reconciliation.

**Answer**: Virtual DOM is a lightweight JavaScript representation of the real DOM. When state changes, React creates a new virtual DOM tree, compares it with the previous one using a diffing algorithm, and updates only the changed parts in the real DOM. This minimizes expensive DOM operations.

**Reconciliation process**:
1. State changes trigger re-render
2. New virtual DOM tree created
3. Diff algorithm compares old vs new
4. Calculate minimal changes needed
5. Batch update real DOM

**Keys importance**: Keys help React identify which items changed, were added, or removed. Without proper keys, React may re-render entire lists unnecessarily.

---

### Q6: Explain React component lifecycle with hooks.

**Answer**: Class components had distinct lifecycle methods (mount, update, unmount). Hooks unified this. useEffect handles all lifecycle phases based on dependency array.

```javascript
// Mount (runs once)
useEffect(() => {
  console.log('Component mounted');
  fetchData();
}, []); // Empty deps = componentDidMount

// Update (runs when deps change)
useEffect(() => {
  console.log('Count changed:', count);
}, [count]); // Runs when count changes

// Unmount (cleanup)
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => {
    clearInterval(timer); // Cleanup = componentWillUnmount
  };
}, []);

// Every render (no deps array)
useEffect(() => {
  console.log('Runs on every render');
});
```

---

### Q7: When should you use useCallback vs useMemo?

**Answer**: useCallback memoizes functions, useMemo memoizes computed values. Both prevent recalculation/recreation on every render. Use when passing callbacks to memoized children or for expensive calculations.

```javascript
// useCallback - memoize function
const handleClick = useCallback(() => {
  console.log('Clicked', userId);
}, [userId]); // Only recreate if userId changes

// useMemo - memoize computed value
const expensiveValue = useMemo(() => {
  return data.filter(item => item.active)
    .map(item => item.value)
    .reduce((sum, val) => sum + val, 0);
}, [data]); // Only recalculate if data changes

// Pass to memoized child
const MemoizedChild = memo(Child);
<MemoizedChild onClick={handleClick} />
```

**When NOT to use**: Don't overuse - memoization has its own cost. Profile first, optimize when needed.

---

### Q8: Explain controlled vs uncontrolled components (simple examples).

**Answer**: The difference is WHO controls the input value - React state (controlled) or the DOM itself (uncontrolled).

**CONTROLLED = React is in control**
- Input value comes from state
- Changes update state via onChange
- React always knows the current value
- Can validate, transform, or prevent input

**UNCONTROLLED = DOM is in control**
- Input manages its own value
- Read value only when needed (submit) using ref
- React doesn't track changes
- Simpler for basic forms

```javascript
// CONTROLLED COMPONENT - React controls the value
function ControlledExample() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Name:', name);    // From state
    console.log('Email:', email);  // From state
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}                           // ← Value from state
        onChange={e => setName(e.target.value)} // ← Update state
        placeholder="Name"
      />
      <input
        value={email}                            // ← Value from state
        onChange={e => setEmail(e.target.value)} // ← Update state
        placeholder="Email"
      />
      <button type="submit">Submit</button>

      {/* Can show live validation */}
      {name.length > 0 && <p>Hello, {name}!</p>}
    </form>
  );
}

// UNCONTROLLED COMPONENT - DOM controls the value
function UncontrolledExample() {
  const nameRef = useRef();
  const emailRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Name:', nameRef.current.value);  // From DOM
    console.log('Email:', emailRef.current.value); // From DOM
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={nameRef}              // ← Just attach ref
        defaultValue="John"        // ← Initial value (optional)
        placeholder="Name"
      />
      <input
        ref={emailRef}             // ← Just attach ref
        placeholder="Email"
      />
      <button type="submit">Submit</button>

      {/* Can't show live validation - don't know value until submit */}
    </form>
  );
}
```

**When to use each:**

| Scenario | Use Controlled | Use Uncontrolled |
|----------|---------------|------------------|
| Live validation | ✓ | ✗ |
| Conditional submit button | ✓ | ✗ |
| Transform input (uppercase) | ✓ | ✗ |
| Character counter | ✓ | ✗ |
| Simple contact form | Either | ✓ |
| File input | ✗ | ✓ (only way) |
| Legacy code integration | ✗ | ✓ |

**Simple rule**: Use **controlled** for 95% of cases. Use **uncontrolled** only for file inputs or very simple forms.

---

## Part 3: Context API (15-20 minutes)

### Q9: What is Context API and when should you use it?

**Answer**: Context API provides a way to share data across the component tree without prop drilling. Use for global data like theme, authenticated user, language that many components need. Not a full state management solution - for complex state, use Redux or Zustand.

```javascript
// Create context
const ThemeContext = createContext();

// Provider
function App() {
  const [theme, setTheme] = useState('light');

  const value = useMemo(() => ({
    theme,
    setTheme
  }), [theme]); // Memoize to prevent unnecessary re-renders

  return (
    <ThemeContext.Provider value={value}>
      <Header />
      <Main />
    </ThemeContext.Provider>
  );
}

// Consumer
function Header() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <header className={theme}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </header>
  );
}
```

**Performance tip**: Memoize context value to prevent re-renders. Split contexts if unrelated data changes frequently.

---

### Q10: What are the performance implications of Context API?

**Answer**: Every context consumer re-renders when context value changes, even if it only uses part of the value. This can cause performance issues with frequent updates or many consumers.

**Solutions**:

```javascript
// ❌ Problem: All consumers re-render on any change
const AppContext = createContext();
const value = { user, theme, settings, notifications };

// ✓ Solution 1: Split contexts
const UserContext = createContext();
const ThemeContext = createContext();

// ✓ Solution 2: Memoize context value
const value = useMemo(() => ({ theme, setTheme }), [theme]);

// ✓ Solution 3: Split state and updater contexts
const StateContext = createContext();
const DispatchContext = createContext();

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// Components using only dispatch don't re-render on state changes
function UpdateButton() {
  const dispatch = useContext(DispatchContext); // Won't re-render
  return <button onClick={() => dispatch({ type: 'UPDATE' })}>Update</button>;
}
```

---

## Part 4: Redux (20-25 minutes)

### Q11: Explain Redux and its core principles.

**Answer**: Redux is a predictable state container with three principles: single source of truth (one store), state is read-only (dispatch actions), changes via pure functions (reducers). It's framework-agnostic and uses unidirectional data flow.

**Flow**: Component → Action → Reducer → Store → Component

```javascript
// Actions
const increment = () => ({ type: 'INCREMENT' });
const addUser = (user) => ({ type: 'ADD_USER', payload: user });

// Reducer (pure function)
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}

// Store
const store = createStore(counterReducer);

// Component
function Counter() {
  const count = useSelector(state => state.count);
  const dispatch = useDispatch();

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => dispatch(increment())}>+</button>
    </div>
  );
}
```

---

### Q12: What is Redux Toolkit and why use it?

**Answer**: Redux Toolkit is the official recommended way to write Redux logic. It includes utilities to simplify store setup, reduce boilerplate, and includes best practices by default. Uses Immer for immutable updates.

```javascript
// Redux Toolkit - cleaner, less boilerplate
import { createSlice, configureStore } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { users: [], loading: false },
  reducers: {
    addUser: (state, action) => {
      state.users.push(action.payload); // Immer makes this safe
    },
    removeUser: (state, action) => {
      state.users = state.users.filter(u => u.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { addUser, removeUser, setLoading } = userSlice.actions;

const store = configureStore({
  reducer: {
    user: userSlice.reducer
  }
});

// Usage
dispatch(addUser({ id: 1, name: 'John' }));
```

**Benefits**: Less boilerplate, built-in Immer, DevTools configured, async thunks included.

---

### Q13: How do you handle async operations in Redux?

**Answer**: Use Redux Thunk (default in Redux Toolkit) for async logic. Thunks are functions that return functions instead of action objects. Redux Toolkit's createAsyncThunk handles pending/fulfilled/rejected states automatically.

```javascript
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Async thunk
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: { data: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Component
function Users() {
  const { data, loading, error } = useSelector(state => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <ul>{data.map(user => <li key={user.id}>{user.name}</li>)}</ul>;
}
```

---

## Part 5: React Performance Optimization (30-35 minutes)

### Q14: What are the main performance optimization techniques in React?

**Answer**:

1. **Memoization**: React.memo, useMemo, useCallback
2. **Code Splitting**: React.lazy, dynamic imports
3. **Virtualization**: Only render visible items in long lists
4. **Debouncing/Throttling**: Limit expensive operations
5. **Avoid inline objects/functions**: Prevent unnecessary re-renders
6. **Proper key usage**: Help React identify changes
7. **State colocation**: Keep state close to where it's used

```javascript
// 1. React.memo - prevent re-renders
const ExpensiveChild = memo(({ data, onClick }) => {
  console.log('Child rendered');
  return <div onClick={onClick}>{data}</div>;
});

// 2. Code splitting
const Dashboard = lazy(() => import('./Dashboard'));
<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>

// 3. Virtualization (react-window)
import { FixedSizeList } from 'react-window';
<FixedSizeList
  height={600}
  itemCount={1000}
  itemSize={50}
>
  {({ index, style }) => <div style={style}>Item {index}</div>}
</FixedSizeList>

// 4. Debouncing
const debouncedSearch = useMemo(
  () => debounce((query) => fetchResults(query), 300),
  []
);

// 5. Avoid inline objects
// ❌ Bad - new object every render
<Component style={{ margin: 10 }} />

// ✓ Good - reuse same object
const style = { margin: 10 };
<Component style={style} />

// 6. Proper keys
{items.map(item => <Item key={item.id} {...item} />)}

// 7. State colocation
// ❌ Bad - global state for local UI
const [isModalOpen, setIsModalOpen] = useState(false);

// ✓ Good - state in Modal component
function Modal() {
  const [isOpen, setIsOpen] = useState(false);
}
```

---

### Q15: How do you identify and fix performance issues?

**Answer**: Use React DevTools Profiler to identify slow renders, check why components re-render, and measure render times.

**Process**:
1. Open React DevTools → Profiler
2. Record interaction
3. Identify slow components (flame graph)
4. Check why component rendered
5. Apply optimizations
6. Re-profile to verify improvement

**Common issues and fixes**:

```javascript
// Issue 1: Unnecessary re-renders from inline functions
// ❌ Bad
<Child onClick={() => handleClick(id)} />

// ✓ Good
const onClick = useCallback(() => handleClick(id), [id]);
<Child onClick={onClick} />

// Issue 2: Creating new objects in render
// ❌ Bad
const options = { filter: 'active', sort: 'date' };
<List options={options} />

// ✓ Good
const options = useMemo(() => ({
  filter: 'active',
  sort: 'date'
}), []);

// Issue 3: Large list re-renders
// ❌ Bad
{users.map(user => <UserCard user={user} />)}

// ✓ Good
const MemoizedUserCard = memo(UserCard);
{users.map(user => <MemoizedUserCard key={user.id} user={user} />)}

// Issue 4: Expensive calculations on every render
// ❌ Bad
const total = items.reduce((sum, item) => sum + item.price, 0);

// ✓ Good
const total = useMemo(
  () => items.reduce((sum, item) => sum + item.price, 0),
  [items]
);
```

---

### Q16: Explain code splitting and lazy loading in React.

**Answer**: Code splitting breaks your bundle into smaller chunks loaded on demand. React.lazy enables component-level code splitting with dynamic imports. Suspense provides fallback UI during loading.

```javascript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy load routes
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// Conditional lazy loading
function AdminPanel() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const Advanced = lazy(() => import('./AdvancedSettings'));

  return (
    <div>
      <button onClick={() => setShowAdvanced(true)}>
        Show Advanced
      </button>
      {showAdvanced && (
        <Suspense fallback={<Spinner />}>
          <Advanced />
        </Suspense>
      )}
    </div>
  );
}
```

**Benefits**: Smaller initial bundle, faster page load, load features on demand.

---

## Part 6: Code Review & Problem Identification (30-40 minutes)

### Q17: Review this code and identify problems with solutions.

```javascript
// ❌ PROBLEMATIC CODE
function UserList() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');

  // Problem 1: No dependency array - runs on every render
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  });

  // Problem 2: No loading/error states

  // Problem 3: Inline function creates new reference every render
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Problem 4: No key or using index as key
  return (
    <div>
      <input
        value={filter}
        // Problem 5: Inline arrow function
        onChange={(e) => setFilter(e.target.value)}
      />
      {filteredUsers.map((user, index) => (
        // Problem 6: Index as key
        <div key={index}>
          {user.name}
          {/* Problem 7: Inline object */}
          <button style={{ margin: 10 }} onClick={() => deleteUser(user.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

**FIXED CODE:**

```javascript
// ✓ OPTIMIZED CODE
function UserList() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fix 1: Add empty dependency array - run only on mount
  useEffect(() => {
    let isMounted = true; // Cleanup flag

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();

        if (isMounted) {
          setUsers(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    // Cleanup
    return () => {
      isMounted = false;
    };
  }, []); // Fix 1: Empty deps

  // Fix 3: Memoize filtered users
  const filteredUsers = useMemo(() =>
    users.filter(user =>
      user.name.toLowerCase().includes(filter.toLowerCase())
    ),
    [users, filter]
  );

  // Fix 5: Memoize onChange handler
  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []);

  // Fix 7: Define style outside
  const buttonStyle = { margin: 10 };

  // Fix 7: Memoize delete handler
  const handleDelete = useCallback((id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    // Also call API to delete
    fetch(`/api/users/${id}`, { method: 'DELETE' });
  }, []);

  // Fix 2: Handle loading/error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <input
        value={filter}
        onChange={handleFilterChange} // Fix 5
        placeholder="Filter by name..."
      />
      {filteredUsers.length === 0 ? (
        <p>No users found</p>
      ) : (
        filteredUsers.map(user => (
          // Fix 6: Use unique ID as key
          <UserItem
            key={user.id}
            user={user}
            onDelete={handleDelete}
            buttonStyle={buttonStyle}
          />
        ))
      )}
    </div>
  );
}

// Extract to separate memoized component
const UserItem = memo(({ user, onDelete, buttonStyle }) => {
  const handleClick = useCallback(() => {
    onDelete(user.id);
  }, [user.id, onDelete]);

  return (
    <div>
      {user.name}
      <button style={buttonStyle} onClick={handleClick}>
        Delete
      </button>
    </div>
  );
});
```

**Problems identified:**
1. Missing dependency array causes infinite loop
2. No loading/error states
3. Expensive filter operation on every render
4. Inline functions create new references
5. Index as key causes reconciliation issues
6. Inline objects/styles create new references
7. No cleanup for async operations

---

## Part 7: Production Issues & Debugging (15-20 minutes)

### Q18: Describe your experience with production issues. How do you debug them?

**Answer structure**:

**Types of issues encountered**:
1. Memory leaks (event listeners, intervals, subscriptions)
2. Performance degradation (unnecessary re-renders)
3. Race conditions (concurrent API calls)
4. State synchronization issues
5. Third-party library bugs

**Debugging process**:

```javascript
// 1. Memory leaks
// ❌ Problem: Subscription not cleaned up
useEffect(() => {
  const subscription = eventEmitter.on('data', handleData);
  // Missing cleanup!
}, []);

// ✓ Solution: Cleanup subscription
useEffect(() => {
  const subscription = eventEmitter.on('data', handleData);
  return () => {
    subscription.unsubscribe();
  };
}, []);

// 2. Race conditions
// ❌ Problem: Multiple concurrent requests
const [data, setData] = useState(null);

useEffect(() => {
  fetch(`/api/users/${userId}`)
    .then(res => res.json())
    .then(setData); // May set stale data if userId changed
}, [userId]);

// ✓ Solution: Cancel previous request
useEffect(() => {
  let isCancelled = false;

  fetch(`/api/users/${userId}`)
    .then(res => res.json())
    .then(data => {
      if (!isCancelled) {
        setData(data);
      }
    });

  return () => {
    isCancelled = true;
  };
}, [userId]);

// 3. Error boundaries for production
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to monitoring service
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

**Tools used**:
- React DevTools Profiler
- Browser DevTools (Performance, Network)
- Sentry/LogRocket for error tracking
- Chrome Lighthouse for performance audits

---

## Part 8: Testing (15-20 minutes)

### Q19: What's your testing strategy and preferred tools?

**Answer**: I follow the testing pyramid: many unit tests, fewer integration tests, minimal e2e tests. I prefer React Testing Library for component testing because it encourages testing behavior over implementation.

**Testing approach**:

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserList } from './UserList';

// 1. Unit test - component behavior
describe('UserList', () => {
  // Mock API
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' }
        ])
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('displays loading state initially', () => {
    render(<UserList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays users after fetch', async () => {
    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
    });
  });

  test('filters users by name', async () => {
    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Filter by name...');
    await userEvent.type(input, 'John');

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.queryByText('Jane')).not.toBeInTheDocument();
  });

  test('handles fetch error', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Failed')));

    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  test('deletes user on button click', async () => {
    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByText('Delete')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText('John')).not.toBeInTheDocument();
    });
  });
});

// 2. Custom hook testing
import { renderHook, act } from '@testing-library/react';
import { useFetch } from './useFetch';

test('useFetch returns data', async () => {
  const { result } = renderHook(() => useFetch('/api/users'));

  expect(result.current.loading).toBe(true);

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual([{ id: 1, name: 'John' }]);
  });
});

// 3. Integration test with providers
import { Provider } from 'react-redux';
import { store } from './store';

test('updates Redux state on action', () => {
  render(
    <Provider store={store}>
      <ConnectedComponent />
    </Provider>
  );

  const button = screen.getByText('Add User');
  fireEvent.click(button);

  expect(screen.getByText('User added')).toBeInTheDocument();
});
```

**Best practices**:
- Test behavior, not implementation
- Mock external dependencies (APIs, timers)
- Use data-testid sparingly, prefer accessible queries
- Test error states and edge cases
- Keep tests isolated and independent

---

## Part 9: REST & GraphQL APIs (20-25 minutes)

### Q20: What are best practices for consuming REST APIs in React?

**Answer**:

1. **Centralize API calls** - Create an API service layer
2. **Handle errors consistently** - Global error handler
3. **Loading and error states** - Always handle all states
4. **Caching** - Avoid redundant requests
5. **Request cancellation** - Prevent memory leaks
6. **Authentication** - Interceptors for tokens

```javascript
// 1. API Service Layer
// api/client.js
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      }
    };

    // Add auth token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      // Global error handling
      console.error('API Error:', error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }
}

export const api = new ApiClient('https://api.example.com');

// 2. Custom hook for data fetching
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await api.get(url);
        if (!isCancelled) {
          setData(result);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}

// 3. Using React Query (recommended for complex apps)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function Users() {
  const queryClient = useQueryClient();

  // GET request with caching
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // POST mutation
  const createMutation = useMutation({
    mutationFn: (newUser) => api.post('/users', newUser),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  const handleCreate = () => {
    createMutation.mutate({ name: 'New User' });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.map(user => <div key={user.id}>{user.name}</div>)}
      <button onClick={handleCreate}>Add User</button>
    </div>
  );
}
```

---

### Q21: How do you work with GraphQL in React?

**Answer**: GraphQL allows requesting exactly the data needed in a single request. I use Apollo Client for React GraphQL integration with caching, optimistic updates, and real-time subscriptions.

```javascript
// 1. Setup Apollo Client
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.example.com/graphql',
  cache: new InMemoryCache(),
  headers: {
    authorization: `Bearer ${localStorage.getItem('token')}` || '',
  }
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Users />
    </ApolloProvider>
  );
}

// 2. Queries
import { useQuery, gql } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers($filter: String) {
    users(filter: $filter) {
      id
      name
      email
      posts {
        id
        title
      }
    }
  }
`;

function Users() {
  const { data, loading, error } = useQuery(GET_USERS, {
    variables: { filter: 'active' }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.users.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <p>Posts: {user.posts.length}</p>
        </div>
      ))}
    </div>
  );
}

// 3. Mutations
import { useMutation, gql } from '@apollo/client';

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
`;

function CreateUser() {
  const [createUser, { loading, error }] = useMutation(CREATE_USER, {
    // Update cache after mutation
    update(cache, { data: { createUser } }) {
      cache.modify({
        fields: {
          users(existingUsers = []) {
            const newUserRef = cache.writeFragment({
              data: createUser,
              fragment: gql`
                fragment NewUser on User {
                  id
                  name
                  email
                }
              `
            });
            return [...existingUsers, newUserRef];
          }
        }
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    createUser({
      variables: {
        input: {
          name: formData.get('name'),
          email: formData.get('email')
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" />
      <input name="email" type="email" placeholder="Email" />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}

// 4. Subscriptions (real-time)
import { useSubscription, gql } from '@apollo/client';

const USER_ADDED = gql`
  subscription OnUserAdded {
    userAdded {
      id
      name
      email
    }
  }
`;

function LiveUsers() {
  const { data, loading } = useSubscription(USER_ADDED);

  if (data) {
    console.log('New user added:', data.userAdded);
  }

  return <div>Listening for new users...</div>;
}
```

**GraphQL vs REST**:
- **GraphQL**: Single endpoint, precise data fetching, no over/under-fetching, strongly typed
- **REST**: Multiple endpoints, standard HTTP methods, easier caching, simpler for CRUD

---

## Part 10: Best Practices & Development Experience (15-20 minutes)

### Q22: What are your best practices for React development?

**Answer**:

1. **Component organization**:
```
src/
  components/
    common/        # Reusable components
    features/      # Feature-specific components
  hooks/           # Custom hooks
  utils/           # Helper functions
  services/        # API calls
  store/           # Redux/state management
  types/           # TypeScript types
```

2. **Code quality**:
- ESLint + Prettier for consistency
- TypeScript for type safety
- Husky for pre-commit hooks
- Code reviews

3. **Component patterns**:
```javascript
// Container/Presentational pattern
// Container - logic
function UserListContainer() {
  const { data, loading } = useFetch('/api/users');
  const [filter, setFilter] = useState('');

  const filtered = useMemo(
    () => data?.filter(u => u.name.includes(filter)),
    [data, filter]
  );

  return (
    <UserListPresentation
      users={filtered}
      loading={loading}
      filter={filter}
      onFilterChange={setFilter}
    />
  );
}

// Presentational - UI only
function UserListPresentation({ users, loading, filter, onFilterChange }) {
  if (loading) return <Spinner />;

  return (
    <div>
      <SearchInput value={filter} onChange={onFilterChange} />
      <UserGrid users={users} />
    </div>
  );
}

// Custom hooks for reusability
function useUserFiltering(users) {
  const [filter, setFilter] = useState('');

  const filtered = useMemo(
    () => users.filter(u => u.name.toLowerCase().includes(filter.toLowerCase())),
    [users, filter]
  );

  return { filtered, filter, setFilter };
}
```

4. **Error handling**:
```javascript
// Error boundaries for component errors
// Global error handler for API errors
// Fallback UI for each error type
// Logging to monitoring service (Sentry)
```

5. **Performance mindset**:
- Profile before optimizing
- Memoize expensive operations
- Code split routes
- Lazy load images
- Virtual scrolling for long lists

---

## Summary & Key Takeaways

**Most important topics for Friday**:

1. **JavaScript**: Closures, event loop, async/await
2. **React fundamentals**: Virtual DOM, hooks lifecycle, controlled components
3. **Context API**: When to use, performance implications
4. **Redux**: Core concepts, Redux Toolkit, async operations
5. **Performance**: React.memo, useMemo, useCallback, code splitting, profiling
6. **Code review skills**: Identify problems, propose solutions
7. **Production debugging**: Memory leaks, race conditions, error boundaries
8. **Testing**: React Testing Library, behavior over implementation
9. **API consumption**: REST service layer, GraphQL with Apollo, React Query
10. **Best practices**: Code organization, patterns, error handling

**Practice talking through**:
- How you've solved production issues
- Performance optimizations you've implemented
- Your testing approach and philosophy
- Trade-offs between different solutions

Good luck with your interview! 🚀
