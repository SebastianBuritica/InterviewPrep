# React Interview Practice Challenges

This project contains 5 common React interview challenges to help you prepare for your 30-minute coding interview.

## Getting Started

```bash
# Install dependencies (already done)
npm install

# Start the development server
npm run dev
```

Open your browser to `http://localhost:5173`

## Challenges

### Challenge 1: User List with Fetch (10-15 min)
**Skills tested:**
- `useState`, `useEffect`
- API fetching
- Loading and error states
- Cleanup on unmount

**API:** `https://jsonplaceholder.typicode.com/users`

**File:** `src/challenges/Challenge1-UserList.jsx`

---

### Challenge 2: Search & Filter (15-20 min)
**Skills tested:**
- `useMemo` for optimization
- Filtering arrays
- Controlled inputs
- Performance optimization

**API:** `https://jsonplaceholder.typicode.com/posts`

**File:** `src/challenges/Challenge2-SearchFilter.jsx`

---

### Challenge 3: Todo List (20-25 min)
**Skills tested:**
- CRUD operations
- Array manipulation with immutability
- Proper keys in lists
- Event handling

**File:** `src/challenges/Challenge3-TodoList.jsx`

---

### Challenge 4: Form Validation (20-25 min)
**Skills tested:**
- Form handling
- Validation logic
- Error state management
- Controlled components

**File:** `src/challenges/Challenge4-FormValidation.jsx`

---

### Challenge 5: Custom Hook (15-20 min)
**Skills tested:**
- Creating custom hooks
- Hook composition
- Reusable logic
- Cleanup

**API:** `https://jsonplaceholder.typicode.com/todos?_limit=5`

**File:** `src/challenges/Challenge5-CustomHook.jsx`

---

## Interview Tips

### Time Management
- Spend 2-3 minutes reading and understanding requirements
- Start with basic functionality first
- Add bonus features only if you have time
- Test your code as you go

### Best Practices to Show
1. ✅ Handle loading and error states
2. ✅ Use cleanup in useEffect
3. ✅ Use functional updates when state depends on previous state
4. ✅ Use proper keys in lists
5. ✅ Handle edge cases (empty arrays, null values, etc.)
6. ✅ Write clean, readable code
7. ✅ Add comments for complex logic

### Common Mistakes to Avoid
- ❌ Missing cleanup in useEffect
- ❌ Using array index as key in dynamic lists
- ❌ Not handling loading/error states
- ❌ Directly mutating state
- ❌ Missing error handling in try/catch
- ❌ Forgetting to prevent default on form submit

## Solution Approach

For each challenge:

1. **Read requirements carefully** (2 min)
2. **Plan your approach** (1-2 min)
   - What state do you need?
   - What effects?
   - What handlers?
3. **Implement basic functionality** (10-15 min)
   - Get it working first
   - Don't worry about edge cases yet
4. **Test and refine** (3-5 min)
   - Test happy path
   - Add error handling
   - Clean up code
5. **Add bonus features** (if time allows)

## Practice Schedule

**Week 1:**
- Day 1-2: Challenge 1 (repeat 3 times)
- Day 3-4: Challenge 2 (repeat 3 times)
- Day 5: Challenge 3

**Week 2:**
- Day 1-2: Challenge 3 (repeat 3 times)
- Day 3-4: Challenge 4 (repeat 3 times)
- Day 5: Challenge 5

**Week 3:**
- Mix all challenges randomly
- Time yourself strictly (30 min max)
- Practice explaining your code out loud

## Resources

- [React Docs](https://react.dev)
- [JSONPlaceholder API](https://jsonplaceholder.typicode.com)
- Your interview prep guide: `../05-React-Guide.md`

## Good Luck! 🚀

Remember:
- **Communication** is as important as code
- **Explain your thinking** as you code
- **Ask clarifying questions** if requirements are unclear
- **Stay calm** and work through problems systematically
