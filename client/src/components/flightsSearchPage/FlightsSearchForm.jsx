import React from "react";
import PassengerSelector from "@/components/flightsSearchPage/PassengerSelector";
import { SpecialBenefits } from "@/components/flightsSearchPage/SpecialBenefits";
import { ArrowRightLeft } from "lucide-react";

const toISODate = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatPrettyDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
  });
};

export function FlightsSearchForm({
  from,
  to,
  setFrom,
  setTo,
  departDate,
  setDepartDate,
  returnDate,
  setReturnDate,
  tripType,
  setTripType,
  loading,
  hasSearched,
  paxData,
  setPaxData,
  travelClass,
  setTravelClass,
  benefitTypes,
  setBenefitTypes,
  onSubmit,
}) {
  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      from,
      to,
      departDate,
      returnDate,
      tripType,
      paxData,
      travelClass,
      benefitTypes,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 mb-2"
      autoComplete="off"
    >
      {/* MAIN GRID LAYOUT 
         - REMOVED 'z-50' from here. It was causing the form to overlay the sidebar.
         - Added 'relative' to maintain stacking context for children.
      */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-end relative">
        {/* --- 1. FROM & TO --- */}
        <div className="col-span-2 grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
          {/* From Input */}
          <div className="w-full">
            <label className="block text-yellow-600 font-medium text-xs md:text-sm mb-1">
              From
            </label>
            <input
              className="w-full h-10 px-3 border border-gray-300 rounded font-semibold text-slate-900 focus:outline-none focus:ring-0 focus:border-yellow-500 uppercase text-sm md:text-base"
              value={from}
              onChange={(e) => setFrom(e.target.value.toUpperCase())}
              placeholder="MAA"
              required
            />
          </div>

          {/* Swap Button */}
          <div className="flex justify-center pb-1">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2 rounded-full border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 hover:text-yellow-600 transition shadow-sm"
              title="Swap locations"
            >
              <ArrowRightLeft size={16} />
            </button>
          </div>

          {/* To Input */}
          <div className="w-full">
            <label className="block text-yellow-600 font-medium text-xs md:text-sm mb-1">
              To
            </label>
            <input
              className="w-full h-10 px-3 border border-gray-300 rounded font-semibold text-slate-900 focus:outline-none focus:ring-0 focus:border-yellow-500 uppercase text-sm md:text-base"
              value={to}
              onChange={(e) => setTo(e.target.value.toUpperCase())}
              placeholder="JAI"
              required
            />
          </div>
        </div>

        {/* --- 2. TRIP TYPE --- */}
        {/* Added z-20 here only (for Desktop dropdown) */}
        <div className="col-span-2 lg:col-span-1 flex flex-col justify-end h-full relative z-20">
          <label className="block text-yellow-600 font-medium text-xs md:text-sm mb-1 lg:mb-2">
            Trip Type
          </label>

          {/* MOBILE: Radio Buttons */}
          <div className="flex lg:hidden items-center gap-3 bg-slate-50 p-2 rounded border border-gray-300 h-10 justify-around">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="tripType"
                value="oneway"
                checked={tripType === "oneway"}
                onChange={(e) => setTripType(e.target.value)}
                className="accent-yellow-500 w-4 h-4 cursor-pointer focus:ring-0"
              />
              <span className="text-xs font-semibold text-slate-700">
                One Way
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="tripType"
                value="roundtrip"
                checked={tripType === "roundtrip"}
                onChange={(e) => setTripType(e.target.value)}
                className="accent-yellow-500 w-4 h-4 cursor-pointer focus:ring-0"
              />
              <span className="text-xs font-semibold text-slate-700">
                Round Trip
              </span>
            </label>
          </div>

          {/* DESKTOP: Select Dropdown */}
          <div className="hidden lg:block h-10">
            <select
              className="w-full h-full px-3 border border-gray-300 rounded font-semibold text-slate-900 text-sm focus:outline-none focus:ring-0 focus:border-yellow-500 bg-white"
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
            >
              <option value="oneway">One Way</option>
              <option value="roundtrip">Round Trip</option>
            </select>
          </div>
        </div>

        {/* --- 3. FROM DATE --- */}
        <div className="col-span-1 lg:col-span-1">
          <label className="block text-yellow-600 font-medium text-xs md:text-sm mb-1">
            From Date
          </label>
          <div
            className="w-full h-10 px-3 flex items-center border border-gray-300 rounded cursor-pointer bg-white hover:border-yellow-500 transition relative"
            onClick={() =>
              document.getElementById("depart-date-hidden")?.showPicker?.()
            }
          >
            <span className="font-semibold text-slate-900 text-xs md:text-sm whitespace-nowrap overflow-hidden">
              {formatPrettyDate(departDate || toISODate())}
            </span>
            <input
              id="depart-date-hidden"
              type="date"
              className="absolute inset-0 opacity-0 cursor-pointer focus:ring-0"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
            />
          </div>
        </div>

        {/* --- 4. RETURN DATE --- */}
        <div className="col-span-1 lg:col-span-1">
          <label
            className={`block font-medium text-xs md:text-sm mb-1 ${
              tripType === "oneway" ? "text-slate-400" : "text-yellow-600"
            }`}
          >
            Return Date
          </label>
          <div
            className={`w-full h-10 px-3 flex items-center border rounded transition relative ${
              tripType === "oneway"
                ? "bg-slate-100 border-gray-300 cursor-not-allowed"
                : "bg-white border-gray-300 cursor-pointer hover:border-yellow-500"
            }`}
            onClick={() => {
              if (tripType === "roundtrip") {
                document.getElementById("return-date-hidden")?.showPicker?.();
              }
            }}
          >
            <span
              className={`font-semibold text-xs md:text-sm whitespace-nowrap overflow-hidden ${
                tripType === "oneway" ? "text-slate-400" : "text-slate-900"
              }`}
            >
              {tripType === "oneway"
                ? "Select Round Trip to add"
                : formatPrettyDate(returnDate || toISODate())}
            </span>
            <input
              id="return-date-hidden"
              type="date"
              className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed focus:ring-0"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              disabled={tripType === "oneway"}
            />
          </div>
        </div>

        {/* --- 5. PASSENGERS --- */}
        {/* Changed z-50 to z-20. This is high enough to show popup over the section below, 
            but low enough to stay UNDER your sidebar (usually z-40 or z-50). */}
        <div className="col-span-2 lg:col-span-1 relative z-20">
          <label className="block text-yellow-600 font-medium text-xs md:text-sm mb-1 truncate">
            Passengers
          </label>
          <div className="h-10">
            <PassengerSelector
              value={paxData}
              onChange={setPaxData}
              className="w-full focus:outline-none focus:ring-0 focus:border-yellow-500"
            />
          </div>
        </div>

        {/* --- 6. CLASS --- */}
        <div className="col-span-2 lg:col-span-1">
          <label className="block text-yellow-600 font-medium text-xs md:text-sm mb-1 truncate">
            Class
          </label>
          <select
            className="w-full h-10 px-2 border border-gray-300 font-semibold rounded text-slate-900 text-sm focus:outline-none focus:ring-0 focus:border-yellow-500 bg-white"
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value)}
          >
            <option value="economy">Economy</option>
            <option value="premium">Prem. Eco</option>
            <option value="business">Business</option>
            <option value="firstclass">First</option>
          </select>
        </div>

        {/* --- 7. SEARCH BUTTON --- */}
        <div className="col-span-2 lg:col-span-1">
          <label className="hidden lg:block text-transparent text-xs md:text-sm mb-1 select-none">
            Action
          </label>
          <button
            type="submit"
            className="w-full h-10 bg-yellow-400 text-black font-bold text-sm rounded hover:bg-yellow-500 hover:shadow-md transition-all flex items-center justify-center uppercase tracking-wide focus:outline-none focus:ring-0"
            disabled={loading}
          >
            {loading
              ? "Searching..."
              : hasSearched
                ? "Modify Search"
                : "Search Flights"}
          </button>
        </div>
      </div>

      {/* --- ROW 3: Special Benefits --- */}
      <div className="mt-2 pt-2 border-t border-slate-100 relative z-0">
        <SpecialBenefits
          selected={benefitTypes}
          setSelected={setBenefitTypes}
        />
      </div>
    </form>
  );
}
