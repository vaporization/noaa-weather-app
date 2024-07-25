import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'chart.js';

const DataAnalysis = () => {
  const [data, setData] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState({ start: '', end: '' });
  const chartRef = React.useRef(null);

  useEffect(() => {
    if (selectedDateRange.start && selectedDateRange.end) {
      axios.get(`/data?start=${selectedDateRange.start}&end=${selectedDateRange.end}`)
        .then(response => setData(response.data));
    }
  }, [selectedDateRange]);

  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: data.map(entry => entry.date),
          datasets: [{
            label: 'Data over Time',
            data: data.map(entry => entry.value),
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        }
      });
    }
  }, [data]);

  return (
    <div>
      <h2>Data Analysis</h2>
      <input type="date" value={selectedDateRange.start} onChange={(e) => setSelectedDateRange({ ...selectedDateRange, start: e.target.value })} />
      <input type="date" value={selectedDateRange.end} onChange={(e) => setSelectedDateRange({ ...selectedDateRange, end: e.target.value })} />
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default DataAnalysis;
