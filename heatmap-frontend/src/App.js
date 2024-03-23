import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Deployment from './components/Deployment';
import Spatial from './components/Spatial';
import Prediction from './components/Prediction';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Landing from './components/Landing';

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

const App = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <div className="flex">
      {!isLandingPage && <Sidebar />}
      <div className={`flex-grow ${!isLandingPage ? 'ml-30' : 'w-full'}`}>
        <Navbar />
        <div className="p-4">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/Prediction" element={<Prediction />} />
            <Route path="/Spatial" element={<Spatial />} />
            <Route path="/Deployment" element={<Deployment />} />
            <Route path="/map" element={<Map />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AppWrapper;