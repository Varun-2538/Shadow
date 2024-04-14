const express = require("express");
const cors = require("cors");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const app = express();

// Configure CORS for production (update your allowed origins as needed)
const corsOptions = {
  origin: ["https://gallants-ksp-2.onrender.com"], // Replace with your actual frontend URL for production
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());

// Set a fixed port number
const port = 5000;

// Define the CSV file path directly
const csvFilePath = path.join(
  __dirname,
  "dataset",
  "updated_ml_model_ready_dataset.csv"
);

// Utility function to read CSV and filter based on selection
const readCSV = (filterColumn = null, filterValue = null) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        if (!filterColumn || row[filterColumn] === filterValue) {
          results.push(row);
        }
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", reject);
  });
};

// Endpoint to get unique district names
app.get("/api/districts", async (req, res) => {
  try {
    const data = await readCSV();
    const districts = [...new Set(data.map((item) => item.district_name))];
    res.json(districts);
  } catch (error) {
    console.error("Failed to read districts:", error);
    res.status(500).send("Error reading CSV file");
  }
});

// Endpoint to get unit names based on the selected district
app.get("/api/units/:district", async (req, res) => {
  try {
    const { district } = req.params;
    const data = await readCSV("district_name", district);
    const units = [...new Set(data.map((item) => item.unitname))];
    res.json(units);
  } catch (error) {
    console.error("Failed to read units:", error);
    res.status(500).send("Error reading CSV file");
  }
});

// Endpoint to process data and return frequency of each value for every field
app.post("/api/data-frequency", async (req, res) => {
  try {
    const { selectedDistrict, selectedUnit } = req.body;
    const data = await readCSV();

    const filteredData = data.filter(
      (row) =>
        (!selectedDistrict || row.district_name === selectedDistrict) &&
        (!selectedUnit || row.unitname === selectedUnit)
    );

    let frequency = {};
    filteredData.forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (!frequency[key]) {
          frequency[key] = {};
        }
        if (!frequency[key][row[key]]) {
          frequency[key][row[key]] = 0;
        }
        frequency[key][row[key]] += 1;
      });
    });

    res.json(frequency);
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).send("Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
