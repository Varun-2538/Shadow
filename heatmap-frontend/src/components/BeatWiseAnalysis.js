import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BeatWiseAnalysis = () => {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/districts')
      .then(response => {
        setDistricts(response.data);
        setSelectedDistrict(response.data[0]);
      })
      .catch(error => console.error('Error fetching districts:', error));
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      axios.get(`http://localhost:5000/api/units/${selectedDistrict}`)
        .then(response => {
          setUnits(response.data);
          setSelectedUnit(response.data[0]);
        })
        .catch(error => console.error('Error fetching units:', error));
    }
  }, [selectedDistrict]);

  return (
    <div className="flex items-center justify-center min-h-screen flex-col">
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <div>
          <label>District:</label>
          <select 
            value={selectedDistrict} 
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="ml-2"
          >
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Police Station:</label>
          <select 
            value={selectedUnit} 
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="ml-2"
            disabled={!selectedDistrict}
          >
            {units.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
      </div>
      <h1>Under Builld</h1>
    </div>
  );
};

export default BeatWiseAnalysis;
