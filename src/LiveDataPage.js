import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataDisplay from './DataDisplay';
import { regions } from './stations';
import './LiveDataPage.css';

const LiveDataPage = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedStation, setSelectedStation] = useState('');

  useEffect(() => {
    if (!selectedStation) return;

    const fetchData = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);

        const currentDate = now.toISOString().split('T')[0].replace(/-/g, '');
        const previousDate = yesterday.toISOString().split('T')[0].replace(/-/g, '');

        console.log(`Fetching data for station: ${selectedStation}`);
        console.log(`Current Date: ${currentDate}, Previous Date: ${previousDate}`);

        const waterLevelResponse = await axios.get(
          `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=${selectedStation}&product=water_level&datum=MLLW&time_zone=LST_LDT&units=english&application=web_services&format=json`
        );

        const tidePredictionsResponse = await axios.get(
          `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=${selectedStation}&product=predictions&datum=MLLW&time_zone=LST_LDT&units=english&application=web_services&format=json`
        );

        const waterTemperatureResponse = await axios.get(
          `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=${selectedStation}&product=water_temperature&begin_date=${previousDate}&end_date=${currentDate}&units=english&time_zone=LST_LDT&application=web_services&range=48&format=json`
        );

        const airPressureResponse = await axios.get(
          `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=${selectedStation}&product=air_pressure&begin_date=${previousDate}&end_date=${currentDate}&units=english&time_zone=LST_LDT&application=web_services&range=48&format=json`
        );

        const airTemperatureResponse = await axios.get(
          `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=${selectedStation}&product=air_temperature&begin_date=${previousDate}&end_date=${currentDate}&units=english&time_zone=LST_LDT&application=web_services&range=48&format=json`
        );

        const windSpeedResponse = await axios.get(
          `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=${selectedStation}&product=wind&begin_date=${previousDate}&end_date=${currentDate}&units=english&time_zone=LST_LDT&application=web_services&range=48&format=json`
        );

        setData({
          waterLevel: waterLevelResponse.data.data || [],
          tidePredictions: tidePredictionsResponse.data.predictions || [],
          waterTemperature: waterTemperatureResponse.data.data || [],
          airPressure: airPressureResponse.data.data || [],
          airTemperature: airTemperatureResponse.data.data || [],
          windSpeed: windSpeedResponse.data.data || [],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedStation]);

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
    setSelectedStation('');
    setData({});
  };

  const handleStationChange = (event) => {
    setSelectedStation(event.target.value);
  };

  return (
    <div>
      <h1>Live Weather and Water Data</h1>
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

      {isLoading ? (
        <p>Loading data...</p>
      ) : hasError ? (
        <p>Failed to load data</p>
      ) : (
        <div className="data-container">
          <DataDisplay title="Water Level" data={data.waterLevel} />
          <DataDisplay title="Tide Predictions" data={data.tidePredictions} />
          <DataDisplay title="Water Temperature" data={data.waterTemperature} />
          <DataDisplay title="Air Pressure" data={data.airPressure} />
          <DataDisplay title="Air Temperature" data={data.airTemperature} />
          <DataDisplay title="Wind Speed" data={data.windSpeed} />
        </div>
      )}

      <iframe
        src="https://radar.weather.gov/?settings=v1_eyJhZ2VuZGEiOnsiaWQiOiJsb2NhbCIsImNlbnRlciI6Wy03Ni41NjcsMzcuMDkxXSwibG9jYXRpb24iOm51bGwsInpvb20iOjkuODU2NjY2NjY4NTQwNTQ4LCJmaWx0ZXIiOm51bGwsImxheWVyIjoic3JfYnJlZiIsInN0YXRpb24iOiJLQUtRIn0sImFuaW1hdGluZyI6ZmFsc2UsImJhc2UiOiJzdGFuZGFyZCIsImFydGNjIjpmYWxzZSwiY291bnR5IjpmYWxzZSwiY3dhIjpmYWxzZSwicmZjIjpmYWxzZSwic3RhdGUiOmZhbHNlLCJtZW51Ijp0cnVlLCJzaG9ydEZ1c2VkT25seSI6dHJ1ZSwib3BhY2l0eSI6eyJhbGVydHMiOjAuOCwibG9jYWwiOjAuNiwibG9jYWxTdGF0aW9ucyI6MC44LCJuYXRpb25hbCI6MC42fX0%3D"
        width="100%"
        height="600px"
        style={{ border: 'none', marginTop: '20px' }}
        title="NWS Radar"
      ></iframe>
    </div>
  );
};

export default LiveDataPage;
