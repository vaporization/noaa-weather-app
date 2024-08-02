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
import { auth, db } from './firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Wave from 'react-wavify';
import NavigationMenuDemo from './NavigationMenuDemo';
import './App.css';
import DataAlerts from './DataAlerts';

const Layout = ({ gradientColors, setGradientColors, waveColors, setWaveColors, menuColors, setMenuColors, dataColumnColors, setDataColumnColors, dataEntryColor, setDataEntryColor }) => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsLoggedIn(!!user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setGradientColors({
            start: data.gradientColors.start || '#003057',
            end: data.gradientColors.end || '#001F3D'
          });
          setWaveColors({
            wave1: data.waveColors.wave1 || 'rgba(18, 119, 176, 0.45)',
            wave2: data.waveColors.wave2 || 'rgba(10, 90, 150, 0.45)',
            wave3: data.waveColors.wave3 || 'rgba(5, 60, 120, 0.45)',
            wave1Alpha: data.waveColors.wave1Alpha || '0.45',
            wave2Alpha: data.waveColors.wave2Alpha || '0.45',
            wave3Alpha: data.waveColors.wave3Alpha || '0.45'
          });
          setMenuColors({
            backgroundColor: data.menuColors.backgroundColor || '#286090',
            textColor: data.menuColors.textColor || '#FFFFFF',
            buttonColor: data.menuColors.buttonColor || '#286090'
          });
          setDataColumnColors({
            textColor: data.dataColumnColors.textColor || '#FFFFFF',
            backgroundColor: data.dataColumnColors.backgroundColor || '#FFFFFF',
            alpha: data.dataColumnColors.alpha || '1'
          });
          setDataEntryColor(data.dataEntryColor || '#FFFFFF'); 
        }
      }
    });
    return () => unsubscribe();
  }, [setGradientColors, setWaveColors, setMenuColors, setDataColumnColors, setDataEntryColor]);

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
      document.body.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, ${gradientColors.start}, ${gradientColors.end})`;
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
  }, [gradientColors]);

  useEffect(() => {
    document.documentElement.style.setProperty('--menu-background-color', menuColors.backgroundColor);
    document.documentElement.style.setProperty('--menu-text-color', menuColors.textColor);
    document.documentElement.style.setProperty('--button-color', menuColors.buttonColor);
    document.documentElement.style.setProperty('--data-column-background-color', dataColumnColors.backgroundColor); 
    document.documentElement.style.setProperty('--data-column-alpha', dataColumnColors.alpha); 
    document.documentElement.style.setProperty('--data-entry-color', dataEntryColor); 
  }, [menuColors, dataColumnColors, dataEntryColor]);

  return (
    <>
      <StatusIcon isLoggedIn={isLoggedIn} />
      <NavigationMenuDemo menuColors={menuColors} />
      <TransitionGroup>
        <CSSTransition key={location.key} classNames="fade" timeout={300}>
          <Routes location={location}>
            <Route path="/" element={<LiveDataPage dataColumnColors={dataColumnColors} dataEntryColor={dataEntryColor} />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/registration-confirmation" element={<RegistrationConfirmation />} />
            <Route path="/login-confirmation" element={<LoginConfirmation />} />
            <Route path="/email-already-used" element={<EmailAlreadyUsed />} />
            <Route path="/profile" element={isLoggedIn ? <Profile setGradientColors={setGradientColors} setWaveColors={setWaveColors} setMenuColors={setMenuColors} setDataColumnColors={setDataColumnColors} setDataEntryColor={setDataEntryColor} /> : <Login />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/alerts" element={isLoggedIn ? <DataAlerts /> : <Login />} />  {/* New Route */}
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </>
  );
};

const App = () => {
  const [gradientColors, setGradientColors] = useState({
    start: '#003057',
    end: '#001F3D',
  });

  const [waveColors, setWaveColors] = useState({
    wave1: 'rgba(18, 119, 176, 0.45)',
    wave2: 'rgba(10, 90, 150, 0.45)',
    wave3: 'rgba(5, 60, 120, 0.45)',
    wave1Alpha: '0.45',
    wave2Alpha: '0.45',
    wave3Alpha: '0.45'
  });

  const [menuColors, setMenuColors] = useState({
    backgroundColor: '#286090',
    textColor: '#FFFFFF',
    buttonColor: '#286090'
  });

  const [dataColumnColors, setDataColumnColors] = useState({
    textColor: '#000000',
    backgroundColor: '#FFFFFF',
    alpha: '1'
  });

  const [dataEntryColor, setDataEntryColor] = useState('#FFFFFF');

  return (
    <Router>
      <div className="wave-container">
        <Wave
          fill={waveColors.wave1}
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
          fill={waveColors.wave2}
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
          fill={waveColors.wave3}
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
        <Layout gradientColors={gradientColors} setGradientColors={setGradientColors} waveColors={waveColors} setWaveColors={setWaveColors} menuColors={menuColors} setMenuColors={setMenuColors} dataColumnColors={dataColumnColors} setDataColumnColors={setDataColumnColors} dataEntryColor={dataEntryColor} setDataEntryColor={setDataEntryColor} />
      </div>
    </Router>
  );
};

export default App;
