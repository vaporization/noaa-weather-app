import React from 'react';
import './DataDisplay.css';

const getTidePredictionData = (data) => {
  if (!data || data.length === 0) {
    return <p>No data available for this station.</p>;
  }

  const reversedData = [...data].reverse();

  return reversedData.map((entry, index) => {
    const value = parseFloat(entry.v);
    const displayValue = `${value.toFixed(2)} ft`;

    const time = new Date(entry.t);
    const localTime = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'America/New_York', // Adjust this to the desired time zone or leave it as it is
    }).format(time);

    return (
      <div key={index} className={`data-entry ${index === 0 ? 'highlight' : ''}`}>
        <p><strong>Time:</strong> {localTime}</p>
        <p><strong>Value:</strong> {displayValue}</p>
      </div>
    );
  });
};

const TidePredictionDisplay = ({ title, data }) => {
  return (
    <div className="data-column">
      <h2>{title}</h2>
      {getTidePredictionData(data)}
    </div>
  );
};

export default TidePredictionDisplay;
