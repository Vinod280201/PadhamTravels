import React, { useState, useEffect, useRef, useCallback } from "react";
import { FlightsSearchForm } from "@/components/flightsSearchPage/FlightsSearchForm";
import FlightTicket from "@/assets/FlightsSearchPage/FlightTicket.png";
import { FlightsSearchResults } from "@/components/flightsSearchPage/FlightsSearchResults";
import { FlightsResultsSkeleton } from "@/components/flightsSearchPage/FlightsResultsSkeleton";
import { apiGet } from "@/apiClient";

const toISODate = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const BookFlights = () => {
  const [loading, setLoading] = useState(false);

  //ref for results container
  const resultsRef = useRef(null);

  // Form state
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState(toISODate());
  const [returnDate, setReturnDate] = useState(toISODate());
  const [tripType, setTripType] = useState("oneway");
  const [paxData, setPaxData] = useState({ adult: 1, child: 0, infant: 0 });
  const [travelClass, setTravelClass] = useState("economy");
  const [benefitTypes, setBenefitTypes] = useState([]);

  //state for results + filters + meta
  const [flights, setFlights] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [nonstopOnly, setNonstopOnly] = useState(false);
  const [oneStopOrLess, setOneStopOrLess] = useState(false);
  const [airlines, setAirlines] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const pluralize = (n, s, p) => (n === 1 ? s : p);

  const adult = paxData?.adult ?? 1;
  const child = paxData?.child ?? 0;
  const infant = paxData?.infant ?? 0;

  const scrollToResults = useCallback(() => {
    // Use setTimeout to ensure DOM has updated
    setTimeout(() => {
      const resultsContainer = document.getElementById("resultsContainer");
      if (resultsContainer) {
        resultsContainer.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Extra scroll to make sure form is out of view
        setTimeout(() => {
          window.scrollBy({ top: -50, behavior: "smooth" });
        }, 50);
      }
    }, 50); // Small delay for DOM update
  }, []);

  // helper to call backend and update flights
  const fetchFlights = async (formData) => {
    setLoading(true);

    const params = new URLSearchParams({
      from: formData.from,
      to: formData.to,
      departDate: formData.departDate,
      tripType: formData.tripType,
      adults: String(formData.paxData.adult || 1),
      children: String(formData.paxData.child || 0),
      infants: String(formData.paxData.infant || 0),
      travelClass: formData.travelClass,
    });

    if (formData.tripType === "roundtrip" && formData.returnDate) {
      params.append("returnDate", formData.returnDate);
    }

    formData.benefitTypes.forEach((b) => params.append("benefits", b));

    // derive stops from checkboxes
    let stops = "0";
    if (nonstopOnly) {
      stops = "1";
    } else if (oneStopOrLess) {
      stops = "2";
    }
    if (stops !== "0") {
      params.append("stops", stops);
    }

    // airline codes from checkboxes
    if (airlines.length > 0) {
      params.append("airline", airlines.join(","));
    }

    try {
      const res = await apiGet(`/flights/search?${params.toString()}`);
      const data = await res.json();

      if (data.status) {
        const all = [...(data.bestFlights || []), ...(data.otherFlights || [])];
        setFlights(all);
        // SCROLL AFTER state update & re-render
        setTimeout(() => {
          if (all.length > 0) {
            scrollToResults();
          }
        }, 300); // Wait for re-render
      } else {
        setFlights([]);
      }
    } catch (err) {
      console.error("SEARCH ERROR:", err);
      const message = err.message || "Something went wrong.";
      // Auth error: show message, then redirect to login page After user clicks OK
      if (
        message.toLowerCase().includes("unauthorized") ||
        message.toLowerCase().includes("session expired")
      ) {
        alert("Session expired or unauthorized. Please login again.");
        console.log("Redirecting to /login now");
        window.location.href = "/login";
      } else {
        alert(message || "Something went wrong while searching flights.");
      }

      setFlights([]);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  // receives formData from FlightsSearchForm
  const handleSearch = async (formData) => {
    setLoading(true);
    // keep form state in sync so summary uses latest values
    setFrom(formData.from);
    setTo(formData.to);
    setDepartDate(formData.departDate);
    setReturnDate(formData.returnDate || "");
    setTripType(formData.tripType);
    setPaxData(formData.paxData);
    setTravelClass(formData.travelClass);
    setBenefitTypes(formData.benefitTypes);

    await fetchFlights(formData);
  };

  // refetch when filters (stops/airlines) change after first search
  useEffect(() => {
    if (!hasSearched) return;
    fetchFlights({
      from,
      to,
      departDate,
      returnDate,
      tripType,
      paxData,
      travelClass,
      benefitTypes,
    });
  }, [nonstopOnly, oneStopOrLess, airlines]);

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
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="flex justify-center items-center mb-3">
        <h1 className="text-center font-semibold text-3xl text-slate-800">
          Book Flights
        </h1>
        <img
          src={FlightTicket}
          alt="Flight Ticket Img"
          className="w-3 ml-2 lg:w-12 h-auto object-contain"
        />
      </div>

      <div className="bg-white border border-slate-400 rounded-md mx-30 pb-5 p-10 shadow-md">
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
          loading={loading}
          hasSearched={hasSearched}
          paxData={paxData}
          setPaxData={setPaxData}
          travelClass={travelClass}
          setTravelClass={setTravelClass}
          benefitTypes={benefitTypes}
          setBenefitTypes={setBenefitTypes}
          onSubmit={handleSearch}
        />
      </div>

      {/* Filters + results layout */}
      <div className="mt-12">
        <div id="resultsContainer">
          {/* Top bar with Filters button and result count */}
          <div>
            <div className="flex items-center justify-between text-slate-800">
              <div>
                <button
                  type="button"
                  onClick={() => setShowFilters((prev) => !prev)}
                  className="px-4 py-1.5 rounded-md border border-slate-400 text-sm font-semibold bg-white text-slate-800 hover:bg-slate-100"
                  disabled={!loading && flights.length === 0}
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
        </div>
      </div>
    </div>
  );
};
