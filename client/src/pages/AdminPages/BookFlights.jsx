import React, { useState, useEffect, useRef, useCallback } from "react";
import { FlightsSearchForm } from "@/components/flightsSearchPage/FlightsSearchForm";
import FlightTicket from "@/assets/FlightsSearchPage/FlightTicket.png";
import { FlightsSearchResults } from "@/components/flightsSearchPage/FlightsSearchResults";
import { FlightsResultsSkeleton } from "@/components/flightsSearchPage/FlightsResultsSkeleton";
import { apiGet } from "@/apiClient";
import { Filter } from "lucide-react";

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

  // UPDATED: Initial state set to false so filters are hidden initially
  const [showFilters, setShowFilters] = useState(false);

  const pluralize = (n, s, p) => (n === 1 ? s : p);

  const adult = paxData?.adult ?? 1;
  const child = paxData?.child ?? 0;
  const infant = paxData?.infant ?? 0;

  const scrollToResults = useCallback(() => {
    setTimeout(() => {
      const resultsContainer = document.getElementById("resultsContainer");
      if (resultsContainer) {
        resultsContainer.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        setTimeout(() => {
          window.scrollBy({ top: -50, behavior: "smooth" });
        }, 50);
      }
    }, 50);
  }, []);

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

    try {
      const res = await apiGet(`/flights/search?${params.toString()}`);
      const data = await res.json();

      if (data.status) {
        const all = [...(data.bestFlights || []), ...(data.otherFlights || [])];
        setFlights(all);
        setTimeout(() => {
          if (all.length > 0) {
            scrollToResults();
          }
        }, 300);
      } else {
        setFlights([]);
      }
    } catch (err) {
      console.error("SEARCH ERROR:", err);
      const message = err.message || "Something went wrong.";
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

  const handleSearch = async (formData) => {
    setLoading(true);
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
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="flex justify-center items-center mb-4 md:mb-6">
        <h1 className="text-center font-semibold text-2xl md:text-3xl text-slate-800">
          Book Flights
        </h1>
        <img
          src={FlightTicket}
          alt="Flight Ticket Img"
          className="w-8 ml-2 md:w-12 h-auto object-contain"
        />
      </div>

      <div className="bg-white border border-slate-400 rounded-md shadow-md w-full max-w-5xl mx-auto p-4 md:p-8 pb-6">
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

      <div className="mt-8 md:mt-12 w-full max-w-7xl mx-auto">
        <div id="resultsContainer">
          <div className="text-center mb-6">
            <h1 className="font-bold text-xl md:text-3xl mb-2 text-slate-800">
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

          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-slate-400 text-sm font-semibold bg-white text-slate-800 hover:bg-slate-100 transition-colors shadow-sm"
              disabled={!loading && flights.length === 0}
            >
              <Filter className="w-4 h-4" />
              {showFilters ? "Hide filters" : "Show filters"}
            </button>

            <span className="text-sm text-slate-700 font-medium">
              {!loading && flights.length > 0
                ? `${flights.length} Flights found`
                : !loading
                ? "No flights found"
                : "Searching..."}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 relative">
            {showFilters && (
              <div className="md:col-span-1 h-fit bg-white border border-slate-200 rounded-lg p-4 shadow-sm text-slate-800">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-bold text-slate-900 border-b pb-1">
                      Stops
                    </span>
                    <label className="flex items-center text-sm text-slate-700 cursor-pointer hover:bg-slate-50 p-1 rounded">
                      <input
                        type="checkbox"
                        className="mr-3 w-4 h-4 accent-slate-600"
                        checked={nonstopOnly}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setNonstopOnly(checked);
                          if (checked) setOneStopOrLess(false);
                        }}
                      />
                      Nonstop only
                    </label>
                    <label className="flex items-center text-sm text-slate-700 cursor-pointer hover:bg-slate-50 p-1 rounded">
                      <input
                        type="checkbox"
                        className="mr-3 w-4 h-4 accent-slate-600"
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

                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-bold text-slate-900 border-b pb-1">
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
                          className="flex items-center text-sm text-slate-700 cursor-pointer hover:bg-slate-50 p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            className="mr-3 w-4 h-4 accent-slate-600"
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

            <div className={showFilters ? "md:col-span-3" : "md:col-span-4"}>
              {loading ? (
                <div className="bg-slate-700 p-4 md:p-6 rounded-lg">
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
  );
};
