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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  // TODO: Implement handleChange

  // TODO: Implement validation logic

  // TODO: Implement handleSubmit

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>Challenge 4: Form Validation</h2>
      <form>
        {/* TODO: Add form inputs with error display */}
        {/* TODO: Add submit button */}
      </form>
    </div>
  );
};

export default Challenge4;
