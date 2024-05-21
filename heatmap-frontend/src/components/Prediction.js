

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ProgressBar } from "react-loader-spinner";

// Define the custom marker icon
const customIcon = new L.Icon({
  iconUrl: require("./marker.png"), // Replace with the path to your custom image
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

const Prediction = () => {
  const [districts, setDistricts] = useState([]);
  const [units, setUnits] = useState([]);
  const [months] = useState([...Array(12).keys()].map((i) => i + 1)); // Array of months 1-12
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [startMonth, setStartMonth] = useState(null); // Default to January
  const [endMonth, setEndMonth] = useState(null); // Default to January
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [filterType, setFilterType] = useState("month"); // "month" or "time"
  const [details, setDetails] = useState({});
  const [selectedCrimeTypes, setSelectedCrimeTypes] = useState({});
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [analysisResult, setAnalysisResult] = useState("");
  const [analysisText, setAnalysisText] = useState(""); 
  const [showReasoningButton, setShowReasoningButton] = useState(false);

  const timeRanges = [
    { label: "6-10am", start: "06:00:00", end: "10:00:00" },
    { label: "10am-2pm", start: "10:00:00", end: "14:00:00" },
    { label: "2-6pm", start: "14:00:00", end: "18:00:00" },
    { label: "6-10pm", start: "18:00:00", end: "22:00:00" },
    { label: "10pm-2am", start: "22:00:00", end: "02:00:00" },
    { label: "2-6am", start: "02:00:00", end: "06:00:00" },
  ];

  const buttonCondition = details.allLatLong && details.allLatLong.length > 0;

  // Fetch districts
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

  // Fetch units based on selected district
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
    setSelectedUnit(""); // Reset unit selection
  };

  const handleUnitChange = (event) => {
    setSelectedUnit(event.target.value);
  };

  const handleMonthChange = (type, value) => {
    if (type === "start") setStartMonth(Number(value));
    if (type === "end") setEndMonth(Number(value));
    setSelectedTimeRange(null);
    setFilterType("month");
  };

  const handleTimeRangeChange = (event) => {
    const selectedRange = timeRanges.find(
      (range) => range.label === event.target.value
    );
    setSelectedTimeRange(selectedRange);
    setFilterType("time");
    setStartMonth(null);
    setEndMonth(null);
  };

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    setStartMonth(null);
    setEndMonth(null);
    setSelectedTimeRange(null);
  };

  // Fetch details based on selected district, unit, and time/month range
  const fetchDetails = () => {
    setShowProgressBar(true);
    const params = {
      district: selectedDistrict,
      unit: selectedUnit,
    };

    if (filterType === "time" && selectedTimeRange) {
      params.startTime = selectedTimeRange.start;
      params.endTime = selectedTimeRange.end;
    } else if (filterType === "month") {
      params.startMonth = startMonth;
      params.endMonth = endMonth;
    }

    axios
      .post("http://localhost:5000/api/details", params)
      .then((response) => {
        console.log(response.data);
        setDetails(response.data);
        generateAnalysisText(response.data);
        setShowProgressBar(false);
        setShowReasoningButton(true);
      })
      .catch((error) => {
        console.error("Error fetching details:", error);
        setShowProgressBar(false);
      });
  };

  // Helper function to calculate top occurrences
  const getTopOccurrences = (data, key, count = 10) => {
    const frequency = {};
    data.forEach((item) => {
      const value = item[key];
      if (value && value.trim() !== "" && !/^[-,\s]*$/.test(value)) {
        if (!frequency[value]) {
          frequency[value] = 0;
        }
        frequency[value] += 1;
      }
    });
    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([value, freq]) => ({ value, freq }));
  };

  // Generate analysis text based on the fetched data
  const generateAnalysisText = () => {
    if (!details || Object.keys(details).length === 0) {
      console.error("No details available or details are empty");
      return;
    }
  
    console.log("Details received:", details);
  
    const {
      allLatLong = [],
      topCrimes = []
    } = details;
  
    const formatTopItems = (items) =>
      items.length > 0
        ? items
            .map((item) => `${item.value} (${item.freq} occurrences)`)
            .join(", ")
        : "No data";
  
    const getCrimeSpecificDemographics = (crimeType, key) => {
      const crimeSpecificData = allLatLong.filter(latLong => latLong.crimeType === crimeType);
      return getTopOccurrences(crimeSpecificData, key, 3);
    };
  
    const analysis = topCrimes.map((crime, index) => {
      const ageAnalysis = formatTopItems(getCrimeSpecificDemographics(crime.value, 'accused_age'));
      const casteAnalysis = formatTopItems(getCrimeSpecificDemographics(crime.value, 'accused_caste'));
      const professionAnalysis = formatTopItems(getCrimeSpecificDemographics(crime.value, 'accused_profession'));
  
      return `${index + 1}. For the selected ${filterType === "time" ? `time range ${selectedTimeRange.label}` : `month range ${startMonth}-${endMonth}`}, there were ${crime.freq} ${crime.value} cases recorded where accused demographics are: Accused age: ${ageAnalysis}, Accused caste: ${casteAnalysis}, Accused profession: ${professionAnalysis}`;
    }).join("<br /><br />");
  
    setAnalysisText(analysis.trim());
  
    // Post request to get detailed analysis
    setShowProgressBar(true);
    axios
      .post("http://localhost:8000/crime_prediction", {
        analysis_text: analysis.trim(),
        district: selectedDistrict,
        police_station: selectedUnit,
      })
      .then((response) => {
        setShowProgressBar(false);
        const analysis = response.data.analysis;
        const bulletPoints = analysis
          .split("\n")
          .map((point, index) => <li key={index}>{point}</li>);
        setAnalysisResult(<ul>{bulletPoints}</ul>);
      })
      .catch((error) => {
        setShowProgressBar(false);
        console.error("Error fetching analysis:", error);
      });
  };
  

  // Handle crime type checkbox change
  const handleCrimeTypeChange = (event, crimeType) => {
    setSelectedCrimeTypes((prevSelected) => ({
      ...prevSelected,
      [crimeType]: event.target.checked,
    }));
  };

  // Calculate the total number of cases for the top 10 crime types
  const totalCases = details.topCrimes
    ? details.topCrimes.reduce((total, crime) => total + crime.freq, 0)
    : 0;

  return (
    <div className="min-h-screen container bg-gradient-to-b from-indigo-950 via-gray-800 to-stone-950 text-white mx-auto px-4 pt-4 sm:px-2">
      <h2 className="text-3xl pt-1 font-bold mb-4">Crime Prediction Analysis</h2>
  
      <div className="flex justify-center mb-4">
        <button
          onClick={() => handleFilterTypeChange("month")}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 ${filterType === "month" ? "opacity-50" : ""}`}
        >
          Month Filter
        </button>
        <button
          onClick={() => handleFilterTypeChange("time")}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${filterType === "time" ? "opacity-50" : ""}`}
        >
          Time Range Filter
        </button>
      </div>
  
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
            onChange={handleDistrictChange}
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
            className="block mb-2 text-sm sm:text-xs text-white font-medium"
          >
            Unit:
          </label>
          <select
            id="unit-select"
            value={selectedUnit}
            onChange={handleUnitChange}
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
  
      {filterType === "month" ? (
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-full sm:w-1/2 px-2">
            <label
              htmlFor="start-month-select"
              className="block mb-2 text-sm sm:text-xs text-white font-medium"
            >
              Start Month:
            </label>
            <select
              id="start-month-select"
              value={startMonth || ""}
              onChange={(e) => handleMonthChange("start", e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-1/2 px-2">
            <label
              htmlFor="end-month-select"
              className="block mb-2 text-sm sm:text-xs text-white font-medium"
            >
              End Month:
            </label>
            <select
              id="end-month-select"
              value={endMonth || ""}
              onChange={(e) => handleMonthChange("end", e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-full sm:w-1/2 px-2">
            <label
              htmlFor="time-range-select"
              className="block mb-2 text-sm sm:text-xs text-white font-medium"
            >
              Time Range:
            </label>
            <select
              id="time-range-select"
              value={selectedTimeRange ? selectedTimeRange.label : ""}
              onChange={handleTimeRangeChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="" disabled>Select time range</option>
              {timeRanges.map((range) => (
                <option key={range.label} value={range.label}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
  
      <button
        onClick={fetchDetails}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Fetch Details
      </button>
  
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2">Map View:</h3>
        <MapContainer
          center={[14.5204, 75.7224]}
          zoom={10}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {details.allLatLong &&
            details.allLatLong.map(
              (latLong, index) =>
                selectedCrimeTypes[latLong.crimeType] && (
                  <React.Fragment key={index}>
                    <Marker
                      position={[latLong.latitude, latLong.longitude]}
                      icon={customIcon} // Use the custom icon
                    >
                      <Popup>
                        {`Crime Type: ${latLong.crimeType} (${latLong.latitude}, ${latLong.longitude})`}
                      </Popup>
                      <Tooltip>{`Crime Type: ${latLong.crimeType}`}</Tooltip>
                    </Marker>
                    <Circle
                      center={[latLong.latitude, latLong.longitude]}
                      radius={3000} // 3 km radius
                      color="red"
                      fillColor="red"
                      fillOpacity={0.2}
                    >
                      <Tooltip>{`Crime Type: ${latLong.crimeType}`}</Tooltip>
                    </Circle>
                  </React.Fragment>
                )
            )}
        </MapContainer>
      </div>
      {buttonCondition && (
        <button
          onClick={generateAnalysisText}
          className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Get Prediction
        </button>
      )}
  
      {showProgressBar && (
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
  
      <div className="mt-4">
        {/* <h3 className="text-lg font-bold">Analysis Result:</h3>
        <div dangerouslySetInnerHTML={{ __html: analysisText || 'Click "Get Analysis Text" to view the result.' }} /> */}
        {/* <div className="mt-4">
          <h3 className="text-lg font-bold">Detailed Analysis Result:</h3>
          <div>{analysisResult || "Click 'Get Analysis Text' to view the result."}</div>
        </div> */}
        <h3 className="text-lg font-bold">Prediction and Deployment plan for Top 10 crime :</h3>
        <ul>
          {details.topCrimes &&
            details.topCrimes.map((crime, index) => (
              <li key={index}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedCrimeTypes[crime.value] || false}
                    onChange={(e) => handleCrimeTypeChange(e, crime.value)}
                  />
                  {` ${crime.value} (${(
                    (crime.freq / totalCases) * 100
                  ).toFixed(2)}% of the police force should get deployed to corresponding latitude and longitude positions show in map to control ${crime.value})`}
                </label>
              </li>
            ))}
        </ul>
        <div className="mt-4">
          <h3 className="text-lg font-bold">Detailed Analysis Result:</h3>
          <div>{analysisResult || "Click 'Get Analysis Text' to view the result."}</div>
        </div>
      </div>
    </div>
  );
}

  export default Prediction;