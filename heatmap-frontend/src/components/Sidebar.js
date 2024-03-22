import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const hideSidebar = location.pathname === "/";

  if (hideSidebar) {
    return null; // Or, return an empty fragment <> if you prefer
  }

  return (
    <div className="sidebar">
      <Link to="/Spatial">Spatial</Link>
      <Link to="/Prediction">Prediction plan</Link>
      <Link to="/Deployment">Deployment</Link>
      <Link to="/map">Data Entry</Link>
    </div>
  );
};

export default Sidebar;
