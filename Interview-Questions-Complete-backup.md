# Preguntas Esenciales de Entrevista - 70 Preguntas

Preguntas técnicas de entrevista con respuestas concisas en español.

---

## React — Conceptos Fundamentales

**1. ¿Qué es el Virtual DOM y para qué se usa?**

El Virtual DOM es una representación ligera del DOM real en JavaScript. React lo usa para optimizar el renderizado: cuando cambia el estado, React crea un nuevo Virtual DOM, lo compara con el anterior (diffing), y solo actualiza las diferencias en el DOM real. Esto es más rápido porque manipular objetos JavaScript es mucho más eficiente que manipular el DOM directamente.

```javascript
// Cuando haces esto:
setState({ count: 5 });

// React internamente:
// 1. Crea nuevo Virtual DOM
// 2. Compara con el anterior
// 3. Solo actualiza lo que cambió en el DOM real
```

**2. ¿Cuáles son los problemas de usar el index como key?**

Usar el index como key causa problemas cuando la lista se reordena, se filtran items o se insertan/eliminan elementos. React puede asignar el estado incorrecto a los elementos porque los identifica por posición en lugar de identidad. Esto causa bugs donde los valores de inputs persisten en los elementos equivocados.

```javascript
// ❌ Mal - causa bugs al reordenar
{items.map((item, index) => (
  <div key={index}>{item.name}</div>
))}

// ✅ Bien - usa ID único
{items.map((item) => (
  <div key={item.id}>{item.name}</div>
))}
```

**3. Explica el ciclo de vida de un componente en React.**

El ciclo de vida tiene tres fases: **Montaje** (componente se crea e inserta en el DOM), **Actualización** (re-renderiza por cambios en state/props), y **Desmontaje** (componente se elimina del DOM). En componentes funcionales, useEffect maneja estas fases.

```javascript
useEffect(() => {
  // Montaje: código aquí se ejecuta al montar
  console.log('Componente montado');

  return () => {
    // Desmontaje: cleanup al desmontar
    console.log('Componente desmontado');
  };
}, []); // Array vacío = solo al montar/desmontar

useEffect(() => {
  // Actualización: se ejecuta cuando count cambia
  console.log('Count cambió:', count);
}, [count]);
```

**4. ¿Cómo simular componentWillUnmount con hooks?**

Retornando una función de cleanup desde useEffect. Esta función se ejecuta cuando el componente se desmonta o antes de que el efecto se ejecute de nuevo.

```javascript
useEffect(() => {
  // Configurar intervalo
  const interval = setInterval(() => {
    console.log('tick');
  }, 1000);

  // Cleanup: limpia el intervalo al desmontar
  return () => {
    clearInterval(interval);
  };
}, []);
```

**5. ¿Diferencia entre useMemo y useCallback?**

**useMemo** memoriza el **resultado** de un cálculo. **useCallback** memoriza la **función misma**. Usa useMemo para cálculos costosos, useCallback para funciones que pasas como props.

```javascript
// useMemo - memoriza el RESULTADO
const expensiveValue = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price, 0);
}, [items]);

// useCallback - memoriza la FUNCIÓN
const handleClick = useCallback(() => {
  console.log(count);
}, [count]);

// Sin useCallback, se crea nueva función en cada render
// Con useCallback, misma referencia = hijo no re-renderiza
```

**6. ¿Para qué sirven los custom hooks?**

Los custom hooks extraen lógica stateful reutilizable entre componentes. Empiezan con "use" y pueden usar otros hooks internamente.

```javascript
// Custom hook
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [url]);

  return { data, loading };
}

// Uso
function Users() {
  const { data, loading } = useFetch('/api/users');
  if (loading) return <p>Cargando...</p>;
  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

**7. ¿Has usado useReducer? ¿Para qué sirve?**

useReducer maneja estado complejo con múltiples sub-valores o cuando el próximo estado depende del anterior. Similar a Redux pero local al componente.

```javascript
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  );
}
```

**8. ¿Qué usos tiene useRef?**

useRef tiene dos usos principales: 1) Acceso directo a elementos DOM, 2) Almacenar valores mutables que persisten entre renders sin causar re-renders.

```javascript
function Component() {
  // Uso 1: Acceso a DOM
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  // Uso 2: Valor mutable sin re-render
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1; // No causa re-render
  });

  return <input ref={inputRef} />;
}
```

**9. ¿Cómo manejas inputs y formularios?**

Uso componentes controlados donde React state es la fuente de verdad. Para formularios complejos, uso React Hook Form.

```javascript
// Controlado
function Form() {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

**10. ¿Diferencia entre inputs controlados y no controlados?**

**Controlados**: React controla el valor mediante state (value + onChange). **No controlados**: DOM controla el valor, se accede con refs.

```javascript
// Controlado - React tiene control
function Controlled() {
  const [value, setValue] = useState('');
  return <input value={value} onChange={e => setValue(e.target.value)} />;
}

// No controlado - DOM tiene control
function Uncontrolled() {
  const inputRef = useRef();
  const handleSubmit = () => {
    console.log(inputRef.current.value); // Lee del DOM
  };
  return <input ref={inputRef} defaultValue="inicial" />;
}
```

---

## Estado Global & Redux

**11. ¿Diferencia entre estado local y global?**

**Estado local**: pertenece a un componente (useState/useReducer). **Estado global**: compartido entre múltiples componentes (Redux/Context/Zustand). Usa local cuando los datos solo se necesitan en un componente. Usa global para autenticación, tema, datos compartidos.

```javascript
// Local
function Counter() {
  const [count, setCount] = useState(0); // Solo este componente
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// Global
const AuthContext = createContext();
function App() {
  const [user, setUser] = useState(null); // Compartido globalmente
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Header /> {/* Puede acceder a user */}
      <Profile /> {/* Puede acceder a user */}
    </AuthContext.Provider>
  );
}
```

**12. ¿Cómo funciona Redux? Explica el flujo.**

Redux sigue flujo unidireccional: **Store** (guarda todo el estado) → **Dispatch** (envía acción) → **Reducer** (calcula nuevo estado) → **Store actualiza** → **Componentes re-renderizan**.

```javascript
// 1. Store
const store = configureStore({ reducer: counterReducer });

// 2. Reducer
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    default:
      return state;
  }
}

// 3. Componente
function Counter() {
  const count = useSelector(state => state.count);
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch({ type: 'increment' })}>
      {count}
    </button>
  );
}
```

**13. ¿Ventajas de Redux Toolkit?**

Redux Toolkit reduce boilerplate significativamente. Incluye configureStore (setup automático), createSlice (genera actions y reducers juntos), y createAsyncThunk (para lógica async). Tiene Immer integrado para escribir código "mutativo" que es inmutable.

```javascript
import { createSlice, configureStore } from '@reduxjs/toolkit';

// createSlice genera actions y reducer automáticamente
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value += 1; }, // Immer permite "mutar"
    decrement: state => { state.value -= 1; },
  }
});

export const { increment, decrement } = counterSlice.actions;
const store = configureStore({ reducer: counterSlice.reducer });
```

**14. ¿Cuándo usar Context API vs Redux?**

**Context API**: para estado simple como tema, auth, idioma. Sin dependencias extra. **Redux**: para estado complejo con actualizaciones frecuentes, múltiples fuentes de datos, o cuando necesitas DevTools potentes. Redux es mejor para apps grandes.

```javascript
// Context - simple, pocas actualizaciones
const ThemeContext = createContext();
<ThemeContext.Provider value={{ theme, setTheme }}>

// Redux - complejo, muchas actualizaciones
const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    comments: commentsReducer
  }
});
```

**15. ¿Has usado Zustand u otras librerías de estado?**

Zustand es más simple que Redux con menos boilerplate. Creas un store con un hook y los componentes se suscriben. No requiere providers ni context.

```javascript
import create from 'zustand';

// Crear store
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

// Usar en componente
function Counter() {
  const { count, increment } = useStore();
  return <button onClick={increment}>{count}</button>;
}
```

---

## Performance & Optimización

**16. ¿Técnicas para optimizar performance en React?**

Usa React.memo para prevenir re-renders innecesarios, useMemo para cálculos costosos, useCallback para referencias estables de funciones. Code splitting con lazy/Suspense reduce bundle inicial. Virtualiza listas largas con react-window.

```javascript
// React.memo previene re-renders
const ExpensiveChild = React.memo(({ data }) => {
  console.log('Render expensive');
  return <div>{data}</div>;
});

// useMemo para cálculos costosos
const total = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price, 0);
}, [items]);

// Code splitting
const Heavy = lazy(() => import('./Heavy'));
<Suspense fallback={<Loading />}>
  <Heavy />
</Suspense>
```

**17. ¿Qué es React.memo y cuándo usarlo?**

React.memo memoriza un componente y previene re-renders si las props no cambian. Úsalo para componentes que renderizan frecuentemente con las mismas props o tienen lógica de render costosa.

```javascript
// Sin memo - re-renderiza siempre que el padre renderiza
function Child({ name }) {
  console.log('Render');
  return <p>{name}</p>;
}

// Con memo - solo re-renderiza si name cambia
const Child = React.memo(({ name }) => {
  console.log('Render');
  return <p>{name}</p>;
});

function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <Child name="John" /> {/* Con memo: no re-renderiza */}
    </>
  );
}
```

**18. ¿Qué es code splitting y por qué usarlo?**

Code splitting divide tu bundle JavaScript en chunks más pequeños que se cargan bajo demanda. Reduce el bundle inicial y mejora el tiempo de carga. Se implementa con lazy y Suspense.

```javascript
import { lazy, Suspense } from 'react';

// Code splitting por ruta
const Home = lazy(() => import('./Home'));
const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

**19. ¿Cómo funciona lazy loading en React?**

Lazy loading difiere la carga de componentes hasta que se necesitan usando React.lazy y dynamic imports. Envuelves componentes lazy en Suspense para mostrar fallback mientras cargan.

```javascript
// Lazy loading de componente
const Modal = lazy(() => import('./Modal'));

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>Abrir</button>
      {showModal && (
        <Suspense fallback={<p>Cargando modal...</p>}>
          <Modal />
        </Suspense>
      )}
    </>
  );
}
```

**20. ¿Qué son Higher-Order Components?**

Los HOCs son funciones que toman un componente y retornan un nuevo componente con funcionalidad adicional. Se usan para reutilizar lógica. En React moderno, los custom hooks han reemplazado a los HOCs en la mayoría de casos.

```javascript
// HOC
function withAuth(Component) {
  return function AuthComponent(props) {
    const user = useAuth();
    if (!user) return <Login />;
    return <Component {...props} user={user} />;
  };
}

// Uso
const ProtectedPage = withAuth(Dashboard);

// Alternativa moderna: custom hook
function Dashboard() {
  const user = useAuth();
  if (!user) return <Login />;
  return <div>Dashboard para {user.name}</div>;
}
```

---

## JavaScript - Conceptos Core

**21. ¿Qué es hoisting?**

Hoisting es el comportamiento de JavaScript que mueve declaraciones al tope del scope antes de ejecutar. Las declaraciones de funciones se elevan completamente. Las variables var se elevan como undefined. let/const se elevan pero están en "temporal dead zone" hasta su declaración.

```javascript
// Hoisting de función - funciona
greet(); // "Hola"
function greet() {
  console.log("Hola");
}

// var se eleva como undefined
console.log(x); // undefined (no error)
var x = 5;

// let/const - temporal dead zone
console.log(y); // ReferenceError
let y = 10;

// Expresiones de función NO se elevan
sayHi(); // TypeError
var sayHi = function() {
  console.log("Hi");
};
```

**22. ¿Diferencia entre let, const y var?**

**var**: function-scoped, se eleva, se puede redeclarar. **let**: block-scoped, no se puede redeclarar. **const**: block-scoped, no se puede reasignar. Siempre usa const por defecto, let cuando necesites reasignar.

```javascript
// var - function scope
function test() {
  if (true) {
    var x = 1; // Se escapa del if
  }
  console.log(x); // 1
}

// let - block scope
function test2() {
  if (true) {
    let y = 1; // Solo dentro del if
  }
  console.log(y); // ReferenceError
}

// const - no se puede reasignar
const z = 1;
z = 2; // Error

// Pero objetos son mutables
const obj = { a: 1 };
obj.a = 2; // ✓ Funciona
obj = {}; // ✗ Error
```

**23. Explica closures con ejemplo.**

Closures son funciones que recuerdan variables de su scope externo incluso después de que la función externa terminó de ejecutarse. Se usan para data privacy, factory functions, callbacks.

```javascript
// Closure básico
function outer() {
  let count = 0; // Variable privada

  return function inner() {
    count++;
    console.log(count);
  };
}

const counter = outer();
counter(); // 1
counter(); // 2
counter(); // 3

// Factory con closure
function createCounter(start) {
  let count = start;
  return {
    increment: () => ++count,
    decrement: () => --count,
    get: () => count
  };
}

const c1 = createCounter(0);
c1.increment(); // 1
c1.increment(); // 2
```

**24. ¿Qué es el event loop?**

JavaScript es single-threaded pero maneja async con el event loop. Orden de ejecución: 1) Código síncrono, 2) TODAS las microtasks (Promises), 3) UNA macrotask (setTimeout), repite. Las Promises siempre se ejecutan antes que setTimeout.

```javascript
console.log('1'); // Síncrono
setTimeout(() => console.log('2'), 0); // Macrotask
Promise.resolve().then(() => console.log('3')); // Microtask
console.log('4'); // Síncrono

// Output: 1, 4, 3, 2
// Explicación:
// 1. Ejecuta síncronos: 1, 4
// 2. Ejecuta microtasks: 3
// 3. Ejecuta macrotasks: 2
```

**25. ¿Diferencia entre == y ===?**

**==** hace coerción de tipo (convierte antes de comparar). **===** compara valor Y tipo sin conversión. Siempre usa === para evitar bugs.

```javascript
// == hace coerción
5 == "5"    // true (convierte string a número)
0 == false  // true
null == undefined // true

// === NO hace coerción
5 === "5"   // false (número !== string)
0 === false // false
null === undefined // false

// Excepción: null/undefined
if (value == null) {} // Detecta null Y undefined
```

**26. Explica this en JavaScript.**

**this** depende de cómo se llama la función: 1) En métodos, this es el objeto. 2) En funciones regulares, this es global/undefined. 3) Arrow functions heredan this del scope padre. 4) Puedes fijar this con bind/call/apply.

```javascript
// 1. Método
const obj = {
  name: 'John',
  greet() {
    console.log(this.name); // 'John'
  }
};

// 2. Función regular
function show() {
  console.log(this); // global object o undefined
}

// 3. Arrow function
const obj2 = {
  name: 'Alice',
  greet() {
    setTimeout(() => {
      console.log(this.name); // 'Alice' (hereda this)
    }, 100);
  }
};

// 4. Pérdida de contexto y solución
const greet = obj.greet;
greet(); // undefined

const boundGreet = obj.greet.bind(obj);
boundGreet(); // 'John'
```

**27. ¿Qué son Promises y cómo funcionan?**

Promises representan el resultado eventual de una operación asíncrona. Tienen tres estados: pending, fulfilled, rejected. Usa .then() para éxito, .catch() para errores, .finally() para cleanup.

```javascript
// Crear Promise
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('Datos');
    } else {
      reject('Error');
    }
  }, 1000);
});

// Consumir
promise
  .then(data => console.log(data))
  .catch(error => console.error(error))
  .finally(() => console.log('Terminado'));

// Fetch API retorna Promise
fetch('/api/users')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

**28. ¿Diferencia entre Promise.all, Promise.allSettled y Promise.race?**

**Promise.all**: espera todas, falla si una falla. **Promise.allSettled**: espera todas sin importar éxito/fallo. **Promise.race**: retorna la primera que se resuelva.

```javascript
// Promise.all - todas exitosas o falla
Promise.all([
  fetch('/api/users'),
  fetch('/api/posts')
]).then(([users, posts]) => {
  console.log('Ambas exitosas');
}).catch(() => {
  console.log('Una falló');
});

// Promise.allSettled - todas completan
Promise.allSettled([
  fetch('/api/users'),
  fetch('/api/posts')
]).then(results => {
  results.forEach(r => {
    if (r.status === 'fulfilled') console.log(r.value);
    if (r.status === 'rejected') console.log(r.reason);
  });
});

// Promise.race - la primera
Promise.race([
  fetch('/api/users'),
  new Promise((_, reject) =>
    setTimeout(() => reject('Timeout'), 5000)
  )
]).then(data => console.log('Ganó:', data));
```

**29. ¿Qué es async/await?**

async/await es sintaxis que hace código asíncrono parecer síncrono. **async** hace que una función retorne Promise. **await** pausa ejecución hasta que la Promise se resuelva. Usa try/catch para manejar errores.

```javascript
// Con Promises - difícil de leer
function getUser() {
  return fetch('/api/user')
    .then(res => res.json())
    .then(user => {
      return fetch(`/api/posts/${user.id}`)
        .then(res => res.json());
    });
}

// Con async/await - más limpio
async function getUser() {
  try {
    const res = await fetch('/api/user');
    const user = await res.json();

    const postsRes = await fetch(`/api/posts/${user.id}`);
    const posts = await postsRes.json();

    return posts;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

**30. ¿Diferencia entre null y undefined?**

**undefined**: variable declarada pero no asignada. **null**: asignación explícita de "sin valor". Usa null cuando quieras indicar intencionalmente ausencia de valor.

```javascript
// undefined
let x;
console.log(x); // undefined

function test() {}
console.log(test()); // undefined (no retorna nada)

// null
let user = null; // Explícitamente sin valor

// Detectar ambos
if (value == null) {} // Detecta null Y undefined
if (value === null) {} // Solo null
if (value === undefined) {} // Solo undefined
```

**31. ¿Arrow functions vs funciones regulares?**

Arrow functions tienen sintaxis corta y heredan this del scope padre. No pueden usarse como constructores y no tienen objeto arguments.

```javascript
// Sintaxis
const regular = function(x) { return x * 2; }
const arrow = x => x * 2;

// this diferente
const obj = {
  count: 0,
  // Regular - this es obj
  incrementReg: function() {
    setTimeout(function() {
      this.count++; // ✗ this es global
    }, 100);
  },
  // Arrow - hereda this
  incrementArrow: function() {
    setTimeout(() => {
      this.count++; // ✓ this es obj
    }, 100);
  }
};
```

**32. Explica map, filter y reduce.**

**map**: transforma cada elemento. **filter**: selecciona elementos que cumplen condición. **reduce**: acumula valores en un resultado. Ninguno muta el array original.

```javascript
const nums = [1, 2, 3, 4, 5];

// map - transforma
const doubled = nums.map(n => n * 2);
// [2, 4, 6, 8, 10]

// filter - selecciona
const evens = nums.filter(n => n % 2 === 0);
// [2, 4]

// reduce - acumula
const sum = nums.reduce((acc, n) => acc + n, 0);
// 15

// Ejemplo complejo
const users = [
  { name: 'John', age: 25 },
  { name: 'Jane', age: 30 }
];

const names = users
  .filter(u => u.age >= 30)
  .map(u => u.name);
// ['Jane']
```

**33. ¿Qué es destructuring?**

Destructuring extrae valores de arrays u objetos en variables distintas. Hace el código más limpio.

```javascript
// Array destructuring
const arr = [1, 2, 3];
const [a, b, c] = arr;
console.log(a); // 1

// Con rest
const [first, ...rest] = arr;
console.log(rest); // [2, 3]

// Object destructuring
const user = { name: 'John', age: 25, city: 'NY' };
const { name, age } = user;
console.log(name); // 'John'

// Renombrar
const { name: userName } = user;
console.log(userName); // 'John'

// Default values
const { country = 'USA' } = user;

// En parámetros (React props)
function Profile({ name, age }) {
  return <p>{name} tiene {age} años</p>;
}
```

**34. ¿Spread y rest operators?**

**Spread (...)**: expande array/objeto. **Rest**: recolecta múltiples elementos en array. Misma sintaxis, propósito opuesto.

```javascript
// Spread - expande
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4]; // [1, 2, 3, 4]

const obj1 = { a: 1 };
const obj2 = { ...obj1, b: 2 }; // { a: 1, b: 2 }

// Rest - recolecta
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4); // 10

const [first, ...rest] = [1, 2, 3];
// first = 1, rest = [2, 3]

const { name, ...otherProps } = { name: 'John', age: 25, city: 'NY' };
// otherProps = { age: 25, city: 'NY' }
```

**35. ¿Diferencia entre shallow copy y deep copy?**

**Shallow copy**: copia nivel superior, propiedades anidadas siguen siendo referencias. **Deep copy**: copia independiente a todos los niveles.

```javascript
// Shallow copy
const original = { a: 1, nested: { b: 2 } };
const shallow = { ...original };

shallow.a = 10; // No afecta original ✓
shallow.nested.b = 20; // Afecta original ✗

console.log(original.nested.b); // 20

// Deep copy - JSON (solo para datos simples)
const deep = JSON.parse(JSON.stringify(original));
deep.nested.b = 30; // No afecta original ✓

// Deep copy - structuredClone (moderno)
const deep2 = structuredClone(original);
```

---

## TypeScript

**36. ¿Qué es TypeScript y por qué usarlo?**

TypeScript es JavaScript con tipos estáticos que se compila a JavaScript. Detecta errores en tiempo de compilación, mejora autocompletado del IDE, documenta código, y facilita refactoring seguro.

```typescript
// JavaScript - error en runtime
function greet(name) {
  return name.toUpperCase();
}
greet(123); // Runtime error

// TypeScript - error en compile time
function greet(name: string): string {
  return name.toUpperCase();
}
greet(123); // ✗ Compile error
```

**37. ¿Diferencia entre interface y type?**

**interface**: para objetos, soporta extends y declaration merging. **type**: para todo (unions, intersections, primitives), no puede mergear. Usa interface para objetos, type para unions/primitives.

```typescript
// Interface para objetos
interface User {
  id: number;
  name: string;
}

interface Admin extends User {
  role: string;
}

// Type para unions
type Status = "active" | "inactive";
type ID = string | number;

// Ambos funcionan para objetos
type UserType = {
  id: number;
  name: string;
};
```

**38. Explica generics.**

Generics crean código reutilizable y type-safe que funciona con múltiples tipos. Son como parámetros pero para tipos.

```typescript
// Sin generics - pierde type safety
function getFirst(arr: any[]): any {
  return arr[0];
}

// Con generics - mantiene tipo
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const num = getFirst([1, 2, 3]); // number
const str = getFirst(["a", "b"]); // string

// Generic en React
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(renderItem)}</ul>;
}
```

**39. ¿Utility types más comunes?**

**Partial**: hace propiedades opcionales. **Pick**: selecciona propiedades. **Omit**: remueve propiedades. **Required**: hace todo required. **Readonly**: previene mutación.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Partial - todas opcionales
type UserUpdate = Partial<User>;
// { id?: number; name?: string; email?: string }

// Pick - selecciona
type UserPreview = Pick<User, "name" | "email">;
// { name: string; email: string }

// Omit - remueve
type SafeUser = Omit<User, "password">;
// { id: number; name: string; email: string }

// Record - objeto con keys específicas
type Roles = Record<"admin" | "user" | "guest", boolean>;
// { admin: boolean; user: boolean; guest: boolean }
```

**40. ¿Cómo tipear props de componente React?**

Define interface con nombres de propiedades, tipos, y marca opcionales con ?.

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  children?: React.ReactNode;
}

function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// Uso
<Button label="Click" onClick={() => console.log('clicked')} />
```

**41. ¿Cómo tipear hooks de React?**

Deja que TypeScript infiera cuando sea posible. Sé explícito con unions o tipos complejos.

```typescript
// Inferido
const [count, setCount] = useState(0); // number

// Explícito con union
const [user, setUser] = useState<User | null>(null);

// useRef
const inputRef = useRef<HTMLInputElement>(null);

// Event handlers
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

// Custom hook con generic
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  return { data };
}

const { data } = useFetch<User[]>('/api/users');
```

**42. ¿Diferencia entre any y unknown?**

**any**: desactiva type checking (evitar). **unknown**: type-safe, requiere verificación antes de usar. Siempre prefiere unknown.

```typescript
// any - no detecta errores
let x: any = "hello";
x.foo.bar(); // No error, crash en runtime

// unknown - type-safe
let y: unknown = "hello";
y.toUpperCase(); // ✗ Error

if (typeof y === "string") {
  y.toUpperCase(); // ✓ OK después de verificar
}
```

**43. ¿Qué son discriminated unions?**

Discriminated unions manejan estados diferentes de forma type-safe usando una propiedad literal como discriminante.

```typescript
type State =
  | { status: "loading" }
  | { status: "success"; data: string }
  | { status: "error"; error: string };

function render(state: State) {
  switch (state.status) {
    case "loading":
      return <Spinner />;
    case "success":
      return <div>{state.data}</div>; // TS sabe que data existe
    case "error":
      return <Error message={state.error} />;
  }
}
```

**44. ¿Qué son type guards?**

Type guards son funciones que estrechan tipos en runtime. TypeScript entiende el tipo después del guard.

```typescript
// Type guard built-in
function process(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase()); // TS sabe que es string
  }
}

// Custom type guard
interface User {
  name: string;
}

function isUser(obj: any): obj is User {
  return obj && typeof obj.name === "string";
}

if (isUser(data)) {
  console.log(data.name); // TS sabe que es User
}
```

**45. ¿Qué es type assertion?**

Type assertion le dice a TypeScript "confía en mí, sé el tipo" con sintaxis `as`. Úsalo con cuidado, puede causar errores en runtime. Prefiere type guards.

```typescript
// Type assertion
const input = document.querySelector("input") as HTMLInputElement;
input.value = "test";

// Mejor con type guard
const input = document.querySelector("input");
if (input instanceof HTMLInputElement) {
  input.value = "test";
}
```

---

## CSS & Estilos

**46. ¿Qué es el CSS Box Model?**

El Box Model tiene 4 capas: content, padding, border, margin. **box-sizing: content-box** (default): width solo aplica a content. **box-sizing: border-box**: width incluye padding y border. Siempre usa border-box.

```css
/* Problema con content-box */
.box {
  width: 300px;
  padding: 20px;
  border: 5px solid;
  /* Total = 300 + 40 + 10 = 350px */
}

/* Solución con border-box */
* {
  box-sizing: border-box;
}
.box {
  width: 300px;
  padding: 20px;
  border: 5px solid;
  /* Total = 300px exacto */
}
```

**47. ¿Cuándo usar Flexbox vs CSS Grid?**

**Flexbox**: una dimensión (fila o columna). Usa para navbars, centrar, distribuir espacio. **Grid**: dos dimensiones (filas Y columnas). Usa para layouts de página, galerías, dashboards.

```css
/* Flexbox - navbar */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Grid - layout de página */
.layout {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  gap: 1rem;
}
```

**48. ¿Cómo funciona la Cascada CSS?**

La cascada decide qué estilo gana con 3 niveles: 1) **Importance** (!important gana), 2) **Specificity** (selectores más específicos), 3) **Source Order** (último gana si empatan).

```css
/* Nivel 1: Importance */
p { color: red !important; } /* Gana */
p { color: blue; }

/* Nivel 2: Specificity */
#intro { color: green; }    /* 0,1,0,0 - Gana */
.text { color: blue; }      /* 0,0,1,0 */
p { color: red; }           /* 0,0,0,1 */

/* Nivel 3: Source Order */
p { color: red; }
p { color: blue; }  /* Gana (último) */
```

**49. ¿Qué es Specificity CSS y cómo calcularla?**

Specificity es un sistema de puntuación con 4 columnas (A, B, C, D). Cuenta: inline styles (A), IDs (B), classes/attributes/pseudo-classes (C), elements (D). Compara izquierda a derecha.

```css
/* Cálculo */
p { }                    /* 0,0,0,1 */
.text { }                /* 0,0,1,0 */
#intro { }               /* 0,1,0,0 */
#nav .btn:hover { }      /* 0,1,2,0 (1 ID + 1 class + 1 pseudo) */

/* Ejemplo */
<p class="text" id="intro">Hola</p>

p { color: red; }           /* 0,0,0,1 */
.text { color: blue; }      /* 0,0,1,0 */
#intro { color: green; }    /* 0,1,0,0 - GANA */
```

**50. ¿Diferencia entre display none, visibility hidden y opacity 0?**

**display: none**: remueve del layout, no ocupa espacio, inaccesible. **visibility: hidden**: oculta pero ocupa espacio, no interactivo. **opacity: 0**: invisible pero ocupa espacio y es interactivo.

```css
.hidden-none { display: none; }       /* No espacio, no click */
.hidden-visibility { visibility: hidden; } /* Sí espacio, no click */
.hidden-opacity { opacity: 0; }       /* Sí espacio, sí click */
```

---

## HTML & Accesibilidad

**51. ¿Qué es HTML semántico?**

HTML semántico usa elementos que describen su significado: header, nav, article, section, footer en lugar de divs genéricos. Mejora accesibilidad, SEO, mantenibilidad.

```html
<!-- ✗ No semántico -->
<div class="header">
  <div class="nav">...</div>
</div>

<!-- ✓ Semántico -->
<header>
  <nav>...</nav>
</header>
<main>
  <article>...</article>
</main>
<footer>...</footer>
```

**52. ¿Cómo hacer un sitio accesible?**

Usa HTML semántico, jerarquía de headings correcta, alt text en imágenes, navegación por teclado, labels en forms, contraste de color suficiente, soporte para screen readers.

```html
<!-- Alt text -->
<img src="logo.png" alt="Logo de la empresa">

<!-- Labels -->
<label for="email">Email:</label>
<input id="email" type="email">

<!-- ARIA cuando HTML no es suficiente -->
<button aria-label="Cerrar menú">
  <span>×</span>
</button>
```

**53. ¿Qué es ARIA?**

ARIA (Accessible Rich Internet Applications) provee información semántica adicional para tecnologías asistivas. Usa HTML semántico primero, ARIA cuando HTML no es suficiente.

```html
<!-- aria-label para texto no visible -->
<button aria-label="Buscar">
  <svg>...</svg>
</button>

<!-- aria-live para contenido dinámico -->
<div aria-live="polite">
  Guardando...
</div>

<!-- role para widgets personalizados -->
<div role="tablist">
  <button role="tab">Tab 1</button>
</div>
```

**54. ¿Qué son data attributes?**

Data attributes (data-*) almacenan datos custom en elementos HTML. Se acceden con dataset o getAttribute.

```html
<div data-user-id="123" data-role="admin">User</div>

<script>
const div = document.querySelector('div');
console.log(div.dataset.userId); // "123"
console.log(div.dataset.role);   // "admin"
</script>
```

---

## Testing

**55. ¿Estrategias de testing?**

Uso pirámide de testing: muchos tests unitarios, menos tests de integración, pocos tests E2E. Unit tests con Jest y React Testing Library. E2E con Cypress/Playwright para flujos críticos.

```javascript
// Unit test
import { render, screen } from '@testing-library/react';

test('muestra nombre de usuario', () => {
  render(<Profile name="John" />);
  expect(screen.getByText('John')).toBeInTheDocument();
});

// Integration test
test('formulario completo', async () => {
  render(<LoginForm />);
  await userEvent.type(screen.getByLabelText('Email'), 'test@test.com');
  await userEvent.click(screen.getByRole('button', { name: 'Login' }));
  expect(screen.getByText('Welcome')).toBeInTheDocument();
});
```

**56. ¿Qué es React Testing Library?**

React Testing Library testea componentes desde la perspectiva del usuario, buscando por texto, labels, roles en lugar de detalles de implementación. Esto hace tests más mantenibles.

```javascript
// ✓ Bueno - como el usuario lo ve
screen.getByRole('button', { name: 'Submit' });
screen.getByLabelText('Email');
screen.getByText('Welcome');

// ✗ Malo - detalles de implementación
wrapper.find('.submit-button');
wrapper.state('email');
```

**57. ¿Cómo testear comportamiento async?**

Usa waitFor, findBy queries, y waitForElementToBeRemoved de React Testing Library.

```javascript
test('carga usuarios', async () => {
  render(<Users />);

  // Espera a que aparezca
  const user = await screen.findByText('John');
  expect(user).toBeInTheDocument();

  // O con waitFor
  await waitFor(() => {
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
```

**58. ¿Qué es mocking?**

Mocking reemplaza dependencias reales con implementaciones fake durante testing. Mockea API calls, servicios externos, timers. Jest provee jest.fn(), jest.mock(), jest.spyOn().

```javascript
// Mock de API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ name: 'John' })
  })
);

test('fetch user', async () => {
  render(<User id="1" />);
  await screen.findByText('John');
  expect(fetch).toHaveBeenCalledWith('/api/user/1');
});
```

---

## Next.js & Server-Side Rendering

**59. ¿Qué es Next.js?**

Next.js es un framework de React que añade SSR, SSG, API routes, routing basado en archivos, y code splitting automático. Soluciona SEO de React apps y mejora performance.

```javascript
// pages/index.js - routing automático
export default function Home() {
  return <h1>Home</h1>;
}

// pages/api/users.js - API route
export default function handler(req, res) {
  res.status(200).json({ name: 'John' });
}
```

**60. ¿Diferencia entre SSR, SSG y CSR?**

**CSR**: renderiza en browser, pobre SEO, carga inicial lenta. **SSR**: genera HTML en cada request, buen SEO. **SSG**: pre-genera HTML en build time, mejor performance.

```javascript
// SSG - build time
export async function getStaticProps() {
  const data = await fetch('/api/data');
  return { props: { data } };
}

// SSR - cada request
export async function getServerSideProps() {
  const data = await fetch('/api/data');
  return { props: { data } };
}
```

**61. ¿Cuándo usar getStaticProps vs getServerSideProps?**

**getStaticProps**: contenido que no cambia frecuentemente (blog, marketing). **getServerSideProps**: data que cambia frecuentemente o es user-specific (dashboard, perfil).

```javascript
// Static - mejor performance
export async function getStaticProps() {
  const posts = await getPosts();
  return {
    props: { posts },
    revalidate: 60 // ISR: regenera cada 60s
  };
}

// Server - siempre fresh
export async function getServerSideProps() {
  const user = await getCurrentUser();
  return { props: { user } };
}
```

**62. ¿Qué es ISR en Next.js?**

Incremental Static Regeneration (ISR) combina beneficios de static y dynamic. Páginas se generan estáticamente pero se regeneran en background después del período de revalidación.

```javascript
export async function getStaticProps() {
  const data = await fetchData();
  return {
    props: { data },
    revalidate: 60 // Regenera cada 60 segundos
  };
}
```

---

## API & Data Fetching

**63. ¿Cómo manejas llamadas a API en React?**

Uso useEffect para fetch en mount con useState para resultados. Para casos complejos, uso React Query o SWR que proveen caching, revalidación, loading/error states automáticos.

```javascript
// Básico con useEffect
function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando...</p>;
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// Con React Query - mejor
function Users() {
  const { data, isLoading } = useQuery('users', () =>
    fetch('/api/users').then(r => r.json())
  );

  if (isLoading) return <p>Cargando...</p>;
  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

**64. ¿Qué es React Query?**

React Query maneja server state con caching automático, background refetching, optimistic updates. Reduce boilerplate, provee loading/error states, soporte para pagination/infinite scroll.

```javascript
import { useQuery, useMutation } from 'react-query';

// Query
function Users() {
  const { data, isLoading } = useQuery('users', fetchUsers);
  if (isLoading) return <Spinner />;
  return <UserList users={data} />;
}

// Mutation
function CreateUser() {
  const mutation = useMutation(newUser =>
    fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(newUser)
    })
  );

  return (
    <button onClick={() => mutation.mutate({ name: 'John' })}>
      Crear
    </button>
  );
}
```

**65. ¿Cómo manejas errores en API calls?**

Usa try/catch para async ops, almacena errores en state, muestra mensajes user-friendly, implementa retry logic, usa error boundaries para errores de rendering.

```javascript
async function fetchUser() {
  try {
    const res = await fetch('/api/user');
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    setUser(data);
  } catch (error) {
    setError('No pudimos cargar el usuario. Intenta de nuevo.');
    console.error(error);
  }
}

// Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Algo salió mal.</h1>;
    }
    return this.props.children;
  }
}
```

**66. ¿Qué es CORS?**

CORS (Cross-Origin Resource Sharing) es un mecanismo de seguridad que restringe requests a dominios diferentes. Soluciones: configurar headers CORS en backend, usar proxy en desarrollo.

```javascript
// Backend - Express
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  next();
});

// Next.js API route
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ data: 'test' });
}
```

---

## Performance & Seguridad Web

**67. ¿Qué son Web Vitals?**

Web Vitals miden experiencia de usuario: **LCP** (Largest Contentful Paint - loading), **FID** (First Input Delay - interactivity), **CLS** (Cumulative Layout Shift - estabilidad visual). Google los usa para SEO ranking.

```javascript
// Medir con web-vitals
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

**68. ¿Cómo asegurar una aplicación React?**

Sanitiza input de usuario para prevenir XSS, nunca uses dangerouslySetInnerHTML con datos no confiables. Guarda tokens en httpOnly cookies. Valida en backend. Usa HTTPS. Mantén dependencias actualizadas.

```javascript
// ✗ Vulnerable a XSS
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✓ React escapa automáticamente
<div>{userInput}</div>

// ✓ Si necesitas HTML, sanitiza
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(userInput)
}} />

// Tokens en httpOnly cookies (no localStorage)
// Backend set cookie:
res.cookie('token', jwt, { httpOnly: true, secure: true });
```

**69. ¿Qué es XSS y cómo prevenirlo?**

XSS (Cross-Site Scripting) es un ataque donde scripts maliciosos se inyectan en sitios confiables. React previene XSS por default escapando valores en JSX. Vulnerabilidades ocurren con dangerouslySetInnerHTML.

```javascript
// React previene XSS
const userInput = '<script>alert("hack")</script>';
<div>{userInput}</div>
// Muestra el texto literal, no ejecuta script

// Vulnerable
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// Seguro con sanitización
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(userInput)
}} />
```

**70. ¿Qué es lazy loading?**

Lazy loading difiere la carga de recursos hasta que se necesitan, reduciendo bundle inicial y mejorando tiempo de carga. Usa React.lazy para componentes, loading="lazy" para imágenes.

```javascript
// Lazy loading de componentes
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Dashboard />
    </Suspense>
  );
}

// Lazy loading de imágenes
<img src="image.jpg" loading="lazy" alt="Descripción" />
```
