# CSS Interview Guide - Questions & Answers

CSS interview preparation with concise paragraph-style answers and code examples.

---

## 1. What is the CSS Box Model and why is box-sizing important?

The CSS Box Model describes how elements are structured with four layers from inside out: content, padding, border, and margin. The box-sizing property controls how width/height are calculated. By default (content-box), width only applies to content, so padding and border ADD to the total size. With border-box, width INCLUDES padding and border, making elements behave predictably.

**Visual example:**

```
┌─────────────────────────────┐
│        MARGIN (outside)      │  ← Always outside, doesn't affect size
│  ┌───────────────────────┐  │
│  │    BORDER             │  │
│  │  ┌─────────────────┐ │  │
│  │  │   PADDING       │ │  │
│  │  │  ┌───────────┐  │ │  │
│  │  │  │  CONTENT  │  │ │  │  ← This is what you put inside
│  │  │  └───────────┘  │ │  │
│  │  └─────────────────┘ │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

```css
/* Problem with content-box (default) */
.box {
  width: 300px;           /* Only content width */
  padding: 20px;          /* Adds 40px total (left + right) */
  border: 5px solid;      /* Adds 10px total (left + right) */
  /* Total width = 300 + 40 + 10 = 350px! Not what you expected! */
}

/* Solution with border-box */
.box {
  box-sizing: border-box; /* Include padding and border in width */
  width: 300px;           /* Total width including padding and border */
  padding: 20px;
  border: 5px solid;
  /* Total width = 300px exactly! Padding and border fit inside */
}

/* Best practice: Apply to all elements */
* {
  box-sizing: border-box;
}
```

**Real example:**

```css
/* Without border-box - breaks layout! */
.card {
  width: 100%;     /* Should fill container */
  padding: 20px;   /* But now it's 100% + 40px = overflows! */
}

/* With border-box - works perfectly */
.card {
  box-sizing: border-box;
  width: 100%;     /* Fills container exactly */
  padding: 20px;   /* Padding fits inside the 100% */
}
```

**Simple rule**: Always use `box-sizing: border-box` - it makes width mean "total width" instead of "content width only".

---

## 2. When should you use Flexbox versus CSS Grid?

Flexbox is one-dimensional for arranging items in a row or column. Use it for navigation bars, centering content, and distributing space. Grid is two-dimensional for layouts with rows and columns. Use it for page layouts, galleries, and dashboards. In practice, use Grid for overall structure and Flexbox for components.

```css
.nav { display: flex; justify-content: space-between; }
.layout { display: grid; grid-template-columns: 200px 1fr 200px; }
```

---

## 3. Explain CSS positioning values.

Static is default with normal flow. Relative positions offset from normal position, keeping original space. Absolute removes from flow and positions relative to nearest positioned ancestor. Fixed positions relative to viewport and stays on scroll. Sticky acts relative until a scroll threshold, then becomes fixed. Use sticky for headers that should stick after scrolling.

---

## 4. How does the CSS Cascade work?

The cascade is the "C" in CSS - it decides which style wins when multiple rules target the same element. Think of it like a waterfall flowing down, with three levels that determine the winner in this order: 1) Importance, 2) Specificity, 3) Source Order. Each level only matters if the previous level is tied.

**The 3 Cascade Levels (in order):**

**Level 1: Importance** - !important always wins (but avoid using it!)
```css
p { color: red !important; }  /* Wins over everything */
p { color: blue; }
/* Result: red (because !important) */
```

**Level 2: Specificity** - More specific selectors win (see next question for calculation)
```css
p { color: red; }              /* Specificity: 0,0,0,1 */
.text { color: blue; }         /* Specificity: 0,0,1,0 - WINS */
/* Result: blue (class is more specific than element) */
```

**Level 3: Source Order** - If importance AND specificity are equal, the last rule wins
```css
p { color: red; }
p { color: blue; }   /* Same specificity, comes later - WINS */
/* Result: blue (written last) */
```

**Real-world example:**
```html
<p class="intro" id="first">Hello</p>
```

```css
/* Which color wins? */
p { color: red; }           /* Specificity: 0,0,0,1 */
.intro { color: blue; }     /* Specificity: 0,0,1,0 */
#first { color: green; }    /* Specificity: 0,1,0,0 - WINS! */

/* Result: green
   Why: ID has highest specificity
   Order doesn't matter when specificity is different */
```

**Inheritance** - Some properties (like color, font) pass from parent to children:
```css
body { color: gray; }
/* All text inside body inherits gray color unless overridden */
```

**Simple memory trick**: Cascade = Importance > Specificity > Order. Think "ISO" (like the camera setting).

---

## 5. What is CSS Specificity and how do you calculate it?

Specificity is like a scoring system that determines which CSS rule wins. Think of it as four columns of numbers (A, B, C, D) from left to right. Higher numbers in earlier columns always win, like comparing 0,1,0,0 vs 0,0,99,99 - the first wins because column B is higher.

**The 4 Columns (A, B, C, D):**

```
    A    B    C    D
┌────┬────┬────┬────┐
│ ?  │ ?  │ ?  │ ?  │
└────┴────┴────┴────┘
  │    │    │    │
  │    │    │    └─── D: Elements (div, p, h1)
  │    │    └──────── C: Classes (.button), Attributes ([type]), Pseudo-classes (:hover)
  │    └───────────── B: IDs (#header)
  └────────────────── A: Inline styles (style="...")
```

**How to calculate:**

1. Count **inline styles** → Column A
2. Count **IDs** → Column B
3. Count **classes, attributes, pseudo-classes** → Column C
4. Count **elements** → Column D

**Examples with step-by-step:**

```css
/* Example 1: p */
p { }
/* A=0, B=0, C=0, D=1 (one element)
   Score: 0,0,0,1 */

/* Example 2: .button */
.button { }
/* A=0, B=0, C=1 (one class), D=0
   Score: 0,0,1,0 */

/* Example 3: #header */
#header { }
/* A=0, B=1 (one ID), C=0, D=0
   Score: 0,1,0,0 */

/* Example 4: div.button */
div.button { }
/* A=0, B=0, C=1 (one class), D=1 (one element)
   Score: 0,0,1,1 */

/* Example 5: #nav .button:hover */
#nav .button:hover { }
/* A=0, B=1 (one ID), C=2 (one class + one pseudo-class), D=0
   Score: 0,1,2,0 */

/* Example 6: ul li a.link */
ul li a.link { }
/* A=0, B=0, C=1 (one class), D=3 (three elements: ul, li, a)
   Score: 0,0,1,3 */
```

**Which one wins? Compare left to right:**

```html
<p class="text" id="intro">Hello</p>
```

```css
p { color: red; }              /* 0,0,0,1 */
.text { color: blue; }         /* 0,0,1,0 - Column C higher */
#intro { color: green; }       /* 0,1,0,0 - Column B higher - WINS! */
p.text { color: yellow; }      /* 0,0,1,1 - Column B is 0, loses */

/* Result: green
   Why: ID (0,1,0,0) has higher B column than all others */
```

**Important rules:**
- **One ID beats ANY number of classes**: `0,1,0,0` > `0,0,99,99`
- **One class beats ANY number of elements**: `0,0,1,0` > `0,0,0,99`
- **Inline styles beat everything**: `<p style="color: red">` has `1,0,0,0`
- **!important breaks the system** (avoid it)

**Simple memory trick**: Think of it like money - $1,000 (ID) is worth more than $999 (999 classes).

---

## 6. What's the difference between display none, visibility hidden, and opacity zero?

display none removes element from layout completely, taking no space and inaccessible to screen readers. visibility hidden hides it but preserves space, not interactive. opacity zero makes it invisible but keeps space and remains interactive. Choose based on whether you need space preserved and interactivity maintained.

---

## 7. What are CSS Variables and their advantages?

CSS variables are reusable values defined with -- prefix and accessed with var(). Unlike preprocessor variables, they're evaluated at runtime, can be updated with JavaScript, follow cascade rules, and can be scoped. Use them for theme colors, spacing scales, and consistent values across components.

```css
:root { --primary: #007bff; }
.button { background: var(--primary); }
```

---

## 8. What is mobile-first responsive design?

Mobile-first starts with mobile styles as base, then uses min-width media queries to enhance for larger screens. It's better than desktop-first because mobile devices only load needed CSS, it's easier to enhance than strip down, and forces content prioritization. Mobile traffic often exceeds desktop, so you optimize for your primary audience.

```css
.container { width: 100%; }
@media (min-width: 768px) { .container { width: 750px; } }
```

---

## 9. What are CSS selectors and combinators?

Selectors target HTML elements for styling. Basic selectors are element (div), class (.class), ID (#id), attribute ([type="text"]), and universal (*). Combinators show relationships between elements. Think of it like a family tree: descendant (space) finds any nested element at any level, child (>) finds only direct children, adjacent sibling (+) finds the immediate next sibling, and general sibling (~) finds all following siblings at the same level.

**HTML structure for examples:**
```html
<div class="container">
  <p>Paragraph 1</p>           <!-- Direct child of div -->
  <section>
    <p>Paragraph 2</p>         <!-- Nested inside section -->
  </section>
  <p>Paragraph 3</p>           <!-- Direct child of div -->
</div>

<h1>Title</h1>
<p>First paragraph after h1</p>      <!-- Adjacent to h1 -->
<p>Second paragraph after h1</p>     <!-- General sibling to h1 -->
<div>Not a paragraph</div>
<p>Third paragraph after h1</p>      <!-- General sibling to h1 -->
```

**Combinator examples with results:**

```css
/* 1. DESCENDANT (space) - Any p inside div, at ANY level */
div p { color: red; }
/* Selects: Paragraph 1, Paragraph 2, Paragraph 3
   Why: All three are inside div (doesn't matter how deep) */

/* 2. CHILD (>) - Only DIRECT p children of div */
div > p { color: blue; }
/* Selects: Paragraph 1, Paragraph 3
   NOT Paragraph 2 (it's inside section, not a direct child) */

/* 3. ADJACENT SIBLING (+) - The p IMMEDIATELY after h1 */
h1 + p { color: green; }
/* Selects: "First paragraph after h1"
   NOT "Second paragraph" (not immediately after h1) */

/* 4. GENERAL SIBLING (~) - ALL p elements after h1 at same level */
h1 ~ p { color: purple; }
/* Selects: "First paragraph", "Second paragraph", "Third paragraph"
   Why: All are siblings of h1 that come after it
   NOT the div (it's not a p element) */
```

**Visual guide:**
```
div (parent)
├─ p ← Child (direct)          div > p ✓
│                               div p ✓
├─ section
│  └─ p ← Descendant (nested)  div > p ✗ (not direct)
│                               div p ✓ (any level)
└─ p ← Child (direct)          div > p ✓
                                div p ✓

h1
├─ p ← Adjacent (+)            h1 + p ✓  h1 ~ p ✓
├─ p ← General sibling (~)     h1 + p ✗  h1 ~ p ✓
├─ div ← Sibling but not p     h1 + p ✗  h1 ~ p ✗
└─ p ← General sibling (~)     h1 + p ✗  h1 ~ p ✓
```

**Memory tricks:**
- **Descendant (space)**: "Anyone in the family" - searches the whole tree
- **Child (>)**: "My kids only" - direct children, not grandchildren
- **Adjacent (+)**: "Next door neighbor" - the very next sibling
- **General sibling (~)**: "All neighbors after me" - all following siblings

---

## 10. What are pseudo-classes and pseudo-elements?

Pseudo-classes select elements based on state or position using single colon: :hover, :focus, :first-child, :nth-child. Pseudo-elements style parts of elements or insert content using double colons: ::before, ::after, ::first-letter. Pseudo-classes target whole elements based on conditions, pseudo-elements target parts.

```css
a:hover { color: blue; }
p::first-letter { font-size: 2em; }
```

---

## 11. What is Flexbox and its main properties?

Flexbox arranges items in rows or columns. Container properties: flex-direction (row/column), justify-content (main axis alignment), align-items (cross axis alignment), flex-wrap (wrapping), gap (spacing). Item properties: flex-grow (growth factor), flex-shrink (shrink factor), flex-basis (initial size), align-self (individual alignment), order (visual order).

---

## 12. What is CSS Grid and when to use it?

Grid creates two-dimensional layouts with rows and columns. Define structure with grid-template-columns and grid-template-rows using pixels, fr units, or repeat(). Use grid-template-areas for named regions. Properties include gap, justify-items, align-items. Use for page layouts, galleries, dashboards, and precise two-dimensional alignment.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
```

---

## 13. What are CSS transitions and animations?

Transitions animate property changes between two states, requiring a trigger like hover. Specify property, duration, timing function, and delay. Animations use keyframes for multi-step sequences that can run automatically and loop. Use transitions for simple hover effects, animations for complex sequences or loading spinners. Both should prefer transform and opacity for performance.

```css
.button { transition: background 0.3s ease; }
@keyframes slideIn { from { opacity: 0; } to { opacity: 1; } }
```

---

## 14. How do you center an element?

For modern browsers, use Flexbox with justify-content center and align-items center, or Grid with place-items center. For horizontal centering of block elements, use margin zero auto. For inline elements, use text-align center on parent. These methods work for any content size and keep elements in document flow.

---

## 15. What is the calc function?

calc() performs mathematical calculations mixing different units. Use it for dynamic widths accounting for fixed padding, fluid typography, full-height sections minus headers, or with CSS variables. Must include spaces around + and - operators. More powerful than preprocessor math because it's evaluated at runtime.

```css
.container { width: calc(100% - 80px); height: calc(100vh - 60px); }
```

---

## 16. What is Sass/SCSS and its main features?

Sass is a CSS preprocessor extending CSS with variables, nesting, mixins (reusable style blocks), functions, and operators. Advantages: DRY principles, better organization, maintainability. Disadvantages: requires build process, variables are compile-time only. Use for large projects needing organization and consistent patterns.

```scss
$primary: #007bff;
.button {
  background: $primary;
  &:hover { background: darken($primary, 10%); }
}
```

---

## 17. What are Sass mixins?

Mixins are reusable style blocks accepting parameters. Define with @mixin, include with @include. Use for responsive breakpoints, vendor prefixes, common patterns like centering, and typography styles. They prevent code duplication and create consistent patterns.

```scss
@mixin button($bg) {
  background: $bg;
  &:hover { background: darken($bg, 10%); }
}
.btn { @include button(#007bff); }
```

---

## 18. What is BEM?

BEM (Block Element Modifier) is a naming convention: block__element--modifier. Blocks are standalone entities, elements are parts of blocks, modifiers are variations. Advantages: clear structure, no specificity issues, self-documenting. Best for large projects and component libraries.

```html
<div class="card card--featured">
  <h2 class="card__title">Title</h2>
</div>
```

---

## 19. What is Tailwind CSS?

Tailwind is a utility-first framework with single-purpose classes. Instead of semantic names, combine utilities like bg-blue-500 text-white px-4 py-2. Advantages: no naming fatigue, consistent design system, small bundles with purging. Disadvantages: verbose HTML, harder to read. Use for rapid prototyping and component-based apps.

```html
<button class="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
  Click me
</button>
```

---

## Summary

Key CSS concepts: box model with border-box, Flexbox vs Grid (1D vs 2D), positioning especially sticky, cascade with origin/specificity/source order, specificity calculation, selectors and combinators (descendant, child, sibling), multiple centering methods, display/visibility/opacity differences, CSS variables advantages, mobile-first approach, pseudo-classes vs pseudo-elements, transitions vs animations, modern features like calc and gap, and methodologies like BEM and Tailwind with their trade-offs.
