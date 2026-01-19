import React from "react";
import { FaPlane, FaClock } from "react-icons/fa";

// Helper to get airline logo (You can replace this with actual image imports)
const getAirlineLogo = (airlineName) => {
  // Simple fallback placeholder logic
  return `https://ui-avatars.com/api/?name=${airlineName}&background=facc15&color=000&size=40&font-size=0.5`;
};

export function FlightsSearchResults({ flights, hasSearched, loading }) {
  return (
    <div className="my-3 p-2 bg-slate-600 rounded-md">
      <div className="py-2 md:py-4 space-y-3">
        {flights.map((f, idx) => {
          const firstLeg = f.flights?.[0];
          const lastLeg = f.flights?.[f.flights.length - 1];
          const airlineName = firstLeg?.airline || "Airline";
          const airlineLogo = f.airline_logo || getAirlineLogo(airlineName);

          return (
            <div
              key={idx}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-slate-200"
            >
              {/* --- Container: Stack vertical on mobile, Row on Desktop --- */}
              <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                {/* 1. LEFT: Airline Info & Logo */}
                <div className="flex items-center gap-3 md:w-1/4">
                  <img
                    src={airlineLogo}
                    alt={airlineName}
                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                    onError={(e) => {
                      e.target.src = getAirlineLogo(airlineName);
                    }}
                  />
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm md:text-base">
                      {airlineName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {f.flights?.length > 1
                        ? `${f.flights.length} Stops`
                        : "Non-stop"}
                    </p>
                  </div>
                </div>

                {/* 2. CENTER: Flight Times & Route (Grid on mobile for alignment) */}
                <div className="flex-1 grid grid-cols-3 items-center gap-2 text-center md:px-4 border-t md:border-t-0 border-dashed border-gray-200 pt-3 md:pt-0">
                  {/* Departure */}
                  <div className="text-left md:text-center">
                    <p className="font-bold text-lg text-slate-800">
                      {firstLeg?.departure_airport?.time}
                    </p>
                    <p className="text-xs font-semibold text-slate-500">
                      {firstLeg?.departure_airport?.id}
                    </p>
                  </div>

                  {/* Duration / Arrow icon */}
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-xs text-slate-500 mb-1">
                      {Math.floor((f.total_duration || 0) / 60)}h{" "}
                      {(f.total_duration || 0) % 60}m
                    </p>
                    <div className="w-full flex items-center justify-center text-slate-300">
                      <span className="h-px w-full bg-slate-300"></span>
                      <FaPlane className="mx-1 text-yellow-500 text-xs" />
                      <span className="h-px w-full bg-slate-300"></span>
                    </div>
                  </div>

                  {/* Arrival */}
                  <div className="text-right md:text-center">
                    <p className="font-bold text-lg text-slate-800">
                      {lastLeg?.arrival_airport?.time}
                    </p>
                    <p className="text-xs font-semibold text-slate-500">
                      {lastLeg?.arrival_airport?.id}
                    </p>
                  </div>
                </div>

                {/* 3. RIGHT: Price & CTA */}
                <div className="flex flex-row md:flex-col justify-between items-center md:w-1/5 md:items-end border-t md:border-t-0 border-gray-100 pt-3 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-2xl font-bold text-slate-800">
                      ₹{f.price?.toLocaleString?.("en-IN") ?? f.price}
                    </p>
                    <p className="text-xs text-slate-500 hidden md:block">
                      per adult
                    </p>
                  </div>

                  <button className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-2 px-6 rounded text-sm transition-colors shadow-sm">
                    Book
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty States */}
        {!hasSearched && !loading && (
          <div className="flex flex-col items-center justify-center py-10 text-slate-300">
            <FaPlane className="text-4xl mb-3 opacity-50" />
            <p className="text-lg font-medium text-center">
              Search your flights to see available options.
            </p>
          </div>
        )}

        {hasSearched && !loading && flights.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-slate-300">
            <p className="text-lg font-medium text-center">
              No flights found for this search.
            </p>
            <p className="text-sm">Try changing dates or airports.</p>
          </div>
        )}
      </div>
    </div>
  );
}
