import React, { useEffect, useState } from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { auth } from './firebase';
import './styles.css';
import './NavigationMenuDemo.css';

const NavigationMenuDemo = ({ menuColors }) => {
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
      window.location.href = '/noaa-weather-app/#/login';
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  };

  return (
    <NavigationMenu.Root className="NavigationMenuRoot">
      <NavigationMenu.List className="NavigationMenuList" style={{ backgroundColor: menuColors.backgroundColor }}>
        <div className="NavigationMenuCenter">
          <NavigationMenu.Item className="NavigationMenuItem" style={{ backgroundColor: menuColors.buttonColor }}>
            <NavigationMenu.Link asChild>
              <a className="NavigationMenuLink" href="#/">Home</a>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          {!isLoggedIn && (
            <>
              <NavigationMenu.Item className="NavigationMenuItem" style={{ backgroundColor: menuColors.buttonColor }}>
                <NavigationMenu.Link asChild>
                  <a className="NavigationMenuLink" href="#/login">Login</a>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item className="NavigationMenuItem" style={{ backgroundColor: menuColors.buttonColor }}>
                <NavigationMenu.Link asChild>
                  <a className="NavigationMenuLink" href="#/register">Register</a>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </>
          )}
          {isLoggedIn && (
            <>
              <NavigationMenu.Item className="NavigationMenuItem" style={{ backgroundColor: menuColors.buttonColor }}>
                <NavigationMenu.Link asChild>
                  <a className="NavigationMenuLink" href="#/profile">Profile</a>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item className="NavigationMenuItem" style={{ backgroundColor: menuColors.buttonColor }}>
                <NavigationMenu.Link asChild>
                  <a className="NavigationMenuLink" href="#/alerts">Data Alerts</a>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item className="NavigationMenuItem" style={{ backgroundColor: menuColors.buttonColor }}>
                <NavigationMenu.Link asChild>
                  <button className="NavigationMenuLink" onClick={handleLogout}>Logout</button>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </>
          )}
        </div>
      </NavigationMenu.List>
      <div className="ViewportPosition">
        <NavigationMenu.Viewport className="NavigationMenuViewport" />
      </div>
    </NavigationMenu.Root>
  );
};

export default NavigationMenuDemo;
