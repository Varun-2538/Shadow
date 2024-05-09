import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from "react-chartjs-2";
import "chart.js/auto";
import 'leaflet/dist/leaflet.css';

const TemporalAnalysis = () => {

  const [data, setData] = useState([]);
  const [year, setYear] = useState(2020);
  const [selectedSeason, setSelectedSeason] = useState('Summer');

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
      <>
      <div className="flex items-center justify-center min-h-screen flex-col">
      <input type="number" value={year} onChange={handleYearChange} />
            <Bar data={monthlyChartData} 
            options={{
              title: {
                display: true,
                text: `Monthly Data for ${year}`,
                fontSize: 20
              },
              legend: {
                display: true,
                position: 'right'
              }
            }}/>
            <hr />
            <Bar data={yearlyChartData} />
            <hr />
            <Bar data={seasonalChartData} />
            <hr />
            <select value={selectedSeason} onChange={handleSeasonChange}>
              <option value="Winter">Winter</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
            </select>
            <Bar data={selectiveSeasonalChartData}  options={{
            title: {
              display: true,
              text: `Data for ${selectedSeason}`,
              fontSize: 20
            },
            legend: {
              display: true,
              position: 'right'
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }}/>
      </div>
      </>
    );
};

export default TemporalAnalysis;
