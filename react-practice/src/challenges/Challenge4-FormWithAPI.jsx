import { useState } from 'react';
import axios from 'axios';

/**
 * CHALLENGE 4: Form with API Submission (Axios)
 *
 * Same as Challenge 4 but submits to API using Axios
 */

const Challenge4WithAPI = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEmailChange = (e) => {
    setForm({ ...form, email: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setForm({ ...form, password: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate
    if (!form.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!form.email.includes('@')) {
      setError('Invalid email');
      return;
    }
    if (!form.password) {
      setError('Password is required');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Submit to API with Axios
    try {
      setLoading(true);
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', form);
      console.log('Success:', response.data);
      setSuccess(true);
      setForm({ email: '', password: '' }); // Reset form
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', padding: '20px' }}>
      <h2>Form with API</h2>

      {error && (
        <div style={{ padding: '10px', background: '#ffebee', color: 'red', marginBottom: '15px' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ padding: '10px', background: '#e8f5e9', color: 'green', marginBottom: '15px' }}>
          Form submitted successfully!
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <input
          type="email"
          value={form.email}
          onChange={handleEmailChange}
          placeholder="Email"
          style={{ width: '100%', padding: '8px' }}
          disabled={loading}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <input
          type="password"
          value={form.password}
          onChange={handlePasswordChange}
          placeholder="Password"
          style={{ width: '100%', padding: '8px' }}
          disabled={loading}
        />
      </div>

      <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default Challenge4WithAPI;
