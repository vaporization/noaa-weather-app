import React from 'react';
import './LoginConfirmation.css';

const LoginConfirmation = () => {
  return (
    <div className="confirmation-container">
      <div className="confirmation-message">
        <h2>Login Successful</h2>
        <p>You have successfully logged in.</p>
      </div>
    </div>
  );
};

export default LoginConfirmation;
