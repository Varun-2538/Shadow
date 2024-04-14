const express = require('express');
const cors = require('cors');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Get the project directory
const projectDir = path.dirname(path.dirname(path.dirname(__filename)));

// Utility function to read CSV and filter based on selection
const readCSV = (filterColumn = null, filterValue = null) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const csvFilePath = path.join(projectDir, 'Gallants-KSP', 'heatmap-backend', 'dataset', 'updated_ml_model_ready_dataset.csv');
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        if (!filterColumn || row[filterColumn] === filterValue) {
          results.push(row);
        }
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', reject);
  });
};

// Endpoint to get unique district names
app.get('/api/districts', async (req, res) => {
  try {
    const data = await readCSV();
    const districts = [...new Set(data.map(item => item.district_name))];
    res.json(districts);
  } catch (error) {
    res.status(500).send('Error reading CSV file');
  }
});

// Endpoint to get unit names based on the selected district
app.get('/api/units/:district', async (req, res) => {
  try {
    const { district } = req.params;
    const data = await readCSV('district_name', district);
    const units = [...new Set(data.map(item => item.unitname))];
    res.json(units);
  } catch (error) {
    res.status(500).send('Error reading CSV file');
  }
});

// Endpoint to process data and return frequency of each value for every field
app.post('/api/data-frequency', async (req, res) => {
  try {
    const { selectedDistrict, selectedUnit } = req.body;
    const data = await readCSV();

    const filteredData = data.filter(row =>
      (!selectedDistrict || row.district_name === selectedDistrict) &&
      (!selectedUnit || row.unitname === selectedUnit)
    );

    let frequency = {};
    filteredData.forEach(row => {
      Object.keys(row).forEach(key => {
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
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});