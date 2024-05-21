import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { ProgressBar } from "react-loader-spinner";

const TemporalAnalysis = () => {
  const [districts, setDistricts] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [timeData, setTimeData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [weekData, setWeekData] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [monthChartData, setMonthChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [weekChartData, setWeekChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [showHourProgressBar, setShowHourProgressBar] = useState(false);
  const [showMonthProgressBar, setShowMonthProgressBar] = useState(false);
  const [showWeekProgressBar, setShowWeekProgressBar] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/districts")
      .then((response) => {
        setDistricts(response.data);
        if (response.data.length > 0) {
          setSelectedDistrict(response.data[0]);
        }
      })
      .catch((error) => console.error("Error fetching districts:", error));
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      axios
        .get(`http://localhost:5000/api/units/${selectedDistrict}`)
        .then((response) => {
          setUnits(response.data);
          if (response.data.length > 0) {
            setSelectedUnit(response.data[0]);
          } else {
            setSelectedUnit("");
          }
        })
        .catch((error) => console.error("Error fetching units:", error));
    }
  }, [selectedDistrict]);

  const handleFetchData = () => {
    setShowHourProgressBar(true);
    if (selectedDistrict && selectedUnit) {
      axios
        .get(
          `http://localhost:5000/api/crime-by-time/${selectedDistrict}/${selectedUnit}`
        )
        .then((response) => {
          const newData = response.data;
          if (JSON.stringify(newData) !== JSON.stringify(timeData)) {
            setTimeData(newData);
            const data = {
              labels: newData.map((d) => d.hour),
              datasets: [
                {
                  label: "Number of Crimes by Hour",
                  data: newData.map((d) => d.count),
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                  borderColor: "rgba(255, 99, 132, 1)",
                  borderWidth: 2,
                  fill: false,
                  tension: 0.4,
                },
              ],
            };
            setChartData(data);
          }
          setShowHourProgressBar(false);
        })
        .catch((error) => {
          console.error("Error fetching time data:", error);
          setShowHourProgressBar(false);
        });
    }
  };

  const handleFetchMonthData = () => {
    setShowMonthProgressBar(true);
    if (selectedDistrict && selectedUnit) {
      axios
        .get(
          `http://localhost:5000/api/crime-by-month/${selectedDistrict}/${selectedUnit}`
        )
        .then((response) => {
          const newData = response.data;
          if (JSON.stringify(newData) !== JSON.stringify(monthData)) {
            setMonthData(newData);
            const data = {
              labels: newData.map((d) => `${d.month}`),
              datasets: [
                {
                  label: "Number of Crimes by Month",
                  data: newData.map((d) => d.count),
                  backgroundColor: "rgba(54, 162, 235, 0.2)",
                  borderColor: "rgba(54, 162, 235, 1)",
                  borderWidth: 2,
                  fill: false,
                  tension: 0.4,
                },
              ],
            };
            setMonthChartData(data);
          }
          setShowMonthProgressBar(false);
        })
        .catch((error) => {
          console.error("Error fetching month data:", error);
          setShowMonthProgressBar(false);
        });
    }
  };

  const handleFetchWeekData = () => {
    setShowWeekProgressBar(true);
    if (selectedDistrict && selectedUnit) {
      axios
        .get(
          `http://localhost:5000/api/crime-by-week/${selectedDistrict}/${selectedUnit}`
        )
        .then((response) => {
          const newData = response.data;
          if (JSON.stringify(newData) !== JSON.stringify(weekData)) {
            setWeekData(newData);
            const data = {
              labels: newData.map((d) => `Week ${d.week}`),
              datasets: [
                {
                  label: "Number of Crimes by Week",
                  data: newData.map((d) => d.count),
                  backgroundColor: "rgba(153, 102, 255, 0.2)",
                  borderColor: "rgba(153, 102, 255, 1)",
                  borderWidth: 2,
                  fill: false,
                  tension: 0.4,
                },
              ],
            };
            setWeekChartData(data);
          }
          setShowWeekProgressBar(false);
        })
        .catch((error) => {
          console.error("Error fetching week data:", error);
          setShowWeekProgressBar(false);
        });
    }
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const renderCharts = (data, title) => (
    <div className="w-full p-2">
      <div className="p-5 backdrop-blur-sm bg-slate-900 shadow-lg shadow-indigo-900 rounded">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <Line data={data} options={options} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen container bg-gradient-to-b from-indigo-950 via-gray-800 to-stone-950 text-white mx-auto px-4 pt-4">
      <h2 className="text-3xl pt-1 font-bold mb-1">
        Temporal Analysis of Crimes
      </h2>
      <p className="pb-7 text-lg ">
        Strategic Insights for Improved Police Patrolling
      </p>
      <div className="flex flex-wrap -mx-2 mb-4">
        <div className="w-full sm:w-1/2 px-2">
          <label
            htmlFor="district-select"
            className="block mb-2 text-sm sm:text-xs text-white font-medium"
          >
            District:
          </label>
          <select
            id="district-select"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-1/2 px-2">
          <label
            htmlFor="unit-select"
            className="block mb-2 text-sm sm:text-xs font-medium text-white"
          >
            Unit:
          </label>
          <select
            id="unit-select"
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            disabled={!selectedDistrict}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="my-4">
        <button
          onClick={handleFetchData}
          className="mx-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Fetch Hourly Data
        </button>
        {showHourProgressBar && (
          <ProgressBar
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="progress-bar-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        )}
        <button
          onClick={handleFetchMonthData}
          className="mx-2 px-4 py-2 bg-green-500 text-white rounded"
        >
          Fetch Monthly Data
        </button>
        {showMonthProgressBar && (
          <ProgressBar
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="progress-bar-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        )}
        <button
          onClick={handleFetchWeekData}
          className="mx-2 px-4 py-2 bg-purple-500 text-white rounded"
        >
          Fetch Weekly Data
        </button>
        {showWeekProgressBar && (
          <ProgressBar
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="progress-bar-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        )}
      </div>
      {chartData.labels.length > 0 &&
        renderCharts(chartData, "Hourly Crime Data")}
      {monthChartData.labels.length > 0 &&
        renderCharts(monthChartData, "Monthly Crime Data")}
      {weekChartData.labels.length > 0 &&
        renderCharts(weekChartData, "Weekly Crime Data")}
    </div>
  );
};

export default TemporalAnalysis;
