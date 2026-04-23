import React, { useState, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GiAirplaneDeparture, GiAirplaneArrival } from "react-icons/gi";
import { FaCalendarAlt, FaUserFriends, FaChair } from "react-icons/fa";
import { MdFlightClass } from "react-icons/md";
import TravellerCounter from "./TravellerCounter";
import Select from "react-select";
import airportsData from "@/data/airports.json";

const airportOptions = (airportsData || []).map((a) => {
  const cityStr = a.city && a.city !== "null" ? `${a.city}, ` : "";
  const nameStr = a.name && a.name !== "null" ? a.name : "Airport";
  const codeStr = a.iata ? ` -(${a.iata})` : "";

  return {
    value: a.iata,
    label: `${cityStr}${nameStr}${codeStr}`,
  };
});

// --- Helper Functions ---

const toISODate = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getMaxDate = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 6);
  return toISODate(d);
};

// --- Reusable Design Wrapper ---
const CustomInputRow = ({ icon, label, children, className, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center border border-gray-400 rounded-sm px-2 h-12 bg-white ${className || ""}`}
    >
      <div className="border-r border-r-gray-400 px-2 text-gray-800 flex items-center justify-center h-full">
        {icon}
      </div>
      <div className="flex-1 px-1 min-w-0 flex items-center h-full relative">
        {children}
      </div>
      <p className="text-sm font-medium text-yellow-600 text-center whitespace-nowrap pl-1 w-[75px]">
        {label}
      </p>
    </div>
  );
};

export const FlightBookingForm = () => {
  const navigate = useNavigate();

  // --- Refs for Date Inputs (Fixes showPicker error) ---
  const departDateRef = useRef(null);
  const returnDateRef = useRef(null);

  const today = toISODate();
  const maxDate = getMaxDate();

  const [tripType, setTripType] = useState("oneway");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [departDate, setDepartDate] = useState(today);
  const [returnDate, setReturnDate] = useState("");
  const [paxData, setPaxData] = useState({ adult: 1, child: 0, infant: 0 });
  const [travelClass, setTravelClass] = useState("economy");

  const getFilteredOptions = useCallback((inputValue) => {
    if (!inputValue) return airportOptions.slice(0, 100);
    const lowerInput = inputValue.toLowerCase();
    
    const filtered = airportOptions.filter(opt => 
        opt.value.toLowerCase().includes(lowerInput) || 
        opt.label.toLowerCase().includes(lowerInput)
    );
    
    filtered.sort((a, b) => {
        const aVal = a.value.toLowerCase();
        const bVal = b.value.toLowerCase();
        const exactA = aVal === lowerInput;
        const exactB = bVal === lowerInput;
        
        if (exactA && !exactB) return -1;
        if (!exactA && exactB) return 1;
        
        const startsA = aVal.startsWith(lowerInput);
        const startsB = bVal.startsWith(lowerInput);
        
        if (startsA && !startsB) return -1;
        if (!startsA && startsB) return 1;
        
        return 0;
    });
    
    return filtered.slice(0, 100);
  }, []);

  const fromOptions = useMemo(() => getFilteredOptions(fromSearch), [fromSearch, getFilteredOptions]);
  const toOptions = useMemo(() => getFilteredOptions(toSearch), [toSearch, getFilteredOptions]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!from || !to) {
      alert("Please select both Departure and Arrival airports.");
      return;
    }
    const params = new URLSearchParams({
      from,
      to,
      departDate,
      tripType,
      adults: String(paxData.adult),
      children: String(paxData.child),
      infants: String(paxData.infant),
      travelClass,
    });

    if (tripType === "roundtrip" && returnDate) {
      params.append("returnDate", returnDate);
    }

    // UPDATED: Route matches App.jsx "/flights/search-results"
    navigate(`/flights/search-results?${params.toString()}`);
  };

  // Helper to safely open picker
  const openPicker = (ref) => {
    try {
      if (ref.current && typeof ref.current.showPicker === "function") {
        ref.current.showPicker();
      } else if (ref.current) {
        ref.current.focus(); // Fallback for older browsers
      }
    } catch (error) {
      console.error("Error opening date picker:", error);
    }
  };

  return (
    <div className="bg-white w-auto md:mr-15 xl:w-[22%] pb-1 rounded-4xl absolute md:-bottom-17 shadow shadow-gray-600 md:mx-4 mx-12 z-20">
      {/* Header */}
      <div className="flex justify-center mt-2 py-1">
        <p className="font-bold md:font-semibold text-2xl">Search Flight</p>
      </div>

      {/* Trip Type Selector */}
      <div className="flex bg-black text-white justify-center mt-2 py-4 md:py-3 gap-6">
        <div className="flex items-center cursor-pointer">
          <input
            type="radio"
            id="oneway"
            name="triptype"
            value="oneway"
            checked={tripType === "oneway"}
            onChange={(e) => setTripType(e.target.value)}
            className="form-radio h-3 w-3 border-2 border-gray-300 checked:border-yellow-400 checked:bg-yellow-400 focus:outline-none focus:ring-0 text-yellow-400 cursor-pointer"
          />
          <label htmlFor="oneway" className="text-sm ml-1 cursor-pointer">
            One Way
          </label>
        </div>
        <div className="flex items-center cursor-pointer">
          <input
            type="radio"
            id="roundtrip"
            name="triptype"
            value="roundtrip"
            checked={tripType === "roundtrip"}
            onChange={(e) => setTripType(e.target.value)}
            className="form-radio h-3 w-3 border-2 border-gray-300 checked:border-yellow-400 checked:bg-yellow-400 focus:outline-none focus:ring-0 text-yellow-400 cursor-pointer"
          />
          <label htmlFor="roundtrip" className="text-sm ml-1 cursor-pointer">
            Round Trip
          </label>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSearch} className="p-5 flex flex-col gap-0">
        {/* From Input */}
        <CustomInputRow
          icon={<GiAirplaneDeparture size={23} className="-ml-1" />}
          label="Departure"
        >
          <Select
            options={fromOptions}
            classNamePrefix="react-select"
            filterOption={null}
            onInputChange={(val, { action }) => {
              if (action === "input-change") setFromSearch(val);
              if (action === "menu-close") setFromSearch("");
            }}
            value={airportOptions.find((opt) => opt.value === from) || (from ? { value: from, label: from } : null)}
            onChange={(selected) => setFrom(selected ? selected.value : "")}
            placeholder="Enter City/Airport"
            isClearable
            menuPortalTarget={document.body}
            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
            noOptionsMessage={() => "Fetching nearby airports..."}
            className="w-full text-sm font-bold text-gray-800 h-full flex flex-col justify-center"
            styles={{
              control: (base) => ({
                ...base,
                border: "none",
                boxShadow: "none",
                backgroundColor: "transparent",
                minHeight: "100%",
                height: "100%",
                cursor: "text",
              }),
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              valueContainer: (base) => ({
                ...base,
                padding: "0 8px",
                flexWrap: "nowrap",
              }),
              placeholder: (base) => ({
                ...base,
                color: "#9ca3af",
                textTransform: "none",
                fontWeight: "normal",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }),
              singleValue: (base) => ({
                ...base,
                textTransform: "uppercase",
                fontWeight: "700",
                color: "#1f2937",
              }),
              input: (base) => ({
                ...base,
                margin: 0,
                padding: 0,
                textTransform: "uppercase",
                fontWeight: "700",
                color: "#1f2937",
                '[type="text"]': {
                  boxShadow: 'none !important',
                  '--tw-ring-color': 'transparent !important',
                  '--tw-ring-shadow': 'none !important'
                }
              }),
              menu: (base) => ({ ...base, zIndex: 9999, width: "300px" }),
              option: (base) => ({ ...base, cursor: "pointer", fontWeight: "normal", textTransform: "none" }),
              clearIndicator: (base) => ({ ...base, cursor: "pointer" }),
              dropdownIndicator: (base) => ({ ...base, cursor: "pointer" }),
            }}
          />
        </CustomInputRow>

        {/* To Input */}
        <CustomInputRow
          icon={<GiAirplaneArrival size={23} className="-ml-1" />}
          label="Arrival"
          className="mt-4"
        >
          <Select
            options={toOptions}
            classNamePrefix="react-select"
            filterOption={null}
            onInputChange={(val, { action }) => {
              if (action === "input-change") setToSearch(val);
              if (action === "menu-close") setToSearch("");
            }}
            value={airportOptions.find((opt) => opt.value === to) || (to ? { value: to, label: to } : null)}
            onChange={(selected) => setTo(selected ? selected.value : "")}
            placeholder="Enter City/Airport"
            isClearable
            menuPortalTarget={document.body}
            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
            noOptionsMessage={() => "Fetching nearby airports..."}
            className="w-full text-sm font-bold text-gray-800 h-full flex flex-col justify-center"
            styles={{
              control: (base) => ({
                ...base,
                border: "none",
                boxShadow: "none",
                backgroundColor: "transparent",
                minHeight: "100%",
                height: "100%",
                cursor: "text",
              }),
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              valueContainer: (base) => ({
                ...base,
                padding: "0 8px",
                flexWrap: "nowrap",
              }),
              placeholder: (base) => ({
                ...base,
                color: "#9ca3af",
                textTransform: "none",
                fontWeight: "normal",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }),
              singleValue: (base) => ({
                ...base,
                textTransform: "uppercase",
                fontWeight: "700",
                color: "#1f2937",
              }),
              input: (base) => ({
                ...base,
                margin: 0,
                padding: 0,
                textTransform: "uppercase",
                fontWeight: "700",
                color: "#1f2937",
                '[type="text"]': {
                  boxShadow: 'none !important',
                  '--tw-ring-color': 'transparent !important',
                  '--tw-ring-shadow': 'none !important'
                }
              }),
              menu: (base) => ({ ...base, zIndex: 9999, width: "300px" }),
              option: (base) => ({ ...base, cursor: "pointer", fontWeight: "normal", textTransform: "none" }),
            }}
          />
        </CustomInputRow>

        {/* Depart Date */}
        <div className="mt-4">
          <CustomInputRow
            icon={<FaCalendarAlt size={18} />}
            label="Depart"
            // Trigger picker via ref on container click
            onClick={() => openPicker(departDateRef)}
            className="cursor-pointer"
          >
            <input
              ref={departDateRef}
              type="date"
              min={today}
              max={maxDate}
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              // Stop propagation so clicking input doesn't trigger parent click
              onClick={(e) => {
                e.stopPropagation();
                openPicker(departDateRef);
              }}
              className="w-full text-sm font-bold text-gray-800 outline-none border-none focus:ring-0 pl-2 uppercase bg-transparent h-full cursor-pointer appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
              required
            />
          </CustomInputRow>
        </div>

        {/* Return Date */}
        <div className="mt-4">
          <CustomInputRow
            icon={<FaCalendarAlt size={18} />}
            label="Return"
            // Only open if roundtrip
            onClick={() =>
              tripType === "roundtrip" && openPicker(returnDateRef)
            }
            className={`cursor-pointer ${tripType === "oneway" ? "bg-gray-100 opacity-60 cursor-not-allowed" : ""}`}
          >
            <input
              ref={returnDateRef}
              type="date"
              min={departDate || today}
              max={maxDate}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              onClick={(e) => {
                e.stopPropagation();
                if (tripType === "roundtrip") openPicker(returnDateRef);
              }}
              className="w-full text-sm font-bold text-gray-800 outline-none border-none focus:ring-0 pl-2 uppercase bg-transparent h-full cursor-pointer appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
              disabled={tripType === "oneway"}
              required={tripType === "roundtrip"}
            />
          </CustomInputRow>
        </div>

        {/* Passenger Selector */}
        <div className="mt-4 relative z-50">
          <CustomInputRow icon={<FaUserFriends size={20} />} label="Passengers">
            <div className="h-full w-full flex items-center">
              <TravellerCounter
                value={paxData}
                onChange={setPaxData}
                direction="up"
                relativePosition={false}
                className="w-full h-full flex items-center border-none pl-2 bg-transparent text-sm font-bold text-gray-800 focus:ring-0 shadow-none rounded-none!"
              />
            </div>
          </CustomInputRow>
        </div>

        {/* Class Selector */}
        <div className="mt-4">
          <CustomInputRow
            // UPDATED: Removed className="-ml-1" from the wrapper row to fix alignment.
            // Adjusted icon size to 20 to match Passengers icon size.
            icon={<MdFlightClass size={20} />}
            label="Class"
          >
            <select
              value={travelClass}
              onChange={(e) => setTravelClass(e.target.value)}
              className="w-full h-full text-sm font-bold text-gray-800 outline-none border-none bg-transparent focus:ring-0 pl-2 cursor-pointer appearance-none"
            >
              <option value="economy">Economy</option>
              <option value="premium">Premium Economy</option>
              <option value="business">Business</option>
              <option value="firstclass">First Class</option>
            </select>
          </CustomInputRow>
        </div>

        {/* Search Button */}
        <div className="flex justify-center items-center">
          <button
            type="submit"
            className="relative mt-6 px-4 py-2 rounded-md text-white font-bold bg-yellow-600
              transition-all duration-300 hover:bg-yellow-400
              cursor-pointer hover:text-gray-600 w-full md:w-auto"
          >
            SEARCH FLIGHTS
          </button>
        </div>
      </form>
    </div>
  );
};
{
  /**
  import { InputText } from "./InputText";

import { GiAirplaneDeparture, GiAirplaneArrival } from "react-icons/gi";

import { DatePickerComp } from "./DatePickerComp";

import TravellerCounter from "./TravellerCounter";

import { ClassSelector } from "./ClassSelector";



export const FlightBookingForm = () => {

  return (

    <div className="bg-white w-auto md:mr-15 xl:w-[22%] pb-1 rounded-4xl absolute md:-bottom-17 shadow shadow-gray-600 mx-4 overflow-x-hidden">

      <div className="flex justify-center mt-2 py-1">

        <p className="font-bold md:font-semibold text-2xl">Search Flight</p>

      </div>



      <div className="flex bg-black text-white justify-center mt-2 py-4 md:py-3">

        <div className="flex items-center">

          <input

            type="radio"

            id="oneway"

            name="triptype"

            value="1"

            className="form-radio h-3 w-3 border-2 border-gray-300 checked:border-yellow-400 checked:bg-yellow-400 focus:outline-none focus:ring-0 text-yellow-400"

          />

          <label htmlFor="oneway" className="text-sm ml-2">

            One Way

          </label>

        </div>

        <div className="flex items-center ml-5">

          <input

            type="radio"

            id="roundtrip"

            name="triptype"

            value="2"

            className="form-radio h-3 w-3 border-2 border-gray-300 checked:border-yellow-400 checked:bg-yellow-400 focus:outline-none focus:ring-0 text-yellow-400"

          />

          <label htmlFor="roundtrip" className="text-sm ml-1">

            Round Trip

          </label>

        </div>

      </div>



      <div className="p-5">

        <InputText

          image={<GiAirplaneDeparture size={25} />}

          placeholder={"Enter City/Airport"}

          label="Departure"

        />

        <InputText

          image={<GiAirplaneArrival size={25} />}

          placeholder={"Enter City/Airport"}

          label="Arrival"

          extrastyle={"mt-4"}

        />



        <DatePickerComp />



        <TravellerCounter />



        <ClassSelector />



        <div className="flex justify-center items-center">

          <button

            className="relative mt-6 px-4 py-2 rounded-md text-white font-bold bg-yellow-600

              transition-all duration-300 hover:bg-yellow-400

              cursor-pointer hover:text-gray-600"

          >

            SEARCH FLIGHTS

          </button>

        </div>

      </div>

    </div>

  );

};
  */
}
