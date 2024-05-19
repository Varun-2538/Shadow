import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Define the custom marker icon
const customIcon = new L.Icon({
  iconUrl: require("./marker.png"), // Replace with the path to your custom image
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  shadowSize: [41, 41],
  shadowAnchor: [12, 41]
});

const Prediction = () => {
  const [districts, setDistricts] = useState([]);
  const [units, setUnits] = useState([]);
  const [months] = useState([...Array(12).keys()].map((i) => i + 1)); // Array of months 1-12
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [startMonth, setStartMonth] = useState(1); // Default to January
  const [endMonth, setEndMonth] = useState(1); // Default to January
  const [details, setDetails] = useState({});
  const [analysisText, setAnalysisText] = useState("");
  const [selectedCrimeTypes, setSelectedCrimeTypes] = useState(new Set());

  const buttonCondition =
    details.length > 0 &&
    details.some((detail) => detail.latitude !== undefined);

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

  const handleStartMonthChange = (event) => {
    setStartMonth(Number(event.target.value));
  };

  const handleEndMonthChange = (event) => {
    setEndMonth(Number(event.target.value));
  };

  // Fetch details based on selected district, unit, and month range
  const fetchDetails = () => {
    axios
      .post("http://localhost:5000/api/details", {
        district: selectedDistrict,
        unit: selectedUnit,
        startMonth,
        endMonth,
      })
      .then((response) => {
        console.log(response.data);
        setDetails(response.data);
      })
      .catch((error) => console.error("Error fetching details:", error));
  };

  // Generate analysis text based on the fetched data
  const generateAnalysisText = () => {
    if (!details || Object.keys(details).length === 0) {
      console.error("No details available or details are empty");
      return;
    }

    console.log("Details received:", details);

    const {
      topLatLong = [],
      topCrimeGroups = [],
      topCrimes = [],
      topMonths = [],
    } = details;

    const formatTopItems = (items) =>
      items.length > 0
        ? items
            .map((item) => `${item.value} (${item.freq} occurrences)`)
            .join(", ")
        : "No data";

    const analysisText = `
      Top Latitude-Longitude pairs: ${formatTopItems(topLatLong)}
      Top Crime Groups: ${formatTopItems(topCrimeGroups)}
      Top Crimes: ${formatTopItems(topCrimes)}
      Top Crime Months: ${formatTopItems(topMonths)}
    `;

    setAnalysisText(analysisText.trim());
  };

  // Handle crime type checkbox change
  const handleCrimeTypeChange = (crimeType) => {
    setSelectedCrimeTypes((prevSelectedCrimeTypes) => {
      const newSelectedCrimeTypes = new Set(prevSelectedCrimeTypes);
      if (newSelectedCrimeTypes.has(crimeType)) {
        newSelectedCrimeTypes.delete(crimeType);
      } else {
        newSelectedCrimeTypes.add(crimeType);
      }
      return newSelectedCrimeTypes;
    });
  };

  // Filtered markers based on selected crime types
  const filteredMarkers = details.topLatLong
    ? details.topLatLong.filter((latLong) =>
        selectedCrimeTypes.has(latLong.crimeType)
      )
    : [];

  return (
    <div className="container mx-auto px-4 pt-4">
      <h2 className="text-xl font-bold mb-2">Crime Prediction Analysis</h2>
      <div className="mb-4">
        <div>
          <label
            htmlFor="district-select"
            className="block mb-2 text-sm font-medium"
          >
            District:
          </label>
          <select
            id="district-select"
            value={selectedDistrict}
            onChange={handleDistrictChange}
            className="bg-gray-200 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <label
            htmlFor="unit-select"
            className="block mb-2 text-sm font-medium"
          >
            Unit:
          </label>
          <select
            id="unit-select"
            value={selectedUnit}
            onChange={handleUnitChange}
            disabled={!selectedDistrict}
            className="bg-gray-200 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <label
            htmlFor="start-month-select"
            className="block mb-2 text-sm font-medium"
          >
            Start Month:
          </label>
          <select
            id="start-month-select"
            value={startMonth}
            onChange={handleStartMonthChange}
            className="bg-gray-200 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <label
            htmlFor="end-month-select"
            className="block mb-2 text-sm font-medium"
          >
            End Month:
          </label>
          <select
            id="end-month-select"
            value={endMonth}
            onChange={handleEndMonthChange}
            className="bg-gray-200 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <button
        onClick={fetchDetails}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Fetch Details
      </button>
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2">Map View:</h3>
        <MapContainer
          center={[12.9716, 77.5946]} // Default center (Bangalore coordinates)
          zoom={10}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredMarkers.map((latLong, index) => (
            <React.Fragment key={index}>
              <Marker 
                position={[latLong.latitude, latLong.longitude]} 
                icon={customIcon} // Use the custom icon
              >
                <Popup>
                  {`Crime Type: ${latLong.crimeType} (${latLong.latitude}, ${latLong.longitude})`}
                </Popup>
                <Tooltip>
                  {`Crime Type: ${latLong.crimeType}`}
                </Tooltip>
              </Marker>
              <Circle
                center={[latLong.latitude, latLong.longitude]}
                radius={3000} // 5 km radius
                color="red"
                fillColor="red"
                fillOpacity={0.2}
              >
                <Tooltip>
                  {`Crime Type: ${latLong.crimeType}`}
                </Tooltip>
              </Circle>
            </React.Fragment>
          ))}
        </MapContainer>
      </div>
      {buttonCondition && (
        <button
          onClick={generateAnalysisText}
          className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Get Analysis Text
        </button>
      )}
      <div className="mt-4">
        <h3 className="text-lg font-bold">Analysis Result:</h3>
        <p>{analysisText || 'Click "Get Analysis Text" to view the result.'}</p>
        <h3 className="text-lg font-bold">Top 10 Crime Types:</h3>
        <ul>
          {details.topCrimes && details.topCrimes.map((crime, index) => (
            <li key={index}>
              <input 
                type="checkbox" 
                onChange={() => handleCrimeTypeChange(crime.value)} 
              /> 
              {crime.value} - {crime.freq} occurrences
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Prediction;
