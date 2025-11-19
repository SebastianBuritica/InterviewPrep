# Next.js Interview Guide - 25 Essential Questions

Complete Next.js interview preparation organized from beginner to advanced concepts.

---

## Beginner Level (1-8)

### 1. What is Next.js?

Next.js is a React framework built by Vercel that enables server-side rendering, static site generation, and other advanced features for building production-ready React applications. Unlike plain React which only runs on the client, Next.js can render your pages on the server, making them SEO-friendly and performant. It provides a complete solution with file-based routing, API routes, automatic code splitting, image optimization, and TypeScript support out of the box, all with zero configuration required.

```javascript
// Simple Next.js page - pages/index.js
export default function Home() {
  return <h1>Hello Next.js!</h1>;
}
// This automatically creates the route "/"
```

---

### 2. What are the advantages and disadvantages of Next.js?

**Advantages:**

Next.js provides significantly better SEO compared to client-rendered React apps because search engines receive fully rendered HTML. The performance is excellent as static pages load instantly from CDN, and the developer experience is superior with file-based routing, fast refresh, and zero configuration needed. You get a full-stack framework where API routes let you build your backend in the same project, and automatic optimizations handle code splitting, image optimization, and font loading. The flexibility to choose between SSR, SSG, ISR, or CSR on a per-page basis means you can optimize each route for its specific needs. Everything is production-ready with built-in best practices.

**Disadvantages:**

The learning curve is steeper than plain React, especially when understanding the different rendering strategies and data fetching methods. Next.js is opinionated, giving you less flexibility than a custom Webpack setup. Build times can become slow for static generation when dealing with thousands of pages. Some features work best on Vercel, creating potential vendor lock-in. For simple applications, Next.js can be over-engineering, adding unnecessary complexity. Unlike pure client-side rendering, SSR requires a server which increases hosting costs.

---

### 3. What is the difference between Next.js and React?

React is a UI library focused solely on building user interfaces that run in the browser, while Next.js is a full-stack framework built on top of React. The fundamental difference is in rendering: React apps are client-side only (CSR) where JavaScript renders everything in the browser, whereas Next.js supports server-side rendering (SSR), static site generation (SSG), incremental static regeneration (ISR), and client-side rendering.

For routing, React requires installing react-router and manually configuring routes, but Next.js has built-in file-based routing where your file structure automatically creates routes. Next.js includes API routes for building backend functionality in the same project, while React needs a separate backend server. This makes Next.js excellent for SEO since search engines receive pre-rendered HTML, whereas React apps show an empty shell until JavaScript loads. Setup is also different: React often needs manual Webpack configuration, while Next.js works with zero config. Code splitting is automatic per page in Next.js but requires manual setup in React, and Next.js provides built-in image optimization through next/image while React requires manual implementation.

```javascript
// React (CRA) - SEO problem
function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData);
  }, []);

  return <div>{data?.title}</div>; // Search engines see empty div
}

// Next.js - SEO friendly
export async function getServerSideProps() {
  const data = await fetch('https://api.com/data').then(r => r.json());
  return { props: { data } }; // Search engines see full HTML
}

export default function Page({ data }) {
  return <div>{data.title}</div>;
}
```

---

### 4. How does file-based routing work in Next.js?

Next.js uses file-based routing where your folder structure automatically creates routes without configuring a routing library. There are two routing systems: the **Pages Router** (legacy, uses `pages/` directory) and the **App Router** (modern, uses `app/` directory). The Pages Router is the traditional approach that's been around since Next.js started and is still supported but considered legacy. The App Router is the new recommended approach introduced in Next.js 13+ with better performance and features.

In both systems, files become routes based on their location. For example, `pages/about.js` or `app/about/page.js` both create the `/about` route. The key difference is that App Router requires a `page.js` file inside a folder, while Pages Router uses the file name directly as the route.

**Dynamic routing** allows you to create routes with variable segments using bracket notation. A file named `[slug].js` creates a dynamic route where `slug` can be any value. For example, `pages/blog/[slug].js` matches `/blog/hello`, `/blog/nextjs`, or any URL under `/blog/`. You access the dynamic parameter through the router to fetch the correct data. You can also use **catch-all routes** with `[...slug].js` which matches multiple segments like `/docs/api/intro` where slug becomes `['api', 'intro']`, or optional catch-all routes with `[[...slug]].js` that also match the base route.

```javascript
// Pages Router (legacy) - file structure
pages/
  index.js              → /
  about.js              → /about
  blog/
    [slug].js           → /blog/:slug (dynamic)
    [category]/[id].js  → /blog/:category/:id

// App Router (modern) - folder structure
app/
  page.js               → /
  about/
    page.js             → /about
  blog/
    [slug]/
      page.js           → /blog/:slug (dynamic)

// Dynamic route example - pages/blog/[slug].js
import { useRouter } from 'next/router';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query; // Get dynamic parameter
  return <h1>Post: {slug}</h1>;
}
```

---

### 5. What are the different rendering strategies in Next.js?

Next.js supports four rendering strategies, each optimized for different use cases.

**CSR (Client-Side Rendering)** renders content in the browser like traditional React apps. The server sends an empty HTML shell and JavaScript does all the rendering client-side. This results in poor SEO because search engines see empty content and slow initial page loads since users wait for JavaScript to download and execute. Use CSR for authenticated dashboards and admin panels where SEO doesn't matter and content is user-specific.

**SSR (Server-Side Rendering)** generates HTML on the server for each request. Every time a user visits the page, the server fetches fresh data and renders complete HTML. This provides excellent SEO since search engines receive fully rendered content and ensures data is always up-to-date. The tradeoff is slower response times compared to static pages because the server must do work on every request. Use SSR for user-specific pages that need SEO like user profiles or personalized content.

**SSG (Static Site Generation)** pre-generates HTML at build time. Pages are rendered once during the build process and served as static files from a CDN, resulting in the fastest possible performance. SEO is excellent since pages are fully rendered, but data can become stale since it's only updated when you rebuild. Use SSG for content that doesn't change often like blogs, documentation, and marketing pages.

**ISR (Incremental Static Regeneration)** combines the benefits of static and dynamic rendering. Pages are initially generated as static files for fast delivery, but Next.js can regenerate them in the background after a specified revalidation period. Users still get the speed of static pages while content stays relatively fresh. This is the best of both worlds. Use ISR for e-commerce product pages, news sites, and any content that updates periodically but doesn't need real-time accuracy.

```javascript
// CSR - Client-Side Rendering
function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData);
  }, []);
  return <div>{data?.title}</div>;
}

// SSR - Server-Side Rendering
export async function getServerSideProps() {
  const data = await fetchData();
  return { props: { data } };
}

// SSG - Static Site Generation
export async function getStaticProps() {
  const data = await fetchData();
  return { props: { data } };
}

// ISR - Incremental Static Regeneration
export async function getStaticProps() {
  return {
    props: { data: await fetchData() },
    revalidate: 60 // Regenerate every 60 seconds
  };
}
```

---

### 6. What is the difference between Pages Router and App Router?

Next.js has two routing systems: the **Pages Router** (legacy but stable) and the **App Router** (modern).

**Pages Router** uses the `/pages` directory with special data fetching functions like `getServerSideProps` and `getStaticProps` that run on the server. Components render on the server first, then hydrate on the client to become interactive. You need to manually set up layouts using `_app.js` and manually implement loading and error states.

**App Router** uses the `/app` directory and introduces true Server Components that only run on the server and never send code to the browser. You can also use Client Components (marked with `'use client'`) for interactivity. Data fetching happens directly in async Server Components using the native fetch API. It has built-in features like nested layouts with `layout.js`, loading states with `loading.js`, and error handling with `error.js`.

Use Pages Router for existing stable apps. Use App Router for new projects where you want better performance, Server Components, and modern features like streaming.

```javascript
// Pages Router (legacy)
// pages/blog/[slug].js
export async function getServerSideProps({ params }) {
  const post = await getPost(params.slug);
  return { props: { post } };
}

export default function Post({ post }) {
  return <article>{post.title}</article>;
}

// App Router (modern)
// app/blog/[slug]/page.js
export default async function Post({ params }) {
  const post = await getPost(params.slug); // Fetch directly in component!
  return <article>{post.title}</article>;
}
```

---

### 7. How do you create a basic page in Next.js?

Creating a page in Next.js is as simple as creating a file in the `pages/` directory for Pages Router or `app/` directory for App Router. The filename determines the route automatically. For a products page at `/products`, you create `pages/products.js` in Pages Router or `app/products/page.js` in App Router. The component you export becomes the page content. In App Router, you can also export metadata for SEO directly from the page file.

```javascript
// Pages Router: pages/products.js
export default function Products() {
  return (
    <div>
      <h1>Products</h1>
      <p>Browse our products</p>
    </div>
  );
}
// Available at /products

// App Router: app/products/page.js
export default function Products() {
  return (
    <div>
      <h1>Products</h1>
      <p>Browse our products</p>
    </div>
  );
}
// Available at /products

// With metadata (App Router)
export const metadata = {
  title: 'Products',
  description: 'Browse our products'
};

export default function Products() {
  return <div>Products</div>;
}
```

---

### 8. How do you navigate between pages?

Next.js provides two ways to navigate: the `Link` component for declarative navigation and the `useRouter` hook for programmatic navigation. The Link component automatically prefetches pages in the background when they appear in the viewport, making navigation instant. It handles client-side transitions without full page reloads, preserving application state. For programmatic navigation like after form submission or button clicks, use the `useRouter` hook which provides methods like `push`, `replace`, and `back`.

```javascript
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // App Router
// import { useRouter } from 'next/router'; // Pages Router

export default function Navigation() {
  const router = useRouter();

  return (
    <nav>
      {/* Declarative navigation with Link */}
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/blog/my-post">Blog Post</Link>

      {/* Dynamic route */}
      <Link href={`/product/${productId}`}>Product</Link>

      {/* Programmatic navigation */}
      <button onClick={() => router.push('/dashboard')}>
        Go to Dashboard
      </button>

      <button onClick={() => router.back()}>
        Go Back
      </button>
    </nav>
  );
}
```

---

## Intermediate Level (9-16)

### 9. Explain SSR, SSG, ISR, and CSR in detail with code examples

**CSR (Client-Side Rendering)** fetches all data in the browser after the page loads. The server sends a minimal HTML shell with JavaScript bundles, and React renders everything client-side once JavaScript executes. This means users see a loading state while data fetches, search engines see empty content, and the initial page load is slow. However, subsequent interactions are fast since the app is fully loaded. Use CSR for authenticated areas like dashboards where SEO doesn't matter and you need dynamic, user-specific content that changes frequently.

```javascript
// CSR - All data fetched in browser
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user-data')
      .then(r => r.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  return <div>Welcome {data.name}</div>;
}
```

**SSR (Server-Side Rendering)** generates fresh HTML on every request. When a user visits the page, the server fetches current data, renders the complete HTML, and sends it to the browser. This ensures data is always fresh and search engines see full content, making it perfect for SEO. You can access request-specific data like cookies and headers, and you can redirect users based on authentication. The downside is slower response times since the server does work on each request, and it requires a running server unlike static hosting. Use SSR for pages that need both SEO and real-time data like user profiles, personalized dashboards, or any content that's different for each user.

```javascript
// SSR - HTML generated on each request
export async function getServerSideProps(context) {
  const { req, res, params, query } = context;

  // Access cookies, headers
  const token = req.cookies.token;

  // Fetch fresh data
  const user = await getUserData(token);

  // Redirect if not authenticated
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }

  return {
    props: { user } // Passed to component
  };
}

export default function Profile({ user }) {
  return <h1>Welcome, {user.name}!</h1>;
}
```

**SSG (Static Site Generation)** pre-renders pages at build time. During the build process, Next.js fetches all data and generates static HTML files that are served from a CDN. This provides the absolute fastest performance since pages are pre-built and cached globally. SEO is excellent because pages are fully rendered. The limitation is that data is only as fresh as your last build, so it's best for content that doesn't change frequently. Use SSG for blogs, documentation, marketing pages, and any content that's the same for all users and doesn't need real-time updates.

```javascript
// SSG - Pre-generated at build time
export async function getStaticProps() {
  const posts = await fetch('https://api.com/posts').then(r => r.json());

  return {
    props: { posts }
  };
}

export default function Blog({ posts }) {
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
        </article>
      ))}
    </div>
  );
}
```

**ISR (Incremental Static Regeneration)** gives you the speed of static pages with the freshness of server rendering. Pages are initially generated as static files, but Next.js can regenerate them in the background after a specified time period. When a user requests a page after the revalidation time, they still get the cached version instantly (stale-while-revalidate), but Next.js triggers a background regeneration. The next user gets the fresh version. This means you get CDN-level performance with content that updates periodically without rebuilding your entire site. Use ISR for e-commerce product pages where prices and inventory change, news articles that update throughout the day, or any content that needs to be relatively fresh but doesn't require real-time accuracy.

```javascript
// ISR - Static + periodic revalidation
export async function getStaticProps() {
  const products = await getProducts();

  return {
    props: { products },
    revalidate: 60 // Regenerate every 60 seconds
  };
}

export default function Products({ products }) {
  return (
    <div>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
```

---

### 10. When should you use each rendering strategy?

Use **CSR** when content is behind authentication and SEO doesn't matter, like admin dashboards or user account settings. It's ideal when data changes constantly in real-time and you need immediate updates, or when initial page load performance isn't critical. The benefit is simpler implementation and no server costs for rendering.

Use **SSR** when you need SEO with user-specific content, like user profile pages that need to rank in search engines but show different content per user. It's perfect when data changes frequently and must always be fresh on every request, or when you need access to request-time data like cookies and headers for authentication. Examples include personalized news feeds, user dashboards that need SEO, and any page where stale data would be problematic.

Use **SSG** when content doesn't change often and is the same for all users. It's ideal when you need the absolute best performance and SEO, like blogs where posts rarely update, documentation sites, marketing landing pages, and any content-heavy site where the content is managed infrequently. The tradeoff is that you must rebuild to update content.

Use **ISR** when content updates periodically but doesn't need real-time accuracy. It's perfect for e-commerce product pages where prices and inventory change throughout the day, news sites where articles publish every few hours, or any scenario where you want static performance with content that stays relatively fresh. You get the best of both worlds: CDN-speed delivery with periodic updates.

```javascript
// Real-world example: E-commerce site

// Product listing - SSG (changes rarely)
// pages/products/index.js
export async function getStaticProps() {
  const categories = await getCategories();
  return { props: { categories } };
}

// Individual product - ISR (prices/stock change)
// pages/products/[id].js
export async function getStaticProps({ params }) {
  const product = await getProduct(params.id);
  return {
    props: { product },
    revalidate: 60 // Update every minute
  };
}

// User cart - SSR (user-specific, fresh data)
// pages/cart.js
export async function getServerSideProps({ req }) {
  const user = await getUserFromCookie(req);
  const cart = await getCart(user.id);
  return { props: { cart } };
}

// Admin dashboard - CSR (behind auth, no SEO)
// pages/admin.js
export default function Admin() {
  const { data } = useSWR('/api/admin/stats');
  return <Dashboard stats={data} />;
}
```

---

### 11. How does data fetching work in Next.js?

In the **Pages Router**, data fetching happens through special functions that run on the server. `getServerSideProps` runs on every request and is perfect for SSR when you need fresh data or access to request objects like cookies. It receives a context object with params, query, request, and response objects, and returns props that get passed to your component. You can also return redirects or trigger 404 pages from this function.

`getStaticProps` runs at build time for SSG and ISR. It fetches data once during the build and can optionally include a `revalidate` property for ISR to periodically regenerate the page. For dynamic routes with SSG, you also need `getStaticPaths` which tells Next.js which pages to pre-generate and what to do with paths that weren't pre-generated using the `fallback` option.

```javascript
// Pages Router

// 1. getServerSideProps - SSR
export async function getServerSideProps(context) {
  const { params, query, req, res } = context;

  const data = await fetch(`https://api.com/data/${params.id}`).then(r => r.json());

  return {
    props: { data }, // Passed to component as props
    // OR
    // redirect: { destination: '/login', permanent: false },
    // OR
    // notFound: true
  };
}

// 2. getStaticProps - SSG/ISR
export async function getStaticProps(context) {
  const data = await fetchData();

  return {
    props: { data },
    revalidate: 60, // ISR: revalidate every 60s
    notFound: false,
    redirect: { destination: '/other' }
  };
}

// 3. getStaticPaths - For dynamic routes with SSG
export async function getStaticPaths() {
  const posts = await getAllPosts();

  return {
    paths: posts.map(post => ({
      params: { slug: post.slug }
    })),
    fallback: 'blocking' // or false, true
  };
}
```

In the **App Router**, data fetching is simpler because you fetch directly in Server Components using async/await. You can use the native fetch API with Next.js extensions for caching control. Setting `cache: 'no-store'` makes requests always fresh (like SSR), using `cache: 'force-cache'` caches indefinitely (default), and setting `next: { revalidate: 60 }` enables ISR with a 60-second revalidation period. You can also use tags for on-demand revalidation when specific data changes.

```javascript
// App Router - Server Component
export default async function Page() {
  // No caching - always fresh
  const data = await fetch('https://api.com/data', {
    cache: 'no-store'
  }).then(r => r.json());

  // With caching
  const cached = await fetch('https://api.com/data', {
    cache: 'force-cache' // Default
  }).then(r => r.json());

  // ISR
  const revalidated = await fetch('https://api.com/data', {
    next: { revalidate: 60 }
  }).then(r => r.json());

  return <div>{data.title}</div>;
}
```

---

### 12. How do dynamic routes work?

Dynamic routes in Next.js use bracket notation in filenames to create routes that match variable URL segments. A file named `[slug].js` creates a dynamic route where `slug` is available as a parameter. For example, `pages/blog/[slug].js` matches `/blog/hello-world`, `/blog/next-js`, or any other path under `/blog/`. You access the dynamic parameter through `params` in data fetching functions or the `useRouter` hook.

You can have multiple dynamic segments like `pages/shop/[category]/[product].js` which matches URLs like `/shop/electronics/laptop`. For catch-all routes, use `[...slug].js` which matches any number of segments like `/docs/a/b/c`. The `slug` parameter becomes an array `['a', 'b', 'c']`. Optional catch-all routes use `[[...slug]].js` and match both the base route and any nested paths.

```javascript
// pages/blog/[slug].js - Single dynamic parameter
export async function getStaticPaths() {
  const posts = await getAllPosts();

  return {
    paths: posts.map(post => ({
      params: { slug: post.slug }
    })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const post = await getPost(params.slug);
  return { props: { post } };
}

export default function Post({ post }) {
  return <article>{post.title}</article>;
}

// pages/shop/[category]/[product].js - Multiple parameters
export default function Product({ params }) {
  const { category, product } = params;
  // URL: /shop/electronics/laptop
  // params: { category: 'electronics', product: 'laptop' }
  return <div>{category} - {product}</div>;
}

// pages/docs/[...slug].js - Catch-all route
export default function Docs({ params }) {
  const { slug } = params;
  // URL: /docs/api/components/button
  // slug: ['api', 'components', 'button']
  return <div>Path: {slug.join('/')}</div>;
}

// pages/docs/[[...slug]].js - Optional catch-all
// Matches /docs AND /docs/api/components
```

---

### 13. How do API routes work?

API routes let you build backend endpoints directly in your Next.js application without needing a separate server. In the Pages Router, any file in `pages/api` becomes an API endpoint. The filename determines the route, so `pages/api/users.js` creates `/api/users`. You export a handler function that receives request and response objects similar to Express.js.

You can handle different HTTP methods by checking `req.method`, access query parameters through `req.query`, get the request body from `req.body`, and read cookies from `req.cookies`. The response object lets you set status codes, headers, and send JSON or other responses.

```javascript
// Pages Router: pages/api/users.js
export default async function handler(req, res) {
  const { method, query, body, cookies } = req;

  // Handle different HTTP methods
  if (method === 'GET') {
    const users = await db.users.findMany();
    return res.status(200).json(users);
  }

  if (method === 'POST') {
    const { name, email } = body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email required' });
    }

    const user = await db.users.create({ data: { name, email } });
    return res.status(201).json(user);
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${method} Not Allowed`);
}
```

In the **App Router**, API routes work differently. You create a `route.js` file in the `app/api` directory structure, and export async functions named after HTTP methods (GET, POST, PUT, DELETE, etc.). Each function receives a Request object and returns a Response. Use `NextResponse.json()` to return JSON data easily.

```javascript
// App Router: app/api/users/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const users = await db.users.findMany();
  return NextResponse.json(users);
}

export async function POST(request) {
  const body = await request.json();
  const user = await db.users.create({ data: body });
  return NextResponse.json(user, { status: 201 });
}

// Dynamic API route: app/api/users/[id]/route.js
export async function GET(request, { params }) {
  const user = await db.users.findUnique({
    where: { id: params.id }
  });

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}

export async function DELETE(request, { params }) {
  await db.users.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}
```

---

### 14. What are Server Components vs Client Components?

Server Components and Client Components were introduced in the App Router to give you fine-grained control over where code runs. Server Components (the default in App Router) run exclusively on the server and never send JavaScript to the client. They can fetch data directly, access backend resources like databases, use server-only code, and keep sensitive information like API keys on the server. Since they don't add JavaScript to the bundle, they reduce the amount of code sent to browsers, improving performance.

Client Components run in the browser and are needed for interactivity. You mark them with the `'use client'` directive at the top of the file. They can use React hooks like useState, useEffect, and useContext, handle user interactions with event listeners, access browser APIs like localStorage and window, and use third-party libraries that depend on browser features. Client Components add JavaScript to your bundle, so use them only when necessary.

The best practice is composing them together: use Server Components for data fetching and non-interactive content, and nest Client Components only where you need interactivity. This gives you the performance benefits of Server Components while still allowing interactive features where needed.

```javascript
// Server Component (default in App Router)
// app/posts/page.js - no 'use client' directive

export default async function Posts() {
  // Can fetch data directly
  const posts = await db.posts.findMany();

  // Can access server-only resources
  const apiKey = process.env.SECRET_API_KEY;

  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
        </article>
      ))}
    </div>
  );
}

// Client Component
// app/counter.js
'use client'; // Required directive

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}

// Best practice: Compose them together
// app/page.js (Server Component)
import Counter from './counter'; // Client Component

export default async function Page() {
  const data = await fetchData(); // Server-only

  return (
    <div>
      <h1>{data.title}</h1>
      <Counter /> {/* Interactive client component */}
    </div>
  );
}
```

---

### 15. How do you handle forms in Next.js?

There are three main approaches to handling forms in Next.js, each suited for different complexity levels.

For **basic forms**, use controlled components with useState. Store form values in state, update them with onChange handlers, and submit with an onSubmit handler that prevents default behavior and sends data to your API. This approach is simple and works well for straightforward forms with a few fields.

```javascript
// 1. Basic form with useState
'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    setMessage(data.message);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      <button disabled={loading}>
        {loading ? 'Sending...' : 'Submit'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

For **modern forms with progressive enhancement** in the App Router, use Server Actions. Server Actions are asynchronous functions marked with `'use server'` that run exclusively on the server. You can call them directly from form actions without needing API routes. They support progressive enhancement, meaning forms work even without JavaScript enabled. Use `useFormState` to manage form state and errors, and `useFormStatus` to show pending states during submission.

```javascript
// 2. Server Actions (App Router - modern approach)
// app/actions.js
'use server';

import { revalidatePath } from 'next/cache';

export async function submitForm(formData) {
  const name = formData.get('name');
  const email = formData.get('email');

  // Validation
  if (!name || name.length < 3) {
    return { error: 'Name must be at least 3 characters' };
  }

  if (!email.includes('@')) {
    return { error: 'Invalid email' };
  }

  // Save to database
  await db.contacts.create({
    data: { name, email }
  });

  revalidatePath('/contacts');
  return { success: 'Form submitted!' };
}

// app/contact/page.js
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitForm } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

export default function ContactPage() {
  const [state, formAction] = useFormState(submitForm, null);

  return (
    <form action={formAction}>
      <input name="name" required />
      <input name="email" type="email" required />
      {state?.error && <p className="error">{state.error}</p>}
      {state?.success && <p className="success">{state.success}</p>}
      <SubmitButton />
    </form>
  );
}
```

For **complex forms with validation**, use React Hook Form with Zod for schema validation. React Hook Form minimizes re-renders, provides excellent TypeScript support, and integrates seamlessly with validation libraries. Zod defines a schema with validation rules, and the zodResolver connects it to React Hook Form. This approach handles complex validation logic, conditional fields, field arrays, and provides detailed error messages.

```javascript
// 3. React Hook Form + Zod (complex forms)
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18 or older'),
  terms: z.boolean().refine(val => val === true, 'Must accept terms')
});

export default function RegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}

      <input type="email" {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="number" {...register('age', { valueAsNumber: true })} />
      {errors.age && <span>{errors.age.message}</span>}

      <label>
        <input type="checkbox" {...register('terms')} />
        Accept terms
      </label>
      {errors.terms && <span>{errors.terms.message}</span>}

      <button disabled={isSubmitting}>Submit</button>
    </form>
  );
}
```

---

### 16. How do you manage state in Next.js?

State management in Next.js follows the same patterns as React, but you need to consider server-side rendering. Separate client state (UI state, form data, temporary data) from server state (API data, cached responses).

For **client state**, React Context works well for simple global state like theme or user preferences. It's built-in, requires no additional libraries, but can cause unnecessary re-renders if not optimized. Zustand is the recommended solution for more complex client state because it's lightweight, has no provider boilerplate, and provides excellent performance with minimal re-renders. Redux Toolkit is appropriate for very complex state with many interdependent updates, but it's often overkill for most applications.

```javascript
// React Context - simple global state
'use client';

import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (item) => setItems([...items, item]);
  const removeItem = (id) => setItems(items.filter(i => i.id !== id));

  return (
    <CartContext.Provider value={{ items, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

// Zustand - recommended for simplicity
import { create } from 'zustand';

export const useStore = create((set) => ({
  count: 0,
  user: null,
  increment: () => set((state) => ({ count: state.count + 1 })),
  setUser: (user) => set({ user })
}));

// Usage (no provider needed!)
function Component() {
  const { count, increment } = useStore();
  return <button onClick={increment}>{count}</button>;
}
```

For **server state** (API data), use specialized libraries like SWR or React Query instead of managing it manually with useState and useEffect. These libraries provide automatic caching, background revalidation, automatic retries, optimistic updates, and handle loading and error states. SWR is simpler and works great for most use cases. React Query is more powerful with advanced features like infinite scrolling and complex cache management.

```javascript
// SWR - recommended for server state
'use client';

import useSWR from 'swr';

const fetcher = (url) => fetch(url).then(r => r.json());

export default function Profile() {
  const { data, error, isLoading, mutate } = useSWR('/api/user', fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <button onClick={() => mutate()}>Refresh</button>
    </div>
  );
}

// React Query - alternative
import { useQuery, useMutation } from '@tanstack/react-query';

function Users() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json())
  });

  const mutation = useMutation({
    mutationFn: (newUser) => fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(newUser)
    })
  });

  return <div>{/* ... */}</div>;
}
```

---

## Advanced Level (17-25)

### 17. How does ISR (Incremental Static Regeneration) work in depth?

ISR allows you to update static pages after build time without rebuilding your entire site. When you set a `revalidate` time, Next.js serves the cached static page but triggers a background regeneration after that period expires. This implements a stale-while-revalidate strategy where users always get fast responses while Next.js updates content in the background.

The process works like this: at build time, you pre-generate popular pages (like your top 100 products). For paths not generated at build, you use `fallback: 'blocking'` to generate them on-demand when first requested. After the revalidation period (say 60 seconds), the next request to a page triggers background regeneration while still serving the cached version. Once regeneration completes, Next.js caches the new version and serves it to subsequent users. This means your first user after the revalidation period might see slightly stale content, but they still get instant page loads.

You can also trigger on-demand revalidation when you know content has changed, like after updating a product in your CMS. Call the revalidation API endpoint and Next.js immediately regenerates that specific page.

```javascript
// pages/products/[id].js
export async function getStaticPaths() {
  // Pre-generate only popular products at build time
  const popularProducts = await getPopularProducts(100);

  return {
    paths: popularProducts.map(p => ({
      params: { id: p.id }
    })),
    fallback: 'blocking' // Generate other products on-demand
  };
}

export async function getStaticProps({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    return { notFound: true };
  }

  return {
    props: { product },
    revalidate: 60, // Revalidate every 60 seconds
  };
}

export default function Product({ product }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: ${product.price}</p>
      <p>Stock: {product.stock}</p>
    </div>
  );
}

// API route to force revalidation
export default async function handler(req, res) {
  await res.revalidate('/products/123');
  return res.json({ revalidated: true });
}
```

In the **App Router**, ISR is even simpler. Use the fetch API with `next: { revalidate: 60 }` to enable time-based revalidation, or use tags for on-demand revalidation. Tags let you group related data and revalidate everything with a specific tag when that data changes.

```javascript
// App Router ISR with time-based revalidation
// app/products/[id]/page.js
export default async function Product({ params }) {
  const product = await fetch(`https://api.com/products/${params.id}`, {
    next: { revalidate: 60 } // ISR: revalidate every 60 seconds
  }).then(r => r.json());

  return <div>{product.name}</div>;
}

// ISR with tags for on-demand revalidation
export default async function Product({ params }) {
  const product = await fetch(`https://api.com/products/${params.id}`, {
    next: { tags: ['products', `product-${params.id}`] }
  }).then(r => r.json());

  return <div>{product.name}</div>;
}

// Trigger on-demand revalidation
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST() {
  revalidateTag('products'); // Revalidate all with this tag
  revalidatePath('/products'); // Revalidate specific path
  return Response.json({ revalidated: true });
}
```

---

### 18. How does middleware work in Next.js?

Middleware runs code before a request completes, letting you modify responses, rewrite URLs, redirect users, or add headers. It executes at the Edge (CDN nodes) for ultra-low latency and runs before cached content and page rendering, giving you complete control over the request/response cycle.

Create middleware by exporting a function from `middleware.js` in your project root. The function receives a request object with URL, cookies, headers, and geo data. Return NextResponse to redirect, rewrite, or modify requests. Use the config matcher to specify which paths trigger the middleware.

Common use cases include authentication (check tokens and redirect to login), A/B testing (assign users to variants), geolocation routing (serve country-specific content), bot detection, and feature flags. The key advantage is running logic before your application code loads, enabling fast security checks and personalization.

```javascript
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');

  // Authentication check
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*'
};
```

---

### 19. What are Server Actions and how do you use them?

Server Actions are asynchronous functions marked with `'use server'` that run exclusively on the server but can be called directly from Client Components. They enable data mutations, database operations, and cache revalidations without building API routes, and support progressive enhancement so forms work without JavaScript.

Create Server Actions in separate files or inline in Server Components. They receive FormData from forms or regular arguments when called programmatically. Inside actions, you can validate data, perform database operations, use `revalidatePath` or `revalidateTag` to update caches, and `redirect` to navigate users. Return error/success messages that Client Components display using `useFormState`, and use `useFormStatus` for pending states.

Benefits include no API routes needed for mutations, end-to-end TypeScript type safety, progressive enhancement, and integrated cache revalidation. This simplifies your codebase by eliminating the need for separate API endpoints for form submissions.

```javascript
// app/actions.js
'use server';
import { revalidatePath } from 'next/cache';

export async function createPost(formData) {
  const title = formData.get('title');
  if (!title) return { error: 'Title required' };

  await db.posts.create({ data: { title } });
  revalidatePath('/posts');
  return { success: true };
}

// Usage in form
<form action={createPost}>
  <input name="title" required />
  <button>Submit</button>
</form>
```

---

### 20. How do you implement authentication in Next.js?

Authentication is typically implemented using **NextAuth.js** or custom JWT. NextAuth.js provides a complete solution with OAuth providers (Google, GitHub, Facebook), credentials login, session management, CSRF protection, and database integration.

**NextAuth.js with Pages Router** uses an API route at `pages/api/auth/[...nextauth].js` to configure providers and callbacks. **With App Router**, create `app/api/auth/[...nextauth]/route.js` and export GET/POST handlers. Server Components use `getServerSession()` for secure server-side session access, while Client Components use the `useSession()` hook. Both routers support middleware for protecting routes.

Advantages include automatic CSRF protection, secure httpOnly cookies, easy provider setup, email verification, and token refresh. It integrates with databases via adapters.

**Custom JWT** gives more control but requires implementing security yourself. Create login endpoints, generate JWTs with jsonwebtoken, store in httpOnly cookies (never localStorage), and verify tokens in middleware. Use secure and sameSite flags for protection against XSS and CSRF attacks.

NextAuth.js is recommended for most apps due to built-in security. Custom JWT is better for specific requirements where you need full control over the authentication flow.

```javascript
// NextAuth.js example
// App Router: app/api/auth/[...nextauth]/route.js
const handler = NextAuth({
  providers: [GoogleProvider({ /* config */ })]
});
export { handler as GET, handler as POST };

// Client usage
import { useSession } from 'next-auth/react';
const { data: session } = useSession();
```

---

### 21. How do you optimize performance in Next.js?

Performance optimization focuses on images, fonts, code splitting, and scripts.

**Images**: The `next/image` component automatically serves modern formats (WebP/AVIF), lazy loads by default, prevents layout shift with width/height props, and resizes on-demand for responsive screens. Use `priority` for above-the-fold images to ensure fast LCP scores.

**Fonts**: The `next/font` package downloads and self-hosts fonts at build time, eliminating external requests to CDNs. It uses CSS `size-adjust` for zero layout shift and `display: 'swap'` to show text immediately with fallback fonts.

**Code splitting**: Use `dynamic()` imports for heavy components (charts, maps, editors) to load them only when needed. Pages are automatically code-split, but large components require manual splitting. Optionally disable SSR for client-only components.

**Scripts**: The `Script` component optimizes third-party scripts with strategies: `afterInteractive` for analytics, `lazyOnload` for chat widgets, and `beforeInteractive` for critical scripts.

**Bundle analysis**: Use `@next/bundle-analyzer` to visualize bundle contents and identify large dependencies to optimize.

```javascript
// Key optimization examples
<Image src="/hero.jpg" width={1200} height={600} priority />

import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('./Chart'), { ssr: false });

<Script src="analytics.js" strategy="afterInteractive" />
```

---

### 22. What are caching strategies in Next.js?

The App Router provides granular caching control through the fetch API and route segment configuration. By default, fetch requests are cached indefinitely (`force-cache`), but you can opt out of caching with `cache: 'no-store'` for always-fresh data, use time-based revalidation with `next: { revalidate: 60 }` for ISR, or implement tag-based revalidation with `next: { tags: ['posts'] }` for on-demand cache invalidation.

Tag-based revalidation is powerful because you can group related data under tags and invalidate all related caches when that data changes. For example, tag all product fetches with `'products'` and call `revalidateTag('products')` when inventory updates to refresh all product-related caches.

Route segment configuration lets you set caching behavior for entire routes using exports like `export const revalidate = 60` to revalidate every 60 seconds, `export const dynamic = 'force-dynamic'` to never cache and always render fresh, or `export const fetchCache = 'force-no-store'` to opt out of fetch caching entirely.

```javascript
// App Router Caching

// 1. No caching - always fresh
export default async function Page() {
  const data = await fetch('https://api.com/data', {
    cache: 'no-store'
  }).then(r => r.json());

  return <div>{data.title}</div>;
}

// 2. Cache indefinitely (default)
const data = await fetch('https://api.com/data', {
  cache: 'force-cache'
}).then(r => r.json());

// 3. Revalidate after time (ISR)
const data = await fetch('https://api.com/data', {
  next: { revalidate: 60 } // Revalidate every 60s
}).then(r => r.json());

// 4. Tag-based revalidation
const data = await fetch('https://api.com/data', {
  next: { tags: ['posts'] }
}).then(r => r.json());

// Revalidate on-demand
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST() {
  revalidateTag('posts'); // Revalidate all with this tag
  revalidatePath('/posts'); // Revalidate specific path
  return Response.json({ revalidated: true });
}

// 5. Route segment config
export const revalidate = 60; // Revalidate every 60s
export const dynamic = 'force-dynamic'; // Never cache
export const fetchCache = 'force-no-store'; // Opt out of caching

export default async function Page() {
  const data = await fetchData();
  return <div>{data.title}</div>;
}
```

For client-side caching, use SWR which implements stale-while-revalidate. It returns cached data immediately (stale) while fetching fresh data in the background (revalidate). Configure revalidation on focus to refresh when users return to the tab, on reconnect for network recovery, and set deduping intervals to prevent duplicate requests.

```javascript
import useSWR from 'swr';

function Profile() {
  const { data, error, isLoading } = useSWR(
    '/api/user',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      dedupingInterval: 2000, // Dedupe requests within 2s
      focusThrottleInterval: 5000
    }
  );

  return <div>{data?.name}</div>;
}
```

---

### 23. What are Edge Functions and when should you use them?

Edge Functions run at CDN edge locations close to users rather than a single origin server, providing ultra-low latency (under 50ms) with no cold starts. Enable with `export const runtime = 'edge'` in API routes or pages.

**Key benefits**: Fast responses globally distributed, automatic geolocation data access (country, city, region), instant execution without cold start delays.

**Limitations**: Only Web APIs supported (no Node.js APIs), no file system access, ~1MB size limit, limited npm packages, requires HTTP-based database APIs instead of direct connections.

**Use for**: Authentication checks, redirects/rewrites, A/B testing, geolocation routing, bot detection, header manipulation.

**Don't use for**: Heavy computations, direct database connections (use Prisma Data Proxy or Supabase instead), Node.js-specific features, large dependencies.

```javascript
export const runtime = 'edge';

export async function GET(request) {
  const country = request.geo?.country;
  return Response.json({ country });
}
```

---

### 24. How do you integrate a database with Next.js?

**Prisma** is the recommended ORM with excellent TypeScript support, type-safe queries, and automatic migrations. Define your schema in `prisma/schema.prisma`, generate the Prisma Client, and use the **singleton pattern** to prevent connection exhaustion during development's hot reloading.

Use Prisma in **API routes** for REST endpoints, **Server Components** (App Router) to query databases directly without API routes, and **Server Actions** for mutations with cache revalidation.

**Alternatives** include raw SQL (pg, mysql2) for maximum control but less type safety, Drizzle ORM (lightweight Prisma alternative), MongoDB with native driver or Mongoose, and Supabase/PlanetScale for serverless database services with Edge compatibility.

**Key considerations**: TypeScript support, migration ease, connection pooling for serverless, Edge runtime compatibility, and developer experience.

```javascript
// Singleton pattern
import { PrismaClient } from '@prisma/client';
const globalForPrisma = global;
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Usage in Server Component
const users = await prisma.user.findMany();
```

---

### 25. What are best practices for deploying Next.js to production?

**Environment variables**: Variables with `NEXT_PUBLIC_` prefix are exposed to the browser; without it they're server-only. Never use `NEXT_PUBLIC_` for sensitive data (database URLs, API secrets). Store sensitive vars in `.env.local` (never commit), and set production vars through platform configuration.

**Production optimizations**: Enable React Strict Mode, remove console logs in production builds, add security headers (X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security), configure redirects for SEO, enable compression.

**Deployment options**: **Vercel** offers zero-config deployment with Git integration, automatic HTTPS, global CDN, preview deployments, and native Edge Functions/ISR support. **Self-hosting** with Docker uses `standalone` output mode for minimal builds. Deploy to AWS/GCP/DigitalOcean with PM2. Ensure sufficient memory for SSR and persistent storage for ISR.

**Monitoring**: Track performance (Vercel Analytics, Google Analytics) for Core Web Vitals, implement error tracking (Sentry), set up structured logging with request IDs, monitor server health (memory, CPU), configure alerts.

**Security**: Validate inputs, enforce HTTPS with HSTS, use CSRF protection, set secure cookie flags (httpOnly, secure, sameSite), keep dependencies updated, implement rate limiting, use Content Security Policy headers.

```javascript
// Environment variables
const dbUrl = process.env.DATABASE_URL; // Server-only
const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Client-accessible

// next.config.js
module.exports = {
  reactStrictMode: true,
  output: 'standalone' // For Docker
};
```

---

## Summary & Study Tips

Master these essential concepts in order: understand what Next.js is and why to use it, learn file-based routing, grasp the four rendering strategies and when to use each, and understand the difference between Pages and App Router. For intermediate knowledge, dive deep into when to use SSR vs SSG vs ISR vs CSR with real examples, learn data fetching methods for both routers, master dynamic routes and API routes, understand Server vs Client Components, and practice forms with multiple approaches and state management patterns.

Advanced topics require hands-on practice: implement ISR with on-demand revalidation, create middleware for authentication and A/B testing, use Server Actions for mutations, implement complete authentication with NextAuth.js or custom JWT, optimize performance with images/fonts/code-splitting, understand caching strategies in depth, use Edge Functions appropriately, integrate Prisma with your database, and follow production deployment best practices.

Build a full-stack application with authentication and database to solidify your knowledge. Practice explaining rendering strategies and their tradeoffs. Understand when to use each feature and be able to compare Next.js with React, Gatsby, and Remix. Common libraries to know include Tailwind CSS and shadcn/ui for UI, React Hook Form with Zod for forms, Zustand and SWR for state management, NextAuth.js for authentication, Prisma for databases, and Jest with Playwright for testing.
