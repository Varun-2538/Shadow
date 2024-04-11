import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import Deployment from './components/Deployment';
import Spatial from './components/Spatial';
import Prediction from './components/Prediction';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import BeatWiseAnalysis from './components/BeatWiseAnalysis';
import TemporalAnalysis from './components/TemporalAnalysis';

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

const App = () => {
  const [selectedPage, setSelectedPage] = useState('spatial'); // default page
  const navigate = useNavigate();

  const handleRadioChange = (event) => {
    setSelectedPage(event.target.value);
    navigate(`/${event.target.value}`);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow ml-30">
        <Navbar />
        <div className="p-4">
          <div className="radio-buttons">
            <label>
              <input
                type="radio"
                value="spatial"
                checked={selectedPage === 'spatial'}
                onChange={handleRadioChange}
              />
              Spatial Analysis
            </label>
            <label>
              <input
                type="radio"
                value="beatwise"
                checked={selectedPage === 'beatwise'}
                onChange={handleRadioChange}
              />
              Beat Wise Analysis
            </label>
            <label>
              <input
                type="radio"
                value="temporal"
                checked={selectedPage === 'temporal'}
                onChange={handleRadioChange}
              />
              Temporal Analysis
            </label>
            {/* Add more radio buttons if necessary */}
          </div>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/spatial" element={<Spatial />} />
            <Route path="/beatwise" element={<BeatWiseAnalysis />} />
            <Route path="/temporal" element={<TemporalAnalysis />} />
            <Route path="/deployment" element={<Deployment />} />
            <Route path="/map" element={<Map />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AppWrapper;
