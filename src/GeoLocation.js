import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GeoLocation = () => {
    const [location, setLocation] = useState({ lat: null, lon: null });
    const [stations, setStations] = useState([]);

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

    return (
        <div>
            <h1>Select a Weather Station</h1>
            <ul>
                {stations.map(station => (
                    <li key={station}>{station}</li>
                ))}
            </ul>
        </div>
    );
};

export default GeoLocation;
