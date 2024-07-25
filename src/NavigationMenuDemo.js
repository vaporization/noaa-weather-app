import React, { useEffect, useState } from 'react';
import { auth } from './firebase'; // Make sure you have the correct path to your firebase config
import { CaretDownIcon } from '@radix-ui/react-icons';
import './styles.css';

const NavigationMenuDemo = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log('User signed out');
      window.location.href = '/noaa-weather-app/login';
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  };

  const toggleMenu = () => {
    console.log("Menu before toggle:", menuOpen);
    setMenuOpen(!menuOpen);
    console.log("Menu after toggle:", !menuOpen);
  };

  return (
    <div className="NavigationMenuRoot">
      <div className="NavigationMenuList">
        <div className="NavigationMenuItem">
          <button className="NavigationMenuTrigger" onClick={toggleMenu}>
            Menu <CaretDownIcon className="CaretDown" aria-hidden />
          </button>
          {menuOpen && (
            <div className="NavigationMenuContent open">
              <ul className="List">
                <li>
                  <a className="NavigationMenuLink" href="/noaa-weather-app">Home</a>
                </li>
                {!isLoggedIn && (
                  <>
                    <li>
                      <a className="NavigationMenuLink" href="/noaa-weather-app/login">Login</a>
                    </li>
                    <li>
                      <a className="NavigationMenuLink" href="/noaa-weather-app/register">Register</a>
                    </li>
                  </>
                )}
                {isLoggedIn && (
                  <>
                    <li>
                      <a className="NavigationMenuLink" href="/noaa-weather-app/profile">Profile</a>
                    </li>
                    <li>
                      <a className="NavigationMenuLink" onClick={handleLogout}>Logout</a>
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigationMenuDemo;
