### 1. What is Next.js?
Next.js is a metaframework meaning the framework of a framework as Next.js is a framework for React.js that was created by vercel.
Next.js enables server side rendering, static site generation and incremental static regeneration unlike react which only supports
client side rendering therefore improving the performance and the SEO, Next.js also has a file base routing system (theres two actually, the legadcy one which is Pages Router and the new and most stable one App Router) in which by creating the pages/ or app/ directories you would be able to immediately create the routes without configuring them manually or through external libraries like react.

### 2. What are the advantages and disadvantages of Next.js?
The advantages of Next.js are many, file base routing system which simplifies the process of creating all of the routes for the application, the support for 4 different rendering methos CSR, SSR, SSG and ISR as each of them can be used on specific routes according to the needs for example better interactivity, improving SEO and performance, real time updates, etc.
Next.js also has by default through next/image component an optimized way of handling images through lazy loading, the same for next/fonts, next.js also handles code splitting and lazy loading automatically and lastly through the use of server components next.js reduces the bundle size by a lot improving the performance of the app.

The disadvantages of next.js is that it has a higher learning curve than plain react, its an opinionated framework meaning that it already comes with a predefined structure in how to organize the apps such as the routing while as in react you have more options as its more flexible.

### 4. How does file-based routing work in Next.js?
Next.js uses filed based routing in which through the folder structure one can automatically create all of the routes without the need of a routing library such as react router. There are two routing systems through the Pages router (pages/Home.js) and App router (app/Home/page.js), App router is the recommended approach since the release of Next.js 13 since it provides true server components that only run in the server and are never sent to the client side, reducing the js bundling size and adding a security layer, colocation (keeping components, tests, styles in the same route folder), streaming and suspense which allows you do progressive page rendering and automatic handle of loading states while pages router loaded everything at once.

### 5. What are the different rendering strategies in Next.js?
There are 4 different rendering strategies in Next.js:

CSR: Client side rendering is the traditional approach used by standalone react applications where you initially rendered an empty html shell or an empty div with a javascript bundle that generated all of the content after rendering leading to an initial waiting time for the user and poor SEO performance as search engines read the empty HTML shell. This is used mostly for pages where you need interactivity the most and SEO is not as needed such as the settings page of an user.

SSR: Server side rendering generates HTML on the server on each requests meaning that when the user goes to an specific page the server fetches the complete data and renders the full HTML (it can also render the HTML progressively through streaming which sends chunks of the HTML as they are ready) which improves the SEO performance by a lot! As search engine crawlers read the complete HTML, the tradeoff is static responses as the server has to work on each request.

SSG: Static site generation prebuilds HTML at build time, the pages are rendered once during the buld process and served as static files from the CDN, resulting in the best possible performance and great SEO, however as the pages are updated on every build it makes them almost non interactive so their better suited for landing pages or pages that dont need to change constantly.

ISR: Incremental static regeneration, combines the benefits of static and dynamic rendering as the pages are initially generated as static files from the CDN the same as SSG however Next.js can regenerate them in the background through the revalidation configuration (after a validation period)
