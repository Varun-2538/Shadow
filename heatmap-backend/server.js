const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let locationEntries = [];

app.post('/log-entry', (req, res) => {
  const { latitude, longitude } = req.body;
  if (!latitude || !longitude) {
    return res.status(400).send('Missing latitude or longitude');
  }
  locationEntries.push({ latitude, longitude });
  res.status(201).send('Entry logged successfully');
});

app.get('/entries', (req, res) => {
  res.json(locationEntries);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
