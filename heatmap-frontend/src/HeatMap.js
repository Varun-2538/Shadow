import React from 'react';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const center = [15.3173, 75.7139]; // Center on Karnataka

const HeatMap = ({ entries }) => {
  return (
    <MapContainer center={center} zoom={7} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {entries.map((entry, index) => (
        <Circle
          key={index}
          center={[entry.latitude, entry.longitude]}
          fillColor="red"
          color="red"
          radius={200} // Adjust based on your preference
        />
      ))}
    </MapContainer>
  );
};

export default HeatMap;
