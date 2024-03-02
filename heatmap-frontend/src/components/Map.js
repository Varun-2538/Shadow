import React, { useState } from "react";
import { MapContainer, TileLayer, Circle, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Define the MapEvents component for handling map events
function MapEvents({ onUpdate }) {
  useMapEvents({
    dblclick(e) {
      onUpdate(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Define the HeatMap component
const HeatMap = ({ entries, color, onUpdate }) => {
  const center = [12.9716, 77.5946]; // Center on Bangalore

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: "400px", width: "80%" ,  }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapEvents onUpdate={onUpdate} />
      {entries.map((entry, index) => (
        <Circle
          key={index}
          center={[entry.latitude, entry.longitude]}
          fillColor={color}
          color={color}
          radius={200}
        />
      ))}
    </MapContainer>
  );
};

function Map() {
  const [allegedEntries, setAllegedEntries] = useState([]);
  const [provenEntries, setProvenEntries] = useState([]);
  const [entry, setEntry] = useState({
    latitude: "",
    longitude: "",
    crime: "",
    severity: "1",
    report: "",
  });
  const [mapType, setMapType] = useState("alleged");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = { ...entry };
    if (mapType === "alleged") {
      setAllegedEntries([...allegedEntries, newEntry]);
    } else {
      setProvenEntries([...provenEntries, newEntry]);
    }
    setEntry({
      latitude: "",
      longitude: "",
      crime: "",
      severity: "1",
      report: "",
    }); // Reset form
  };

  const handleDelete = (indexToDelete, type) => {
    if (type === "alleged") {
      setAllegedEntries(
        allegedEntries.filter((_, index) => index !== indexToDelete)
      );
    } else {
      setProvenEntries(
        provenEntries.filter((_, index) => index !== indexToDelete)
      );
    }
  };

  const updateEntry = (lat, lng) => {
    setEntry({ ...entry, latitude: lat.toString(), longitude: lng.toString() });
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
            checked={mapType === "alleged"}
            onChange={() => setMapType("alleged")}
          />{" "}
          Alleged
        </label>
        <label>
          <input
            type="radio"
            value="proven"
            name="mapType"
            checked={mapType === "proven"}
            onChange={() => setMapType("proven")}
          />{" "}
          Proven
        </label>
      </div>
      <form onSubmit={handleSubmit} style={{ margin: "20px" }}>
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
        <input
          type="text"
          value={entry.crime}
          onChange={(e) => setEntry({ ...entry, crime: e.target.value })}
          placeholder="Crime Type"
          required
        />

        {mapType === "proven" && (
          <>
            
            <select
              value={entry.severity}
              onChange={(e) => setEntry({ ...entry, severity: e.target.value })}
              required
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <textarea
              value={entry.report}
              onChange={(e) => setEntry({ ...entry, report: e.target.value })}
              placeholder="Incident Report"
              required
            />
          </>
        )}
        <button type="submit">Add to Map</button>
      </form>
      {mapType === "alleged" ? (
        <>
          <HeatMap
            entries={allegedEntries}
            color="red"
            onUpdate={updateEntry}
          />
          {renderTable(allegedEntries, "alleged", handleDelete)}
        </>
      ) : (
        <>
          <HeatMap
            entries={provenEntries}
            color="green"
            onUpdate={updateEntry}
          />
          {renderTable(provenEntries, "proven", handleDelete)}
        </>
      )}
    </div>
  );
}

function renderTable(entries, type, handleDelete) {
  return (
    <table style={{ width: "100%", marginTop: "20px" }}>
      <thead>
        <tr>
          <th>Serial Number</th>
          <th>Latitude</th>
          <th>Longitude</th>
          {type === "proven" && (
            <>
              <th>Crime Type</th>
              <th>Severity</th>
              <th>Report</th>
            </>
          )}
          {type === "alleged" && (
            <>
              <th>Crime Type</th>
              
              
            </>
          )}
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{entry.latitude}</td>
            <td>{entry.longitude}</td>
            {type === "proven" && (
              <>
                <td>{entry.crime}</td>
                <td>{entry.severity}</td>
                <td>{entry.report}</td>
              </>
            )}
            {type === "alleged" && (
              <>
                <td>{entry.crime}</td>
                
                
              </>
            )}
            <td>
              <button onClick={() => handleDelete(index, type)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Map;
