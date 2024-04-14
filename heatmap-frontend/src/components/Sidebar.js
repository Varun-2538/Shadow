import React from "react";
import {useLocation } from "react-router-dom";
// import "./Sidebar.css"; // This line imports the CSS rules

const Sidebar = () => {
  if (useLocation().pathname === "/") {
    return null;
  } else
  return (
    <div className="min-h-screen left-0 w-60 bg-gray-800 shadow-lg px-6 py-2">
        <nav>
          <div className=" text-white font-semibold min-h-screen  space-y-4 flex flex-col justify-center">
            <a
              href="/Spatial"
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
            >
              Spatial
            </a>
            <a
              href="/Prediction"
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
            >
              Prediction Plan
            </a>
            <a
              href="/Deployment"
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
            >
              Deployment
            </a>
            <a
              href="/map"
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
            >
              Data Entry
            </a>
          </div>
        </nav>
    </div>
  );
};


export default Sidebar;