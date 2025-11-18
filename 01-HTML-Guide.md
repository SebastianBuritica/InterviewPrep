# HTML Interview Guide - Questions & Answers

HTML interview preparation with concise paragraph-style answers and code examples.

---

## 1. What is semantic HTML and why is it important?

Semantic HTML uses elements that describe their meaning and purpose, not just appearance. It improves accessibility by helping screen readers understand structure, enhances SEO as search engines better understand content hierarchy, and increases maintainability with self-documenting code. Use semantic elements like nav, article, header instead of generic divs.

```html
<!-- Semantic -->
<nav><a href="/">Home</a></nav>
<article>Content</article>

<!-- Non-semantic -->
<div class="nav"><div class="link">Home</div></div>
<div class="content">Content</div>
```

---

## 2. What are the main semantic HTML elements?

Document structure: header for page/section headers, nav for navigation, main for primary content (one per page), article for self-contained content, section for thematic grouping, aside for related content, and footer for page/section footers. Text semantics include h1-h6 for headings, strong for important text, em for emphasis, mark for highlights, time for dates, and code for code snippets.

---

## 3. Why is accessibility important and how do you implement it?

Accessibility makes web content usable by people with disabilities and is legally required in many jurisdictions. Use semantic HTML, provide alt text for images, label all form inputs with proper association, ensure keyboard navigation works, maintain heading hierarchy, and add ARIA attributes when semantic HTML isn't enough. About 15% of people have disabilities that affect web use.

```html
<label for="email">Email:</label>
<input id="email" type="email" required>
<img src="cat.jpg" alt="Orange cat sleeping">
```

---

## 4. How do you make images accessible?

Provide descriptive alt text under 150 characters that describes the image content. For decorative images, use empty alt attribute (alt=""). Never omit the alt attribute entirely. Don't say "image of" as screen readers already announce it's an image. Alt text is read aloud by screen readers for visually impaired users.

```html
<img src="cat.jpg" alt="Orange tabby cat sleeping on blue couch">
<img src="decorative.png" alt="">
```

---

## 5. Explain proper form accessibility.

Associate labels with inputs using for and id attributes so clicking labels focuses inputs. Use fieldset and legend for grouping related inputs like radio buttons. Add aria-describedby for help text. Mark required fields with the required attribute. Proper labels make forms keyboard-accessible and screen reader-friendly.

```html
<label for="username">Username:</label>
<input id="username" type="text" aria-describedby="help" required>
<small id="help">Must be 3-20 characters</small>
```

---

## 6. What are ARIA attributes and when should you use them?

ARIA (Accessible Rich Internet Applications) enhances accessibility when semantic HTML isn't sufficient. Common attributes: aria-label provides accessible names, aria-describedby adds descriptions, aria-live announces dynamic updates, aria-hidden hides decorative elements. Always prefer semantic HTML over ARIA. Only use ARIA when semantic elements can't achieve the same result.

```html
<button aria-label="Close dialog">×</button>
<div aria-live="polite">Form submitted!</div>
```

---

## 7. Why is heading hierarchy important?

Headings create document outline for screen reader navigation. Use one h1 per page for the page title. Don't skip levels - go h1 to h2 to h3, not h1 to h4. Choose headings by semantic importance, not visual size. Use CSS for styling. Screen readers use headings as navigation landmarks to jump between sections.

```html
<h1>Page Title</h1>
  <h2>Section 1</h2>
    <h3>Subsection 1.1</h3>
  <h2>Section 2</h2>
```

---

## 8. How do you ensure keyboard navigation?

All interactive elements must be keyboard-accessible using Tab, Enter, Space, and arrow keys. Use semantic elements like button and a which are naturally keyboard-accessible. If using divs for interactions, add tabindex="0" and handle keyboard events. Never use tabindex values above 0 as they override natural tab order.

```html
<button>Click me</button> <!-- Naturally accessible -->
<div role="button" tabindex="0">Custom button</div>
```

---

## 9. What's the difference between div and span?

div is block-level, taking full width and starting on a new line. It can contain block and inline elements and is used for layout sections. span is inline, taking only necessary width and staying in text flow. It can only contain inline elements and is used for styling parts of text. Use semantic elements when possible instead of generic containers.

```html
<div>Takes full width</div>
<span>Stays</span> <span>inline</span>
```

---

## 10. What are the HTML5 input types?

HTML5 provides semantic input types with built-in validation and appropriate mobile keyboards: email for email validation, number for numeric input with min/max, tel for phone numbers, url for URLs, date/time for date pickers, color for color pickers, search for search fields, and file with accept and multiple attributes. These provide better UX than generic text inputs.

```html
<input type="email" required>
<input type="number" min="0" max="100">
<input type="date">
```

---

## 11. Explain HTML5 form validation attributes.

HTML5 provides client-side validation: required for mandatory fields, pattern for regex validation, min/max for numeric/date ranges, minlength/maxlength for string length, and title for pattern tooltips. Always validate server-side too as client-side validation can be bypassed. These attributes provide immediate user feedback.

```html
<input type="text" pattern="[A-Za-z]{3,}" title="Min 3 letters" required>
<input type="number" min="1" max="10">
```

---

## 12. What is the purpose of DOCTYPE?

DOCTYPE tells browsers which HTML version to use and triggers rendering mode. Without DOCTYPE, browsers enter quirks mode which emulates old bugs for backwards compatibility. With DOCTYPE, browsers use standards mode following modern specifications. HTML5 simplified this to just <!DOCTYPE html> as the first line of every document.

```html
<!DOCTYPE html>
```

---

## 13. What are data attributes?

Data attributes store custom data on elements, prefixed with data-. Access them via element.dataset in JavaScript, which converts kebab-case to camelCase. Use for storing metadata without affecting styling, passing data to JavaScript, testing selectors, or progressive enhancement. Common for storing IDs, states, or configuration.

```html
<div data-user-id="123" data-role="admin">Info</div>
<script>
  element.dataset.userId; // "123"
  element.dataset.role; // "admin"
</script>
```

---

## 14. Explain script, script async, and script defer.

Normal script blocks HTML parsing to download and execute immediately. async downloads in parallel but executes as soon as ready, potentially blocking parsing, with no order guarantee - use for independent scripts like analytics. defer downloads in parallel and executes after HTML parsing completes, maintaining order - use for scripts needing DOM access.

```html
<script src="app.js" defer></script>
<script src="analytics.js" async></script>
```

---

## 15. What's the difference between name and id attributes?

id must be unique on the page and is used for CSS/JS selection, URL fragments, and label associations. name can be duplicated for grouping inputs like radio buttons and is used for form submission to send data to servers. Use id for styling and scripting, name for form data.

```html
<label for="username">Username:</label>
<input id="username" name="user" type="text">

<input type="radio" name="plan" value="basic" id="basic">
<input type="radio" name="plan" value="pro" id="pro">
```

---

## 16. What are void elements?

Void elements don't have closing tags or content and cannot contain child elements. Common ones: img for images, br for line breaks, hr for horizontal rules, input for form inputs, meta for metadata, and link for external resources. In HTML5, the self-closing slash is optional but required in JSX/XHTML.

```html
<img src="photo.jpg" alt="Photo">
<input type="text">
<br>
```

---

## 17. How do you implement responsive images?

Use srcset with different image sizes for various screen widths. Use picture element for different formats or layouts based on media queries. Add loading="lazy" for lazy loading images below the fold. This reduces bandwidth and improves performance, especially on mobile devices.

```html
<img src="small.jpg"
     srcset="medium.jpg 768w, large.jpg 1200w"
     sizes="(max-width: 768px) 100vw, 50vw"
     alt="Description"
     loading="lazy">
```

---

## 18. Explain localStorage vs sessionStorage vs cookies.

Cookies are ~4KB, sent with every HTTP request, have manual expiration, accessible to server and client - use for authentication. localStorage is ~5-10MB, client-only, never expires until cleared - use for preferences and cached data. sessionStorage is ~5-10MB, client-only, cleared when tab closes - use for temporary UI state or multi-step forms.

```javascript
localStorage.setItem('theme', 'dark'); // Persists forever
sessionStorage.setItem('step', '2'); // Clears on tab close
document.cookie = "user=john; max-age=3600"; // Sent to server
```

---

## 19. What is the viewport meta tag?

The viewport meta tag controls page dimensions and scaling on mobile devices, ensuring responsive design. Without it, mobile browsers render pages at desktop width and zoom out. width=device-width sets width to device screen width, initial-scale=1.0 prevents default zoom. Essential for mobile-friendly websites.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## 20. How do you improve SEO with HTML?

Use semantic structure with proper elements, add meta description for search result snippets, maintain heading hierarchy with one h1, provide alt text for images, use descriptive title tags, implement schema markup, ensure mobile responsiveness, improve page speed, and create clean URL structures. Semantic HTML helps search engines understand content.

```html
<meta name="description" content="Page description for search results">
<title>Descriptive Page Title</title>
```

---

## Summary

Key HTML concepts: semantic elements (nav, article, header) over divs for accessibility and SEO, proper accessibility with alt text, labeled inputs, heading hierarchy, and keyboard navigation, ARIA attributes only when semantic HTML insufficient, HTML5 input types for validation and better UX, DOCTYPE for standards mode, data attributes for custom data, script async/defer for performance, id for CSS/JS and name for form data, responsive images with srcset and lazy loading, localStorage for persistence vs sessionStorage for temporary state, viewport meta tag for mobile, and SEO through semantic structure and meta tags. Always validate accessibility with screen readers and keyboard testing.
