import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Radio = () => {
  const [selectedPage, setSelectedPage] = useState('spatial'); // default page
  const navigate = useNavigate();
  const location = useLocation();

  const handleRadioChange = (event) => {
    setSelectedPage(event.target.value);
    navigate(`/${event.target.value}`);
  };

  if (location.pathname === "/") {
    return null;
  }

  return (
    <div className="flex justify-center mt-8 mb-2 space-x-2">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <div className="flex items-cente">
          <input
            type="radio"
            name="radio-btn"
            value="spatial"
            checked={selectedPage === 'spatial'}
            onChange={handleRadioChange}
            className="mr-2 w-5 h-5 text-black bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label className="text-sm font-medium text-black">
            Spatial Analysis
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <div className="flex items-center">
          <input
            type="radio"
            name="radio-btn"
            value="beatwise"
            checked={selectedPage === 'beatwise'}
            onChange={handleRadioChange}
            className="mr-2 w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label className="text-sm font-medium text-black">
            Beat Wise Analysis
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <div className="flex items-center">
          <input
            type="radio"
            name="radio-btn"
            value="temporal"
            checked={selectedPage === 'temporal'}
            onChange={handleRadioChange}
            className="mr-2 w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label className="text-sm font-medium text-black">
            Temporal Analysis
          </label>
        </div>
      </div>
    </div>
  );
};

export default Radio;
