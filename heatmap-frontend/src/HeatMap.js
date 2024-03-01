import React from 'react';
import { MapContainer, TileLayer, Circle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapEvents({ onUpdate }) {
  useMapEvents({
    dblclick(e) {
      onUpdate(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const HeatMap = ({ entries, onUpdate }) => {
  const center = [12.9716, 77.5946]; // Center on Bangalore

  return (
    <MapContainer center={center} zoom={12} style={{ height: '400px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapEvents onUpdate={onUpdate} />
      {entries.map((entry, index) => (
        <Circle
          key={index}
          center={[entry.latitude, entry.longitude]}
          fillColor="red"
          color="red"
          radius={200}
        />
      ))}
    </MapContainer>
  );
};

export default HeatMap;
