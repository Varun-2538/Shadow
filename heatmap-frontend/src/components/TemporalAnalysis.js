import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const TemporalAnalysis = () => {
  const [districts, setDistricts] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [timeData, setTimeData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [weekData, setWeekData] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [monthChartData, setMonthChartData] = useState({ labels: [], datasets: [] });
  const [weekChartData, setWeekChartData] = useState({ labels: [], datasets: [] });

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
          setMonthData(response.data);
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

  const handleFetchWeekData = () => {
    if (selectedDistrict && selectedUnit) {
      axios.get(`http://localhost:5000/api/crime-by-week/${selectedDistrict}/${selectedUnit}`)
        .then(response => {
          setWeekData(response.data);
          const data = {
            labels: response.data.map(d => `Week ${d.week}`),
            datasets: [
              {
                label: 'Number of Crimes by Week',
                data: response.data.map(d => d.count),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4
              }
            ]
          };
          setWeekChartData(data);
        })
        .catch(error => console.error('Error fetching week data:', error));
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
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
      </div>
      <div className="my-4">
        <button onClick={handleFetchData} className="mx-2 px-4 py-2 bg-blue-500 text-white rounded">Fetch Hourly Data</button>
        <button onClick={handleFetchMonthData} className="mx-2 px-4 py-2 bg-green-500 text-white rounded">Fetch Monthly Data</button>
        <button onClick={handleFetchWeekData} className="mx-2 px-4 py-2 bg-purple-500 text-white rounded">Fetch Weekly Data</button>
      </div>
      {chartData.labels.length > 0 && (
        <>
          <h2 className="text-xl font-bold">Hourly Crime Data</h2>
          <Line data={chartData} options={options} />
        </>
      )}
      {monthChartData.labels.length > 0 && (
        <>
          <h2 className="text-xl font-bold">Monthly Crime Data</h2>
          <Line data={monthChartData} options={options} />
        </>
      )}
      {weekChartData.labels.length > 0 && (
        <>
          <h2 className="text-xl font-bold">Weekly Crime Data</h2>
          <Line data={weekChartData} options={options} />
        </>
      )}
    </div>
  );
};

export default TemporalAnalysis;
