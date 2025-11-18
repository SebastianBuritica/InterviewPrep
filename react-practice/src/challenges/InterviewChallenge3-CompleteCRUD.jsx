import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * INTERVIEW CHALLENGE 3: Complete CRUD App
 *
 * Combines everything: Form, API requests, filtering, deletion, adding
 * This is a comprehensive challenge that covers most interview scenarios
 */

const InterviewChallenge3 = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ title: '', body: '' });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=10');
      setItems(response.data);
    } catch (err) {
      setError('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  // Validate form
  const validate = () => {
    const errors = {};
    if (!form.title.trim()) {
      errors.title = 'Title is required';
    } else if (form.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }
    if (!form.body.trim()) {
      errors.body = 'Body is required';
    } else if (form.body.length < 10) {
      errors.body = 'Body must be at least 10 characters';
    }
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', form);

      // Add new item to the list
      setItems([{ ...response.data, id: Date.now() }, ...items]);
      setForm({ title: '', body: '' });
      setFormErrors({});
    } catch (err) {
      setError('Failed to add item');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter items
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete item
  const handleDelete = async (id) => {
    try {
      setItems(items.filter(item => item.id !== id));
      await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
    } catch (err) {
      setError('Failed to delete item');
      fetchItems();
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Complete CRUD App</h2>

      {error && (
        <div style={{ padding: '10px', background: '#ffebee', color: 'red', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Add New Item Form */}
      <div style={{ background: '#f5f5f5', padding: '20px', marginBottom: '20px', borderRadius: '8px' }}>
        <h3>Add New Post</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', fontSize: '16px' }}
            />
            {formErrors.title && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                {formErrors.title}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <textarea
              name="body"
              placeholder="Body"
              value={form.body}
              onChange={handleChange}
              rows="4"
              style={{ width: '100%', padding: '10px', fontSize: '16px' }}
            />
            {formErrors.body && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                {formErrors.body}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '10px 20px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {submitting ? 'Adding...' : 'Add Post'}
          </button>
        </form>
      </div>

      {/* Search/Filter */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        />
      </div>

      {/* Results count */}
      <div style={{ marginBottom: '10px', color: '#666' }}>
        Showing {filteredItems.length} of {items.length} posts
      </div>

      {/* Items list */}
      {loading ? (
        <div>Loading...</div>
      ) : filteredItems.length === 0 ? (
        <div>No posts found</div>
      ) : (
        <div>
          {filteredItems.map(item => (
            <div
              key={item.id}
              style={{
                padding: '15px',
                border: '1px solid #ddd',
                marginBottom: '10px',
                borderRadius: '4px',
                background: 'white'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>{item.title}</h4>
                  <p style={{ margin: 0, color: '#666' }}>{item.body}</p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    padding: '8px 16px',
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginLeft: '10px'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewChallenge3;
