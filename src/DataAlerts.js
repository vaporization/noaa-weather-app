import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { regions } from './stations';
import './DataAlerts.css';  // You can create a new CSS file similar to LiveDataPage.css or reuse the same one

const DataAlerts = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedStation, setSelectedStation] = useState('');
  const [alertConditions, setAlertConditions] = useState({
    airTemperature: '',
    waterTemperature: '',
    humidity: ''
  });
  const [alerts, setAlerts] = useState([]);

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
    setSelectedStation('');
  };

  const handleStationChange = (event) => {
    setSelectedStation(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAlertConditions({ ...alertConditions, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userId = 'user-id';  // Replace with actual user ID
      const response = await axios.post('/api/alerts', {
        userId,
        stationId: selectedStation,
        conditions: alertConditions
      });
      setAlerts([...alerts, response.data]);
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  return (
    <div className="page-container">
      <h1>Set Data Alerts</h1>
      <div className="select-container">
        <select value={selectedRegion} onChange={handleRegionChange}>
          <option value="">Select a region</option>
          {Object.keys(regions).map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>

        {selectedRegion && (
          <select value={selectedStation} onChange={handleStationChange}>
            <option value="">Select a station</option>
            {regions[selectedRegion].map((station) => (
              <option key={station.id} value={station.id}>
                {station.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="alert-inputs">
          <label>
            Air Temperature:
            <input
              type="number"
              name="airTemperature"
              value={alertConditions.airTemperature}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Water Temperature:
            <input
              type="number"
              name="waterTemperature"
              value={alertConditions.waterTemperature}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Humidity:
            <input
              type="number"
              name="humidity"
              value={alertConditions.humidity}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <button type="submit">Set Alert</button>
      </form>

      <div className="alerts-container">
        <h2>Active Alerts</h2>
        <ul>
          {alerts.map((alert, index) => (
            <li key={index}>
              Station: {alert.stationId}, Conditions: {JSON.stringify(alert.conditions)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DataAlerts;
