import React, { useState } from 'react';
import './App.css';
import HeatMap from './HeatMap';

function App() {
  const [entry, setEntry] = useState({ latitude: '', longitude: '' });
  const [entries, setEntries] = useState([]);

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
      <form onSubmit={handleSubmit} style={{margin: '20px'}}>
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
        <HeatMap entries={entries} onUpdate={updateEntry} />
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
