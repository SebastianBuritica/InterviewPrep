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

ISR solves the fundamental tradeoff between static and dynamic content by allowing you to update static pages after deployment without rebuilding your entire application. It implements a **stale-while-revalidate** strategy that prioritizes performance while keeping content relatively fresh.

**The Three-Phase Lifecycle:**

At **build time**, Next.js pre-generates the most important pages based on your configuration. For an e-commerce site with 10,000 products, you might pre-generate only the top 100 best-selling products. The remaining 9,900 products aren't built yet, saving significant build time.

During **runtime**, when someone requests a page that wasn't pre-generated, Next.js has three fallback strategies: `false` returns 404 for non-generated pages, `true` shows a loading fallback while generating the page client-side, and `'blocking'` waits to generate the full page server-side before responding (recommended for SEO). Once generated, these on-demand pages are cached just like pre-built pages.

For **revalidation**, Next.js tracks when each page was last generated. After the revalidation period expires (e.g., 60 seconds), the next visitor still receives the cached version instantly, but Next.js triggers background regeneration. Subsequent visitors get the fresh version. This means one user might see slightly stale content, but they never wait for regeneration.

**Two Revalidation Strategies:**

**Time-based revalidation** regenerates pages periodically. Set a revalidation interval, and Next.js automatically refreshes pages after that duration. This works well for content that changes predictably, like news articles or product listings that update every few minutes.

**On-demand revalidation** gives you surgical control. When specific content changes in your CMS or database, you can immediately trigger regeneration for affected pages without waiting for the timer. Use `revalidatePath` to regenerate specific routes or `revalidateTag` to regenerate all pages that fetch data with a certain tag. This is powerful for content-heavy sites where editors expect changes to appear immediately.

**Key Trade-offs:**

ISR provides near-instant page loads (static speed) with relatively fresh content, but accepts the possibility of serving slightly stale data between revalidations. It requires a Node.js server for regeneration and uses server resources for background rebuilding. The complexity increases compared to pure static sites, but you gain the ability to scale to millions of pages without hour-long build times.

---

### 18. How does middleware work in Next.js?

Middleware intercepts requests before they reach your application code, giving you the power to modify, redirect, rewrite, or block requests at the edge before any rendering occurs. Unlike traditional server-side logic that runs during page rendering, middleware executes **before** the cache is checked and **before** any page or API route runs.

**Execution Model:**

Middleware runs on the **Edge Runtime** at CDN nodes geographically close to users, not on your origin server. This means ultra-low latency (typically under 50ms globally) for operations like authentication checks, redirects, and header manipulation. The tradeoff is you only have access to Web APIs, not Node.js-specific features, and there's a 1MB code size limit.

**Request Lifecycle Position:**

When a request arrives, Next.js follows this order: Middleware executes first with access to cookies, headers, and geolocation data. Then it checks if a cached response exists for the route. Finally, it renders the page or API route if needed. This ordering is crucial—middleware can prevent expensive rendering by redirecting unauthenticated users before your page code even loads.

**Common Patterns:**

**Authentication guards** check for valid session tokens in cookies and redirect to login pages before protected routes load. This is more efficient than checking auth in every page component because it happens once, early in the request lifecycle.

**A/B testing** assigns users to experiment variants by reading or setting cookies, then serves different content paths. The user's variant is determined before rendering, ensuring consistent experiences.

**Geolocation routing** reads the user's country from edge request data and redirects to region-specific domains or serves localized content. This happens automatically at the edge without your origin server involvement.

**Bot detection** analyzes user-agent headers and request patterns to identify and block scrapers or route them to static snapshots, protecting your dynamic routes from abuse.

**When to Use vs. Not Use:**

Use middleware for lightweight request inspection, authentication checks, redirects, header manipulation, and cookie operations. Don't use it for heavy computation, database queries (though HTTP-based database APIs work), or Node.js-specific features. Keep middleware fast—it runs on every matching request, so slow middleware hurts all your users.

---

### 19. What are Server Actions and how do you use them?

Server Actions represent a fundamental shift in how Next.js handles data mutations. They're asynchronous functions marked with `'use server'` that run exclusively on the server but can be invoked directly from Client Components, effectively creating RPC-style (Remote Procedure Call) endpoints without writing API routes.

**Architectural Advantages:**

Traditional data mutations require three layers: a client form handler that calls a fetch to an API route that executes database logic. Server Actions collapse this into one function. You write the mutation logic once, and Next.js automatically handles the network layer, serialization, and security. This dramatically reduces boilerplate while maintaining type safety across the client-server boundary.

**Progressive Enhancement:**

Unlike traditional JavaScript form handlers, Server Actions work even if JavaScript fails to load or is disabled. When you use an action as a form's `action` attribute, the browser treats it as a standard form submission. Next.js intercepts this on the server, executes your action, and returns the result. If JavaScript is enabled, Next.js enhances the experience with client-side state management and optimistic updates. If JavaScript fails, the form still works—it just does a full page refresh.

**Cache Integration:**

Server Actions have direct access to Next.js's caching system through `revalidatePath` and `revalidateTag`. After mutating data, you can immediately invalidate relevant caches in the same function. This is more ergonomic than API routes where you'd need to call separate revalidation endpoints.

**State Management:**

The `useFormState` hook connects Server Actions to React state, letting you access returned errors or success messages in your UI. The `useFormStatus` hook provides pending states, enabling loading indicators without manual state management. These hooks bridge server execution with client-side interactivity seamlessly.

**Security Considerations:**

Server Actions automatically protect against CSRF attacks and only expose functions explicitly marked with `'use server'`. They serialize data safely and validate that actions are called from legitimate sources. However, you must still validate inputs within actions—Next.js doesn't automatically sanitize form data.

**When to Use:**

Use Server Actions for form submissions, data mutations, and cache invalidation. They excel when you need tight integration between UI and server logic. Stick with API routes when you need REST endpoints for third-party consumers, webhook receivers, or complex middleware chains that require request/response manipulation beyond simple data mutations.

---

### 20. How do you implement authentication in Next.js?

Authentication in Next.js requires careful coordination between client-side session access, server-side validation, and middleware protection. The challenge is maintaining security while providing seamless experiences across Server Components, Client Components, API routes, and middleware.

**NextAuth.js (Auth.js) - The Standard Approach:**

NextAuth.js abstracts away the complexity of authentication infrastructure. It handles the complete OAuth flow (redirects, state parameters, token exchanges), manages session cookies with automatic CSRF protection, refreshes tokens before expiration, and integrates with databases to persist users and sessions.

For **session management**, NextAuth uses httpOnly cookies that JavaScript can't access, protecting against XSS attacks. Sessions are stored either in JWT tokens (stateless, no database needed) or database records (stateful, allows instant revocation). JWT sessions are faster but harder to invalidate; database sessions enable immediate logout across devices but require database queries on every request.

In the **App Router**, Server Components call `getServerSession()` to access the current user without client-side JavaScript. This is more secure than client-side checks because the session validation happens on the server where users can't tamper with it. Client Components use the `useSession()` hook for interactive features like user menus.

**Middleware integration** is critical for protecting routes. Middleware checks session validity before page rendering, redirecting unauthenticated users to login immediately. This is more efficient than checking auth in individual page components because it happens once per request, early in the lifecycle.

**Custom JWT Implementation:**

Custom JWT gives you complete control over authentication logic but requires implementing security yourself. You're responsible for generating secure tokens with proper expiration times, storing them in httpOnly cookies with secure and sameSite flags, validating signatures on every request, and handling token refresh flows.

The **security burden** is significant: you must prevent timing attacks during token validation, implement rate limiting on login endpoints, handle password hashing with bcrypt or Argon2, protect against JWT algorithm confusion attacks, and ensure tokens are invalidated on logout (requiring a token blacklist or short expiration times).

**Key Architectural Decisions:**

**Session storage location** matters: Database sessions allow instant revocation and session listing but add database latency to every authenticated request. JWT sessions are stateless and fast but can't be revoked until they expire (use short expiration times like 15 minutes with refresh tokens).

**Middleware vs. page-level auth** protection determines where checks happen. Middleware protects entire route segments efficiently but all routes share the same middleware logic. Page-level checks provide granular control but require more boilerplate and can't redirect before rendering starts.

**Provider strategy** affects user experience: OAuth (Google, GitHub) is convenient for users but requires managing external provider relationships and handling account linking when users use multiple providers. Email/password gives you full control but requires secure password storage, reset flows, and email verification infrastructure.

**When to Choose Each:**

Use NextAuth.js for most applications because it handles security correctly by default, supports multiple providers easily, and has extensive documentation. Choose custom JWT when you have specific requirements like integrating with existing auth systems, need unusual session storage mechanisms, or want to minimize dependencies. Never build custom auth unless you have security expertise—authentication bugs create critical vulnerabilities.

---

### 21. How do you optimize performance in Next.js?

Performance optimization in Next.js focuses on reducing JavaScript payload, optimizing asset delivery, and minimizing render-blocking resources. The framework provides specialized tools for each major performance category.

**Image Optimization:**

Images typically account for 50-70% of page weight, making them the highest-impact optimization target. Next.js's Image component automatically generates multiple sizes (srcset) so browsers download appropriately sized images for each device. It serves modern formats like WebP and AVIF with automatic fallbacks for older browsers, reducing file sizes by 30-50% without quality loss.

Lazy loading is automatic for below-the-fold images, meaning they only download when users scroll near them. This dramatically improves initial page load time for content-heavy pages. For above-the-fold hero images, use the priority prop to preload them and optimize Largest Contentful Paint (LCP), the most important Core Web Vital metric.

The component reserves space before images load (using width/height or fill mode) to prevent layout shift, which hurts Cumulative Layout Shift (CLS) scores. Images are served through Next.js's image optimization API, which processes and caches variants on-demand.

**Font Optimization:**

Font loading has historically caused Flash of Unstyled Text (FOUT) or Flash of Invisible Text (FOIT), hurting perceived performance. Next.js's font system downloads fonts at build time and self-hosts them, eliminating external network requests to font CDNs that block rendering.

It automatically implements font-display: swap, showing fallback fonts immediately while custom fonts load. The CSS size-adjust property adjusts fallback font metrics to match custom font dimensions, preventing layout shift when fonts swap. This combination provides instant text visibility with zero layout shift.

**Code Splitting Strategy:**

Next.js automatically splits code at page boundaries, so visiting the homepage doesn't download code for the dashboard. This works without configuration. However, large components shared across pages (chart libraries, rich text editors, maps) still bundle everywhere unless you manually split them.

Dynamic imports load components on-demand, only downloading code when the component renders. For client-only components that use browser APIs or don't need server rendering, disable SSR to reduce server-side bundle size. The tradeoff is users see a loading state until the component downloads and mounts.

**Third-Party Script Management:**

Unoptimized third-party scripts (analytics, ads, chat widgets) often block the main thread, degrading interactivity. Next.js's Script component provides loading strategies to control when scripts execute. The afterInteractive strategy loads scripts after the page becomes interactive, preventing them from blocking critical rendering. The lazyOnload strategy defers scripts until the browser is idle. The beforeInteractive strategy (use sparingly) loads scripts before hydration for critical functionality.

**Bundle Analysis:**

Performance optimization requires measuring what's actually in your bundles. Bundle analyzer visualizes all dependencies, showing which packages contribute most to bundle size. Common issues include accidentally importing entire libraries when you only need small parts, duplicate dependencies from different packages, and moment.js-style libraries that bundle all locales. Tree-shaking eliminates unused code automatically, but only for ESM packages with proper package.json sideEffects configuration.

**Core Web Vitals Focus:**

Google ranks pages partly based on three Core Web Vitals: Largest Contentful Paint (LCP, how quickly main content loads), First Input Delay (FID, how quickly the page responds to interactions), and Cumulative Layout Shift (CLS, how much the page jumps around). Next.js optimizations target all three: image and font optimization improve LCP, code splitting and script management improve FID, and automatic space reservation prevents CLS.

---

### 22. What are caching strategies in Next.js?

Next.js provides multiple caching layers that work together to optimize performance. Understanding when and how to use each layer is critical for building fast applications without serving stale data.

**The Four Caching Layers:**

**Request Memoization** happens automatically within a single render cycle. If you call the same fetch with identical arguments multiple times in different components during one request, Next.js deduplicates them into a single network request. This cache only lasts for the duration of one server render, not across requests. It prevents redundant fetches when multiple components need the same data.

**Data Cache** persists fetch results across requests and deployments. By default, Next.js caches fetch responses indefinitely using `force-cache`, meaning the first request fetches data and subsequent requests serve from cache until you explicitly revalidate. This is powerful for static content but dangerous for dynamic data if you forget to configure revalidation.

**Full Route Cache** stores the HTML and React Server Component payload after rendering. For statically generated routes, this cache persists indefinitely across deployments. For dynamic routes, this cache doesn't exist. This is why static pages load instantly—they're fully pre-rendered files served from disk.

**Router Cache** is a client-side cache of React Server Component payloads. When you navigate to a page, Next.js caches it in memory so clicking Back doesn't refetch data. This cache is temporary (session-based) and makes client-side navigation feel instant.

**Cache Configuration Strategies:**

**No caching** (`cache: 'no-store'`) bypasses the Data Cache entirely, always fetching fresh data. Use this for user-specific or real-time data that changes frequently. The tradeoff is every request hits your data source, increasing latency and load.

**Infinite caching** (`force-cache`, the default) caches forever until explicitly revalidated. Use this for truly static content like blog posts that rarely change. Be careful—forgot to revalidate and users see stale data indefinitely.

**Time-based revalidation** (`next: { revalidate: 60 }`) implements ISR, revalidating after a specified duration. After 60 seconds, the next request triggers background regeneration while serving cached data. This balances freshness with performance.

**Tag-based revalidation** (`next: { tags: ['products'] }`) lets you group related fetches and invalidate them together. When product data changes, call `revalidateTag('products')` to purge all cached fetches with that tag. This is more surgical than time-based revalidation because you invalidate exactly when data changes, not on a timer.

**Route Segment Configuration:**

Beyond fetch-level caching, you can configure entire routes. Setting `export const dynamic = 'force-dynamic'` opts the entire route out of caching, always rendering fresh. Setting `export const revalidate = 60` makes all fetches in that route revalidate every 60 seconds by default. Setting `export const fetchCache = 'force-no-store'` prevents any fetch caching in that route.

**Client-Side Caching with SWR:**

For Client Components, SWR provides client-side caching with automatic revalidation. It implements stale-while-revalidate: immediately return cached data (stale) while fetching fresh data (revalidate). Configure `revalidateOnFocus` to refresh when users return to your tab, `revalidateOnReconnect` for network recovery, and `dedupingInterval` to prevent duplicate requests within a time window.

**Common Pitfalls:**

The most common mistake is forgetting that the default behavior is infinite caching. Developers fetch data, see it work, then later discover users see stale content because they never configured revalidation. Always explicitly choose your caching strategy.

Another issue is over-caching. Caching user-specific data can leak private information between users. Never cache data that varies by user without scoping the cache key to include user identity.

Finally, cache invalidation is notoriously difficult. Tag-based revalidation helps, but you must tag fetches correctly and remember to revalidate when data changes. Missing a revalidation call means stale data until the next deployment.

---

### 24. How do you integrate a database with Next.js?

Database integration in Next.js differs from traditional servers because of the serverless deployment model and the App Router's Server Components that query databases directly from components.

**The Serverless Challenge:**

Traditional servers maintain persistent database connection pools that reuse connections across requests. Next.js serverless functions (including Server Components) create new execution environments for each request, making connection pooling difficult. Without careful management, you'll exhaust database connection limits as each request opens new connections.

**Prisma - The Recommended Approach:**

Prisma solves serverless connection pooling through its query engine architecture. It generates TypeScript types from your database schema, providing compile-time safety that prevents querying non-existent columns or wrong data types. The migrations system tracks schema changes, making it easy to evolve your database alongside your application.

The **singleton pattern** is critical in development because Next.js's hot reloading creates new module instances, potentially opening new database connections on every file save. The singleton ensures only one Prisma Client exists globally during development. In production, each serverless invocation gets a fresh instance, which is fine because production doesn't have hot reloading.

**App Router Integration:**

Server Components can query databases directly without API routes. This eliminates the traditional three-layer architecture (component → API route → database) into one layer (Server Component → database). This dramatically reduces boilerplate and latency since you avoid the HTTP round-trip to your own API.

Server Actions handle mutations with integrated cache invalidation. After inserting a record, immediately call `revalidatePath` to purge affected caches, ensuring subsequent requests see fresh data. This tight integration between data mutations and caching is cleaner than coordinating cache invalidation from separate API endpoints.

**Connection Pooling for Production:**

For production serverless deployments, use connection pooling solutions like PgBouncer (Postgres) or Prisma Data Proxy. These services maintain persistent connection pools and expose HTTP endpoints that your serverless functions connect to. This solves the connection exhaustion problem by proxying many serverless invocations through a limited pool of database connections.

**Alternative Approaches:**

**MongoDB with Mongoose** provides schema validation and ODM features for document databases. MongoDB Atlas has built-in connection pooling that works well with serverless.

**Supabase and PlanetScale** are serverless-native database services designed for edge/serverless environments. They expose HTTP APIs instead of requiring TCP connections, making them compatible with Edge Functions. They handle connection pooling, scaling, and backups automatically.

**Key Architectural Decisions:**

**ORM vs raw SQL** trades developer experience for control. ORMs reduce boilerplate and provide type safety but can generate inefficient queries. Raw SQL requires more code but gives precise control over performance.

**Connection strategy** depends on deployment. Traditional servers can use connection pools directly. Serverless requires connection proxies or HTTP-based database services.

**Edge compatibility** matters if you use Edge Functions. Traditional databases require TCP connections unavailable at the edge. Use HTTP-based services like Supabase, PlanetScale, or Prisma Data Proxy for edge execution.

---

### 25. What are best practices for deploying Next.js to production?

**Environment Variables:**

Variables without `NEXT_PUBLIC_` prefix are server-only and secure for sensitive data (database URLs, API keys). Variables with `NEXT_PUBLIC_` prefix are embedded in the JavaScript bundle at build time and visible to all users—only use for truly public configuration. The common mistake is using `NEXT_PUBLIC_` for convenience, exposing secrets in browser dev tools. Store development variables in `.env.local` (git-ignored) and set production variables through deployment platform interfaces.

**Deployment Strategy:**

**Vercel** offers zero-configuration deployment with automatic HTTPS, global CDN, preview deployments, and native ISR/Edge Functions support. The tradeoff is vendor lock-in and higher costs at scale.

**Self-hosting** (Docker with `standalone` output mode) provides complete control and potentially lower costs but requires managing load balancers, HTTPS certificates, CDN caching, and ensuring sufficient memory for SSR. For ISR with multiple instances, use shared storage (Redis, S3) to prevent inconsistent caching across servers.

**Security Essentials:**

Always validate inputs server-side using schemas (Zod, Yup). Configure security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Content-Security-Policy`) in `next.config.js`. Set cookie flags correctly: `httpOnly` prevents XSS, `secure` requires HTTPS, `sameSite: 'strict'` prevents CSRF. Never store sensitive data in localStorage. Implement rate limiting at middleware layer for login attempts, API calls, and form submissions.

**Monitoring:**

Track Core Web Vitals (LCP, FID, CLS) for SEO ranking. Use error tracking (Sentry) with source map uploads for meaningful stack traces. Implement structured logging with request IDs to trace distributed requests. Monitor server health (memory, CPU, disk, response times) and configure alerts for anomalies.

---

## Summary & Study Tips

Master these essential concepts in order: understand what Next.js is and why to use it, learn file-based routing, grasp the four rendering strategies and when to use each, and understand the difference between Pages and App Router. For intermediate knowledge, dive deep into when to use SSR vs SSG vs ISR vs CSR with real examples, learn data fetching methods for both routers, master dynamic routes and API routes, understand Server vs Client Components, and practice forms with multiple approaches and state management patterns.

Advanced topics require hands-on practice: implement ISR with on-demand revalidation, create middleware for authentication and A/B testing, use Server Actions for mutations, implement complete authentication with NextAuth.js or custom JWT, optimize performance with images/fonts/code-splitting, understand caching strategies in depth, use Edge Functions appropriately, integrate Prisma with your database, and follow production deployment best practices.

Build a full-stack application with authentication and database to solidify your knowledge. Practice explaining rendering strategies and their tradeoffs. Understand when to use each feature and be able to compare Next.js with React, Gatsby, and Remix. Common libraries to know include Tailwind CSS and shadcn/ui for UI, React Hook Form with Zod for forms, Zustand and SWR for state management, NextAuth.js for authentication, Prisma for databases, and Jest with Playwright for testing.
