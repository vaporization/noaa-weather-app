import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in successfully');
      navigate('/login-confirmation');
    } catch (err) {
      console.log('Error during login:', err.message);
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');

    try {
      await signInWithPopup(auth, googleProvider);
      console.log('User logged in with Google successfully');
      navigate('/login-confirmation');
    } catch (err) {
      console.log('Error during Google login:', err.message);
      setError(err.message);
    }
  };

  const handlePasswordReset = () => {
    navigate('/password-reset');
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Login</button>
        </form>
        <button onClick={handleGoogleLogin}>Login with Google</button>
        <button className="forgot-password" onClick={handlePasswordReset}>Forgot Password?</button>
      </div>
    </div>
  );
};

export default Login;
