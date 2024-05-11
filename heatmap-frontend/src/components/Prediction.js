import React, { useState, useEffect } from "react";
import axios from "axios";

const Prediction = () => {
  const [districts, setDistricts] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [details, setDetails] = useState({});
  const [analysisText, setAnalysisText] = useState("");

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

  // Fetch details based on selected district and unit
  const fetchDetails = () => {
    axios
      .post("http://localhost:5000/api/details", {
        district: selectedDistrict,
        unit: selectedUnit,
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
      topPlaces = [],
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
    Top Places of Occurrence: ${formatTopItems(topPlaces)}
    Top Crime Months: ${formatTopItems(topMonths)}
  `;

    setAnalysisText(analysisText.trim());
  };



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
      </div>
      <button
        onClick={fetchDetails}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Fetch Details
      </button>
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
      </div>
    </div>
  );
};

export default Prediction;
