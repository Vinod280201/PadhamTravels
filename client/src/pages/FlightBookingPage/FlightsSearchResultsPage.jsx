import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FlightsSearchForm } from "@/components/flightsSearchPage/FlightsSearchForm";
import { FlightsSearchResults } from "@/components/flightsSearchPage/FlightsSearchResults";
import { FlightPageFooter } from "@/components/flightsSearchPage/FlightPageFooter";
import BestDeals from "@/assets/FlightsSearchPage/BestDeals.png";
import { FlightsResultsSkeleton } from "@/components/flightsSearchPage/FlightsResultsSkeleton";
import { apiGet } from "@/apiClient";
import MainNavbar from "@/components/layout/MainNavbar";

const toISODate = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const FlightsSearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const pluralize = (n, s, p) => (n === 1 ? s : p);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [nonstopOnly, setNonstopOnly] = useState(false);
  const [oneStopOrLess, setOneStopOrLess] = useState(false);
  const [airlines, setAirlines] = useState([]);
  const [showFilters, setShowFilters] = useState(true);

  const handleModifyClick = () => {
    setShowSearchForm((prev) => !prev);
  };

  const goToBestDeals = () => {
    navigate("/flights");
    setTimeout(() => {
      const el = document.getElementById("best-deals");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
  };

  // Form state
  const [from, setFrom] = useState(searchParams.get("from") || "");
  const [to, setTo] = useState(searchParams.get("to") || "");
  const [departDate, setDepartDate] = useState(
    searchParams.get("departDate") || toISODate()
  );
  const [returnDate, setReturnDate] = useState(
    searchParams.get("returnDate") || ""
  );
  const [tripType, setTripType] = useState(
    searchParams.get("tripType") || "oneway"
  );
  const [paxData, setPaxData] = useState({
    adult: parseInt(searchParams.get("adults")) || 1,
    child: parseInt(searchParams.get("children")) || 0,
    infant: parseInt(searchParams.get("infants")) || 0,
  });
  const [travelClass, setTravelClass] = useState(
    searchParams.get("travelClass") || "economy"
  );
  const [benefitTypes, setBenefitTypes] = useState([]);

  // Fetch Flights Logic
  const fetchFlights = async () => {
    setLoading(true);

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

    if (returnDate) {
      params.append("returnDate", returnDate);
    }

    let stops = "0";
    if (nonstopOnly) {
      stops = "1";
    } else if (oneStopOrLess) {
      stops = "2";
    }
    if (stops !== "0") {
      params.append("stops", stops);
    }

    if (airlines.length > 0) {
      params.append("airline", airlines.join(","));
    }
    benefitTypes.forEach((b) => params.append("benefits", b));

    try {
      const res = await apiGet(`/flights/search?${params.toString()}`);
      const data = await res.json();

      if (data.status) {
        const all = [...(data.bestFlights || []), ...(data.otherFlights || [])];
        setFlights(all);
      } else {
        setFlights([]);
      }
    } catch (err) {
      console.error("FLIGHTS SEARCH ERROR:", err);
      if (err.message?.toLowerCase().includes("session expired")) {
        alert("Session expired. Please login again.");
        window.location.href = "/login";
      } else {
        alert(err.message || "Unable to load flight results.");
      }
      setFlights([]);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  useEffect(() => {
    fetchFlights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonstopOnly, oneStopOrLess, airlines]);

  const handleModifySearch = (formData) => {
    const nextPax = formData.paxData || {
      adult: paxData?.adult ?? 1,
      child: paxData?.child ?? 0,
      infant: paxData?.infant ?? 0,
    };

    setFrom(formData.from ?? from);
    setTo(formData.to ?? to);
    setDepartDate(formData.departDate ?? departDate);
    setReturnDate(formData.returnDate ?? returnDate);
    setTripType(formData.tripType ?? tripType);
    setPaxData(nextPax);
    setTravelClass(formData.travelClass ?? travelClass);
    setBenefitTypes(formData.benefitTypes ?? benefitTypes);

    fetchFlights();
    setShowSearchForm(false);
  };

  const adult = paxData?.adult ?? 1;
  const child = paxData?.child ?? 0;
  const infant = paxData?.infant ?? 0;

  const toggleAirline = (code, checked) => {
    setAirlines((prev) => {
      if (checked) {
        if (prev.includes(code)) return prev;
        return [...prev, code];
      }
      return prev.filter((c) => c !== code);
    });
  };

  return (
    <div className="min-h-screen bg-slate-200 text-white">
      <MainNavbar />

      <div className="p-2 md:p-4">
        {/* --- Top Gray Header Box --- */}
        <div className="bg-slate-500 p-4 md:p-5 rounded-md mt-3 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Title & Modify Button */}
            <div className="flex flex-col md:flex-row justify-center items-center flex-1 gap-3 w-full lg:w-auto">
              <h1 className="text-center font-semibold text-xl md:text-3xl text-white">
                Modify Your Flight Search →
              </h1>
              <button
                type="button"
                onClick={handleModifyClick}
                className="w-full md:w-auto px-4 py-2 rounded-md border border-slate-400 text-sm font-semibold bg-yellow-400 text-slate-800 hover:bg-yellow-500 transition-colors"
              >
                {showSearchForm ? "Hide flight search" : "Click here to modify"}
              </button>
            </div>

            {/* Best Deals Button */}
            <button
              type="button"
              onClick={goToBestDeals}
              className="w-full lg:w-auto px-4 py-2 flex items-center justify-center rounded-md border border-slate-400 text-sm font-semibold bg-slate-200 text-slate-800 hover:bg-white hover:font-semibold cursor-pointer transition-colors"
            >
              <img
                src={BestDeals}
                alt="Best Deals"
                className="w-6 md:w-8 lg:w-10 h-auto object-contain mr-2"
              />
              View Best Deals
            </button>
          </div>

          {/* --- Collapsible Search Form --- */}
          {showSearchForm && (
            // FIX: Removed mx-30, added responsive width & padding
            <div className="bg-white rounded-md w-full max-w-6xl mx-auto mt-4 pb-5 p-4 md:p-10 text-slate-900">
              <FlightsSearchForm
                from={from}
                to={to}
                setFrom={setFrom}
                setTo={setTo}
                departDate={departDate}
                setDepartDate={setDepartDate}
                returnDate={returnDate}
                setReturnDate={setReturnDate}
                tripType={tripType}
                setTripType={setTripType}
                paxData={paxData}
                setPaxData={setPaxData}
                travelClass={travelClass}
                setTravelClass={setTravelClass}
                benefitTypes={benefitTypes}
                setBenefitTypes={setBenefitTypes}
                loading={loading}
                hasSearched={hasSearched}
                onSubmit={handleModifySearch}
              />
            </div>
          )}
        </div>

        {/* --- Results Section --- */}
        <div className="mt-3">
          {/* Summary Header */}
          <div className="flex flex-col md:flex-row items-center justify-between text-slate-800 mb-4 gap-4">
            {/* Toggle Filters Button */}
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="w-full md:w-auto px-4 py-2 rounded-md border border-slate-400 text-sm font-semibold bg-white text-slate-800 hover:bg-slate-100 transition-colors"
              disabled={!loading && flights.length === 0}
            >
              {showFilters ? "Hide filters" : "Show filters"}
            </button>

            {/* Route & Passenger Info */}
            <div className="text-center">
              <h1 className="font-bold text-xl md:text-3xl mb-1 md:mb-2">
                Your Flight Results: {from} → {to}
              </h1>
              <p className="text-sm md:text-lg font-medium text-slate-600">
                {departDate} {tripType === "roundtrip" && `→ ${returnDate}`} •{" "}
                {adult} {pluralize(adult, "Adult", "Adults")}
                {child > 0 &&
                  `, ${child} ${pluralize(child, "Child", "Children")}`}
                {infant > 0 &&
                  `, ${infant} ${pluralize(infant, "Infant", "Infants")}`}
              </p>
            </div>

            {/* Flight Count */}
            <div>
              <span className="text-sm font-medium text-slate-700 bg-white px-3 py-1 rounded-full shadow-sm">
                {!loading && flights.length > 0
                  ? `${flights.length} Flights found`
                  : !loading
                  ? "No flights found"
                  : "Searching..."}
              </span>
            </div>
          </div>

          {/* --- Main Content Grid --- */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Left: Filters Sidebar */}
            {showFilters && (
              <div className="md:col-span-1 md:sticky md:top-20 h-fit bg-white border border-slate-300 rounded-lg p-4 text-slate-800 shadow-sm">
                <div className="flex flex-col gap-6">
                  {/* Stops checkboxes */}
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-bold text-slate-800 border-b pb-1">
                      Stops
                    </span>
                    <label className="flex items-center text-sm text-slate-700 cursor-pointer hover:text-blue-600">
                      <input
                        type="checkbox"
                        className="mr-2 accent-yellow-500 h-4 w-4"
                        checked={nonstopOnly}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setNonstopOnly(checked);
                          if (checked) setOneStopOrLess(false);
                        }}
                      />
                      Nonstop only
                    </label>
                    <label className="flex items-center text-sm text-slate-700 cursor-pointer hover:text-blue-600">
                      <input
                        type="checkbox"
                        className="mr-2 accent-yellow-500 h-4 w-4"
                        checked={oneStopOrLess}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setOneStopOrLess(checked);
                          if (checked) setNonstopOnly(false);
                        }}
                      />
                      1 stop or fewer
                    </label>
                  </div>

                  {/* Airlines checkboxes */}
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-bold text-slate-800 border-b pb-1">
                      Airlines
                    </span>
                    {[
                      { code: "AI", label: "Air India" },
                      { code: "6E", label: "IndiGo" },
                      { code: "UK", label: "Vistara" },
                    ].map((a) => {
                      const checked = airlines.includes(a.code);
                      return (
                        <label
                          key={a.code}
                          className="flex items-center text-sm text-slate-700 cursor-pointer hover:text-blue-600"
                        >
                          <input
                            type="checkbox"
                            className="mr-2 accent-yellow-500 h-4 w-4"
                            checked={checked}
                            onChange={(e) => {
                              toggleAirline(a.code, e.target.checked);
                            }}
                          />
                          {a.label}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Right: Flights Results List */}
            {/* Expands to full width if filters are hidden, otherwise takes 5 cols */}
            <div className={showFilters ? "md:col-span-5" : "md:col-span-6"}>
              {loading ? (
                <div className="bg-slate-700 p-5 rounded-lg">
                  <FlightsResultsSkeleton />
                </div>
              ) : (
                <FlightsSearchResults
                  flights={flights}
                  hasSearched={hasSearched}
                  loading={loading}
                />
              )}
            </div>
          </div>
        </div>

        <FlightPageFooter />
      </div>
    </div>
  );
};
