import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const Spatial = () => {
  const [districts, setDistricts] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [frequencyData, setFrequencyData] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/api/districts')
      .then(response => {
        if (Array.isArray(response.data)) {
          setDistricts(response.data);
          setSelectedDistrict(response.data[0] || '');
        }
      })
      .catch(error => console.error('Error fetching districts:', error));
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      axios.get(`http://localhost:5000/api/units/${selectedDistrict}`)
        .then(response => {
          setUnits(response.data);
          setSelectedUnit(response.data[0] || '');
        })
        .catch(error => console.error('Error fetching units:', error));
    }
  }, [selectedDistrict]);

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
    setSelectedUnit('');
  };

  const handleUnitChange = (event) => {
    setSelectedUnit(event.target.value);
  };

  const handleSubmit = () => {
    axios.post('http://localhost:5000/api/data-frequency', { selectedDistrict, selectedUnit })
      .then(response => {
        setFrequencyData(response.data);
      })
      .catch(error => console.error('Error posting data:', error));
  };

  const renderCharts = () => {
    const excludeFields = ['district_name', 'unitname', 'crime_no'];
    const pieChartFields = ['accused_presentaddress', 'victim_presentaddress'];

    // Prepare charts for rendering
    const charts = Object.entries(frequencyData).filter(
      ([field]) => !excludeFields.includes(field)
    ).map(([field, values], index) => {
      const chartData = {
        labels: Object.keys(values),
        datasets: [{
          label: `${field} Values`,
          data: Object.values(values),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      };

      return (
        <div key={index} className="w-full md:w-1/2 p-2">
          <div className="p-5 border border-gray-200 shadow rounded">
            <h3 className="font-bold text-lg">{field}</h3>
            {pieChartFields.includes(field) ? <Pie data={chartData} /> : <Bar data={chartData} />}
          </div>
        </div>
      );
    });

    // Wrap every two charts in a flex row
    const rows = [];
    for (let i = 0; i < charts.length; i += 2) {
      rows.push(
        <div key={i} className="flex flex-wrap -mx-2">
          {charts.slice(i, i + 2)}
        </div>
      );
    }

    return rows;
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Select District and Unit for Spatial Analysis</h2>
      <div className="mb-4">
      <label htmlFor="district-select" className="block mb-2 text-sm font-medium text-gray-900">District:</label>
        <select id="district-select" value={selectedDistrict} onChange={handleDistrictChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
          {districts.map(district => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="unit-select" className="block mb-2 text-sm font-medium text-gray-900">Unit:</label>
        <select id="unit-select" value={selectedUnit} onChange={handleUnitChange} disabled={!selectedDistrict} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
          {units.map(unit => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
      </div>
      <button onClick={handleSubmit} className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Submit</button>
      <div className="mt-8">
        {Object.keys(frequencyData).length > 0 ? renderCharts() : <p className="text-gray-500">No data to display</p>}
      </div>
    </div>
  );
};

export default Spatial;
