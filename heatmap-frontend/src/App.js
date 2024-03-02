import React, { useState } from 'react';
import './App.css';
import HeatMap from './HeatMap';

function App() {
  // Separate state for alleged and proven entries
  const [allegedEntries, setAllegedEntries] = useState([]);
  const [provenEntries, setProvenEntries] = useState([]);
  const [entry, setEntry] = useState({ latitude: '', longitude: '' });
  const [mapType, setMapType] = useState('alleged'); // State to control which map is active

  const handleSubmit = (e) => {
    e.preventDefault();
    if (entry.latitude && entry.longitude) {
      if (mapType === 'alleged') {
        setAllegedEntries([...allegedEntries, { ...entry }]);
      } else {
        setProvenEntries([...provenEntries, { ...entry }]);
      }
      setEntry({ latitude: '', longitude: '' }); // Reset form after submission
    }
  };

  const updateEntry = (lat, lng) => {
    setEntry({ latitude: lat.toString(), longitude: lng.toString() });
  };

  const handleDelete = (indexToDelete, type) => {
    if (type === 'alleged') {
      setAllegedEntries(allegedEntries.filter((_, index) => index !== indexToDelete));
    } else {
      setProvenEntries(provenEntries.filter((_, index) => index !== indexToDelete));
    }
  };

  return (
    <div className="App">
      <h1>Karnataka Heatmap Visualization</h1>
      <div>
        <label>
          <input
            type="radio"
            value="alleged"
            name="mapType"
            checked={mapType === 'alleged'}
            onChange={(e) => setMapType(e.target.value)}
          /> Alleged
        </label>
        <label>
          <input
            type="radio"
            value="proven"
            name="mapType"
            checked={mapType === 'proven'}
            onChange={(e) => setMapType(e.target.value)}
          /> Proven
        </label>
      </div>
      <form onSubmit={handleSubmit} style={{ margin: '20px' }}>
        <input
          type="text"
          value={entry.latitude}
          onChange={(e) => setEntry({ ...entry, latitude: e.target.value })}
          placeholder="Latitude"
          required
        />
        <input
          type="text"
          value={entry.longitude}
          onChange={(e) => setEntry({ ...entry, longitude: e.target.value })}
          placeholder="Longitude"
          required
        />
        <button type="submit">Add to Map</button>
      </form>
      {/* Alleged Map and Log */}
      <div>
        <h2>Alleged Cases</h2>
        <HeatMap entries={allegedEntries} onUpdate={updateEntry} color="red" />
        {renderTable(allegedEntries, 'alleged', handleDelete)}
      </div>
      {/* Proven Map and Log */}
      <div>
        <h2>Proven Cases</h2>
        <HeatMap entries={provenEntries} onUpdate={updateEntry} color="green" />
        {renderTable(provenEntries, 'proven', handleDelete)}
      </div>
    </div>
  );
}

// Helper function to render table for alleged and proven entries
function renderTable(entries, type, handleDelete) {
  return (
    <table style={{ width: '60%', margin: '20px auto' }}>
      <thead>
        <tr>
          <th>Serial Number</th>
          <th>Latitude</th>
          <th>Longitude</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{entry.latitude}</td>
            <td>{entry.longitude}</td>
            <td>
              <button onClick={() => handleDelete(index, type)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default App;
