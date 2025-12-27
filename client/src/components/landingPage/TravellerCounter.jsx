import React, { useState } from "react";
import { MdGroups } from "react-icons/md";

const TravellerCounter = ({
  initialAdults = 1,
  initialChildren = 0,
  minAdults = 1,
  maxAdults = 9,
  maxChildren = 9,
  onChange = () => {},
}) => {
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);

  // Update parent component when travellers change
  const updateCounts = (newAdults, newChildren) => {
    setAdults(newAdults);
    setChildren(newChildren);
    onChange({ adults: newAdults, children: newChildren });
  };

  // Function to format the counts into a single string for the text box
  const formatTravellerCount = () => {
    const total = adults + children;
    const totalText = `${total} Passenger${total !== 1 ? "s" : ""}`;

    // Include details only if children are present
    const details =
      children > 0 ? ` (${adults} Adults, ${children} Children)` : "";

    return `${totalText}${details}`;
  };

  return (
    <div className=" px-4 border border-gray-400 rounded-md mt-3 max-w-xs">
      {/* 1. Text Box Display (New addition) */}
      <div className="pt1 mt-1.5">
        <div className="flex justify-between">
          <p className="text-sm text-gray-600">Total Selected</p>
          <p className="text-sm font-medium text-yellow-600 text-end mt-0.5 ">
            Passengers
          </p>
        </div>

        <div className="flex">
          <MdGroups size={30} className="flex ml-0.5 mt-1" />
          <div className="border-r border-r-gray-400 px-2 mt-2 mb-2" />
          <input
            id="traveller-result"
            type="text"
            readOnly // Important: Makes the text box non-editable
            value={formatTravellerCount()} // Display the formatted count
            className=" flex px-2 py-2 borderoutline-none border-none focus:outline-none 
                      focus:ring-0 text-sm text-center w-full rounded-md text-blue-700 font-semibold 
                      disabled:cursor-default"
          />
        </div>
      </div>

      {/* 2. Adults Counter */}
      <div className="flex justify-between items-center py-1 border-t border-gray-300">
        <span className="text-sm font-medium text-gray-700">Adults</span>
        <div className="flex items-center">
          <button
            className="w-8 h-8 pb-0.5 flex items-center text-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            disabled={adults <= minAdults}
            onClick={() => updateCounts(adults - 1, children)}
          >
            -
          </button>
          <span className="mx-3 w-6 text-center font-semibold text-gray-800">
            {adults}
          </span>
          <button
            className="w-8 h-8 pb-0.5 justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            disabled={adults >= maxAdults}
            onClick={() => updateCounts(adults + 1, children)}
          >
            +
          </button>
        </div>
      </div>

      {/* 3. Children Counter */}
      <div className="flex justify-between items-center py-1 border-t border-gray-300">
        <span className="text-sm font-medium text-gray-700">Children</span>
        <div className="flex items-center">
          <button
            className="w-8 h-8 pb-0.5 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            disabled={children <= 0}
            onClick={() => updateCounts(adults, children - 1)}
          >
            -
          </button>
          <span className="mx-3 w-6 text-center font-semibold text-gray-800">
            {children}
          </span>
          <button
            className="w-8 h-8 pb-0.5 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            disabled={children >= maxChildren}
            onClick={() => updateCounts(adults, children + 1)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravellerCounter;
