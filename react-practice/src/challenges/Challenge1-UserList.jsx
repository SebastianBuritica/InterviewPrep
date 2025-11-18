import { useState, useEffect } from 'react';

/**
 * CHALLENGE 1: User List with Fetch
 *
 * Requirements:
 * 1. Fetch users from: https://jsonplaceholder.typicode.com/users
 * 2. Display loading state while fetching
 * 3. Display error state if fetch fails
 * 4. Show list of users with name and email
 * 5. Handle component unmount (cleanup)
 *
 * Bonus:
 * - Add a refresh button to refetch data
 * - Display user's company name as well
 *
 * Time: 10-15 minutes
 */

const Challenge1 = () => {
  // TODO: Add your state here
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // TODO: Add your useEffect here
  useEffect(() => {
    let isMounted = true

    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!response.ok) throw new Error(console.error('Error with request'))
          const data = await response.json()
        if (isMounted) setUsers(data)
      } catch(err) {
        if (isMounted) setError(err.message)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (isLoading) return <div style={{padding: '15px', margin: '10px 0'}}>Is loading...</div>
  if (error) return <div style={{padding: '15px', margin: '10px 0'}}>Error encountered: {error}</div>

  return (
    <div style={{ padding: '20px' }}>
      <h2>Challenge 1: User List</h2>
      
      {/* TODO: Implement user list */}
      {users.map(user => 
        <div key={user.id}>{user.name}</div>
      )}
    </div>
  );
};

export default Challenge1;
