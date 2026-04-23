import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FlightsSearchForm } from "@/components/flightsSearchPage/FlightsSearchForm";
import { FlightsDealsOffers } from "@/components/flightsSearchPage/FlightsDealsOffers";
import { FlightPageFooter } from "@/components/flightsSearchPage/FlightPageFooter";
import FlightTicket from "@/assets/FlightsSearchPage/FlightTicket.png";
import MainNavbar from "@/components/layout/MainNavbar";
import { HeaderNav } from "@/components/landingPage/HeaderNav";
import { useAuthUser } from "@/hooks/useAuthUser";

// CONSTANTS
const STORAGE_KEY = "user_flight_search_pref"; // Key to save data in browser

const toISODate = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const FlightsSearchPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // Get user status
  const { user } = useAuthUser();

  // --- HELPER: Load state from LocalStorage ---
  const getSavedState = (key, fallbackValue) => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Return the specific key if it exists, otherwise fallback
        return parsedData[key] !== undefined ? parsedData[key] : fallbackValue;
      }
    } catch (error) {
      console.error("Error loading search preferences:", error);
    }
    return fallbackValue;
  };

  // --- FORM STATE (Initialized with saved data or defaults) ---
  const [from, setFrom] = useState(() => getSavedState("from", ""));
  const [to, setTo] = useState(() => getSavedState("to", ""));
  const [departDate, setDepartDate] = useState(() =>
    getSavedState("departDate", toISODate()),
  );
  const [returnDate, setReturnDate] = useState(() =>
    getSavedState("returnDate", toISODate()),
  );
  const [tripType, setTripType] = useState(() =>
    getSavedState("tripType", "oneway"),
  );
  const [paxData, setPaxData] = useState(() =>
    getSavedState("paxData", { adult: 1, child: 0, infant: 0 }),
  );
  const [travelClass, setTravelClass] = useState(() =>
    getSavedState("travelClass", "economy"),
  );
  const [benefitTypes, setBenefitTypes] = useState(() =>
    getSavedState("benefitTypes", []),
  );

  // --- EFFECT: Save to LocalStorage whenever form changes ---
  useEffect(() => {
    const currentState = {
      from,
      to,
      departDate,
      returnDate,
      tripType,
      paxData,
      travelClass,
      benefitTypes,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
  }, [
    from,
    to,
    departDate,
    returnDate,
    tripType,
    paxData,
    travelClass,
    benefitTypes,
  ]);

  // --- HANDLER: Search Submission ---
  const handleSearch = async (formData) => {
    setLoading(true);

    const params = new URLSearchParams({
      from: formData.from,
      to: formData.to,
      departDate: formData.departDate,
      tripType: formData.tripType,
      adults: String(formData.paxData.adult || 1),
      travelClass: formData.travelClass,
      children: String(formData.paxData.child || 0),
      infants: String(formData.paxData.infant || 0),
    });

    if (formData.tripType === "roundtrip" && formData.returnDate) {
      params.append("returnDate", formData.returnDate);
    }
    formData.benefitTypes.forEach((b) => params.append("benefits", b));

    try {
      navigate(`/flights/search-results?${params.toString()}`);
    } catch (err) {
      console.error("SEARCH ERROR:", err);
      alert("Error processing search");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-white">
      {/* Conditional Navigation Rendering */}
      {user ? (
        <MainNavbar />
      ) : (
        <div className="bg-slate-600">
          {" "}
          <HeaderNav />
        </div>
      )}

      <div className="p-2 md:p-4">
        {/* Main gray container */}
        <div className="bg-slate-600 p-3 md:p-5 rounded-md mt-3 shadow-lg">
          {/* Title Section */}
          <div className="flex justify-center items-center p-3 md:p-5">
            <h1 className="text-center font-semibold text-xl md:text-3xl text-white">
              Book Your Flights Online Now!
            </h1>
            <img
              src={FlightTicket}
              alt="Flight Ticket Img"
              className="w-8 ml-2 md:w-12 h-auto object-contain"
            />
          </div>

          {/* White Form Container - Made Responsive */}
          <div className="bg-white rounded-md w-full max-w-7xl mx-auto pb-5 p-4 md:p-8 lg:p-10 text-slate-800">
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
              hasSearched={false}
              paxData={paxData}
              setPaxData={setPaxData}
              travelClass={travelClass}
              setTravelClass={setTravelClass}
              benefitTypes={benefitTypes}
              setBenefitTypes={setBenefitTypes}
              onSubmit={handleSearch}
            />
          </div>
        </div>

        <section id="best-deals" className="mt-6">
          <FlightsDealsOffers />
        </section>

        <FlightPageFooter />
      </div>
    </div>
  );
};
