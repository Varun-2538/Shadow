import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-plugin-crosshair'; // Import the plugin

const TemporalAnalysis = () => {
  const [districts, setDistricts] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [timeData, setTimeData] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    axios.get('http://localhost:5000/api/districts')
      .then(response => {
        setDistricts(response.data);
        if (response.data.length > 0) {
          setSelectedDistrict(response.data[0]);
        }
      })
      .catch(error => console.error('Error fetching districts:', error));
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      axios.get(`http://localhost:5000/api/units/${selectedDistrict}`)
        .then(response => {
          setUnits(response.data);
          if (response.data.length > 0) {
            setSelectedUnit(response.data[0]);
          } else {
            setSelectedUnit('');
          }
        })
        .catch(error => console.error('Error fetching units:', error));
    }
  }, [selectedDistrict]);

  const handleFetchData = () => {
    if (selectedDistrict && selectedUnit) {
      axios.get(`http://localhost:5000/api/crime-by-time/${selectedDistrict}/${selectedUnit}`)
        .then(response => {
          setTimeData(response.data);
          const chartData = {
            labels: response.data.map(d => d.hour),
            datasets: [
              {
                type: 'line',
                label: 'Number of Crimes (Line)',
                data: response.data.map(d => d.count),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 3,
                fill: false,
                tension: 0.4
              }
            ]
          };
          setChartData(chartData);
        })
        .catch(error => console.error('Error fetching time data:', error));
    }
  };

  const options = {
    responsive: true,
    plugins: {
      crosshair: {
        line: {
          color: '#F66',
          width: 1
        },
        sync: {
          enabled: false,
        },
        zoom: {
          enabled: false,
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            const crimeInfo = timeData[context.dataIndex];
            return `${context.dataset.label}: ${context.parsed.y}
Top 3 Crimes: ${crimeInfo.topCrimes}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold mb-4">Temporal Analysis of Crimes</h1>
      <div>
        <label htmlFor="district-select">District:</label>
        <select
          id="district-select"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
        >
          {districts.map(district => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="unit-select">Unit:</label>
        <select
          id="unit-select"
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
          disabled={!selectedDistrict}
        >
          {units.map(unit => (
            <option key={unit} value={unit}>{unit}</option

        </select>
      </div>
      <button onClick={handleFetchData} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Submit
      </button>
      {chartData.labels.length > 0 && (
        <>
          <Bar data={chartData} options={options} />
          <Line data={chartData} options={options} />
        </>
      )}
    </div>
  );
};

export default TemporalAnalysis;
