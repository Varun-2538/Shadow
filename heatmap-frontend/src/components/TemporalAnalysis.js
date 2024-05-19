import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const TemporalAnalysis = () => {
  const [districts, setDistricts] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [monthChartData, setMonthChartData] = useState({ labels: [], datasets: [] });
  const [yearChartData, setYearChartData] = useState({ labels: [], datasets: [] });

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
          const data = {
            labels: response.data.map(d => d.hour),
            datasets: [
              {
                label: 'Number of Crimes by Hour',
                data: response.data.map(d => d.count),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4
              }
            ]
          };
          setChartData(data);
        })
        .catch(error => console.error('Error fetching time data:', error));
    }
  };

  const handleFetchMonthData = () => {
    if (selectedDistrict && selectedUnit) {
      axios.get(`http://localhost:5000/api/crime-by-month/${selectedDistrict}/${selectedUnit}`)
        .then(response => {
          const data = {
            labels: response.data.map(d => `${d.month}`),
            datasets: [
              {
                label: 'Number of Crimes by Month',
                data: response.data.map(d => d.count),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4
              }
            ]
          };
          setMonthChartData(data);
        })
        .catch(error => console.error('Error fetching month data:', error));
    }
  };

  const handleFetchYearData = () => {
    if (selectedDistrict && selectedUnit) {
      axios.get(`http://localhost:5000/api/crime-by-year/${selectedDistrict}/${selectedUnit}`)
        .then(response => {
          const data = {
            labels: response.data.map(d => d.year),
            datasets: [
              {
                label: 'Number of Crimes by Year',
                data: response.data.map(d => d.count),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4
              }
            ]
          };
          setYearChartData(data);
        })
        .catch(error => console.error('Error fetching year data:', error));
    }
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false
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
      <h1 className="text-2xl font-bold mb-4 text-center">Temporal Analysis of Crimes</h1>
      <div className="flex flex-wrap -mx-2 mb-4">
        <div className="w-full md:w-1/2 px-2 mb-4">
          <label htmlFor="district-select" className="block mb-2 text-sm font-medium text-gray-700">District:</label>
          <select
            id="district-select"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
          >
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-1/2 px-2 mb-4">
          <label htmlFor="unit-select" className="block mb-2 text-sm font-medium text-gray-700">Unit:</label>
          <select
            id="unit-select"
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            disabled={!selectedDistrict}
            className="block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
          >
            {units.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-wrap -mx-2 mb-4">
        <div className="w-full md:w-1/3 px-2 mb-4">
          <button onClick={handleFetchData} className="block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Fetch Hourly Data</button>
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4">
          <button onClick={handleFetchMonthData} className="block w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Fetch Monthly Data</button>
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4">
          <button onClick={handleFetchYearData} className="block w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Fetch Yearly Data</button>
        </div>
      </div>
      {chartData.labels.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-center mb-4">Hourly Crime Data</h2>
          <div className="relative w-full h-64">
            <Line data={chartData} options={options} />
          </div>
        </div>
      )}
      {monthChartData.labels.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-center mb-4">Monthly Crime Data</h2>
          <div className="relative w-full h-64">
            <Line data={monthChartData} options={options} />
          </div>
        </div>
      )}
      {yearChartData.labels.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-center mb-4">Yearly Crime Data</h2>
          <div className="relative w-full h-64">
            <Line data={yearChartData} options={options} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TemporalAnalysis;
