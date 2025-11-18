import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

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
  const [posts, setPosts] = useState([])
  const [isLoading, setIsloading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  // Fetch posts with Axios
  useEffect(() => {
    let isMounted = true

    const fetchPosts = async () => {
      try {
        setIsloading(true)
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts')
        if (isMounted) setPosts(response.data)
      } catch(err) {
       if (isMounted) setError(err.message)
      } finally {
        if (isMounted) setIsloading(false)
      }
    }

    fetchPosts()

  }, [])

  const filteredPosts = useMemo(() => 
  posts.filter(post => post.title.toLowerCase().includes(search.toLocaleLowerCase()))
  ,[posts, search])

  if (isLoading) return <div style={{padding: '15px', margin: '10px 0', justifyContent: 'center'}}>Is loading...</div>
  if (error) return (<div style={{padding: '15px', margin: '10px 0', justifyContent: 'center'}}>
    Error encountered: {error}
    </div>)
  // TODO: Implement filtered posts with useMemo

  return (
    <div style={{ padding: '20px' }}>
      <h2>Challenge 2: Search & Filter</h2>
      {/* TODO: Add search input */}
      <input
      value={search}
      onChange={(e) =>setSearch(e.target.value)}
      placeholder='Please enter value here'
      />
      {filteredPosts.map(post => 
        <div key={post.id}>{post.title}</div>
      )}
      {/* TODO: Display filtered posts */}
    </div>
  );
};

export default Challenge2;
