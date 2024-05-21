import React, { useState, useEffect } from "react";
import {useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown toggle

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsOpen(false); // Automatically close the dropdown when screen is resized to wide dimensions
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  

  if (location.pathname !== "/") {
    return null;
  }

  // Changed the background to a gradient similar to Landing.js
  return (
    <nav className="flex items-center justify-between px-4 py-2 w-full mt-0 bg-gradient-to-r from-slate-900 to-stone-950 text-white pt-4 pr-16 pl-16">
      <div className="text-2xl font-bold">
        <a href="/" className="hover:text-red-500">
          Shadow
        </a>
      </div>
      <div className="sm:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
          <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            {isOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>
      {/* Dropdown menu for small screens */}
      <ul className={`${isOpen ? "flex" : "hidden"} flex-col items-start space-y-2 p-4 rounded-lg shadow-lg bg-black absolute top-full right-0 mt-2 w-auto sm:w-64 z-50`}>
        <li>
          <a href="/" className="hover:text-gray-400" onClick={() => setIsOpen(false)}>
            Home
          </a>
        </li>
        <li>
          <a href="https://github.com/Varun-2538/Shadow" className="hover:text-gray-400" onClick={() => setIsOpen(false)}>
            Github
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-gray-400" onClick={() => setIsOpen(false)}>
            FAQs
          </a>
        </li>

        <li>
          <a href="#" className="hover:text-gray-400" onClick={() => setIsOpen(false)}>
            About Us
          </a>
        </li>
      </ul>
      
    </nav>
  );
};

export default Navbar;
