import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from "react-chartjs-2";
import "chart.js/auto";
import 'leaflet/dist/leaflet.css';

const TemporalAnalysis = () => {

  const [data, setData] = useState([]);
  const [year, setYear] = useState(2020);
  const [selectedSeason, setSelectedSeason] = useState('Summer');

  const [isMonthlyChartVisible, setMonthlyChartVisible] = useState(true);
  const [isYearlyChartVisible, setYearlyChartVisible] = useState(true);
  const [isSeasonalChartVisible, setSeasonalChartVisible] = useState(true);
  const [isSelectiveSeasonalChartVisible, setSelectiveSeasonalChartVisible] = useState(true);

  const toggleMonthlyChart = () => {
    setMonthlyChartVisible(!isMonthlyChartVisible);
  };

  const toggleYearlyChart = () => {
    setYearlyChartVisible(!isYearlyChartVisible);
  };

  const toggleSeasonalChart = () => {
    setSeasonalChartVisible(!isSeasonalChartVisible);
  };

  const toggleSelectiveSeasonalChart = () => {
    setSelectiveSeasonalChartVisible(!isSelectiveSeasonalChartVisible);
  };

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  const handleYearChange = (event) => {
    const newYear = Number(event.target.value);
    if (newYear < 2016 || newYear > 2024) {
      throw new Error("No data available for dates before 2016 and after 2024.");
    }
    setYear(newYear);
  };

  useEffect(() => {
      axios.get('http://localhost:5000/api/timeData')
          .then(response => {
              setData(response.data);
              console.log(response.data);
          })
          .catch(error => console.error('Error fetching timeData:', error));
  }, []);

  // Filter data for the selected year and count the months
  const filteredData = data.filter(item => item.year === year);
  const monthCounts = filteredData.reduce((counts, item) => {
      counts[item.month] = (counts[item.month] || 0) + 1;
      return counts;
  }, {});

  const monthlyChartData = {
      labels: Object.keys(monthCounts),
      datasets: [
          {
              label: `Monthly Data for ${year}`,
              data: Object.values(monthCounts),
              backgroundColor: 'rgba(75,192,192,0.4)',
              borderColor: 'rgba(75,192,192,1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(75,192,192,0.6)',
              hoverBorderColor: 'rgba(75,192,192,1)',
          },
      ],
  };

    const yearCounts = data.reduce((counts, item) => {
        if (item.year >= 2016 && item.year <= 2024) {
            counts[item.year] = (counts[item.year] || 0) + 1;
        }
        return counts;
    }, {});

    const yearlyChartData = {
        labels: Object.keys(yearCounts),
        datasets: [
            {
                label: 'Yearly Data',
                data: Object.values(yearCounts),
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75,192,192,0.6)',
                hoverBorderColor: 'rgba(75,192,192,1)',
            },
        ],
    };

    const incidentsPerMonthSeasonal = data.reduce((counts, item) => {
      counts[item.month] = (counts[item.month] || 0) + 1;
      return counts;
    }, {});
    
    // Mapping months to seasons for better interpretation
    const monthsSeasons = {
      1: 'Winter',
      2: 'Winter',
      3: 'Spring',
      4: 'Spring',
      5: 'Spring',
      6: 'Summer',
      7: 'Summer',
      8: 'Summer',
      9: 'Fall',
      10: 'Fall',
      11: 'Fall',
      12: 'Winter'
    };
    
    const incidentsPerMonthSeasonalMapped = Object.keys(incidentsPerMonthSeasonal).reduce((counts, month) => {
      const season = monthsSeasons[month];
      counts[season] = (counts[season] || 0) + incidentsPerMonthSeasonal[month];
      return counts;
    }, {});
    
    const seasonalChartData = {
      labels: Object.keys(incidentsPerMonthSeasonalMapped),
      datasets: [
        {
          label: 'Seasonal Patterns of Offenses',
          data: Object.values(incidentsPerMonthSeasonalMapped),
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(75,192,192,0.6)',
          hoverBorderColor: 'rgba(75,192,192,1)',
        },
      ],
    };

    const filteredSeasonalData = data.filter(item => monthsSeasons[item.month] === selectedSeason);
    const seasonCounts = filteredSeasonalData.reduce((counts, item) => {
      counts[item.year] = (counts[item.year] || 0) + 1;
      return counts;
  }, {});

    const selectiveSeasonalChartData = {
    labels: Object.keys(seasonCounts),
    datasets: [
      {
        label: `Data for ${selectedSeason}`,
        data: Object.values(seasonCounts),
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.6)',
        hoverBorderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
  <div className="container text-white mx-auto px-4 pt-4 bg-gray-900">
    <h2 className="text-3xl font-bold mb-2">Temporal Analysis</h2>
    <p className="mb-4 pb-4">Lorem Ipsum hey this is temporal</p>
    <div className="flex flex-wrap -mx-2 mb-4">
      <div className="w-1/2 px-2">
        <label htmlFor="year-select" className="block mb-2 text-sm text-white font-medium">
          Year:
        </label>
        <input
          type="number"
          id="year-select"
          value={year}
          onChange={handleYearChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      </div>
      <div className="w-1/2 px-2">
        <label htmlFor="season-select" className="block mb-2 text-sm font-medium text-white">
          Season:
        </label>
        <select
          id="season-select"
          value={selectedSeason}
          onChange={handleSeasonChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option value="Winter">Winter</option>
          <option value="Spring">Spring</option>
          <option value="Summer">Summer</option>
          <option value="Fall">Fall</option>
        </select>
      </div>
    </div>
    <div className="flex flex-wrap -mx-2">
      <div className="w-full px-2 mt-4 justify-end">
        <div className="flex justify-between">
          <div className="flex justify-end">
            <button
              onClick={toggleMonthlyChart}
              className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-4"
            >
              {isMonthlyChartVisible ? 'Hide' : 'Show'} Monthly Chart
            </button>
            <button
              onClick={toggleYearlyChart}
              className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              {isYearlyChartVisible ? 'Hide' : 'Show'} Yearly Chart
            </button>
          </div>
        </div>
        <div className="flex flex-wrap -mx-2">
          <div className="w-1/2 px-2 mt-4">
            {isMonthlyChartVisible && <Bar data={monthlyChartData} />}
          </div>
          <div className="w-1/2 px-2 mt-4">
            {isYearlyChartVisible && <Bar data={yearlyChartData} />}
          </div>
        </div>
      </div>
    </div>
    <div className="flex flex-wrap -mx-2">
      <div className="w-full px-2 mt-4">
        <div className="flex justify-between">
          <div className="flex">
            <button
              onClick={toggleSeasonalChart}
              className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-4"
            >
              {isSeasonalChartVisible ? 'Hide' : 'Show'} Seasonal Chart
            </button>
            <button
              onClick={toggleSelectiveSeasonalChart}
              className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              {isSelectiveSeasonalChartVisible ? 'Hide' : 'Show'} Selective Seasonal Chart
            </button>
          </div>
        </div>
        <div className="flex flex-wrap -mx-2">
          <div className="w-1/2 px-2 mt-4">
            {isSeasonalChartVisible && <Bar data={seasonalChartData} />}
          </div>
          <div className="w-1/2 px-2 mt-4">
            {isSelectiveSeasonalChartVisible && <Bar data={selectiveSeasonalChartData} />}
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default TemporalAnalysis;
