import { useState } from 'react';

/**
 * CHALLENGE 3: Todo List (CRUD)
 *
 * Requirements:
 * 1. Add new todos with an input and button
 * 2. Display list of todos
 * 3. Toggle todo completion (checkbox)
 * 4. Delete individual todos
 * 5. Use proper keys for list items
 *
 * Bonus:
 * - Add "Clear completed" button
 * - Show count of active/completed todos
 * - Prevent adding empty todos
 * - Add edit functionality (double-click to edit)
 *
 * Time: 20-25 minutes
 */

const Challenge3 = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: true },
  ]);

  // TODO: Add input state for new todo

  // TODO: Implement addTodo function

  // TODO: Implement toggleTodo function

  // TODO: Implement deleteTodo function

  return (
    <div style={{ padding: '20px' }}>
      <h2>Challenge 3: Todo List</h2>
      {/* TODO: Add input and button to add todos */}
      {/* TODO: Display todo list */}
    </div>
  );
};

export default Challenge3;
