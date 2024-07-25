import React from 'react';
import { auth } from './firebase';
import './StatusIcon.css';

const StatusIcon = ({ isLoggedIn }) => {
  return (
    <div className={`status-icon ${isLoggedIn ? 'logged-in' : 'logged-out'}`}>
      {isLoggedIn ? (
        <div onClick={() => auth.signOut()} />
      ) : (
        <div />
      )}
    </div>
  );
};

export default StatusIcon;
