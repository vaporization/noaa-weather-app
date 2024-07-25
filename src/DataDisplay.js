import React from 'react';
import './DataDisplay.css';

const getConvertedData = (data, type) => {
  if (!data || data.length === 0) {
    return <p>No data available for this station.</p>;
  }

  const reversedData = [...data].reverse();

  return reversedData.map((entry, index) => {
    const value = parseFloat(entry.v || entry.s);
    let displayValue = '';

    switch (type) {
      case 'Water Level':
      case 'Tide Predictions':
        displayValue = `${value.toFixed(2)} ft (${(value * 0.3048).toFixed(2)} m)`;
        break;
      case 'Water Temperature':
        displayValue = `${value.toFixed(2)}° F (${((value - 32) * 5 / 9).toFixed(2)}° C)`;
        break;
      case 'Air Pressure':
        displayValue = `${value.toFixed(2)} mb (${(value * 0.02953).toFixed(2)} inHg)`;
        break;
      case 'Air Temperature':
        displayValue = `${value.toFixed(2)}° F (${((value - 32) * 5 / 9).toFixed(2)}° C)`;
        break;
      case 'Wind Speed':
        displayValue = `${value.toFixed(2)} m/s (${(value * 2.23694).toFixed(2)} mph)`;
        break;
      default:
        displayValue = `${value}`;
        break;
    }

    const time = new Date(entry.t);
    const localTime = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'America/New_York', // Adjust this to the desired time zone or leave it as it is
    }).format(time);

    return (
      <div key={index} className={`data-entry ${index === 0 ? 'highlight' : ''}`}>
        <p><strong>Time:</strong> {localTime}</p>
        <br></br>
        <p><strong>Value:</strong> {displayValue}</p>
      </div>
    );
  });
};

const DataDisplay = ({ title, data }) => {
  return (
    <div className="data-column">
      <h2>{title}</h2>
      {getConvertedData(data, title)}
    </div>
  );
};

export default DataDisplay;
