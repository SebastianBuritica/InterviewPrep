# React Interview Preparation Guide

## Core Concepts

### Components

**Theory**: Components are reusable, independent pieces of UI. They accept inputs (props) and return React elements describing what should appear on screen.

**Functional Components** (modern, preferred):
```jsx
const Welcome = ({ name }) => <h1>Hello, {name}!</h1>;
```

**Class Components** (legacy, still asked about):
```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

### JSX

**Theory**: JSX is a syntax extension that looks like HTML but is actually JavaScript. It gets compiled to `React.createElement()` calls. You can embed any JavaScript expression in JSX using curly braces `{}`.

```jsx
// Conditional rendering
{isLoggedIn ? <UserGreeting /> : <GuestGreeting />}
{showWarning && <Warning />}

// Lists - always use keys for performance
{users.map(user => <User key={user.id} {...user} />)}

// Fragments - return multiple elements without extra DOM node
<>
  <ChildA />
  <ChildB />
</>
```

### Virtual DOM & Reconciliation

**Virtual DOM**: Lightweight JavaScript representation of the real DOM. React keeps a virtual DOM tree in memory.

**How it works:**
1. State changes trigger a re-render
2. React creates a new virtual DOM tree
3. **Diffing algorithm** compares new tree with old tree
4. **Reconciliation** - React calculates minimal set of changes needed
5. React updates only changed parts in real DOM (efficient!)

**Why it's fast**: Manipulating real DOM is slow. Virtual DOM allows React to batch updates and minimize actual DOM operations.

**Keys importance**: Keys help React identify which items changed, were added, or removed. Use stable, unique IDs - never use array index for dynamic lists!

## Essential Hooks

### useState

**Theory**: Adds state to functional components. Returns [currentValue, setterFunction]. When state updates, component re-renders.

**Live coding tips:**
```jsx
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// ALWAYS use functional update when new state depends on previous
setCount(prev => prev + 1); // ✓ Safe
setCount(count + 1); // ✗ Can cause bugs with async operations

// Update object - use spread operator
setUser(prev => ({ ...prev, name: 'John' }));
```

### useEffect

**Theory**: Handles side effects (data fetching, subscriptions, DOM updates). Runs AFTER render. Return cleanup function to prevent memory leaks.

**Dependency array:**
- No array: Runs after every render
- `[]`: Runs once on mount
- `[dep]`: Runs when dep changes

**Live coding tips - Data fetching pattern:**
```jsx
useEffect(() => {
  let isMounted = true; // Cleanup flag

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      const data = await response.json();
      if (isMounted) setUsers(data);
    } catch (err) {
      if (isMounted) setError(err.message);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchData();
  return () => { isMounted = false; }; // Cleanup
}, []);
```

**Common mistake**: Forgetting cleanup. Always return cleanup function for subscriptions/timers/fetch.

### useContext

**Theory**: Shares data across component tree without prop drilling. All consumers re-render when context value changes.

**When to use**: Theme, auth user, language settings - anything needed by many components at different levels.

```jsx
// Create & provide
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Consume
const Button = () => {
  const { theme } = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
};
```

### useReducer

**Theory**: Alternative to useState for complex state logic. Like Redux but local. Use when state has multiple sub-values or complex update logic.

**When to choose useReducer over useState:**
- State updates are complex
- Next state depends on previous
- Multiple related state values
- Want predictable state updates

```jsx
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_DATA':
      return { ...state, data: action.payload, loading: false };
    default:
      return state;
  }
};

const [state, dispatch] = useReducer(reducer, { data: [], loading: true });
dispatch({ type: 'SET_DATA', payload: users });
```

### useRef

**Theory**: Creates mutable reference that persists across renders. Does NOT trigger re-render when changed.

**Two main uses:**
1. Access DOM elements
2. Store mutable values (timers, previous values, etc.)

**Live coding tips:**
```jsx
const inputRef = useRef(null);

// Focus input
const handleFocus = () => inputRef.current.focus();

// Store timer ID
const timerRef = useRef(null);
timerRef.current = setInterval(() => {}, 1000);

// Cleanup
useEffect(() => {
  return () => clearInterval(timerRef.current);
}, []);
```

### useMemo

**Theory**: Memoizes (caches) expensive computed values. Only recalculates when dependencies change.

**When to use**: Expensive calculations, filtering/sorting large arrays, derived data.

**Live coding tip - Filter/sort:**
```jsx
const filteredUsers = useMemo(() => {
  return users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );
}, [users, search]);
```

**Don't overuse**: Only for actually expensive operations. Profile first!

### useCallback

**Theory**: Memoizes functions. Prevents function recreation on every render. Useful when passing callbacks to optimized child components.

**When to use**: Passing to React.memo'd components, as useEffect dependency.

```jsx
const handleClick = useCallback(() => {
  console.log('clicked');
}, []); // Empty deps = same function always

// With dependency
const handleDelete = useCallback((id) => {
  setUsers(prev => prev.filter(u => u.id !== id));
}, []); // No deps needed - uses functional update
```

**Relationship**: `useCallback(fn, deps)` = `useMemo(() => fn, deps)`

### Custom Hooks

**Theory**: Extract reusable logic. Must start with "use". Can use other hooks inside.

**Live coding - Simple fetch hook:**
```jsx
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// Usage
const { data, loading, error } = useFetch('/api/users');
```

## Performance Optimization

### React.memo

**Theory**: Higher-order component that memoizes component. Prevents re-render if props haven't changed (shallow comparison).

**When to use**: Expensive components that render often with same props.

```jsx
const ExpensiveComponent = memo(({ data }) => {
  // Only re-renders when data changes
  return <div>{data}</div>;
});

// Custom comparison
const MyComponent = memo(Component, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id; // true = don't re-render
});
```

### Code Splitting

**Theory**: Split code into smaller bundles loaded on demand. Reduces initial bundle size.

**When to use**: Route-based splitting, large libraries, features not needed immediately.

```jsx
const Dashboard = lazy(() => import('./Dashboard'));

<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

### Profiling

**What is Profiling**: Using React DevTools Profiler to measure component render performance. Shows:
- Which components rendered
- How long each render took
- Why component rendered (which prop/state changed)

**How to use:**
1. Open React DevTools → Profiler tab
2. Click record
3. Interact with app
4. Stop recording
5. Analyze flame graph - see slow components

**What to look for:**
- Components rendering too often
- Slow render times (yellow/red bars)
- Unnecessary re-renders

**Common fixes:**
- Add React.memo
- Use useMemo/useCallback
- Split large components
- Move state down (closer to where it's used)

## Component Patterns

### Container/Presentational Pattern

**Theory**: Separate logic from UI. Container handles data/logic, Presentational handles display.

**Benefits**: Reusability, easier testing, clear separation of concerns.

```jsx
// Presentational - just UI
const UserList = ({ users, onUserClick }) => (
  <ul>
    {users.map(user => (
      <li key={user.id} onClick={() => onUserClick(user)}>
        {user.name}
      </li>
    ))}
  </ul>
);

// Container - logic
const UserListContainer = () => {
  const { data: users, loading } = useFetch('/api/users');
  const handleClick = (user) => console.log(user);

  if (loading) return <Spinner />;
  return <UserList users={users} onUserClick={handleClick} />;
};
```

### Composition Pattern

**Theory**: Build complex UIs by composing smaller components. Use `children` prop or multiple slots.

**Benefits**: Flexible, reusable, follows "open/closed" principle.

```jsx
// Children prop
const Card = ({ children }) => (
  <div className="card">{children}</div>
);

<Card>
  <h2>Title</h2>
  <p>Content</p>
</Card>

// Multiple slots
const Layout = ({ header, sidebar, content }) => (
  <div>
    <header>{header}</header>
    <aside>{sidebar}</aside>
    <main>{content}</main>
  </div>
);
```

### Higher-Order Components (HOC)

**Theory**: Function that takes a component and returns enhanced component. Used for cross-cutting concerns.

**Use cases**: Auth checks, logging, error boundaries.

```jsx
const withAuth = (Component) => {
  return (props) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return <Component {...props} />;
  };
};

const ProtectedPage = withAuth(Dashboard);
```

**Note**: Hooks often replace HOCs in modern React.

## Forms & Controlled Components

**Theory**: Controlled components - React state is "single source of truth". Form data is handled by React state, not DOM.

**Benefits**: Full control, validation, conditional logic.

```jsx
const Form = () => {
  const [form, setForm] = useState({ name: '', email: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
};
```

## Error Boundaries

**Theory**: Class components that catch JavaScript errors in child component tree. Only class components can be error boundaries (no hook equivalent yet).

**Catches**: Rendering errors, lifecycle errors, constructor errors.
**Doesn't catch**: Event handlers, async code, SSR errors.

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

## React Router

**Theory**: Client-side routing. Changes URL without page reload.

```jsx
import { BrowserRouter, Routes, Route, Link, Navigate, useParams, useNavigate } from 'react-router-dom';

const App = () => (
  <BrowserRouter>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users/:userId" element={<UserDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

// Get URL params
const UserDetail = () => {
  const { userId } = useParams();
  return <div>User {userId}</div>;
};

// Programmatic navigation
const Login = () => {
  const navigate = useNavigate();
  const handleLogin = () => navigate('/dashboard');
  return <button onClick={handleLogin}>Login</button>;
};

// Protected routes
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};
```

## State Management - Redux Toolkit

**Theory**: Centralized state management. Use when:
- State needed by many components
- State updates are frequent
- Complex state logic
- Want time-travel debugging

**Core concepts:**
- **Store**: Holds entire app state
- **Actions**: Plain objects describing what happened
- **Reducers**: Pure functions that update state
- **Dispatch**: Send actions to store

```jsx
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

// Create slice
const userSlice = createSlice({
  name: 'user',
  initialState: { users: [], loading: false },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { setUsers, setLoading } = userSlice.actions;

// Create store
const store = configureStore({
  reducer: { user: userSlice.reducer }
});

// Provide store
<Provider store={store}>
  <App />
</Provider>

// Use in components
const UserList = () => {
  const users = useSelector(state => state.user.users);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        dispatch(setLoading(true));
        const response = await fetch('/api/users');
        const data = await response.json();
        dispatch(setUsers(data));
      } catch (err) {
        console.error(err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUsers();
  }, [dispatch]);

  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
};
```

## Live Coding Interview Tips

### Impress with These Practices:

1. **Loading & Error States** - Always handle them
```jsx
if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
```

2. **Cleanup** - Show you understand useEffect
```jsx
useEffect(() => {
  let isMounted = true;
  // ...
  return () => { isMounted = false; };
}, []);
```

3. **Keys in Lists** - Use proper keys
```jsx
{users.map(user => <User key={user.id} {...user} />)}
```

4. **Functional Updates** - When state depends on previous
```jsx
setCount(prev => prev + 1);
```

5. **Optional Chaining** - Safe property access
```jsx
<div>{user?.name}</div>
```

6. **Destructuring** - Clean code
```jsx
const { name, email, age } = user;
```

7. **Error Handling** - Try/catch in async functions
```jsx
try {
  const data = await fetch(url);
} catch (error) {
  setError(error.message);
}
```

8. **Accessibility** - Add basic a11y
```jsx
<button aria-label="Close">×</button>
```

### Common 30-Min Tasks:

**Fetch and Display:**
```jsx
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
};
```

**Search/Filter:**
```jsx
const SearchableList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  const filteredUsers = useMemo(() =>
    users.filter(u => u.name.toLowerCase().includes(search.toLowerCase())),
    [users, search]
  );

  return (
    <>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
      <ul>{filteredUsers.map(u => <li key={u.id}>{u.name}</li>)}</ul>
    </>
  );
};
```

**Toggle/Delete:**
```jsx
const TodoList = () => {
  const [todos, setTodos] = useState([]);

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => toggleTodo(todo.id)}
          />
          {todo.text}
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};
```

## Interview Questions

### Q: "What is Virtual DOM and how does React use it?"

**Answer**: "The Virtual DOM is a lightweight JavaScript representation of the real DOM. Here's how React uses it:

1. When state changes, React creates a new virtual DOM tree
2. React compares it with the previous virtual DOM (diffing algorithm)
3. React calculates the minimal set of changes needed
4. React updates only those parts in the real DOM (reconciliation)

This is much faster than manipulating the real DOM directly because:
- JavaScript operations are fast
- DOM operations are slow
- React batches updates and minimizes DOM changes

Keys are important because they help React identify which items changed, were added, or removed, making the diffing process more efficient."

### Q: "Explain the component lifecycle and useEffect"

**Answer**: "In class components, lifecycle had distinct phases:
- **Mounting**: componentDidMount
- **Updating**: componentDidUpdate
- **Unmounting**: componentWillUnmount

With hooks, useEffect handles all of these:

```jsx
useEffect(() => {
  // Runs after render (like componentDidMount + componentDidUpdate)
  console.log('Effect ran');

  return () => {
    // Cleanup (like componentWillUnmount)
    console.log('Cleanup');
  };
}, [dependency]); // Control when it runs
```

**Dependency array:**
- No array: Runs after every render
- `[]`: Runs once on mount (like componentDidMount)
- `[dep]`: Runs when dep changes (like componentDidUpdate for specific values)

Common mistake: Forgetting cleanup leads to memory leaks with subscriptions/timers."

### Q: "When would you use useCallback vs useMemo?"

**Answer**: "Both memoize values, but for different purposes:

**useMemo** - Memoize computed values:
```jsx
const total = useMemo(() =>
  items.reduce((sum, item) => sum + item.price, 0),
  [items]
);
```

**useCallback** - Memoize functions:
```jsx
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);
```

**When to use:**
- **useMemo**: Expensive calculations, filtering/sorting large data
- **useCallback**: Passing callbacks to React.memo'd components, preventing function recreation

**Key insight**: `useCallback(fn, deps)` is just `useMemo(() => fn, deps)`. They're essentially the same, but useCallback has clearer intent for functions.

Don't overuse them - only when you have actual performance issues. Profile first!"

### Q: "What's the difference between controlled and uncontrolled components?"

**Answer**: "**Controlled components** - React state controls the form:
```jsx
const [value, setValue] = useState('');
<input value={value} onChange={(e) => setValue(e.target.value)} />
```

**Benefits:**
- Single source of truth
- Easy validation
- Conditional logic
- Full control

**Uncontrolled components** - DOM controls the form:
```jsx
const inputRef = useRef();
<input ref={inputRef} />
// Access value: inputRef.current.value
```

**Benefits:**
- Less code
- Integration with non-React code
- Performance (no re-render on every keystroke)

**When to use:**
- Controlled: Most cases, validation needed, conditional logic
- Uncontrolled: File inputs, integration with legacy code, simple forms

I prefer controlled components for predictability and testing."

### Q: "How do you optimize React application performance?"

**Answer**: "I follow this systematic approach:

**1. Identify Problems First (Profiling):**
- Use React DevTools Profiler
- Find components rendering too often
- Measure actual render times

**2. Common Optimizations:**

**Prevent Unnecessary Re-renders:**
- React.memo for expensive components
- useMemo for expensive calculations
- useCallback for stable function references

**Code Splitting:**
```jsx
const Dashboard = lazy(() => import('./Dashboard'));
<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

**Move State Down:**
- Keep state close to where it's used
- Prevents parent re-renders affecting unrelated children

**Virtualization:**
- For long lists (react-window, react-virtualized)
- Only render visible items

**3. Best Practices:**
- Proper keys in lists
- Avoid creating objects/arrays in render
- Debounce expensive operations
- Use production build

**Important**: Always profile first. Don't optimize prematurely - React is already fast!"

### Q: "Explain prop drilling and how to avoid it"

**Answer**: "Prop drilling is passing props through multiple component levels that don't need them, just to reach a deeply nested component.

**Problem:**
```jsx
<App user={user}>
  <Dashboard user={user}>
    <Sidebar user={user}>
      <UserMenu user={user} /> {/* Finally used here */}
    </Sidebar>
  </Dashboard>
</App>
```

**Solutions:**

**1. Context API** (best for global data):
```jsx
const UserContext = createContext();

<UserContext.Provider value={user}>
  <App />
</UserContext.Provider>

// Deep component
const UserMenu = () => {
  const user = useContext(UserContext);
  return <div>{user.name}</div>;
};
```

**2. Component Composition:**
```jsx
<Dashboard sidebar={<Sidebar><UserMenu user={user} /></Sidebar>}>
```

**3. State Management** (Redux, Zustand) for complex apps

**When to use each:**
- Context: Theme, auth, language
- Composition: Layouts, slots
- State management: Complex state logic, many components need same data"

### Q: "What are React keys and why are they important?"

**Answer**: "Keys help React identify which items in a list changed, were added, or removed.

**Why important:**
- **Performance**: Efficient reconciliation - React knows exactly what changed
- **State preservation**: Maintains component state correctly
- **Predictable behavior**: Prevents bugs with component state

**Rules:**
- Must be stable (same item = same key)
- Must be unique among siblings
- DON'T use array index for dynamic lists

**Bad:**
```jsx
{items.map((item, index) =>
  <Item key={index} {...item} /> // ✗ Causes bugs when list changes
)}
```

**Good:**
```jsx
{items.map(item =>
  <Item key={item.id} {...item} /> // ✓ Stable, unique ID
)}
```

**What happens without proper keys:**
- React may reuse component instances incorrectly
- State gets mixed up between components
- Poor performance - React can't optimize

Example bug: If you delete item at index 0, index 1 becomes index 0. React thinks item 0 is still there with different data, leading to wrong state."

## Best Practices

1. **Use functional components and hooks** - Modern standard
2. **Keep components small and focused** - Single responsibility
3. **Destructure props** - Cleaner code
4. **Always handle loading and error states**
5. **Use proper keys in lists** - Stable, unique IDs
6. **Cleanup in useEffect** - Prevent memory leaks
7. **Functional updates when state depends on previous**
8. **Use TypeScript** - Catch errors early
9. **Extract custom hooks** - Reusable logic
10. **Profile before optimizing** - Don't guess
11. **Move state down** - Closer to where it's used
12. **Use meaningful variable names**
13. **Add error boundaries** - Graceful error handling
14. **Accessibility** - aria labels, semantic HTML
15. **Test your components** - Confidence in refactoring
