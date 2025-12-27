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
  const [hasSearched, setHasSearched] = useState(false); // ← small tweak
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
    navigate("/flights"); // navigate to flights page first
    setTimeout(() => {
      const el = document.getElementById("best-deals");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200); // small delay so page has rendered
  };

  // Form state (restored from URL params ONCE)
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

  // =========  fetchFlights: use STATE, not searchParams =========
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

    // derive stops from checkboxes
    let stops = "0"; // 0 = any
    if (nonstopOnly) {
      stops = "1"; // nonstop only
    } else if (oneStopOrLess) {
      stops = "2"; // 1 stop or fewer
    }
    if (stops !== "0") {
      params.append("stops", stops);
    }

    // airline codes from checkboxes
    if (airlines.length > 0) {
      params.append("airline", airlines.join(",")); // backend -> include_airlines
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

  // ========= effect: run once on mount =========
  useEffect(() => {
    fetchFlights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonstopOnly, oneStopOrLess, airlines]);

  // ========= handleModifySearch: just update state, then fetch =========
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

  // helper to toggle airline checkbox
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
    <div className="min-h-screen bg-slate-200 text-white p-4">
      <MainNavbar />

      {/* Search summary + modify form (collapsible later) */}
      <div className="bg-slate-500 p-5 rounded-md mb-6">
        <div className="flex justify-between items-center">
          <div className="flex justify-center flex-1">
            <h1 className="text-center font-semibold text-3xl text-white">
              Modify Your Flight Search →
            </h1>
            <button
              type="button"
              onClick={handleModifyClick}
              className="ml-2 px-4 py-2 rounded-md border border-slate-400 text-sm font-semibold bg-yellow-400 text-slate-800 hover:bg-yellow-500"
            >
              {showSearchForm ? "Hide flight search" : "Click here to modify"}
            </button>
          </div>
          <button
            type="button"
            onClick={goToBestDeals}
            className="px-4 py-2 ml-2 flex items-center justify-center rounded-md border border-slate-400 text-sm font-semibold bg-slate-200 text-slate-800 hover:bg-white hover:font-semibold cursor-pointer"
          >
            <img
              src={BestDeals}
              alt="Beast Deals"
              className="w-3 mb-1 mr-2 lg:w-10 h-auto object-contain"
            />
            View Best Deals
          </button>
        </div>

        {showSearchForm && (
          <div className="bg-white rounded-md mx-30 mt-4 pb-5 p-10">
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

      {/* Filters + results layout */}
      <div className="mt-3">
        {/* Top bar with Filters button and result count */}
        <div>
          <div className="flex items-center justify-between text-slate-800">
            <div>
              <button
                type="button"
                onClick={() => setShowFilters((prev) => !prev)}
                className="px-4 py-1.5 rounded-md border border-slate-400 text-sm font-semibold bg-white text-slate-800 hover:bg-slate-100"
                disabled={!loading && flights.length === 0} //  disabled when no flights
              >
                {showFilters ? "Hide filters" : "Show filters"}
              </button>
            </div>
            <div>
              <h1 className="text-center font-bold text-3xl mb-4">
                Your Flight Results: {from} → {to}
              </h1>
              <p className="text-center text-lg font-medium">
                {departDate} {tripType === "roundtrip" && `→ ${returnDate}`} •{" "}
                {adult} {pluralize(adult, "Adult", "Adults")}
                {child > 0 &&
                  `, ${child} ${pluralize(child, "Child", "Children")}`}
                {infant > 0 &&
                  `, ${infant} ${pluralize(infant, "Infant", "Infants")}`}
              </p>
            </div>

            <div>
              <span className="text-sm text-slate-700">
                {!loading && flights.length > 0
                  ? `${flights.length} Flights found`
                  : !loading
                  ? "No flights found"
                  : "Searching..."}
              </span>
            </div>
          </div>

          {/* 2-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Left: filters column */}
            {showFilters && (
              <div className="md:col-span-1 my-3 bg-white border border-slate-700 rounded-lg p-3 text-slate-800">
                {/* Filters moved here */}
                <div className="flex flex-col gap-4">
                  {/* Stops checkboxes */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-700">
                      Stops
                    </span>
                    <label className="flex items-center text-xs text-slate-700">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={nonstopOnly}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setNonstopOnly(checked);
                          if (checked) setOneStopOrLess(false);
                        }}
                      />
                      Nonstop only
                    </label>
                    <label className="flex items-center text-xs text-slate-700">
                      <input
                        type="checkbox"
                        className="mr-2"
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
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-700">
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
                          className="flex items-center text-xs text-slate-700"
                        >
                          <input
                            type="checkbox"
                            className="mr-2"
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

            {/* Right: flights column */}
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
