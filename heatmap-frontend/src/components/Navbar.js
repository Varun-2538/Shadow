import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleOnClick = () => {
    navigate("/Spatial");
  };
  if (location.pathname !== "/") {
    return null;
  }

  return (
    <nav className="flex items-center justify-between px-4 py-2 w-full mt-0  bg-stone-950 text-white pt-4 pr-16 pl-16">
      <div className="text-2xl font-bold">
        <a href="/" className="hover:text-red-500">
          Shadow
        </a>
      </div>
      <ul className="flex space-x-12">
        <li>
          <a href="/" className="hover:text-gray-400">
            Home
          </a>
        </li>
        <li>
          <a href="/" className="hover:text-gray-400">
            Services
          </a>
        </li>
        <li>
          <a href="/" className="hover:text-gray-400">
            FAQs
          </a>
        </li>
        <li>
          <a href="/" className="hover:text-gray-400">
            Support
          </a>
        </li>
        <li>
          <a href="/" className="hover:text-gray-400">
            About Us
          </a>
        </li>
      </ul>
      <button
        onClick={handleOnClick}
        className="px-4 py-2 bg-white text-gray-900 rounded-md hover:bg-gray-200"
      >
        Login
      </button>
    </nav>
  );
};

export default Navbar;
