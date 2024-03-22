// HeatmapLayer.js
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import { useMap } from 'react-leaflet';

const HeatmapLayer = () => {
  const map = useMap();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/data');
        const data = await response.json();
        const points = data.map(item => [item.latitude, item.longitude, 8]); // Assuming intensity is 1 for all points
        // Log points to the console (can be removed after verification)
        console.log(points);
        // Add a heatmap layer to the map with the fetched points
        const heatLayer = L.heatLayer(points, {
          radius: 25, // Adjust the radius as needed
          blur: 15, // Adjust the blur as needed
          maxZoom: 17, // Adjust maxZoom as needed
        }).addTo(map);

        // Optional: if you want to remove the heatmap layer later, you can store it in a state and use map.removeLayer(heatLayer)
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    fetchData();
  }, [map]);

  return null;
};

export default HeatmapLayer;