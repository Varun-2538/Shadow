import React from "react";
import { Link, useLocation } from "react-router-dom";
// import "./Sidebar.css"; // This line imports the CSS rules

const Sidebar = () => {
  if (useLocation().pathname === "/") {
    return null;
  } else
  return (
    <div className=" inset-y-0 left-0 w-60 bg-gray-800 shadow-lg">
      <div className="px-6 py-4">
        <nav className="mt-6">
          <div>
            <a href="/Spatial" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
              Spatial
            </a>
            <a href="/Prediction" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
              Prediction Plan
            </a>
            <a href="/Deployment" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
              Deployment
            </a>
            <a href="/map" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
              Data Entry
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
};


export default Sidebar;