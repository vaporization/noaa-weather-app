import React, { useState, useEffect } from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const GeoLocation = () => {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [stations, setStations] = useState([]);
  const mapContainer = React.useRef(null);
  const map = React.useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setLocation({ lat: latitude, lon: longitude });
    });
  }, []);

  useEffect(() => {
    if (location.lat && location.lon) {
      axios.get(`/stations?lat=${location.lat}&lon=${location.lon}`)
        .then(response => setStations(response.data));
    }
  }, [location]);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [location.lon, location.lat],
      zoom: 10
    });

    stations.forEach(station => {
      new mapboxgl.Marker()
        .setLngLat([station.lon, station.lat])
        .addTo(map.current);
    });
  }, [stations]);

  return (
    <div>
      <h1>Select a Weather Station</h1>
      <div ref={mapContainer} style={{ width: '100%', height: '400px' }}></div>
    </div>
  );
};

export default GeoLocation;
