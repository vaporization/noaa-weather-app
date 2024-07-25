import React, { useEffect, useState } from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { auth } from './firebase'; // Make sure you have the correct path to your firebase config
import './styles.css';

const NavigationMenuDemo = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log('User signed out');
      window.location.href = '/noaa-weather-app/';
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  };

  return (
    <NavigationMenu.Root className="NavigationMenuRoot">
      <NavigationMenu.List className="NavigationMenuList">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="NavigationMenuTrigger">
            Menu <CaretDownIcon className="CaretDown" aria-hidden />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="NavigationMenuContent">
            <ul className="List">
              <li>
                <NavigationMenu.Link asChild>
                  <a className="NavigationMenuLink" href="/noaa-weather-app/">Home</a>
                </NavigationMenu.Link>
              </li>
              {!isLoggedIn && (
                <>
                  <li>
                    <NavigationMenu.Link asChild>
                      <a className="NavigationMenuLink" href="/noaa-weather-app/login">Login</a>
                    </NavigationMenu.Link>
                  </li>
                  <li>
                    <NavigationMenu.Link asChild>
                      <a className="NavigationMenuLink" href="/noaa-weather-app/register">Register</a>
                    </NavigationMenu.Link>
                  </li>
                </>
              )}
              {isLoggedIn && (
                <>
                  <li>
                    <NavigationMenu.Link asChild>
                      <a className="NavigationMenuLink" href="/noaa-weather-app/profile">Profile</a>
                    </NavigationMenu.Link>
                  </li>
                  <li>
                    <NavigationMenu.Link asChild>
                      <a className="NavigationMenuLink" onClick={handleLogout}>Logout</a>
                    </NavigationMenu.Link>
                  </li>
                </>
              )}
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <div className="ViewportPosition">
        <NavigationMenu.Viewport className="NavigationMenuViewport" />
      </div>
    </NavigationMenu.Root>
  );
};

export default NavigationMenuDemo;
