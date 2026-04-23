import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { FlightsSearchForm } from "@/components/flightsSearchPage/FlightsSearchForm";
import FlightTicket from "@/assets/FlightsSearchPage/FlightTicket.png";
import { FlightsSearchResults } from "@/components/flightsSearchPage/FlightsSearchResults";
import { FlightsResultsSkeleton } from "@/components/flightsSearchPage/FlightsResultsSkeleton";
import { Filter, AlertCircle } from "lucide-react";
import axios from "axios";
import { apiPost, apiGet } from "@/apiClient";

const toISODate = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const loadState = (key, defaultVal) => {
  try {
    const stored = sessionStorage.getItem(`flightSearch_${key}`);
    return stored ? JSON.parse(stored) : defaultVal;
  } catch {
    return defaultVal;
  }
};

export const BookFlights = () => {
  const [loading, setLoading] = useState(false);
  const [isSynced, setIsSynced] = useState(
    localStorage.getItem("agencySynced") === "true",
  );
  
  const location = useLocation();

  // Form state (persisted via loadState)
  const [from, setFrom] = useState(() => loadState("from", ""));
  const [to, setTo] = useState(() => loadState("to", ""));
  const [departDate, setDepartDate] = useState(() => loadState("departDate", toISODate()));
  const [returnDate, setReturnDate] = useState(() => loadState("returnDate", toISODate()));
  const [tripType, setTripType] = useState(() => loadState("tripType", "oneway"));
  const [paxData, setPaxData] = useState(() => loadState("paxData", { adult: 1, child: 0, infant: 0 }));
  const [travelClass, setTravelClass] = useState(() => loadState("travelClass", "economy"));
  const [benefitTypes, setBenefitTypes] = useState(() => loadState("benefitTypes", []));

  // Results state (persisted)
  const [flights, setFlights] = useState(() => loadState("flights", null));
  const [hasSearched, setHasSearched] = useState(() => loadState("hasSearched", false));
  const [pollingId, setPollingId] = useState(() => loadState("pollingId", ""));
  const [nonstopOnly, setNonstopOnly] = useState(() => loadState("nonstopOnly", false));
  const [airlines, setAirlines] = useState(() => loadState("airlines", []));
  const [showFilters, setShowFilters] = useState(false);

  // Clear search results when directed from an expired session's OK button
  useEffect(() => {
    if (location.state?.clearSearch) {
      setFlights(null);
      setHasSearched(false);
      setPollingId("");
      sessionStorage.removeItem("flightSearch_flights");
      sessionStorage.removeItem("flightSearch_hasSearched");
      sessionStorage.removeItem("flightSearch_pollingId");
      
      // Clear the history state so refreshing doesn't keep clearing accidentally
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Effect to save state to session storage
  useEffect(() => {
    sessionStorage.setItem("flightSearch_from", JSON.stringify(from));
    sessionStorage.setItem("flightSearch_to", JSON.stringify(to));
    sessionStorage.setItem("flightSearch_departDate", JSON.stringify(departDate));
    sessionStorage.setItem("flightSearch_returnDate", JSON.stringify(returnDate));
    sessionStorage.setItem("flightSearch_tripType", JSON.stringify(tripType));
    sessionStorage.setItem("flightSearch_paxData", JSON.stringify(paxData));
    sessionStorage.setItem("flightSearch_travelClass", JSON.stringify(travelClass));
    sessionStorage.setItem("flightSearch_benefitTypes", JSON.stringify(benefitTypes));
    sessionStorage.setItem("flightSearch_flights", JSON.stringify(flights));
    sessionStorage.setItem("flightSearch_hasSearched", JSON.stringify(hasSearched));
    sessionStorage.setItem("flightSearch_pollingId", JSON.stringify(pollingId));
    sessionStorage.setItem("flightSearch_nonstopOnly", JSON.stringify(nonstopOnly));
    sessionStorage.setItem("flightSearch_airlines", JSON.stringify(airlines));
  }, [from, to, departDate, returnDate, tripType, paxData, travelClass, benefitTypes, flights, hasSearched, pollingId, nonstopOnly, airlines]);

  const pluralize = (n, s, p) => (n === 1 ? s : p);
  const adult = paxData?.adult ?? 1;
  const child = paxData?.child ?? 0;
  const infant = paxData?.infant ?? 0;

  // Verify sync status on page load
  useEffect(() => {
    const checkSync = async () => {
      try {
        const res = await apiGet("/admin/sync-status");
        const data = await res.json();
        setIsSynced(data.isSynced);
        if (data.isSynced) {
          localStorage.setItem("agencySynced", "true");
        } else {
          localStorage.removeItem("agencySynced");
        }
      } catch (err) {
        console.error("Sync check failed");
      }
    };
    checkSync();
  }, []);

  const scrollToResults = () => {
    const container = document.getElementById("resultsContainer");
    if (container) {
      container.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const fetchFlights = async (formData) => {
    if (!isSynced) {
      alert("Please login to the Agency API on the Dashboard first.");
      return;
    }

    setLoading(true);
    setLoading(true);

    // 1. Map frontend form to Backend API expectations
    // 1. Map frontend form to Backend API expectations (Query Params)
    const params = new URLSearchParams({
      from: formData.from,
      to: formData.to,
      departDate: formData.departDate,
      tripType: formData.tripType,
      adults: String(formData.paxData.adult || 1),
      children: String(formData.paxData.child || 0),
      infants: String(formData.paxData.infant || 0),
      // Ensure travelClass is capitalized (Economy, Business, etc.) as API is strict
      travelClass: formData.travelClass.charAt(0).toUpperCase() + formData.travelClass.slice(1).toLowerCase(),
    });

    if (formData.tripType === "roundtrip" && formData.returnDate) {
      params.append("returnDate", formData.returnDate);
    }

    try {
      const res = await apiGet(`/flights/search?${params.toString()}`);
      const data = await res.json();

      if (data && data.status) {
        // Pass the flights array directly
        setFlights(data.flights || []);
        setPollingId(data.pollingId || "");
        setTimeout(scrollToResults, 100);
      } else {
        setFlights([]);
      }
    } catch (err) {
      console.error("SEARCH ERROR:", err);
      const msg = err.message || "Search failed";
      alert(`Search failed: ${msg}`);
      setFlights([]);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  const handleSearch = (formData) => {
    // Sync local state with form data for the header display
    setFrom(formData.from);
    setTo(formData.to);
    setDepartDate(formData.departDate);
    setTripType(formData.tripType);
    setPaxData(formData.paxData);
    setTravelClass(formData.travelClass);

    fetchFlights(formData);
  };

  const toggleAirline = (code, checked) => {
    setAirlines((prev) =>
      checked ? [...prev, code] : prev.filter((c) => c !== code),
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      {!isSynced && (
        <div className="max-w-5xl mx-auto mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 text-amber-800">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">
            Agency API not synced. Please go to the <strong>Dashboard</strong>{" "}
            and click <strong>Agency Login</strong> to enable flight searching.
          </p>
        </div>
      )}

      <div className="flex justify-center items-center mb-6">
        <h1 className="font-bold text-3xl text-slate-800 tracking-tight">
          Book Your Journey
        </h1>
        <img src={FlightTicket} alt="Icon" className="w-10 ml-3 h-auto" />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-5xl mx-auto p-6 md:p-10 mb-10">
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

      <div
        id="resultsContainer"
        className="w-full max-w-7xl mx-auto mt-10 scroll-mt-10"
      >
        {hasSearched && (
          <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-2">
              {from} <span className="text-blue-500">→</span> {to}
            </h2>
            <p className="text-slate-500 font-medium lowercase">
              {departDate} • {adult} {pluralize(adult, "adult", "adults")}
              {child > 0 &&
                ` • ${child} ${pluralize(child, "child", "children")}`}
              {infant > 0 &&
                ` • ${infant} ${pluralize(infant, "infant", "infants")}`}{" "}
              • {travelClass}
            </p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          {hasSearched && !loading && (
            <div className="w-full md:w-64 space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-4">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Filter size={16} /> Filters
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">
                      Stops
                    </p>
                    <label className="flex items-center gap-2 text-sm text-slate-600 mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={nonstopOnly}
                        onChange={(e) => setNonstopOnly(e.target.checked)}
                        className="rounded text-blue-600"
                      />
                      Non-stop
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results List */}
          <div className="flex-1">
            {loading ? (
              <FlightsResultsSkeleton />
            ) : (
              <FlightsSearchResults
                flights={flights}
                hasSearched={hasSearched}
                loading={loading}
                pollingId={pollingId}
                paxData={paxData}
                departDate={departDate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
