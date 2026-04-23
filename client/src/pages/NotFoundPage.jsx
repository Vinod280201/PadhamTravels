import React from "react";
import { Link } from "react-router-dom";
import { FaPlaneSlash, FaHome } from "react-icons/fa"; // Make sure you have react-icons installed

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* Floating Graphic */}
      <div className="relative mb-8 animate-bounce-slow">
        <FaPlaneSlash className="text-9xl text-gray-300" />
        {/* Simple cloud decoration using pure CSS/Tailwind */}
        <div className="absolute -bottom-4 -right-4 w-24 h-4 bg-gray-200 rounded-full blur-sm"></div>
      </div>

      {/* Main Error Code */}
      <div className="relative">
        <h1 className="text-9xl font-black text-gray-900 tracking-tighter">
          404
        </h1>
        <div className="absolute top-0 -right-8 rotate-12 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded shadow-sm">
          Missing Destination
        </div>
      </div>

      {/* Text Content */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4 text-center">
        Oops! You've flown off the map.
      </h2>
      <p className="text-gray-600 mt-3 text-center max-w-md">
        The page you are looking for doesn't exist, has been moved, or is
        currently under maintenance. Let's get you back on course.
      </p>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold rounded-md hover:bg-yellow-400 hover:text-gray-900 transition-all duration-300 shadow-lg hover:shadow-yellow-400/30"
        >
          <FaHome />
          Return Home
        </Link>

        {/* Optional: Secondary button if they want to try searching */}
        <Link
          to="/flights"
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-md hover:border-gray-900 hover:text-gray-900 transition-colors duration-300"
        >
          Search Flights
        </Link>
      </div>

      {/* Footer Text */}
      <p className="mt-12 text-gray-400 text-sm">
        Padham Travels © {new Date().getFullYear()}
      </p>
    </div>
  );
};
