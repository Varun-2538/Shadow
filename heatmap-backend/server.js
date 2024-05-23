const express = require("express");
const cors = require("cors");
const csv = require("csv-parser");
const bodyParser = require('body-parser');
const fs = require("fs");
const path = require("path");
const app = express();

// Configure CORS for production (update your allowed origins as needed)
const corsOptions = {
  origin: ['https://shadow-gallants.vercel.app'], // Replace with your actual frontend URL for production
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

// Get the absolute path to the dataset directory
const datasetDir = path.join(__dirname, 'dataset');

// Utility function to read CSV and filter based on selection
const readCSV = (filterColumn = null, filterValue = null) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const csvFilePath = path.join(datasetDir, 'merged_data_cleaned.csv');
    
    // Debug logging
    console.log("CSV File Path: ", csvFilePath);

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
      .on("error", (error) => {
        console.error("Error reading CSV file:", error);
        reject(error);
      });
  });
};

app.get("/api/districts", async (req, res) => {
  try {
    const data = await readCSV();
    const districts = [...new Set(data.map((item) => item.district_name))];
    res.json(districts);
  } catch (error) {
    res.status(500).send("Error reading CSV file");
  }
});

const entriesFilePath = path.join(datasetDir, "entries.csv");

// Function to write data to CSV file
const writeDataToCSV = (data) => {
  const headers = Object.keys(data).join(",") + "\n";
  const values = Object.values(data).join(",") + "\n";

  if (!fs.existsSync(entriesFilePath)) {
    fs.writeFileSync(entriesFilePath, headers);
  }
  fs.appendFileSync(entriesFilePath, values);
};

app.post("/api/entries", (req, res) => {
  const entry = req.body;
  writeDataToCSV(entry);
  res.status(201).send("Entry saved to CSV");
});

// Endpoint to get unit names based on the selected district
app.get("/api/units/:district", async (req, res) => {
  try {
    const { district } = req.params;
    const data = await readCSV("district_name", district);
    const units = [...new Set(data.map((item) => item.unitname))];
    res.json(units);
  } catch (error) {
    res.status(500).send("Error reading CSV file");
  }
});

// New endpoint to get beat names based on the selected unit
app.get("/api/beats/:unit", async (req, res) => {
  try {
    const { unit } = req.params;
    const data = await readCSV("unitname", unit);
    const beats = [...new Set(data.map((item) => item.beat_name))];
    res.json(beats);
  } catch (error) {
    res.status(500).send("Error reading CSV file");
  }
});

// Endpoint to get data based on the selected beat
app.get("/api/data-by-beat/:beat", async (req, res) => {
  try {
    const { beat } = req.params;
    const data = await readCSV("beat_name", beat);
    res.json(data);
  } catch (error) {
    res.status(500).send("Error reading CSV file: " + error.message);
  }
});

app.get("/api/crime-by-time/:district/:unit", async (req, res) => {
  try {
    const { district, unit } = req.params;
    const data = await readCSV("district_name", district);
    const filteredData = data.filter(d => d.unitname === unit);
    const timeCounts = filteredData.reduce((acc, row) => {
      const time = row.Offence_From_Time_only;
      if (time) {
        const hour = time.split(':')[0];
        if (!acc[hour]) {
          acc[hour] = { count: 0, crimes: {} };
        }
        acc[hour].count++;
        const crimeType = row.Crime_Type || "Unknown";
        if (!acc[hour].crimes[crimeType]) {
          acc[hour].crimes[crimeType] = 0;
        }
        acc[hour].crimes[crimeType]++;
      }
      return acc;
    }, {});

    const sortedTimes = [];
    for (let i = 0; i < 24; i++) {
      const hourData = timeCounts[i] || { count: 0, crimes: {} };
      const topCrimes = Object.entries(hourData.crimes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(item => `${item[0]} (${item[1]})`);
      sortedTimes.push({
        hour: `${i}:00`,
        count: hourData.count,
        topCrimes: topCrimes.length ? topCrimes.join(", ") : "No data"
      });
    }

    res.json(sortedTimes);
  } catch (error) {
    res.status(500).send("Error processing data by time: " + error.message);
  }
});

app.get("/api/crime-by-month/:district/:unit", async (req, res) => {
  const { district, unit } = req.params;
  const data = await readCSV("district_name", district);
  const filteredData = data.filter(d => d.unitname === unit);

  const monthCounts = filteredData.reduce((acc, row) => {
    const month = row.Offence_From_Date_only.split('-')[1]; // Assumes YYYY-MM-DD format
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const sortedMonths = Object.keys(monthCounts).map(month => ({
    month,
    count: monthCounts[month]
  })).sort((a, b) => a.month - b.month); // Ensure the months are ordered

  res.json(sortedMonths);
});

app.get("/api/crime-by-week/:district/:unit", async (req, res) => {
  const { district, unit } = req.params;
  const data = await readCSV("district_name", district);
  const filteredData = data.filter(d => d.unitname === unit);

  const weekCounts = filteredData.reduce((acc, row) => {
    const date = new Date(row.Offence_From_Date_only);
    const week = getWeekNumber(date); // Function to calculate week number
    acc[week] = (acc[week] || 0) + 1;
    return acc;
  }, {});

  const sortedWeeks = Object.keys(weekCounts).map(week => ({
    week,
    count: weekCounts[week]
  })).sort((a, b) => a.week - b.week); // Ensure the weeks are ordered

  res.json(sortedWeeks);
});

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return weekNo;
}

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

app.post("/api/details", async (req, res) => {
  try {
    const { district, unit, startMonth, endMonth, startTime, endTime } = req.body;
    const data = await readCSV();

    // Filter data based on provided district, unit, and time/month range
    let filteredData = data.filter(
      (row) =>
        (!district || row.district_name === district) &&
        (!unit || row.unitname === unit)
    );

    if (startMonth && endMonth) {
      filteredData = filteredData.filter(
        (row) =>
          parseInt(row.Offence_From_Date_only.split('-')[1]) >= startMonth &&
          parseInt(row.Offence_From_Date_only.split('-')[1]) <= endMonth
      );
    } else if (startTime && endTime) {
      filteredData = filteredData.filter(
        (row) =>
          row.Offence_From_Time_only >= startTime && row.Offence_From_Time_only <= endTime
      );
    }

    // Collect all latitude-longitude pairs with corresponding Crime_Type
    const allLatLong = filteredData
      .filter(item => item.latitude && item.longitude)
      .map(item => ({
        latitude: item.latitude,
        longitude: item.longitude,
        crimeType: item.Crime_Type
      }));

    const topCrimeGroups = getTopOccurrences(filteredData, "crime_group_name");
    const topCrimes = getTopOccurrences(filteredData, "Crime_Type");
    const topMonths = getTopOccurrences(filteredData, "month");

    // Get top accused demographics
    const accusedAge = getTopOccurrences(filteredData, "accused_age", 3);
    const accusedCaste = getTopOccurrences(filteredData, "accused_caste", 3);
    const accusedProfession = getTopOccurrences(filteredData, "accused_profession", 3);

    const details = {
      allLatLong,
      topCrimeGroups,
      topCrimes,
      topMonths,
      demographics: {
        accusedAge,
        accusedCaste,
        accusedProfession
      }
    };

    res.json(details);
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).send("Error fetching details from CSV");
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
    console.error(error);
    res.status(500).send("Server Error");
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
