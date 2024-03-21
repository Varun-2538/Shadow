import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Deployment from './components/Deployment.js';
import Spatial from './components/Spatial.js';
import Prediction from './components/Prediction.js';
import Map from './components/Map'; // Assuming your Map component is saved in a components folder

const App = () => {
  return (
    <Router>
      <div className="App">
        <div className="sidebar">
          <Link to="/Spatial">Spatial</Link>
          <Link to="/Prediction">Prediction plan</Link>
          <Link to="/Deployment">Deployment</Link>
          <Link to="/map">Data Entry</Link>
        </div>
        <div className="main-content">
          <Routes>
            <Route path="/Prediction" element={<Prediction />} />
            <Route path="/Spatial" element={<Spatial />} />
            <Route path="/Deployment" element={<Deployment />} />
            <Route path="/map" element={<Map />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
