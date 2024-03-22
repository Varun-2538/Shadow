// import React, { useEffect } from 'react';
// import { MapContainer, TileLayer } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import HeatmapLayer from './HeatmapLayer';

// const Deployment = () => {
//   const defaultPosition = [14.5204, 75.7224]; // Latitude and Longitude

//   // useEffect(() => {
//   //   // Fetch data from the Flask API
//   //   const fetchData = async () => {
//   //     try {
//   //       const response = await fetch('http://localhost:8000/data');
//   //       const data = await response.json();
//   //       console.log(data);
//   //       // You can process the data further or use it in your component
//   //     } catch (error) {
//   //       console.error('Error fetching data:', error);
//   //     }
//   //   };

//   //   fetchData();
//   // }, []);

//   return (
//     <div className="relative w-full h-screen">
//       <MapContainer center={defaultPosition} zoom={13} className="h-full w-full">
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
//         <HeatmapLayer />
//       </MapContainer>
//     </div>
//   );
// };

// export default Deployment;


// Deployment.js
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import HeatmapLayer from './HeatmapLayer'; // Adjust the import path as necessary
import 'leaflet/dist/leaflet.css';

const Deployment = () => {
  const defaultPosition = [14.5204, 75.7224]; // Latitude and Longitude

  return (
    <div className="relative w-full h-screen">
      <MapContainer center={defaultPosition} zoom={18} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <HeatmapLayer /> {/* Add the HeatmapLayer here */}
      </MapContainer>
    </div>
  );
};

export default Deployment;