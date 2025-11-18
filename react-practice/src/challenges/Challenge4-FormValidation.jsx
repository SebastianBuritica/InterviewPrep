import { useState } from 'react';

/**
 * CHALLENGE 4: Form with Validation
 *
 * Requirements:
 * 1. Create a registration form with: name, email, password
 * 2. Validate on submit:
 *    - Name: required, min 2 characters
 *    - Email: required, valid email format
 *    - Password: required, min 8 characters
 * 3. Display error messages for each field
 * 4. Prevent submission if validation fails
 * 5. Clear form on successful submit
 *
 * Bonus:
 * - Add real-time validation (on blur or on change)
 * - Add password confirmation field
 * - Show success message after submit
 *
 * Time: 20-25 minutes
 */

const Challenge4 = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  // TODO: Implement handleChange
  const handleEmailChange = (e) => {
    setForm({...form, email: e.target.value})
  }

  const handlePasswordChange = (e) => {
    setForm({...form, password: e.target.value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Validate email
    if (!form.email.trim()) {
      setError('Email is required')
      return
    }
    if (!form.email.includes('@')) {
      setError('Invalid email')
      return
    }

    // Validate password
    if (!form.password) {
      setError('Password is required')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    // Success
    console.log('Form submitted:', form)
    setForm({ email: '', password: '' }) // Reset form
  }



  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>Challenge 4: Form Validation</h2>
      <form onSubmit={handleSubmit}>
        {error && (
          <div>{error}</div>
        )}

        <div>
          <input
          type='email'
          value={form.email}
          onChange={handleEmailChange}
          placeholder='Email'
          />
        </div>

        <div>
          <input
          type='password'
          value={form.password}
          onChange={handlePasswordChange}
          placeholder='Password'
          />
        </div>

        <button type='submit'>Submit</button>
      </form>

    </div>
  );
};

export default Challenge4;
