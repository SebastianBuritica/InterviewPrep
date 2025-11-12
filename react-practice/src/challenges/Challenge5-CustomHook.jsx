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

// TODO: Create useFetch custom hook here
const useFetch = (url) => {
  // TODO: Implement the custom hook
  // Return { data, loading, error }
};

const Challenge5 = () => {
  // TODO: Use the useFetch hook

  return (
    <div style={{ padding: '20px' }}>
      <h2>Challenge 5: Custom Hook</h2>
      {/* TODO: Display data using the custom hook */}
    </div>
  );
};

export default Challenge5;
