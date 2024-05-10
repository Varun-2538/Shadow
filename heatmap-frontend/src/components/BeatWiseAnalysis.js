import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

const BeatWiseAnalysis = () => {
  const [districts, setDistricts] = useState([]);
  const [units, setUnits] = useState([]);
  const [beats, setBeats] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedBeat, setSelectedBeat] = useState("");
  const [chartData, setChartData] = useState([]);
  const [collapsibleState, setCollapsibleState] = useState({});
  const [analysisText, setAnalysisText] = useState("");
  const [analysisResult, setAnalysisResult] = useState(""); // State to hold analysis result from server

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/districts")
      .then((response) => {
        setDistricts(response.data);
        setSelectedDistrict(response.data[0] || "");
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

  useEffect(() => {
    if (selectedUnit) {
      axios
        .get(`http://localhost:5000/api/beats/${selectedUnit}`)
        .then((response) => {
          setBeats(response.data);
          setSelectedBeat(response.data[0] || "");
        })
        .catch((error) => console.error("Error fetching beats:", error));
    }
  }, [selectedUnit]);

  const handleSubmit = () => {
    if (selectedBeat) {
      axios
        .get(`http://localhost:5000/api/data-by-beat/${encodeURIComponent(selectedBeat)}`)
        .then((response) => {
          prepareChartData(response.data);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  };

  const generateColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.5)`;
  };

  const formatFieldName = (field) => {
    return field.replace(/_/g, ' ').toLowerCase();
  };

  const prepareChartData = (data) => {
    const fields = [
      "place_of_offence",
      "actsection",
      "fir_type",
      "latitude",
      "longitude",
      "Crime_Type",
      "victim_profession",
      "victim_caste",
      "accused_profession",
      "accused_caste",
    ];
    let chartDataSets = fields.map((field) => {
      const countData = data.reduce((acc, curr) => {
        if (curr[field] !== "null") {
          acc[curr[field]] = (acc[curr[field]] || 0) + 1;
        }
        return acc;
      }, {});
  
      const labels = Object.keys(countData);
      const colors = labels.map(() => generateColor());
  
      return {
        field: field,
        labels: labels,
        countData: countData,
        datasets: [
          {
            label: `${formatFieldName(field)} Frequency`,
            data: Object.values(countData),
            backgroundColor: colors,
            borderColor: colors.map(color => color.replace("0.5", "1")),
            borderWidth: 1,
            barThickness: 10,
            borderRadius: 5,
            borderSkipped: false,
          },
        ],
      };
    });
  
    setChartData(chartDataSets);
    const newCollapsibleState = {};
    chartDataSets.forEach(({ field }) => {
      newCollapsibleState[field] = true;
    });
    setCollapsibleState(newCollapsibleState);
  };
  
  useEffect(() => {
    if (chartData.length > 0) {
      generateAnalysisText(chartData);
    }
  }, [chartData]); // Dependency on chartData to ensure it runs after update
  

  const generateAnalysisText = (chartDataSets) => {
    let text = "";
  
    chartDataSets.forEach((chart, index) => {
      const { field, countData } = chart;
      const formattedField = formatFieldName(field);
      const sortedValues = Object.entries(countData).sort((a, b) => b[1] - a[1]);
      const total = sortedValues.reduce((acc, [_, freq]) => acc + freq, 0);
      const topThreeValues = sortedValues.slice(0, 3);
  
      const topThreeText = topThreeValues.map(([value, freq], idx) => {
        const percentage = Math.floor((freq / total) * 100);
        return `${idx + 1}. ${value}: ${freq} (${percentage}% of total)`;
      }).join("; ");
  
      text += `${index + 1}) In the beat of ${selectedUnit} unit of ${selectedDistrict} district, the top 3 frequencies in ${formattedField} are: ${topThreeText}.\n`;
    });
  
    setAnalysisText(text); // Ensure this line is working as expected
  };

  const fetchAndDisplayAnalysis = () => {
    axios
      .post("http://localhost:8000/beatwise_analysis", {
        analysis_text: analysisText, // Correct variable name for the analysis text
        district: selectedDistrict,
        unit: selectedUnit,
        beat: selectedBeat
      })
      .then((response) => {
        setAnalysisResult(response.data.analysis); // Assuming 'analysis' is the field in response
      })
      .catch((error) => {
        console.error("Error posting analysis:", error);
      });
  };
  
  

  const chartConfig = (data, chartType = "bar") => {
    const commonOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    };

    const barOptions = {
      ...commonOptions,
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            display: false,
          },
        },
      },
    };

    return {
      type: chartType,
      options: chartType === "bar" ? barOptions : commonOptions,
      data: {
        labels: data.labels,
        datasets: data.datasets,
      },
    };
  };

  const renderChart = (data, field) => {
    const chartTypes = {
      actsection: "pie",
      place_of_offence: "pie",
    };
    const chartType = chartTypes[field] || "bar"; // Default to bar if not specified

    const ChartComponent = chartType === "pie" ? Pie : Bar;

    return <ChartComponent {...chartConfig(data, chartType)} />;
  };

  const toggleCollapse = (field) => {
    setCollapsibleState((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };



  const renderCharts = () => {
    const pairedCharts = [];
    for (let i = 0; i < chartData.length; i += 2) {
      pairedCharts.push(chartData.slice(i, i + 2));
    }

    return pairedCharts.map((pair, index) => (
      <div key={index} className="flex flex-wrap -mx-2">
        {pair.map((data) => (
          <div key={data.field} className="w-full md:w-1/2 px-2">
            <div className="p-5 m-2 backdrop-blur-sm bg-slate-900 shadow-lg shadow-indigo-900 rounded">
              <button
                onClick={() => toggleCollapse(data.field)}
                className="flex items-center font-bold text-lg pb-2 mb-2"
              >
                {collapsibleState[data.field] ? "►" : "▼"}{" "}
                {data.field.replace("_", " ")}
              </button>
              <div
                className={`${
                  collapsibleState[data.field] ? "hidden" : ""
                } p-4  rounded`}
              >
                {renderChart(data, data.field)}
              </div>
            </div>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="container bg-gradient-to-b min-h-screen from-indigo-950 via-gray-800 to-stone-950 text-white mx-auto px-4 pt-4">
      <h2 className="text-3xl pt-1 font-bold mb-4 font-serif pb-2">
        Select District, Unit, and Beat for Analysis
      </h2>
      <div className="flex flex-wrap -mx-2 mb-4">
        <div className="w-1/3 px-2">
          <label
            htmlFor="district-select"
            className="block mb-2 text-sm font-medium text-white"
          >
            District:
          </label>
          <select
            id="district-select"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
        <div className="w-1/3 px-2">
          <label
            htmlFor="unit-select"
            className="block mb-2 text-sm font-medium text-white"
          >
            Unit:
          </label>
          <select
            id="unit-select"
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            disabled={!selectedDistrict}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
        <div className="w-1/3 px-2">
          <label
            htmlFor="beat-select"
            className="block mb-2 text-sm font-medium text-white"
          >
            Beat:
          </label>
          <select
            id="beat-select"
            value={selectedBeat}
            onChange={(e) => setSelectedBeat(e.target.value)}
            disabled={!selectedUnit}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            {beats.map((beat) => (
              <option key={beat} value={beat}>
                {beat}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full px-2 mt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </div>
      {renderCharts()}
      <div className="mt-4 p-4  shadow rounded">
        <h3 className="text-lg font-semibold mb-2">Analysis Summary:</h3>
        <pre className="whitespace-pre-wrap break-words overflow-hidden max-w-full">
          {analysisText}
        </pre>
        <button
          onClick={fetchAndDisplayAnalysis}
          className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Get Detailed Analysis
        </button>
        <div className="mt-4">
          <h4 className="text-lg font-bold">Detailed Analysis Result:</h4>
          <p>
            {analysisResult ||
              "Click 'Get Detailed Analysis' to view the result."}
          </p>
        </div>
      </div>
    </div>
  );
  
};

export default BeatWiseAnalysis;
