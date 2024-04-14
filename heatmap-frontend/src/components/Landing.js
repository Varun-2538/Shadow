import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/Spatial");
  };

  return (
    <>
      <div className="bg-stone-950 min-h-screen w-full">
        <div className="flex-grow min-h-screen flex items-center justify-center flex-col text-white">
          <h1 className="text-7xl font-bold mb-4 ">
            Predict. Prevent. Preserve.
          </h1>
          <h2 className="text-3xl font-semibold mb-8">
            Community Sentinel Suite.
          </h2>
          <p className="text-center max-w-3xl mb-8">
            Navigate public safety with precision using the Community Sentinel
            Suite. Deploy law enforcement where it matters most. Insightful,
            responsive, and diligent.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={handleClick}
              className="bg-transparent mr-6 hover:shadow-glow-red-intense shadow-glow-red text-white px-8 py-3 rounded-xl"
            >
              Get Started
            </button>
            
          </div>
        </div>
      </div>
    </>
  );
}
