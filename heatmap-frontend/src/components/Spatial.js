import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import HeatmapLayer from './HeatmapLayer';

const Spatial = () => {
  const [districts, setDistricts] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [frequencyData, setFrequencyData] = useState({});
  const defaultPosition = [14.5204, 75.7224]; // Latitude and Longitude of Karnataka
  const [crimeGroups, setCrimeGroups] = useState([]);
  const [selectedCrimeGroup, setSelectedCrimeGroup] = useState('');

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
      axios.get(`http://localhost:5000/api/crime-groups/${selectedDistrict}`)
        .then(response => {
          setCrimeGroups(response.data);
          setSelectedCrimeGroup(response.data[0] || '');
        })
        .catch(error => console.error('Error fetching crime groups:', error));
    }
  }, [selectedDistrict]);

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
    setSelectedUnit('');
  };

  const handleUnitChange = (event) => {
    const value = event.target.value;
    if (value === 'All Police Stations') {
      setSelectedUnit('');
    } else {
      setSelectedUnit(value);
    }
  };
  const handleCrimeGroupChange = (event) => {
    setSelectedCrimeGroup(event.target.value);
  };

  const handleSubmit = () => {
    axios.post('http://localhost:5000/api/data-frequency', { selectedDistrict, selectedUnit })
      .then(response => {
        setFrequencyData(response.data);
      })
      .catch(error => console.error('Error posting data:', error));
  };

  const renderCrimeGroupDropdown = () => {
    return (
      <div className="mb-4">
        <label htmlFor="crimegroup-select" className="block mb-2 text-sm font-medium text-gray-900">Crime Group:</label>
        <select id="crimegroup-select" value={selectedCrimeGroup} onChange={handleCrimeGroupChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
          {crimeGroups.map(crimeGroup => (
            <option key={crimeGroup} value={crimeGroup}>{crimeGroup}</option>
          ))}
        </select>
      </div>
    );
  };

  const renderCharts = () => {
    const excludeFields = ['district_name', 'unitname', 'crime_no','latitude','longitude'];
    const pieChartFields = ['accused_presentaddress', 'victim_presentaddress'];

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

  const renderUnitOptions = () => {
    let options = units.map(unit => (
      <option key={unit} value={unit}>{unit}</option>
    ));
    options.unshift(<option key="All Police Stations" value="All Police Stations">All Police Stations</option>);
    return options;
  };

  const renderTopThreeFrequencies = () => {
    return Object.entries(frequencyData).map(([field, values]) => {
      if (['crime_no', 'district_name', 'unitname'].includes(field)) {
        return null;
      }
  
      const sortedValues = Object.entries(values).sort((a, b) => b[1] - a[1]);
      const total = sortedValues.reduce((acc, [_, freq]) => acc + freq, 0);
      const topThreeValues = sortedValues.slice(0, 3);
  
      const topThreeText = topThreeValues.map(([value, freq]) => `${value}: ${freq}`).join(', ');
      const percentageText = topThreeValues.map(([_, freq]) => `${Math.floor(freq / total * 100)}%`).join(', ');
  
      return (
        <div key={field} className="mt-4">
          <h3 className="font-bold">{field} Top 3 Frequencies:</h3>
          <p>{topThreeText}</p>
          <p>Most of the {field} in this {selectedDistrict} district and {selectedUnit || 'entire district'} unit belongs to {topThreeText} where total {field} number is {total} which makes {percentageText} of the total {field}.</p>
        </div>
      );
    }).filter(Boolean);
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
          {renderUnitOptions()}
        </select>
      </div>
      
      <button onClick={handleSubmit} className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Submit</button>
      <div className="mt-4" style={{ height: '400px' }}>
        <MapContainer center={defaultPosition} zoom={7} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* You can add Markers here if you have specific locations to mark within Karnataka */}
          <HeatmapLayer />
        </MapContainer>
      </div>
      
      <div className="mt-8">
        {Object.keys(frequencyData).length > 0 ? renderCharts() : <p className="text-gray-500">No data to display</p>}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Top 3 Frequencies for Each Field</h2>
        {Object.keys(frequencyData).length > 0 && renderTopThreeFrequencies()}
      </div>
    </div>
  );
};

export default Spatial;
