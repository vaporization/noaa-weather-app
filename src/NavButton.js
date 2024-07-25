import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavButton = ({ to, children }) => {
  const navigate = useNavigate();

  const handleClick = (event) => {
    event.preventDefault();
    navigate(to);
  };

  return (
    <button onClick={handleClick}>
      {children}
    </button>
  );
};

export default NavButton;
