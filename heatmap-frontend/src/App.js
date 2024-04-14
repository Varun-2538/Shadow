import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Deployment from "./components/Deployment";
import Spatial from "./components/Spatial";
import Prediction from "./components/Prediction";
import Map from "./components/Map";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import BeatWiseAnalysis from "./components/BeatWiseAnalysis";
import TemporalAnalysis from "./components/TemporalAnalysis";
import Radio from "./components/Radio";

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

const App = () => {
  

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow ml-30">
        <Navbar />
          <Radio />
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
  );
};

export default AppWrapper;
