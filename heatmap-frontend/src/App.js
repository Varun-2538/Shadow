import React, { useState } from 'react';
import './App.css';
import HeatMap from './HeatMap';

function App() {
  const [entry, setEntry] = useState({ latitude: '', longitude: '' });
  const [entries, setEntries] = useState([]);
  const [mapType, setMapType] = useState('alleged'); // New state for map type

  const handleSubmit = (e) => {
    e.preventDefault();
    if (entry.latitude && entry.longitude) {
      setEntries([...entries, { ...entry }]);
      setEntry({ latitude: '', longitude: '' }); // Reset form
    }
  };

  const updateEntry = (lat, lng) => {
    setEntry({ latitude: lat.toString(), longitude: lng.toString() });
  };

  const handleDelete = (indexToDelete) => {
    setEntries(entries.filter((_, index) => index !== indexToDelete));
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
        <button type="submit">Update Map</button>
      </form>
      <div style={{ width: '60%', margin: '0 auto' }}>
        {mapType === 'alleged' ? (
          <HeatMap entries={entries} onUpdate={updateEntry} color="red" />
        ) : (
          <HeatMap entries={entries} onUpdate={updateEntry} color="green" />
        )}
      </div>
      <div>
        {entries.map((entry, index) => (
          <div key={index}>
            Latitude: {entry.latitude}, Longitude: {entry.longitude}
            <button onClick={() => handleDelete(index)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
