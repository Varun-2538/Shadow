import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const BeatWiseAnalysis = () => {
    const defaultPosition = [14.5204, 75.7224]; // Latitude and Longitude of Karnataka

    return (
      <div className="relative w-full h-screen">
        <MapContainer center={defaultPosition} zoom={13} className="h-full w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Additional map features go here */}
        </MapContainer>
      </div>
    );
};

export default BeatWiseAnalysis;
