import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

import Spatial from './components/Spatial.js';
import Prediction from './components/Prediction.js';
import Deployment from './components/Deployment.js';
import Map from './components/Map'; 

const App = () => {
  const sidebarStyle = {
    position: 'fixed',
    left: '0px',
    width: '200px',
    height: '100%',
    backgroundColor: '#f0f0f0',
    padding: '20px',
    boxSizing: 'border-box',
    overflowY: 'auto'
  };

  const linkStyle = {
    textDecoration: 'none',
    color: 'black',
    display: 'block',
    padding: '10px',
    margin: '5px 0',
    backgroundColor: '#ddd',
    borderRadius: '4px',
  };

  const activeLinkStyle = {
    backgroundColor: '#bbb',
  };

  return (
    <Router>
      <div style={{ paddingLeft: '220px' }}> {/* Main content padding-left should match the sidebar width + padding */}
        {/* Sidebar with inline styles */}
        <div style={sidebarStyle}>
          <NavLink to="/Spatial" style={linkStyle} activeStyle={activeLinkStyle}>Spatial</NavLink>
          <NavLink to="/Prediction" style={linkStyle} activeStyle={activeLinkStyle}>Prediction plan</NavLink>
          <NavLink to="/Deployment" style={linkStyle} activeStyle={activeLinkStyle}>Deployment</NavLink>
          <NavLink to="/map" style={linkStyle} activeStyle={activeLinkStyle}>Data Entry</NavLink>
        </div>

        {/* Main content */}
        <div style={{ marginTop: '20px' }}>
          <Routes>
            <Route path="/Spatial" element={<Spatial />} />
            <Route path="/Prediction" element={<Prediction />} />
            <Route path="/Deployment" element={<Deployment />} />
            <Route path="/map" element={<Map />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
