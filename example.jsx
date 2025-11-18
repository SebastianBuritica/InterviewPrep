import { useState, useEffect, useMemo } from 'react';

/**
 * CHALLENGE 2: Search and Filter
 *
 * Requirements:
 * 1. Fetch posts from: https://jsonplaceholder.typicode.com/posts
 * 2. Add a search input to filter posts by title
 * 3. Use useMemo to optimize filtering
 * 4. Display filtered results
 * 5. Show "No results found" when filter returns nothing
 *
 * Bonus:
 * - Add debouncing to search (wait 300ms after typing stops)
 * - Add a clear button to reset search
 * - Show count of filtered results
 *
 * Time: 15-20 minutes
 */

const Challenge2 = () => {
  // TODO: Add your state here
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  // TODO: Fetch posts
  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('https://jsonplaceholder.typicode.com/posts')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        if  (isMounted) setPosts(data) 
      } catch (err) {
        if (isMounted) setError(err.message)
      } finally {
         if  (isMounted) setIsLoading(false) 
      }
    }

    fetchData()
  }, [])

  const filteredPosts = useMemo(() => 
    posts.filter(post => post.title.toLowerCase().includes(search.toLowerCase())),
  [posts, search]
  )

  if (isLoading) return <div style={{padding: '15px', margin: '10px 0', justifyContent: 'center'}}>Is loading...</div>
  if (error) return (<div style={{padding: '15px', margin: '10px 0', justifyContent: 'center'}}>
    Error encountered: {error}
    </div>)
  
  // TODO: Implement filtered posts with useMemo
  

  return (
    <div style={{ padding: '20px' }}>
      <h2>Challenge 2: Search & Filter</h2>
      {/* TODO: Add search input */}
      <div style={{display: 'flex',alignItems: 'center', gap: '10px' }}>
      <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder='Enter value here'
      style={{padding: '10px'}}
      />
      <button onClick={() => setSearch('')} style={{ padding: '10px 20px' }}>
    Clear
  </button>
      </div>
      {/* TODO: Display filtered posts */}
      <p>Posts count: {filteredPosts.length}</p>
      {/* 5. Show "No results found" when filter returns nothing */}
      {filteredPosts.length === 0 ? (
        <p>No results found</p>
      ) : (
        <ul style={{listStyle: 'none', padding: '0'}}>
          {filteredPosts.map(post => (
            <li key={post.id} style={{padding: '10px', margin: '10px 0', border: '1px solid black', borderRadius: '5px'}}>
              <strong>{post.title}</strong>
            </li>
          ))}
        </ul>
      )
    }
    </div>
  );
};

export default Challenge2;
