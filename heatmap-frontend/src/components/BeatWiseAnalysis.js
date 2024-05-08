import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';  // Import Pie from react-chartjs-2
import "chart.js/auto";

const BeatWiseAnalysis = () => {
  const [districts, setDistricts] = useState([]);
  const [units, setUnits] = useState([]);
  const [beats, setBeats] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedBeat, setSelectedBeat] = useState('');
  const [chartData, setChartData] = useState([]);
  const [collapsibleState, setCollapsibleState] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/api/districts')
      .then(response => {
        setDistricts(response.data);
        setSelectedDistrict(response.data[0] || '');
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

  useEffect(() => {
    if (selectedUnit) {
      axios.get(`http://localhost:5000/api/beats/${selectedUnit}`)
        .then(response => {
          setBeats(response.data);
          setSelectedBeat(response.data[0] || '');
        })
        .catch(error => console.error('Error fetching beats:', error));
    }
  }, [selectedUnit]);

  useEffect(() => {
    // Initialize collapsible state for each field when chartData is set
    setCollapsibleState(
      chartData.reduce((acc, chart) => {
        acc[chart.field] = true; // start all as closed
        return acc;
      }, {})
    );
  }, [chartData]);

  const handleSubmit = () => {
    if (selectedBeat) {
      axios.get(`http://localhost:5000/api/data-by-beat/${encodeURIComponent(selectedBeat)}`)
        .then(response => {
          prepareChartData(response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  };

  const colors = [
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(255, 159, 64, 0.5)',
    'rgba(199, 199, 199, 0.5)',  // You can extend this list with more colors
    'rgba(164, 255, 101, 0.5)',
    'rgba(101, 140, 255, 0.5)'
  ];

  const generateColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.5)`;
  };

  const prepareChartData = (data) => {
    const fields = ['place_of_offence', 'actsection', 'fir_type', 'latitude', 'longitude', 'crimegroup_name', 'victim_profession', 'victim_caste', 'accused_profession', 'accused_caste'];
    let chartDataSets = fields.map((field) => {
      const countData = data.reduce((acc, curr) => {
        // Check if the field is latitude or longitude and the value is 0, skip adding to countData
        if ((field === 'latitude' || field === 'longitude') && curr[field] === 'null') {
          return acc;
        }
  
        acc[curr[field]] = (acc[curr[field]] || 0) + 1;
        return acc;
      }, {});
  
      const labels = Object.keys(countData);
      const colors = labels.map(() => generateColor()); // Generate a unique color for each label
  
      return {
        field: field,
        labels: labels,
        datasets: [{
          label: `${field.replace('_', ' ')} Frequency`,
          data: Object.values(countData),
          backgroundColor: colors, // Apply the dynamically generated colors to each bar
          borderColor: colors.map(color => color.replace('0.5', '1')), // Darker borders for better visibility
          borderWidth: 1,
          barThickness: 10,
          borderRadius: 5,
          borderSkipped: false,
        }]
      };
    });
  
    setChartData(chartDataSets);
  };
  

  const chartConfig = (data, chartType = 'bar') => {
    const commonOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    };

    const barOptions = {
      ...commonOptions,
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            display: false
          }
        }
      }
    };

    return {
      type: chartType,
      options: chartType === 'bar' ? barOptions : commonOptions,
      data: {
        labels: data.labels,
        datasets: data.datasets
      }
    };
  };

  const renderChart = (data, field) => {
    const chartTypes = {
      'actsection': 'pie',
      'place_of_offence': 'pie'
    };
    const chartType = chartTypes[field] || 'bar'; // Default to bar if not specified

    const ChartComponent = chartType === 'pie' ? Pie : Bar;

    return (
      <ChartComponent {...chartConfig(data, chartType)} />
    );
  };

  const toggleCollapse = (field) => {
    setCollapsibleState(prevState => ({
      ...prevState,
      [field]: !prevState[field]
    }));
  };

  const renderCharts = () => {
    const pairedCharts = [];
    for (let i = 0; i < chartData.length; i += 2) {
      pairedCharts.push(chartData.slice(i, i + 2));
    }

    return pairedCharts.map((pair, index) => (
      <div key={index} className="flex flex-wrap -mx-2">
        {pair.map(data => (
          <div key={data.field} className="w-full md:w-1/2 px-2">
            <div className="p-5 border border-gray-200 shadow rounded">
              <button
                onClick={() => toggleCollapse(data.field)}
                className="w-full text-left text-lg font-semibold py-2 px-4 bg-white rounded"
              >
                {collapsibleState[data.field] ? '►' : '▼'} {data.field.replace('_', ' ')}
              </button>
              <div className={`${collapsibleState[data.field] ? 'hidden' : ''} p-4 bg-white rounded`}>
                {renderChart(data, data.field)}
              </div>
            </div>
          </div>
        ))}
      </div>
    ));
  };
  
  

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Select District, Unit, and Beat for Analysis</h2>
      <div className="flex flex-wrap -mx-2 mb-4">
        <div className="w-1/3 px-2">
          <label htmlFor="district-select" className="block mb-2 text-sm font-medium text-gray-900">District:</label>
          <select id="district-select" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            {districts.map(district => <option key={district} value={district}>{district}</option>)}
          </select>
        </div>
        <div className="w-1/3 px-2">
          <label htmlFor="unit-select" className="block mb-2 text-sm font-medium text-gray-900">Unit:</label>
          <select id="unit-select" value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)} disabled={!selectedDistrict} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
          </select>
        </div>
        <div className="w-1/3 px-2">
          <label htmlFor="beat-select" className="block mb-2 text-sm font-medium text-gray-900">Beat:</label>
          <select id="beat-select" value={selectedBeat} onChange={(e) => setSelectedBeat(e.target.value)} disabled={!selectedUnit} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            {beats.map(beat => <option key={beat} value={beat}>{beat}</option>)}
          </select>
        </div>
        <div className="w-full px-2 mt-4">
          <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
        </div>
      </div>
      {renderCharts()}
    </div>
  );
}

export default BeatWiseAnalysis;
