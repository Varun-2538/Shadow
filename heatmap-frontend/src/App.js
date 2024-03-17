import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import DataEntry from './components/DataEntry.js';
import Map from './components/Map'; // Assuming your Map component is saved in a components folder

const App = () => {
  return (
    <Router>
      <div className="App">
        <div className="sidebar">
          <Link to="/">Analysis</Link>
          <Link to="/dashboard">Prediction plan</Link>
          <Link to="/data-entry">Deployment</Link>
          <Link to="/map">Data Entry</Link>
        </div>
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/data-entry" element={<DataEntry />} />
            <Route path="/map" element={<Map />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
