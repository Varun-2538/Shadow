import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Deployment from './components/Deployment.js';
import Spatial from './components/Spatial.js';
import Prediction from './components/Prediction.js';
import Map from './components/Map'; // Assuming your Map component is saved in a components folder
import Sidebar from './components/Sidebar.js';
import Navbar from './components/Navbar.js';
import Landing from './components/Landing.js';

const App = () => {
  return (
    <>
      <Router>
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/Prediction" element={<Prediction />} />
              <Route path="/Spatial" element={<Spatial />} />
              <Route path="/Deployment" element={<Deployment />} />
              <Route path="/map" element={<Map />} />
            </Routes>
          </div>
        
      </Router>
    </>
  );
}

export default App;
