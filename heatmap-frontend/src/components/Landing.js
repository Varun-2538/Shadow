import React from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/Spatial");
  };
  return (
    <>
      <div className="bg-stone-950 min-h-screen w-full">
        <div className="flex-grow flex items-center justify-center flex-col text-white">
          <h1 className="text-7xl font-bold mb-4 mt-56">
            Streamline. Integrate. Thrive.
          </h1>
          <h2 className="text-3xl font-semibold mb-8">Buildings AI.</h2>
          <p className="text-center max-w-3xl mb-8">
            Experience streamlined building management with the Honeywell
            Buildings App. Effortlessly control and monitor your building'
            operations. Innovative, user-friendly, and efficient.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={handleClick}
              className="bg-transparent mr-6 hover:shadow-glow-red-intense shadow-glow-red text-white px-8 py-3 rounded-xl"
            >
              Get Started
            </button>
            <button className="bg-transparent hover:shadow-glow-white-intense shadow-glow-white text-white px-8 py-3 rounded-xl">
              Offerings
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
