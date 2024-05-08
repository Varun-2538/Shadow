import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import HeatmapLayer from "./HeatmapLayer";

const Spatial = () => {
  const [districts, setDistricts] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [frequencyData, setFrequencyData] = useState({});
  const [analysisResult, setAnalysisResult] = useState("");
  const [formattedAnalysisText, setFormattedAnalysisText] = useState("");
  const defaultPosition = [16.1882, 75.6958]; // Adjust as needed
  const [collapsibleState, setCollapsibleState] = useState({});

  useEffect(() => {
    // Initialize collapsible state for each field when frequencyData is set
    setCollapsibleState(
      Object.keys(frequencyData).reduce((acc, field) => {
        acc[field] = false; // start all as closed
        return acc;
      }, {})
    );
  }, [frequencyData]);

  const toggleCollapse = (field) => {
    setCollapsibleState(prevState => ({
      ...prevState,
      [field]: !prevState[field]
    }));
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/districts")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setDistricts(response.data);
          setSelectedDistrict(response.data[0] || "");
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
          setSelectedUnit(response.data[0] || "");
        })
        .catch((error) => console.error("Error fetching units:", error));
    }
  }, [selectedDistrict]);

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
    setSelectedUnit("");
  };

  const handleUnitChange = (event) => {
    const value = event.target.value;
    if (value === "All Police Stations") {
      setSelectedUnit("");
    } else {
      setSelectedUnit(value);
    }
  };

  const handleSubmit = () => {
    axios
      .post("http://localhost:5000/api/data-frequency", {
        selectedDistrict,
        selectedUnit,
      })
      .then((response) => {
        setFrequencyData(response.data);
        const newText = generateAnalysisText(response.data);
        setFormattedAnalysisText(newText);
      })
      .catch((error) => console.error("Error posting data:", error));
  };

  // Utility function to format field names
  const formatFieldName = (fieldName) => {
    return fieldName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const renderCharts = () => {
    const excludeFields = [
      "district_name",
      "unitname",
      "crime_no",
      "latitude",
      "longitude",
      "Accused Age"
    ];
    const pieChartFields = ["accused_presentaddress", "victim_presentaddress"];
  
    // Create pairs of fields to be displayed in the same row
    const fieldPairs = Object.entries(frequencyData)
      .filter(([field]) => !excludeFields.includes(field))
      .reduce((result, entry, index, array) => {
        if (index % 2 === 0) {
          // Pair the current entry with the next one or null if it's the last
          result.push(array.slice(index, index + 2));
        }
        return result;
      }, []);
  
    return fieldPairs.map((pair, rowIndex) => (
      <div key={rowIndex} className="flex flex-wrap -mx-2">
        {pair.map(([field, values], index) => {
        // Data for the chart
        const chartData = {
          labels: Object.keys(values),
          datasets: [
            {
              label: `${field} Values`,
              data: Object.values(values),
              backgroundColor: [
                "rgba(255, 99, 132, 0.5)",
                "rgba(54, 162, 235, 0.5)",
                "rgba(255, 206, 86, 0.5)",
                "rgba(75, 192, 192, 0.5)",
                "rgba(153, 102, 255, 0.5)",
                "rgba(255, 159, 64, 0.5)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        };

        return (
          <div
            key={index}
            className="w-full  md:w-1/2 p-2"
          >
            <div className="p-5 border border-gray-200 shadow rounded">
              <button
                onClick={() => toggleCollapse(field)}
                className="flex items-center font-bold text-lg mb-2"
              >
                {collapsibleState[field] ? "▼" : "►"}
                <span className="ml-2">{formatFieldName(field)}</span>
              </button>
              {collapsibleState[field] && (
                <div>
                  {pieChartFields.includes(field) ? (
                    <Pie data={chartData} />
                  ) : (
                    <Bar data={chartData} />
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  ));
};

  const renderUnitOptions = () => {
    let options = units.map((unit) => (
      <option key={unit} value={unit}>
        {unit}
      </option>
    ));
    options.unshift(
      <option key="All Police Stations" value="All Police Stations">
        All Police Stations
      </option>
    );
    return options;
  };

  const generateAnalysisText = (data = frequencyData) => {
    let analysisText = "";
    let customIndex = 0;

    Object.entries(data).forEach(([field, values]) => {
      if (
        [
          "crime_no",
          "district_name",
          "unitname",
          "latitude",
          "longitude",
        ].includes(field)
      ) {
        return;
      }

      customIndex++;
      const formattedField = formatFieldName(field);
      const sortedValues = Object.entries(values).sort((a, b) => b[1] - a[1]);
      const total = sortedValues.reduce((acc, [_, freq]) => acc + freq, 0);
      const topThreeValues = sortedValues.slice(0, 3);

      const topThreeText = topThreeValues
        .map(([value, freq], index) => {
          const percentage = Math.floor((freq / total) * 100);
          return `${index + 1}. ${value}: ${freq} (${percentage}% of total)`;
        })
        .join("; ");

      analysisText += `${customIndex}) Most of the ${formattedField} in this ${selectedDistrict} district and ${
        selectedUnit || "entire district"
      } unit belongs to ${topThreeText}.\n`;
    });

    console.log(analysisText);
    return analysisText;
  };

  const fetchAndDisplayAnalysis = () => {
    axios
      .post("http://localhost:8000/spatial_analysis", {
        analysis_text: formattedAnalysisText,
        district: selectedDistrict,
        police_station: selectedUnit,
      })
      .then((response) => {
        setAnalysisResult(response.data.analysis);
      })
      .catch((error) => {
        console.error("Error fetching analysis:", error);
      });
  };

  return (
    <div className="container text-white mx-auto px-4 pt-4 bg-gray-900">
      <h2 className="text-3xl font-bold mb-2">Spatial Analysis</h2>
      <p className="mb-4 pb-4">Lorem Ipsum hey this is spatial</p>

      <div className="flex flex-wrap -mx-2 mb-4">
        {" "}
        {/* Added this wrapper with flex */}
        <div className="w-1/2 px-2">
          {" "}
          {/* Adjusted width to half of the container */}
          <label
            htmlFor="district-select"
            className="block mb-2 text-sm text-white font-medium"
          >
            District:
          </label>
          <select
            id="district-select"
            value={selectedDistrict}
            onChange={handleDistrictChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
        <div className="w-1/2 px-2">
          {" "}
          {/* Adjusted width to half of the container */}
          <label
            htmlFor="unit-select"
            className="block mb-2 text-sm font-medium text-white"
          >
            Unit:
          </label>
          <select
            id="unit-select"
            value={selectedUnit}
            onChange={handleUnitChange}
            disabled={!selectedDistrict}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            {renderUnitOptions()}
          </select>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Submit
      </button>
      <div className="mt-4" style={{ height: "400px" }}>
        <MapContainer
          center={defaultPosition}
          zoom={9}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* You can add Markers here if you have specific locations to mark within Karnataka */}
          <HeatmapLayer />
        </MapContainer>
      </div>

      <div className="mt-8">
        {Object.keys(frequencyData).length > 0 ? (
          renderCharts()
        ) : (
          <p className="text-gray-500">No data to display</p>
        )}
      </div>

      <button
        onClick={fetchAndDisplayAnalysis}
        className="mt-4 text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Get Analysis
      </button>

      <div className="mt-4">
        <h3 className="text-lg font-bold">Analysis Result:</h3>
        <p>{analysisResult || "Click 'Get Analysis' to view the result."}</p>
      </div>
    </div>
  );
};

export default Spatial;
