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
        <div className="bg-gradient-radial top-0 left-0 from-slate-900 to-stone-950">
          <div className="flex-grow min-h-screen flex items-center justify-center flex-col text-white px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-center">
              Predict. <span className="text-sky-600">Prevent.</span> Preserve.
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-8 text-center">
              Community Sentinel Suite.
            </h2>
            <p className="text-center text-sm sm:text-base md:text-lg max-w-3xl mb-8">
              Navigate public safety with precision using the Community Sentinel Suite. Deploy law enforcement where it matters most. Insightful, responsive, and diligent.
            </p>
            <div className="flex space-x-4">
              <button className="bg-transparent no-underline group cursor-pointer relative shadow-2xl shadow-sky-600 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block">
                <span className="absolute inset-0 overflow-hidden rounded-full">
                  <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </span>
                <div
                  onClick={handleClick}
                  className="relative flex text-xl space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 "
                >
                  <span>Get Started </span>
                  <svg
                    fill="none"
                    height="24"
                    viewBox="0 0 22 22"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.75 8.75L14.25 12L10.75 15.25"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
