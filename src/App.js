import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import LiveDataPage from './LiveDataPage';
import Login from './Login';
import Register from './Register';
import RegistrationConfirmation from './RegistrationConfirmation';
import LoginConfirmation from './LoginConfirmation';
import EmailAlreadyUsed from './EmailAlreadyUsed';
import Profile from './Profile';
import PasswordReset from './PasswordReset';
import StatusIcon from './StatusIcon';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import Wave from 'react-wavify';
import NavigationMenuDemo from './NavigationMenuDemo';
import './App.css';

const Layout = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User signed out');
        window.location.href = '/noaa-weather-app/#/login';
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      document.body.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, #003057, #001F3D)`;
    };

    const handleScroll = () => {
      const yScroll = window.scrollY / document.body.scrollHeight;
      document.body.style.backgroundPosition = `50% ${yScroll * 200}%`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <StatusIcon isLoggedIn={isLoggedIn} />
      <NavigationMenuDemo />
      <TransitionGroup>
        <CSSTransition key={location.key} classNames="fade" timeout={300}>
          <Routes location={location}>
            <Route path="/" element={<LiveDataPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/registration-confirmation" element={<RegistrationConfirmation />} />
            <Route path="/login-confirmation" element={<LoginConfirmation />} />
            <Route path="/email-already-used" element={<EmailAlreadyUsed />} />
            <Route path="/profile" element={isLoggedIn ? <Profile /> : <Login />} />
            <Route path="/password-reset" element={<PasswordReset />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <div className="wave-container">
        <Wave
          fill="rgba(18, 119, 176, 0.45)"
          paused={false}
          options={{
            height: 20,
            amplitude: 20,
            speed: 0.15,
            points: 3
          }}
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, transform: 'rotate(180deg)' }}
        />
        <Wave
          fill="rgba(10, 90, 150, 0.45)"
          paused={false}
          options={{
            height: 30,
            amplitude: 30,
            speed: 0.2,
            points: 5
          }}
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, transform: 'rotate(180deg)' }}
        />
        <Wave
          fill="rgba(5, 60, 120, 0.45)"
          paused={false}
          options={{
            height: 40,
            amplitude: 40,
            speed: 0.25,
            points: 4
          }}
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, transform: 'rotate(180deg)' }}
        />
      </div>
      <div className="page-container">
        <Layout />
      </div>
    </Router>
  );
};

export default App;
