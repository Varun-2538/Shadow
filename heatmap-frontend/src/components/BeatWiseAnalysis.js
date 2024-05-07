import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BeatWiseAnalysis = () => {
  const [districts, setDistricts] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState(['', '', '']);
  const [units, setUnits] = useState([[], [], []]);
  const [selectedUnits, setSelectedUnits] = useState(['', '', '']);
  const [activeComparisons, setActiveComparisons] = useState(2);

  useEffect(() => {
    axios.get('http://localhost:5000/api/districts')
      .then(response => {
        setDistricts(response.data);
        const initialDistricts = response.data[0] ? [response.data[0], response.data[0], response.data[0]] : ['', '', ''];
        setSelectedDistricts(initialDistricts);
        fetchUnitsForAllDistricts(initialDistricts);
      })
      .catch(error => console.error('Error fetching districts:', error));
  }, []);

  const fetchUnitsForDistrict = useCallback((district, index) => {
    if (district) {
      axios.get(`http://localhost:5000/api/units/${district}`)
        .then(response => {
          const newUnits = [...units];
          newUnits[index] = response.data;
          setUnits(newUnits);
          setSelectedUnits(prev => {
            const newSelectedUnits = [...prev];
            newSelectedUnits[index] = response.data[0] || '';
            return newSelectedUnits;
          });
        })
        .catch(error => console.error(`Error fetching units for district ${district}:`, error));
    }
  }, [units]);

  const fetchUnitsForAllDistricts = useCallback((districtsArray) => {
    districtsArray.forEach((district, index) => fetchUnitsForDistrict(district, index));
  }, [fetchUnitsForDistrict]);

  const handleDistrictChange = (value, index) => {
    const newSelectedDistricts = [...selectedDistricts];
    newSelectedDistricts[index] = value;
    setSelectedDistricts(newSelectedDistricts);
    fetchUnitsForDistrict(value, index);
  };

  const handleAddComparison = () => {
    if (activeComparisons < 3) {
      setActiveComparisons(current => current + 1);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Select Districts and Units for Beat Wise Comparison</h2>
      <div className="flex flex-wrap -mx-2 mb-4 justify-center">
        {Array.from({ length: activeComparisons }).map((_, index) => (
          <div key={index} className={`px-2 ${activeComparisons === 3 ? 'w-full md:w-1/3' : 'w-full md:w-1/2'}`}>
            <div className="p-5 border border-gray-200 shadow rounded relative">
              <label htmlFor={`district-select-${index}`} className="block mb-2 text-sm font-medium text-gray-900">District {index + 1}:</label>
              <select
                id={`district-select-${index}`}
                value={selectedDistricts[index]}
                onChange={(e) => handleDistrictChange(e.target.value, index)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                {districts.map(district => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              <label htmlFor={`unit-select-${index}`} className="block mt-4 mb-2 text-sm font-medium text-gray-900">Unit {index + 1}:</label>
              <select
                id={`unit-select-${index}`}
                value={selectedUnits[index]}
                onChange={(e) => {
                  const newSelectedUnits = [...selectedUnits];
                  newSelectedUnits[index] = e.target.value;
                  setSelectedUnits(newSelectedUnits);
                }}
                disabled={!selectedDistricts[index]}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                {units[index].map(unit => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              {index === 1 && activeComparisons < 3 && (
                <button
                  onClick={handleAddComparison}
                  className="absolute right-3 top-3 text-blue-500 hover:text-blue-700"
                  title="Add another comparison"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BeatWiseAnalysis;
