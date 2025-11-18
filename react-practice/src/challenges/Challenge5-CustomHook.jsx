import { useState, useEffect } from 'react';

/**
 * CHALLENGE 5: Custom Hook - useFetch
 *
 * Requirements:
 * 1. Create a custom hook called useFetch that:
 *    - Takes a URL as parameter
 *    - Returns { data, loading, error }
 *    - Handles cleanup on unmount
 * 2. Use the hook to fetch and display data from:
 *    https://jsonplaceholder.typicode.com/todos?_limit=5
 * 3. Show loading and error states
 *
 * Bonus:
 * - Add refetch function to the hook
 * - Add AbortController for cleanup
 * - Make the hook work with any API endpoint
 *
 * Time: 15-20 minutes
 */

// Custom Hook
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false };
  }, [url]);

  return { data, loading, error };
};

const Challenge5 = () => {
  const { data: todos, loading, error } = useFetch(
    'https://jsonplaceholder.typicode.com/todos?_limit=5'
  );

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Challenge 5: Custom Hook</h2>
      <ul>
        {todos?.map(todo => (
          <li key={todo.id}>
            {todo.title} - {todo.completed ? '✅' : '❌'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Challenge5;
