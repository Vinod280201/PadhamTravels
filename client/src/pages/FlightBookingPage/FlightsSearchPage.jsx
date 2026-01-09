import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlightsSearchForm } from "@/components/flightsSearchPage/FlightsSearchForm";
import { FlightsDealsOffers } from "@/components/flightsSearchPage/FlightsDealsOffers";
import { FlightPageFooter } from "@/components/flightsSearchPage/FlightPageFooter";
import FlightTicket from "@/assets/FlightsSearchPage/FlightTicket.png";
import MainNavbar from "@/components/layout/MainNavbar";

const toISODate = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const FlightsSearchPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form state
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState(toISODate());
  const [returnDate, setReturnDate] = useState(toISODate());
  const [tripType, setTripType] = useState("oneway");
  const [paxData, setPaxData] = useState({ adult: 1, child: 0, infant: 0 });
  const [travelClass, setTravelClass] = useState("economy");
  const [benefitTypes, setBenefitTypes] = useState([]);

  // receives formData
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
      <MainNavbar />

      <div className="p-4">
        <div className="bg-slate-600 p-5 rounded-md mt-3">
          <div className="flex justify-center items-center p-5">
            <h1 className="text-center font-semibold text-3xl text-white">
              Book Your Flights Online Now!
            </h1>
            <img
              src={FlightTicket}
              alt="Flight Ticket Img"
              className="w-3 ml-2 lg:w-12 h-auto object-contain"
            />
          </div>

          <div className="bg-white rounded-md mx-30 pb-5 p-10">
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
              hasSearched={false} // Always false on search page
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
        <section id="best-deals">
          <FlightsDealsOffers />
        </section>
        <FlightPageFooter />
      </div>
    </div>
  );
};
