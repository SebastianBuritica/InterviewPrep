# CSS - Modern Interview Guide

## Box Model & Box-Sizing

**Theory**: Every element is a box with content, padding, border, and margin.

```css
/* Default - width only affects content */
box-sizing: content-box;

/* Modern - width includes padding & border */
box-sizing: border-box; /* ✅ Use this always */

/* Global reset (best practice) */
* {
  box-sizing: border-box;
}
```

**Why border-box**: Makes sizing predictable. A 300px div stays 300px even with padding/border.

---

## Flexbox vs Grid - When to Use Each

### Flexbox
**Theory**: One-dimensional layout (row OR column). Content-first approach.

**Best for**:
- Navigation bars
- Card layouts
- Centering items
- Distributing space between items
- When content size determines layout

```css
.container {
  display: flex;
  justify-content: space-between; /* Main axis (horizontal) */
  align-items: center;           /* Cross axis (vertical) */
  gap: 1rem;
}

.item {
  flex: 1; /* Grow equally */
}
```

**Common Patterns**:
```css
/* Perfect centering */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Space between items */
.nav {
  display: flex;
  gap: 1rem; /* Modern, cleaner than margins */
}
```

---

### Grid
**Theory**: Two-dimensional layout (rows AND columns). Layout-first approach.

**Best for**:
- Page layouts
- Complex components with rows and columns
- Responsive galleries
- When layout structure matters more than content

```css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr; /* 3 columns */
  gap: 1rem;
}

/* Responsive grid - auto columns */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
```

**Common Patterns**:
```css
/* Holy Grail Layout */
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
```

---

### Quick Comparison

| Aspect | Flexbox | Grid |
|--------|---------|------|
| **Dimensions** | 1D (row or column) | 2D (rows and columns) |
| **Best for** | Components, nav bars | Layouts, galleries |
| **Approach** | Content-first | Layout-first |
| **Alignment** | One direction at a time | Both directions |
| **Use when** | Items in a line | Complex structures |

**Rule of thumb**: Use Flexbox for components, Grid for layouts. They work great together!

---

## Positioning

**Theory**: Controls how elements are positioned in the document.

```css
position: static;    /* Default, normal flow */
position: relative;  /* Relative to normal position, creates context */
position: absolute;  /* Relative to nearest positioned ancestor */
position: fixed;     /* Relative to viewport, stays on scroll */
position: sticky;    /* Relative until scroll threshold, then fixed */
```

**Sticky Example** (common interview question):
```css
.navbar {
  position: sticky;
  top: 0; /* Sticks to top when scrolling */
  z-index: 100;
}
```

---

## Specificity

**Theory**: Determines which CSS rule applies when multiple rules target same element.

**Calculation (0-0-0-0)**:
1. Inline styles (1-0-0-0)
2. IDs (0-1-0-0)
3. Classes, attributes, pseudo-classes (0-0-1-0)
4. Elements, pseudo-elements (0-0-0-1)

```css
div { }                    /* 0-0-0-1 */
.class { }                 /* 0-0-1-0 */
#id { }                    /* 0-1-0-0 */
div.class#id { }           /* 0-1-1-1 - this wins */

/* !important overrides all (avoid!) */
color: red !important;
```

---

## Responsive Design

### Mobile-First Approach
**Theory**: Start with mobile styles, add complexity for larger screens.

```css
/* Mobile first - base styles for small screens */
.container {
  width: 100%;
  padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    width: 750px;
    margin: 0 auto;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    width: 960px;
  }
}
```

**Why mobile-first**: Better performance (mobile loads less CSS), easier to enhance than strip down.

---

### Responsive Units

```css
/* Relative units */
rem  /* Relative to root font-size (most versatile) */
em   /* Relative to parent font-size (careful with nesting) */
%    /* Relative to parent dimension */
vw   /* 1% of viewport width */
vh   /* 1% of viewport height */

/* Examples */
html { font-size: 16px; }
h1 { font-size: 2rem; }      /* 32px */
padding { padding: 1.5rem; } /* 24px */
width { width: 50vw; }       /* Half viewport width */
```

**Best practice**: Use `rem` for font sizes and spacing, `%` or `vw/vh` for layouts.

---

## Modern CSS Features

### CSS Variables (Custom Properties)
**Theory**: Reusable values that can change dynamically.

```css
:root {
  --primary-color: #007bff;
  --spacing: 8px;
}

.button {
  background: var(--primary-color);
  padding: calc(var(--spacing) * 2);
}

/* Change with JavaScript */
document.documentElement.style.setProperty('--primary-color', '#ff0000');
```

**Interview question**: "Why use CSS variables over Sass variables?"
**Answer**: CSS variables are live (can change at runtime), work with JavaScript, and cascade/inherit.

---

### Calc Function
```css
width: calc(100% - 80px);
font-size: calc(1rem + 2vw);      /* Fluid typography */
height: calc(100vh - 60px);       /* Full height minus header */
```

---

### Clamp (Responsive Typography)
**Theory**: Sets min, preferred, and max values.

```css
/* Font size: min 1rem, ideal 2vw, max 3rem */
font-size: clamp(1rem, 2vw, 3rem);

/* No media queries needed! */
```

---

### Gap Property (Flexbox & Grid)
**Theory**: Modern way to add spacing between items.

```css
/* Instead of margins on children */
.flex-container {
  display: flex;
  gap: 1rem; /* Space between all items */
}

.grid-container {
  display: grid;
  gap: 1rem 2rem; /* row-gap column-gap */
}
```

---

### Aspect Ratio
```css
.video {
  aspect-ratio: 16 / 9; /* Maintains ratio */
}

.square {
  aspect-ratio: 1; /* Perfect square */
}
```

---

## Common Interview Questions

### Q1: Center a div horizontally and vertically

```css
/* Method 1: Flexbox (modern, best) */
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Method 2: Grid (even simpler) */
.parent {
  display: grid;
  place-items: center;
}

/* Method 3: Position + Transform (old school) */
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

---

### Q2: `display: none` vs `visibility: hidden` vs `opacity: 0`

| Property | Space Taken | Visible | Interactive | Use Case |
|----------|-------------|---------|-------------|----------|
| `display: none` | No | No | No | Remove from layout |
| `visibility: hidden` | Yes | No | No | Hide but keep space |
| `opacity: 0` | Yes | No | Yes | Fade animations |

---

### Q3: Block vs Inline vs Inline-Block

```css
display: block;        /* Full width, new line, can set width/height */
display: inline;       /* Content width, same line, can't set width/height */
display: inline-block; /* Content width, same line, CAN set width/height */
```

---

### Q4: Pseudo-classes vs Pseudo-elements

```css
/* Pseudo-classes: element state (single :) */
a:hover { }
li:first-child { }
input:focus { }
div:nth-child(2) { }

/* Pseudo-elements: part of element (double ::) */
p::before { content: "→"; }
p::after { content: "←"; }
p::first-letter { }
input::placeholder { }
```

---

### Q5: CSS Transitions vs Animations

**Transitions**: Simple A→B changes triggered by state change.
```css
.button {
  background: blue;
  transition: background 0.3s ease;
}
.button:hover {
  background: red;
}
```

**Animations**: Complex multi-step animations, can loop.
```css
@keyframes slideIn {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(0); }
}

.element {
  animation: slideIn 0.5s ease-out;
}
```

**When to use**: Transitions for simple hover/focus effects. Animations for complex multi-step sequences.

---

## Performance Best Practices

### Avoid Expensive Properties
```css
/* ❌ Triggers layout (expensive) */
width, height, margin, padding, top, left

/* ⚠️ Triggers paint (moderate) */
color, background, border-radius, box-shadow

/* ✅ Composite only (cheap) */
transform, opacity
```

**For smooth animations, stick to `transform` and `opacity`!**

---

### Use `will-change` Sparingly
```css
.animated-element {
  will-change: transform; /* Hint browser to optimize */
}

/* Remove after animation */
.done {
  will-change: auto;
}
```

**Warning**: Don't overuse. Creates new layers = more memory.

---

## Common Patterns

### Truncate Text with Ellipsis
```css
/* Single line */
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Multiple lines (3 lines) */
.truncate-multi {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

### Responsive Image
```css
img {
  max-width: 100%;
  height: auto;
  display: block; /* Removes bottom spacing */
}
```

---

### Smooth Scrolling
```css
html {
  scroll-behavior: smooth;
}
```

---

## Interview Tips

1. **Flexbox vs Grid**: Know when to use each (1D vs 2D)
2. **Box-sizing**: Always explain `border-box` vs `content-box`
3. **Specificity**: Be able to calculate (0-0-0-0)
4. **Mobile-first**: Understand `min-width` media queries
5. **Performance**: Know `transform` and `opacity` are cheapest
6. **CSS Variables**: Explain advantages over preprocessor variables
7. **Positioning**: Understand all 5 types, especially `sticky`
8. **Responsive**: Know multiple centering techniques
9. **Modern features**: Mention `gap`, `clamp`, `aspect-ratio`
10. **BEM naming**: Bonus points if you know `block__element--modifier`

---

## Best Practices Checklist

- ✅ Use `box-sizing: border-box` globally
- ✅ Mobile-first responsive design
- ✅ Use CSS variables for theming
- ✅ Use `rem` for font sizes
- ✅ Use `gap` instead of margins in flex/grid
- ✅ Avoid `!important` (specificity problem)
- ✅ Use `transform` and `opacity` for animations
- ✅ Minimize nesting (max 3 levels)
- ✅ Use semantic class names
- ✅ Group related properties together
