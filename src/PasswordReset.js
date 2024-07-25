import React, { useState } from 'react';
import { auth } from './firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import './PasswordReset.css';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setError(`Error: ${error.message}`);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <h2>Reset Password</h2>
        <form onSubmit={handlePasswordReset}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default PasswordReset;
