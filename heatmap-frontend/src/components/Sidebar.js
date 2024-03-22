import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const hideSidebar = location.pathname === "/";

  if (hideSidebar) {
    return null;
  }

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen py-8 px-4 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-8">
          <span className="text-red-500">H</span>oneywell
        </h1>
        <nav>
          <ul>
            <li className="mb-4">
              <Link
                to="/"
                className="flex items-center gap-2 hover:text-red-500 transition-colors duration-300"
              >
                Landing
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/Prediction"
                className="flex items-center gap-2 hover:text-red-500 transition-colors duration-300"
              >
                Prediction
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/Spatial"
                className="flex items-center gap-2 hover:text-red-500 transition-colors duration-300"
              >
                Spatial
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/Deployment"
                className="flex items-center gap-2 hover:text-red-500 transition-colors duration-300"
              >
                Deployment
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/map"
                className="flex items-center gap-2 hover:text-red-500 transition-colors duration-300"
              >
                Map
              </Link>
            </li>
            {/* Other sidebar items */}
          </ul>
        </nav>
      </div>
      <div>{/* Add any additional components or links */}</div>
    </div>
  );
};

export default Sidebar;
