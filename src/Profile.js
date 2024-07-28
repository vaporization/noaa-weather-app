import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { saveUserPreferences, getUserPreferences, resetUserPreferences, saveUserTheme, getUserThemes, deleteUserTheme } from './userPreferences';
import './Profile.css';

const Profile = ({ setGradientColors, setWaveColors, setMenuColors, setDataColumnColors, setDataEntryColor }) => {
  const [startColor, setStartColor] = useState('#003057');
  const [endColor, setEndColor] = useState('#001F3D');
  const [wave1Color, setWave1Color] = useState('rgba(18, 119, 176, 0.45)');
  const [wave2Color, setWave2Color] = useState('rgba(10, 90, 150, 0.45)');
  const [wave3Color, setWave3Color] = useState('rgba(5, 60, 120, 0.45)');
  const [wave1Alpha, setWave1Alpha] = useState(0.45);
  const [wave2Alpha, setWave2Alpha] = useState(0.45);
  const [wave3Alpha, setWave3Alpha] = useState(0.45);
  const [menuBackgroundColor, setMenuBackgroundColor] = useState('#286090');
  const [menuTextColor, setMenuTextColor] = useState('#000000');
  const [menuButtonColor, setMenuButtonColor] = useState('#286090');
  const [dataColumnTextColor, setDataColumnTextColor] = useState('#000000');
  const [dataColumnBackgroundColor, setDataColumnBackgroundColor] = useState('#FFFFFF');
  const [dataColumnAlpha, setDataColumnAlpha] = useState(1);
  const [dataEntryBackgroundColor, setDataEntryBackgroundColor] = useState('#FFFFFF');
  const [message, setMessage] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [themeName, setThemeName] = useState('');
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const data = await getUserPreferences(user.uid);
          const themesData = await getUserThemes(user.uid);
          setThemes(themesData || []);
          if (data) {
            const { gradientColors, waveColors, menuColors, dataColumnColors, dataEntryColor } = data;
            if (gradientColors) {
              setStartColor(gradientColors.start);
              setEndColor(gradientColors.end);
              setGradientColors(gradientColors);
            }
            if (waveColors) {
              setWave1Color(waveColors.wave1);
              setWave2Color(waveColors.wave2);
              setWave3Color(waveColors.wave3);
              setWave1Alpha(parseFloat(waveColors.wave1Alpha));
              setWave2Alpha(parseFloat(waveColors.wave2Alpha));
              setWave3Alpha(parseFloat(waveColors.wave3Alpha));
              setWaveColors(waveColors);
            }
            if (menuColors) {
              setMenuBackgroundColor(menuColors.backgroundColor || '#286090');
              setMenuTextColor(menuColors.textColor || '#000000');
              setMenuButtonColor(menuColors.buttonColor || '#286090');
              setMenuColors(menuColors);
            } else {
              setMenuColors({
                backgroundColor: '#286090',
                textColor: '#000000',
                buttonColor: '#286090'
              });
            }
            if (dataColumnColors) {
              setDataColumnTextColor(dataColumnColors.textColor);
              setDataColumnBackgroundColor(dataColumnColors.backgroundColor);
              setDataColumnAlpha(parseFloat(dataColumnColors.alpha));
              setDataColumnColors(dataColumnColors);
            } else {
              setDataColumnColors({
                textColor: '#000000',
                backgroundColor: '#FFFFFF',
                alpha: '1'
              });
            }
            if (dataEntryColor) {
              setDataEntryBackgroundColor(dataEntryColor);
              setDataEntryColor(dataEntryColor);
            } else {
              setDataEntryColor('#FFFFFF');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    };

    fetchPreferences();
  }, [setGradientColors, setWaveColors, setMenuColors, setDataColumnColors, setDataEntryColor]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // Reset state when user logs out
        setThemes([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    try {
      setButtonDisabled(true);
      const user = auth.currentUser;
      if (user) {
        const gradientColors = { start: startColor, end: endColor };
        const waveColors = {
          wave1: wave1Color,
          wave2: wave2Color,
          wave3: wave3Color,
          wave1Alpha: wave1Alpha.toString(),
          wave2Alpha: wave2Alpha.toString(),
          wave3Alpha: wave3Alpha.toString()
        };
        const menuColors = {
          backgroundColor: menuBackgroundColor,
          textColor: menuTextColor,
          buttonColor: menuButtonColor
        };
        const dataColumnColors = {
          textColor: dataColumnTextColor,
          backgroundColor: dataColumnBackgroundColor,
          alpha: dataColumnAlpha.toString()
        };
        const dataEntryColor = dataEntryBackgroundColor;
        await saveUserPreferences(user.uid, gradientColors, waveColors, menuColors, dataColumnColors, dataEntryColor);
        setGradientColors(gradientColors);
        setWaveColors(waveColors);
        setMenuColors(menuColors);
        setDataColumnColors(dataColumnColors);
        setDataEntryColor(dataEntryColor);
        setMessage('Preferences saved successfully!');
        setTimeout(() => setButtonDisabled(false), 2000);
      }
    } catch (error) {
      setMessage(`Error saving preferences: ${error.message}`);
    }
  };

  const handleReset = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await resetUserPreferences(user.uid);
        setStartColor('#003057');
        setEndColor('#001F3D');
        setWave1Color('rgba(18, 119, 176, 0.45)');
        setWave2Color('rgba(10, 90, 150, 0.45)');
        setWave3Color('rgba(5, 60, 120, 0.45)');
        setWave1Alpha(0.45);
        setWave2Alpha(0.45);
        setWave3Alpha(0.45);
        setGradientColors({ start: '#003057', end: '#001F3D' });
        setWaveColors({
          wave1: 'rgba(18, 119, 176, 0.45)',
          wave2: 'rgba(10, 90, 150, 0.45)',
          wave3: 'rgba(5, 60, 120, 0.45)',
          wave1Alpha: '0.45',
          wave2Alpha: '0.45',
          wave3Alpha: '0.45'
        });
        setMenuBackgroundColor('#286090');
        setMenuTextColor('#000000');
        setMenuButtonColor('#286090');
        setMenuColors({
          backgroundColor: '#286090',
          textColor: '#000000',
          buttonColor: '#286090'
        });
        setDataColumnTextColor('#000000');
        setDataColumnBackgroundColor('#FFFFFF');
        setDataColumnAlpha(1);
        setDataColumnColors({
          textColor: '#000000',
          backgroundColor: '#FFFFFF',
          alpha: '1'
        });
        setDataEntryBackgroundColor('#FFFFFF');
        setDataEntryColor('#FFFFFF');
        setMessage('Preferences reset to default successfully!');
      }
    } catch (error) {
      setMessage(`Error resetting preferences: ${error.message}`);
    }
  };

  const handleWaveColorChange = (waveColor, setWaveColor, waveAlpha, setWaveAlpha) => (e) => {
    const color = e.target.value;
    const rgbaColor = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${waveAlpha})`;
    setWaveColor(rgbaColor);
  };

  const handleWaveAlphaChange = (waveAlpha, setWaveAlpha, waveColor, setWaveColor) => (e) => {
    const alpha = e.target.value;
    const color = waveColor.match(/\d+/g);
    const rgbaColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
    setWaveAlpha(alpha);
    setWaveColor(rgbaColor);
  };

  const handleMenuColorChange = (setMenuColor) => (e) => {
    const color = e.target.value;
    setMenuColor(color);
  };

  const handleDataColumnTextColorChange = (e) => {
    const color = e.target.value;
    setDataColumnTextColor(color);
  };

  const handleDataColumnBackgroundColorChange = (e) => {
    const color = e.target.value;
    setDataColumnBackgroundColor(color);
  };

  const handleDataColumnAlphaChange = (e) => {
    const alpha = e.target.value;
    setDataColumnAlpha(alpha);
  };

  const handleDataEntryBackgroundColorChange = (e) => {
    const color = e.target.value;
    setDataEntryBackgroundColor(color);
  };

  const handleSaveTheme = async () => {
    try {
      const user = auth.currentUser;
      if (user && themeName) {
        const gradientColors = { start: startColor, end: endColor };
        const waveColors = {
          wave1: wave1Color,
          wave2: wave2Color,
          wave3: wave3Color,
          wave1Alpha: wave1Alpha.toString(),
          wave2Alpha: wave2Alpha.toString(),
          wave3Alpha: wave3Alpha.toString()
        };
        const menuColors = {
          backgroundColor: menuBackgroundColor,
          textColor: menuTextColor,
          buttonColor: menuButtonColor
        };
        const dataColumnColors = {
          textColor: dataColumnTextColor,
          backgroundColor: dataColumnBackgroundColor,
          alpha: dataColumnAlpha.toString()
        };
        const dataEntryColor = dataEntryBackgroundColor;
        await saveUserTheme(user.uid, themeName, gradientColors, waveColors, menuColors, dataColumnColors, dataEntryColor);
        const updatedThemes = await getUserThemes(user.uid);
        setThemes(updatedThemes);
        setMessage('Theme saved successfully!');
      } else {
        setMessage('Please enter a theme name.');
      }
    } catch (error) {
      setMessage(`Error saving theme: ${error.message}`);
    }
  };

  const handleApplyTheme = (theme) => {
    setStartColor(theme.gradientColors.start);
    setEndColor(theme.gradientColors.end);
    setWave1Color(theme.waveColors.wave1);
    setWave2Color(theme.waveColors.wave2);
    setWave3Color(theme.waveColors.wave3);
    setWave1Alpha(parseFloat(theme.waveColors.wave1Alpha));
    setWave2Alpha(parseFloat(theme.waveColors.wave2Alpha));
    setWave3Alpha(parseFloat(theme.waveColors.wave3Alpha));
    setMenuBackgroundColor(theme.menuColors.backgroundColor);
    setMenuTextColor(theme.menuColors.textColor);
    setMenuButtonColor(theme.menuColors.buttonColor);
    setDataColumnTextColor(theme.dataColumnColors.textColor);
    setDataColumnBackgroundColor(theme.dataColumnColors.backgroundColor);
    setDataColumnAlpha(parseFloat(theme.dataColumnColors.alpha));
    setDataEntryBackgroundColor(theme.dataEntryColor);
    setGradientColors(theme.gradientColors);
    setWaveColors(theme.waveColors);
    setMenuColors(theme.menuColors);
    setDataColumnColors(theme.dataColumnColors);
    setDataEntryColor(theme.dataEntryColor);
  };

  const handleDeleteTheme = async (themeName) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteUserTheme(user.uid, themeName);
        const updatedThemes = await getUserThemes(user.uid);
        setThemes(updatedThemes);
        setMessage('Theme deleted successfully!');
      }
    } catch (error) {
      setMessage(`Error deleting theme: ${error.message}`);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <h2>Profile</h2>
        <p>Customize your background gradient:</p>
        <div className="color-picker">
          <br></br>
          <label>Start Color: </label>
          <input
            type="color"
            value={startColor}
            onChange={(e) => setStartColor(e.target.value)}
          />
        </div>
        <div className="color-picker">
          <label>End Color: </label>
          <input
            type="color"
            value={endColor}
            onChange={(e) => setEndColor(e.target.value)}
          />
        </div>
        <p>Customize your wave colors:</p>
        <div className="color-picker">
          <br></br>
          <label>Wave 1 Color: </label>
          <input
            type="color"
            value={`#${wave1Color.match(/\d+/g).slice(0, 3).map((x) => (+x).toString(16).padStart(2, '0')).join('')}`}
            onChange={handleWaveColorChange(wave1Color, setWave1Color, wave1Alpha, setWave1Alpha)}
          />
          <br></br>
          <label>Transparency: </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={wave1Alpha}
            onChange={handleWaveAlphaChange(wave1Alpha, setWave1Alpha, wave1Color, setWave1Color)}
          />
        </div>
        <div className="color-picker">
          <label>Wave 2 Color: </label>
          <input
            type="color"
            value={`#${wave2Color.match(/\d+/g).slice(0, 3).map((x) => (+x).toString(16).padStart(2, '0')).join('')}`}
            onChange={handleWaveColorChange(wave2Color, setWave2Color, wave2Alpha, setWave2Alpha)}
          />
          <br></br>
          <label>Transparency: </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={wave2Alpha}
            onChange={handleWaveAlphaChange(wave2Alpha, setWave2Alpha, wave2Color, setWave2Color)}
          />
        </div>
        <div className="color-picker">
          <label>Wave 3 Color: </label>
          <input
            type="color"
            value={`#${wave3Color.match(/\d+/g).slice(0, 3).map((x) => (+x).toString(16).padStart(2, '0')).join('')}`}
            onChange={handleWaveColorChange(wave3Color, setWave3Color, wave3Alpha, setWave3Alpha)}
          />
          <br></br>
          <label>Transparency: </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={wave3Alpha}
            onChange={handleWaveAlphaChange(wave3Alpha, setWave3Alpha, wave3Color, setWave3Color)}
          />
        </div>
        <p>Customize your menu colors:</p>
        <div className="color-picker">
          <br></br>
          <label>Menu Background Color: </label>
          <input
            type="color"
            value={menuBackgroundColor}
            onChange={handleMenuColorChange(setMenuBackgroundColor)}
          />
        </div>
        <div className="color-picker">
          <label>Menu Text Color: </label>
          <input
            type="color"
            value={menuTextColor}
            onChange={handleMenuColorChange(setMenuTextColor)}
          />
        </div>
        <div className="color-picker">
          <label>Menu Button Color: </label>
          <input
            type="color"
            value={menuButtonColor}
            onChange={handleMenuColorChange(setMenuButtonColor)}
          />
        </div>
        <p>Customize your data column text color:</p>
        <div className="color-picker">
          <br></br>
          <label>Data Column Text Color: </label>
          <input
            type="color"
            value={dataColumnTextColor}
            onChange={handleDataColumnTextColorChange}
          />
        </div>
        <p>Customize your data column background color:</p>
        <div className="color-picker">
          <br></br>
          <label>Data Column Background Color: </label>
          <input
            type="color"
            value={dataColumnBackgroundColor}
            onChange={handleDataColumnBackgroundColorChange}
          />
        </div>
        <div className="color-picker">
          <br></br>
          <label>Transparency: </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={dataColumnAlpha}
            onChange={handleDataColumnAlphaChange}
          />
        </div>
        <p>Customize your data entry background color:</p>
        <div className="color-picker">
          <br></br>
          <label>Data Entry Background Color: </label>
          <input
            type="color"
            value={dataEntryBackgroundColor}
            onChange={handleDataEntryBackgroundColorChange}
          />
        </div>
        <br></br>
        <button onClick={handleSave} disabled={buttonDisabled}>Save Preferences</button><br></br><br></br>
        <button onClick={handleReset}>Reset to Default</button><br></br><br></br>
        <div className="theme-management">
          <h3>Manage Themes</h3>
          <input type="text" placeholder="Enter theme name" value={themeName} onChange={(e) => setThemeName(e.target.value)} />
          <button onClick={handleSaveTheme}>Save Theme</button>
          {themes.length > 0 && (
            <>
              <h4>Saved Themes</h4>
              <ul>
                {themes.map((theme) => (
                  <li key={theme.name}>
                    <button onClick={() => handleApplyTheme(theme)}>Apply {theme.name}</button>
                    <button onClick={() => handleDeleteTheme(theme.name)}>Delete</button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Profile;
