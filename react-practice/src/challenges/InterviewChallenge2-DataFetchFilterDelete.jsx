import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * INTERVIEW CHALLENGE 2: Fetch, Filter, Delete Data
 *
 * Handles: API requests, state management, filtering, deletion
 */

const InterviewChallenge2 = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
    } catch (err) {
      setError(err.message || 'Error with the request');
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete user
  const handleDelete = async (id) => {
    try {
      // Optimistic update
      setUsers(users.filter(user => user.id !== id));

      // API call (in real app, this would actually delete)
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      console.log(`Deleted user ${id}`);
    } catch (err) {
      setError(err.message || 'Error with the request');
      // Revert on error
      fetchUsers();
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <h2>Users List - Fetch, Filter, Delete</h2>

      {/* Search/Filter */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        />
      </div>

      {/* Results count */}
      <div style={{ marginBottom: '10px', color: '#666' }}>
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {/* Users list */}
      {filteredUsers.length === 0 ? (
        <div>No users found</div>
      ) : (
        <div>
          {filteredUsers.map(user => (
            <div
              key={user.id}
              style={{
                padding: '15px',
                border: '1px solid #ddd',
                marginBottom: '10px',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>{user.email}</div>
                <div style={{ color: '#999', fontSize: '12px' }}>{user.phone}</div>
              </div>
              <button
                onClick={() => handleDelete(user.id)}
                style={{
                  padding: '8px 16px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewChallenge2;
