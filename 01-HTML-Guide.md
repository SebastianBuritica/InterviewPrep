# HTML Interview Preparation Guide

## Core Concepts

### What is HTML?

**Theory**: HyperText Markup Language - the standard markup language for creating web pages. HTML provides the structure and semantic meaning of content, while CSS handles presentation and JavaScript handles behavior.

**HTML5**: Latest version with semantic elements, multimedia support, APIs, and better accessibility.

---

## Semantic HTML - Critical Interview Topic

**Theory**: Semantic HTML uses elements that describe their meaning/purpose, not just their appearance. Improves accessibility, SEO, and code maintainability.

### Why Semantic HTML Matters

**1. Accessibility**: Screen readers understand content structure
- `<nav>` tells screen readers "this is navigation"
- `<article>` indicates independent content
- `<button>` vs `<div>` - proper semantics enable keyboard navigation

**2. SEO**: Search engines better understand page structure
- `<header>`, `<main>`, `<footer>` help crawlers identify key sections
- `<h1>` - `<h6>` establish content hierarchy
- Semantic markup improves search rankings

**3. Maintainability**: Code is easier to read and understand
- `<nav>` is clearer than `<div class="navigation">`
- Self-documenting structure

### Semantic Elements

```html
<!-- Document structure -->
<header>   <!-- Page/section header -->
<nav>      <!-- Navigation links -->
<main>     <!-- Primary content (one per page) -->
<article>  <!-- Self-contained content -->
<section>  <!-- Thematic grouping -->
<aside>    <!-- Tangentially related content -->
<footer>   <!-- Page/section footer -->

<!-- Text semantics -->
<h1> - <h6>  <!-- Headings (hierarchy) -->
<p>          <!-- Paragraph -->
<strong>     <!-- Important (bold) -->
<em>         <!-- Emphasized (italic) -->
<mark>       <!-- Highlighted -->
<time>       <!-- Date/time -->
<blockquote> <!-- Quotation -->
<code>       <!-- Code snippet -->

<!-- Media -->
<figure>     <!-- Self-contained content (image, diagram) -->
<figcaption> <!-- Caption for figure -->
```

### Semantic Example

```html
<!-- ❌ Non-semantic -->
<div class="header">
  <div class="nav">
    <div class="link">Home</div>
  </div>
</div>
<div class="content">
  <div class="post">Article content</div>
</div>

<!-- ✓ Semantic -->
<header>
  <nav>
    <a href="/">Home</a>
  </nav>
</header>
<main>
  <article>Article content</article>
</main>
```

**Benefits**: Screen reader announces "navigation landmark" and "main landmark", search engines understand structure, developers understand intent.

---

## Accessibility (a11y) - Critical for Interviews

**Theory**: Making web content usable by people with disabilities. Not optional - legal requirement in many jurisdictions (ADA, WCAG).

### 1. Alternative Text for Images

**Theory**: Screen readers read alt text aloud. Describes image content for visually impaired users.

```html
<!-- ✓ Descriptive alt text -->
<img src="cat.jpg" alt="Orange tabby cat sleeping on blue couch">

<!-- ❌ Bad alt text -->
<img src="cat.jpg" alt="image">

<!-- Decorative images - empty alt -->
<img src="decorative-line.png" alt="">
```

**Rules**:
- Describe what's in the image
- Keep it concise (under 150 characters)
- Don't say "image of" - screen reader already announces it
- Decorative images: empty alt (`alt=""`)
- Never omit alt attribute

---

### 2. Form Accessibility

**Theory**: Forms must be usable by keyboard and screen readers. Labels associate text with inputs.

```html
<!-- ✓ Proper label association -->
<label for="username">Username:</label>
<input id="username" type="text" aria-describedby="username-help" required>
<small id="username-help">Must be 3-20 characters</small>

<!-- ✓ Fieldset for radio groups -->
<fieldset>
  <legend>Choose your plan:</legend>
  <label><input type="radio" name="plan" value="basic"> Basic</label>
  <label><input type="radio" name="plan" value="pro"> Pro</label>
</fieldset>
```

**Why**:
- `for` and `id` link label to input - clicking label focuses input
- `aria-describedby` provides additional context
- `required` indicates mandatory fields
- `<fieldset>` groups related inputs
- `<legend>` describes the group

---

### 3. ARIA (Accessible Rich Internet Applications)

**Theory**: ARIA attributes enhance accessibility when semantic HTML isn't enough. Don't overuse - semantic HTML is preferred.

**Common ARIA attributes**:

```html
<!-- aria-label: Provide accessible name -->
<button aria-label="Close dialog">×</button>

<!-- aria-labelledby: Reference another element for label -->
<h2 id="dialog-title">Confirm Delete</h2>
<div role="dialog" aria-labelledby="dialog-title">...</div>

<!-- aria-describedby: Additional description -->
<input id="password" aria-describedby="password-requirements">
<div id="password-requirements">Must be 8+ characters</div>

<!-- aria-live: Announce dynamic updates -->
<div aria-live="polite">Form submitted successfully!</div>

<!-- aria-hidden: Hide decorative elements -->
<span aria-hidden="true">★</span>

<!-- role: Define element purpose (when semantic element unavailable) -->
<div role="button" tabindex="0">Click me</div>
```

**ARIA roles**:
- `role="banner"` - Site header
- `role="navigation"` - Navigation
- `role="main"` - Main content
- `role="alert"` - Important message
- `role="dialog"` - Modal dialog

**Rule**: Prefer semantic HTML over ARIA. Use `<button>` instead of `<div role="button">`.

---

### 4. Keyboard Navigation

**Theory**: All interactive elements must be accessible via keyboard (Tab, Enter, Space, Arrows).

```html
<!-- ✓ Native buttons are keyboard-accessible -->
<button>Click me</button>
<a href="/page">Link</a>

<!-- ❌ Div isn't focusable or keyboard-accessible -->
<div onclick="doSomething()">Click me</div>

<!-- ✓ If you must use div, make it accessible -->
<div role="button" tabindex="0" onclick="doSomething()" onkeypress="handleKey(event)">
  Click me
</div>
```

**tabindex values**:
- `tabindex="0"` - Element in natural tab order
- `tabindex="-1"` - Programmatically focusable only (for focus management)
- `tabindex="1+"` - **AVOID** - overrides natural order

**Best practice**: Use semantic elements (`<button>`, `<a>`) - they're keyboard-accessible by default.

---

### 5. Heading Hierarchy

**Theory**: Headings create document outline. Critical for screen reader navigation.

```html
<!-- ✓ Proper hierarchy -->
<h1>Page Title</h1>
  <h2>Section 1</h2>
    <h3>Subsection 1.1</h3>
    <h3>Subsection 1.2</h3>
  <h2>Section 2</h2>

<!-- ❌ Skipping levels -->
<h1>Page Title</h1>
  <h4>This skips h2 and h3</h4>
```

**Rules**:
- One `<h1>` per page (page title)
- Don't skip levels (h1 → h3)
- Don't choose headings by size - use CSS for styling
- Headings create document outline for screen readers

---

## Document Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Page description for SEO">
  <title>Page Title</title>
</head>
<body>
  <!-- Content -->
</body>
</html>
```

**Key elements**:
- `<!DOCTYPE html>` - Triggers standards mode (not quirks mode)
- `lang="en"` - Language for screen readers and translation
- `charset="UTF-8"` - Character encoding (supports all languages)
- `viewport` - Responsive design (mobile-friendly)
- `description` - SEO meta tag (appears in search results)

---

## Forms and Input

### Input Types

**Theory**: HTML5 provides semantic input types with built-in validation and mobile keyboards.

```html
<input type="text">       <!-- Plain text -->
<input type="email">      <!-- Email with validation -->
<input type="password">   <!-- Hidden text -->
<input type="number" min="0" max="100" step="5">
<input type="tel">        <!-- Phone number -->
<input type="url">        <!-- URL with validation -->
<input type="date">       <!-- Date picker -->
<input type="time">       <!-- Time picker -->
<input type="color">      <!-- Color picker -->
<input type="search">     <!-- Search field -->
<input type="file" accept="image/*" multiple>
```

**Benefits**:
- Built-in validation (email format, URL format)
- Mobile keyboards (email keyboard for email inputs)
- Native UI controls (date picker, color picker)

---

### Form Validation

**Theory**: HTML5 provides client-side validation attributes. Always validate server-side too.

```html
<input type="email" required>
<input type="text" pattern="[A-Za-z]{3,}" title="Min 3 letters">
<input type="number" min="1" max="10">
<input type="text" minlength="3" maxlength="20">
```

**Validation attributes**:
- `required` - Field must be filled
- `pattern` - Regex validation
- `min`, `max` - Numeric/date range
- `minlength`, `maxlength` - String length
- `title` - Tooltip for pattern

---

## Media Elements

### Responsive Images

```html
<!-- srcset for different screen sizes -->
<img src="small.jpg"
     srcset="medium.jpg 768w, large.jpg 1200w"
     sizes="(max-width: 768px) 100vw, 50vw"
     alt="Description">

<!-- Picture for different formats/layouts -->
<picture>
  <source media="(min-width: 768px)" srcset="wide.jpg">
  <source media="(min-width: 480px)" srcset="medium.jpg">
  <img src="small.jpg" alt="Description">
</picture>

<!-- Lazy loading -->
<img src="image.jpg" alt="Description" loading="lazy">
```

---

## Interview Questions

### Q: "What is semantic HTML and why is it important?"

**Answer**: "Semantic HTML uses elements that describe their meaning, not just appearance.

**Why it matters:**

**1. Accessibility** - Screen readers understand structure:
- `<nav>` announces 'navigation landmark'
- `<button>` is keyboard-accessible by default
- Proper headings create document outline

**2. SEO** - Search engines understand content:
- `<article>` indicates primary content
- `<header>`, `<footer>` identify page structure
- Better rankings from clear structure

**3. Maintainability** - Self-documenting code:
- `<nav>` is clearer than `<div class='nav'>`
- Easier for teams to understand

**Example**:
```html
<!-- Non-semantic -->
<div class="header">
  <div class="nav">Links</div>
</div>

<!-- Semantic -->
<header>
  <nav>Links</nav>
</header>
```

The semantic version tells the browser, search engines, and screen readers exactly what each element is."

---

### Q: "Explain the difference between `<div>` and `<span>`"

**Answer**: "Both are generic containers, but differ in display behavior:

**`<div>`** - Block-level element:
- Takes full width available
- Starts on new line
- Can contain other block and inline elements
- Use for layout sections

**`<span>`** - Inline element:
- Takes only necessary width
- Stays in text flow
- Can only contain inline elements
- Use for styling parts of text

**Example**:
```html
<div>This takes full width</div>
<div>And starts on new line</div>

<span>This stays</span> <span>on same line</span>
```

**When to use**: Use semantic elements when possible (`<nav>`, `<header>`, etc.). Use `<div>` only when no semantic alternative exists."

---

### Q: "What are data attributes and how do you use them?"

**Answer**: "Data attributes store custom data on HTML elements. Prefixed with `data-`.

```html
<div data-user-id="123" data-role="admin">User Info</div>
```

**Access in JavaScript**:
```javascript
// Via dataset (converts kebab-case to camelCase)
element.dataset.userId;        // "123"
element.dataset.role;          // "admin"

// Via getAttribute
element.getAttribute('data-user-id');  // "123"

// Set value
element.dataset.userId = "456";
```

**Use cases**:
- Store metadata without affecting styling
- Pass data to JavaScript
- Testing selectors
- Progressive enhancement

**Example**: Store product ID for 'Add to Cart' button."

---

### Q: "Difference between `<script>`, `<script async>`, and `<script defer>`?"

**Answer**: "Controls how scripts load and execute:

**Normal `<script>`**:
- Blocks HTML parsing
- Downloads and executes immediately
- Blocks page rendering

**`<script async>`**:
- Downloads in parallel with HTML parsing
- Executes as soon as downloaded (may block parsing)
- Order not guaranteed
- Use for independent scripts (analytics)

**`<script defer>`**:
- Downloads in parallel with HTML parsing
- Executes after HTML parsing completes
- Maintains order
- Use for scripts that need DOM

**Visual**:
```
Normal: HTML parsing → STOP → Download & Execute → Continue parsing
Async:  HTML parsing → Download in parallel → STOP when ready → Execute
Defer:  HTML parsing → Download in parallel → Parse complete → Execute
```

**Best practice**: Use `defer` for most scripts, `async` for third-party analytics."

---

### Q: "What is the purpose of DOCTYPE?"

**Answer**: "DOCTYPE tells the browser which HTML version to use and triggers rendering mode.

```html
<!DOCTYPE html>  <!-- HTML5 -->
```

**Without DOCTYPE**: Browser enters 'quirks mode' - emulates old bugs for backwards compatibility. Inconsistent rendering.

**With DOCTYPE**: Browser enters 'standards mode' - follows modern specifications.

**Why HTML5 doctype is simple**: Previous doctypes were complex:
```html
<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01//EN\" \"http://www.w3.org/TR/html4/strict.dtd\">
```

HTML5 simplified to `<!DOCTYPE html>`.

**Always include**: First line of every HTML document."

---

### Q: "Explain `name` vs `id` attributes"

**Answer**: "Both identify elements but serve different purposes:

**`id`**:
- Must be unique on page
- Used for CSS/JS selection
- Creates URL fragment (`#section`)
- Used by `<label for='id'>`

**`name`**:
- Can be duplicated (radio buttons, checkboxes)
- Used for form submission (sent to server)
- Groups related inputs

**Example**:
```html
<form>
  <!-- id for label association -->
  <label for="username">Username:</label>
  <input id="username" name="user" type="text">

  <!-- name groups radio buttons -->
  <input type="radio" name="plan" value="basic" id="basic">
  <input type="radio" name="plan" value="pro" id="pro">
</form>
```

When form submits: `user=john&plan=basic`

**Rule**: Use `id` for CSS/JS, `name` for form data."

---

### Q: "What are void/self-closing elements?"

**Answer**: "Elements that don't have closing tags or content. Cannot contain child elements.

**Common void elements**:
- `<img>` - Images
- `<br>` - Line break
- `<hr>` - Horizontal rule
- `<input>` - Form inputs
- `<meta>` - Metadata
- `<link>` - External resources

**In HTML5**: Self-closing slash is optional:
```html
<!-- Both valid -->
<img src="photo.jpg" alt="Photo">
<img src="photo.jpg" alt="Photo" />
```

**In XHTML/JSX**: Slash is required:
```jsx
<img src="photo.jpg" alt="Photo" />
```

These elements are 'void' because they can't contain content - `<img>` displays image, doesn't wrap text."

---

### Q: "How do you make a website accessible?"

**Answer**: "Accessibility checklist:

**1. Semantic HTML**:
- Use proper elements (`<button>`, `<nav>`, `<header>`)
- Maintain heading hierarchy (h1 → h2 → h3)

**2. Images**:
- Descriptive alt text
- Empty alt for decorative images

**3. Forms**:
- Label all inputs (`<label for='id'>`)
- Provide error messages
- Use fieldsets for groups

**4. Keyboard Navigation**:
- All interactive elements focusable
- Logical tab order
- Visual focus indicators

**5. ARIA when needed**:
- `aria-label` for icon buttons
- `aria-live` for dynamic content
- Roles for custom widgets

**6. Color Contrast**:
- WCAG AA: 4.5:1 for text
- Don't rely on color alone

**7. Responsive**:
- Works on all devices
- Zoomable text

**Tools**: Screen readers (NVDA, VoiceOver), Lighthouse, axe DevTools.

**Remember**: 15% of people have disabilities - accessibility is required by law (ADA, WCAG)."

---

### Q: "Explain localStorage vs sessionStorage vs cookies"

**Answer**:

| Feature | Cookie | localStorage | sessionStorage |
|---------|--------|--------------|----------------|
| **Capacity** | ~4KB | ~5-10MB | ~5-10MB |
| **Sent with requests** | Yes (every request) | No | No |
| **Expiration** | Set manually | Never | Tab close |
| **Accessibility** | Server & Client | Client only | Client only |
| **Use case** | Auth tokens | Preferences | Temp data |

**localStorage**: Persists forever until cleared:
```javascript
localStorage.setItem('theme', 'dark');
localStorage.getItem('theme');  // "dark"
```

**sessionStorage**: Cleared when tab closes:
```javascript
sessionStorage.setItem('step', '2');
```

**Cookies**: Sent with every HTTP request:
```javascript
document.cookie = "user=john; max-age=3600";
```

**When to use**:
- **Cookies**: Authentication, needs server access
- **localStorage**: User preferences, cached data
- **sessionStorage**: Multi-step forms, temporary UI state"

---

## Best Practices

1. **Always use semantic HTML** - `<nav>` not `<div class='nav'>`
2. **One `<h1>` per page** - Maintain heading hierarchy
3. **Alt text for all images** - Accessibility requirement
4. **Label all form inputs** - Use `<label for='id'>`
5. **Use semantic input types** - `type="email"` not `type="text"`
6. **Include DOCTYPE and meta viewport** - Standards mode + mobile support
7. **Use `<button>` for buttons** - Not `<div>` with click handler
8. **Validate both client and server** - HTML5 validation + backend
9. **Keep HTML structure clean** - Proper nesting, indentation
10. **Test with keyboard and screen reader** - Ensure accessibility

---

## Quick Reference

**Accessibility**:
- `alt=""` for images
- `<label for="id">` for inputs
- `aria-label` for icon buttons
- `tabindex="0"` for custom interactive elements

**SEO**:
- Semantic structure
- Meta description
- Proper heading hierarchy
- Alt text on images

**Performance**:
- `loading="lazy"` on images
- `defer` on scripts
- Responsive images with `srcset`

**Security**:
- `rel="noopener noreferrer"` on external links
- Validate all user input
