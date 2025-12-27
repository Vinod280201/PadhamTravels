import React from "react";
import PassengerSelector from "@/components/flightsSearchPage/PassengerSelector";
import { SpecialBenefits } from "@/components/flightsSearchPage/SpecialBenefits";

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
  // swap handler
  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };
  // wrap onSubmit so parent gets a data object, not the event
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
      className="grid gap-3 md:grid-cols-4 items-end mb-3"
      autoComplete="off"
    >
      {/* From */}
      <div className="md:col-span-2 flex justify-between items-end">
        <div className="flex-1 mr-2">
          <label className="block text-yellow-600 font-medium text-sm mb-1">
            From (airport code)
          </label>
          <input
            className="w-full px-3 py-2 rounded font-semibold text-black"
            value={from}
            onChange={(e) => setFrom(e.target.value.toUpperCase())}
            placeholder="MAA"
            required
          />
        </div>
        {/* Swap button */}
        <div className="mb-1.5">
          <button
            type="button"
            onClick={handleSwap}
            className="px-3 py-1 rounded-full border border-slate-700 text-md bg-white text-slate-800 hover:bg-slate-200 hover:font-semibold"
          >
            ⇄
          </button>
        </div>

        {/* To */}
        <div className="flex-1 ml-2">
          <label className="block text-yellow-600 font-medium text-sm mb-1">
            To (airport code)
          </label>
          <input
            className="w-full px-3 py-2 rounded font-semibold text-black"
            value={to}
            onChange={(e) => setTo(e.target.value.toUpperCase())}
            placeholder="JAI"
            required
          />
        </div>
      </div>

      {/* From Date */}
      <div>
        <label className="block text-yellow-600 font-medium text-sm mb-1">
          From Date
        </label>
        <div
          className="w-full px-3 py-2 rounded border font-semibold border-slate-500 text-black cursor-pointer"
          onClick={() =>
            document.getElementById("depart-date-hidden")?.showPicker?.()
          }
        >
          <span className="font-semibold">
            {formatPrettyDate(departDate || toISODate())}
          </span>
        </div>
        <input
          id="depart-date-hidden"
          type="date"
          className="w-0 h-0 opacity-0 absolute -z-10"
          value={departDate}
          onChange={(e) => setDepartDate(e.target.value)}
        />
      </div>

      {/* Trip type */}
      <div>
        <label className="block text-yellow-600 font-medium text-sm mb-1">
          Select Trip type
        </label>
        <select
          className="w-full px-3 py-2 rounded font-semibold text-black"
          value={tripType}
          onChange={(e) => setTripType(e.target.value)}
        >
          <option value="oneway">One way</option>
          <option value="roundtrip">Round trip</option>
        </select>
      </div>

      {/* Return Date */}
      <div>
        <label className="block text-yellow-600 font-medium text-sm mb-1">
          Return Date
        </label>
        <div
          className={`w-full px-3 py-2 border border-slate-500 rounded text-black ${
            tripType === "oneway"
              ? "bg-gray-200 cursor-not-allowed"
              : "cursor-pointer"
          }`}
          onClick={() => {
            if (tripType === "roundtrip") {
              document.getElementById("return-date-hidden")?.showPicker?.();
            }
          }}
        >
          <span
            className={
              tripType === "oneway"
                ? "font-semibold text-gray-500"
                : "font-semibold"
            }
          >
            {formatPrettyDate(returnDate || toISODate())}
          </span>
        </div>
        <input
          id="return-date-hidden"
          type="date"
          className="w-0 h-0 opacity-0 absolute -z-10"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          disabled={tripType === "oneway"}
        />
      </div>

      {/* Passengers */}
      <div>
        <label className="block text-yellow-600 font-medium text-sm mb-1">
          No. of Passegers
        </label>
        <PassengerSelector value={paxData} onChange={setPaxData} />
      </div>

      {/* Class selection */}
      <div>
        <label className="block text-yellow-600 font-medium text-sm mb-1">
          Select Class
        </label>
        <select
          className="w-full px-3 py-2 font-semibold rounded text-black"
          value={travelClass}
          onChange={(e) => setTravelClass(e.target.value)}
        >
          <option value="economy">Economy</option>
          <option value="premium">Premium Economy</option>
          <option value="business">Business Class</option>
          <option value="firstclass">First Class</option>
        </select>
      </div>

      {/* Search button */}
      <button
        type="submit"
        className="md:col-span-1 px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-300 hover:border-2 hover:border-yellow-500 transition-all"
        disabled={loading}
      >
        {loading ? "Searching..." : hasSearched ? "Modify search" : "Search"}
      </button>

      {/* Special benefits */}
      <div>
        <SpecialBenefits
          selected={benefitTypes}
          setSelected={setBenefitTypes}
        />
      </div>
    </form>
  );
}
