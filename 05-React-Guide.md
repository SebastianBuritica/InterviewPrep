# React Interview Guide - Questions & Answers

React interview preparation with concise paragraph-style answers and code examples.

---

## 1. What is the Virtual DOM and how does it work?

The Virtual DOM is a lightweight JavaScript representation of the real DOM. When state changes, React creates a new virtual DOM tree, compares it with the previous one using a diffing algorithm, calculates the minimal changes needed, and updates only those parts in the real DOM. This is faster than direct DOM manipulation because JavaScript operations are fast while DOM operations are slow, and React batches updates efficiently.

```jsx
// Keys help React identify what changed
{users.map(user => <User key={user.id} {...user} />)}
```

---

## 2. Explain useState and when to use functional updates.

useState adds state to functional components, returning the current value and setter function. When the new state depends on the previous state, always use functional updates to avoid bugs with async operations. This ensures you're working with the latest state value.

```jsx
const [count, setCount] = useState(0);
setCount(prev => prev + 1); // ✓ Safe
setCount(count + 1); // ✗ Can cause bugs
```

---

## 3. How does useEffect work and what's the dependency array?

useEffect handles side effects like data fetching, subscriptions, and DOM updates. It runs after render. The dependency array controls when it runs: no array means every render, empty array means once on mount, and array with values means when those values change. Always return a cleanup function to prevent memory leaks.

```jsx
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer); // Cleanup
}, []);
```

---

## 4. When should you use useContext?

useContext shares data across the component tree without prop drilling. Use it for global data like theme, authenticated user, or language settings that many components at different levels need. All consumers re-render when the context value changes, so memoize the value to prevent unnecessary renders.

```jsx
const ThemeContext = createContext();
const value = useMemo(() => ({ theme, setTheme }), [theme]);
<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
```

---

## 5. What's the difference between useMemo and useCallback?

useMemo memoizes computed values while useCallback memoizes functions. Both prevent recalculation or recreation on every render. Use useMemo for expensive calculations or filtering large arrays. Use useCallback when passing callbacks to memoized child components or as useEffect dependencies. Don't overuse them - only optimize when you have actual performance issues.

```jsx
const filtered = useMemo(() => users.filter(u => u.active), [users]);
const handleClick = useCallback(() => console.log('clicked'), []);
```

---

## 6. When should you use useReducer instead of useState?

Use useReducer for complex state logic with multiple sub-values, when the next state depends on the previous one, or when you want predictable state updates. It's like local Redux. For simple state, useState is better. For complex forms or state machines, useReducer is clearer.

```jsx
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA': return { ...state, data: action.payload };
    default: return state;
  }
};
const [state, dispatch] = useReducer(reducer, initialState);
```

---

## 7. What is useRef and when do you use it?

useRef creates a mutable reference that persists across renders without triggering re-renders when changed. Use it to access DOM elements directly or store mutable values like timer IDs or previous values. It's essential for focusing inputs, measuring DOM nodes, or keeping values that shouldn't cause re-renders.

```jsx
const inputRef = useRef(null);
inputRef.current.focus();
```

---

## 8. How do you create custom hooks?

Custom hooks extract reusable logic and must start with "use". They can use other hooks inside. Create them to avoid duplicating logic across components, like data fetching, form handling, or window size tracking. Return values that components need.

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url).then(res => res.json()).then(setData).finally(() => setLoading(false));
  }, [url]);

  return { data, loading };
}
```

---

## 9. What is React.memo and when should you use it?

React.memo is a higher-order component that prevents re-renders if props haven't changed using shallow comparison. Use it for expensive components that render often with the same props. Don't overuse it - memoization has its own cost. Profile first to identify actual performance problems.

```jsx
const ExpensiveComponent = memo(({ data }) => {
  // Only re-renders when data changes
  return <div>{data}</div>;
});
```

---

## 10. Explain controlled vs uncontrolled components.

Controlled components have React state as the single source of truth. The input value is controlled by state and updates through onChange. Uncontrolled components let the DOM control values, accessed via refs. Use controlled for validation, conditional logic, and most forms. Use uncontrolled for file inputs or legacy code integration.

```jsx
// Controlled
const [value, setValue] = useState('');
<input value={value} onChange={e => setValue(e.target.value)} />

// Uncontrolled
const ref = useRef();
<input ref={ref} />
```

---

## 11. What is prop drilling and how do you avoid it?

Prop drilling is passing props through multiple component levels that don't need them to reach a deeply nested component. Avoid it with Context API for global data, component composition for layouts, or state management libraries for complex apps. Context is best for theme, auth, and language. Composition is better for layout slots.

```jsx
const UserContext = createContext();
const user = useContext(UserContext); // No prop drilling
```

---

## 12. Why are keys important in lists?

Keys help React identify which items changed, were added, or removed for efficient reconciliation. They must be stable and unique among siblings. Never use array index for dynamic lists because it causes bugs when list order changes. Without proper keys, component state gets mixed up and performance suffers.

```jsx
{items.map(item => <Item key={item.id} {...item} />)} // ✓
{items.map((item, i) => <Item key={i} {...item} />)} // ✗
```

---

## 13. How do you handle form validation in React?

Validate on submit by checking each field and setting error messages. Show errors only after submit or blur to avoid annoying users. Use controlled inputs for full control. Clear errors when users fix inputs. Validate required fields, formats, and lengths before submission.

```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  if (!email.includes('@')) {
    setError('Invalid email');
    return;
  }
  // Submit
};
```

---

## 14. What is code splitting and why use it?

Code splitting divides your bundle into smaller chunks loaded on demand, reducing initial load time. Use React.lazy and Suspense to load components only when needed. Apply it to routes, large libraries, or features not immediately necessary. This improves performance, especially on slow connections.

```jsx
const Dashboard = lazy(() => import('./Dashboard'));
<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

---

## 15. How does routing work in React and which libraries are used?

React doesn't have built-in routing. React Router DOM is the standard library for client-side routing, enabling navigation without page reloads. Use BrowserRouter for HTML5 history API, Routes to define route structure, Route for each path, Link for navigation, and useNavigate for programmatic navigation. Combine with React.lazy for route-based code splitting.

```jsx
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load route components
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserDetail = lazy(() => import('./pages/UserDetail'));

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// Access URL parameters
function UserDetail() {
  const { id } = useParams();
  return <div>User ID: {id}</div>;
}

// Programmatic navigation
function LoginButton() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/dashboard');
  };
  return <button onClick={handleLogin}>Login</button>;
}

// Protected routes
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}
```

**Other routing libraries**: TanStack Router (type-safe), Wouter (minimalist), Reach Router (deprecated).

---

## 16. How do you optimize React performance?

Start by profiling with React DevTools to identify actual problems. Prevent unnecessary re-renders with React.memo, useMemo, and useCallback. Use code splitting with lazy loading. Move state closer to where it's used. Use proper keys in lists. For long lists, use virtualization. Always profile before optimizing - don't guess.

---

## 17. Explain the component lifecycle with hooks.

Class components had distinct lifecycle methods: componentDidMount, componentDidUpdate, componentWillUnmount. useEffect handles all of these. Empty dependency array runs once on mount. Array with values runs when those change. Cleanup function runs on unmount. This unified approach is simpler and more flexible.

```jsx
useEffect(() => {
  // Mount + Update
  return () => { /* Unmount */ };
}, [dep]);
```

---

## 18. What are Higher-Order Components?

HOCs are functions that take a component and return an enhanced component. Use them for cross-cutting concerns like authentication checks, logging, or error boundaries. Modern React often replaces HOCs with hooks for better composition and less nesting.

```jsx
const withAuth = (Component) => (props) => {
  const { user } = useAuth();
  return user ? <Component {...props} /> : <Navigate to="/login" />;
};
```

---

## 19. When should you use Redux and how does it work?

Use Redux when state is needed by many components across the app, state updates are frequent and complex, or you want time-travel debugging and predictable state updates. For simpler apps, Context or local state suffices. Redux Toolkit simplifies the setup significantly.

**How Redux works - Unidirectional data flow**:

1. **Store**: Single source of truth holding entire application state as one object. Components subscribe to store and re-render when state changes.

2. **Actions**: Plain JavaScript objects describing what happened. Must have a `type` property. Optionally contains payload with data. Actions are dispatched from components.

3. **Dispatch**: Function that sends actions to the store. Components call dispatch to trigger state changes.

4. **Reducers**: Pure functions that take current state and action, return new state. Never mutate state directly - always return new object. Multiple reducers can be combined.

5. **Selectors**: Functions to extract specific data from store. Components use selectors to access only needed state.

**Flow**: Component dispatches action → Action sent to reducer → Reducer calculates new state → Store updates → Components subscribed to that state re-render.

**Three Principles**: Single source of truth (one store), state is read-only (only changed via actions), changes made with pure functions (reducers).

**Example flow**: User clicks button → Component dispatches `addUser` action → Reducer receives action and current state → Reducer returns new state with user added → Store updates → All components using user state re-render with new data.

```jsx
// Action: { type: 'ADD_USER', payload: { name: 'John' } }
// Reducer: (state, action) => { ...state, users: [...state.users, action.payload] }
// Store updates → Components re-render
```

---

## 20. What are the rules of hooks?

Only call hooks at the top level, never inside loops, conditions, or nested functions. Only call hooks from React functions or custom hooks, not regular JavaScript functions. These rules ensure hooks are called in the same order every render, which React relies on to maintain state correctly.

---

## Summary

Key React concepts: Virtual DOM with efficient reconciliation, useState with functional updates for dependent state, useEffect for side effects with cleanup, useContext for avoiding prop drilling, useMemo for values and useCallback for functions, useReducer for complex state, useRef for DOM access without re-renders, custom hooks for reusable logic, React.memo for preventing re-renders, controlled components for forms, proper keys for lists, code splitting with lazy loading, React Router for client-side routing with lazy-loaded routes, Redux unidirectional flow (dispatch action → reducer → store → re-render), and performance optimization through profiling first. Always handle loading and error states, cleanup effects, use proper keys, and profile before optimizing.
