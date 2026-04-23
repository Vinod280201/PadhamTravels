import React, { useState } from "react";
import { FaPlane, FaClock } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { AIRLINE_MAP } from "../../constants/AppConstants";
import { LoginModal } from "@/components/auth/LoginModal";

// Use a NAMED EXPORT to fix the SyntaxError
export const FlightsSearchResults = ({ flights, hasSearched, loading, pollingId, paxData, departDate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminSearch = location.pathname.startsWith("/admin");
  const [expandedFlightIdx, setExpandedFlightIdx] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState(null);

  const handleBookClick = (stateData) => {
    const userStr = localStorage.getItem("authUser");
    if (!userStr && !isAdminSearch) {
      setPendingBookingData(stateData);
      setIsLoginModalOpen(true);
    } else {
      navigate(isAdminSearch ? "/admin/book-flight-details" : "/book-flight-details", {
        state: stateData
      });
    }
  };
  
  const getFlightList = () => {
    if (!Array.isArray(flights)) return [];
    
    // Check if we have the old nested structure (Journey Objects instead of Flight Objects)
    // A valid flight object has 'OD' and 'fares'. If missing, it might be a wrapper.
    if (flights.length > 0) {
        const firstItem = flights[0];
        if (!firstItem.OD && !firstItem.fares) {
           console.log("⚠️ Detected nested flight structure. Flattening on client...");
           let flattened = [];
           flights.forEach(item => {
              // Iterate over keys in the object (e.g., flight IDs)
              Object.values(item).forEach(val => {
                 if (val && typeof val === 'object' && val.OD && val.fares) {
                     flattened.push(val);
                 }
              });
           });
           return flattened;
        }
    }
    return flights;
  };

  const flightList = getFlightList();
  
  // Sort flights by total fare (Ascending)
  const sortedFlightList = [...flightList].sort((a, b) => {
    const fareA = parseFloat(a.fares?.[0]?.totalFare?.TF || 0);
    const fareB = parseFloat(b.fares?.[0]?.totalFare?.TF || 0);
    return fareA - fareB;
  });

  return (
    <div className="my-3 p-2 bg-slate-100 rounded-md min-h-[200px]">
      <div className="py-2 md:py-4 space-y-4">
        {sortedFlightList.length > 0 ? (
          sortedFlightList.map((f, idx) => {
            const segments = f.OD?.[0]?.FS;
            // Relaxed validation: Use fallbacks if data is missing to ensure something renders
            const firstSegment = segments?.[0] || {};
            const lastSegment = segments?.[segments.length - 1] || firstSegment;
            // Try to find fare in fares array, or construct from root if available
            const fare = f.fares?.[0] || { 
              cabin: f.cabin || "Economy", 
              totalFare: f.totalFare || { TF: 0 },
              refundable: f.refundable || "false"
            };

            // Only return null if absolutely no segment info (which means no flight content)
            if (!segments || segments.length === 0) {
                 console.error("Missing flight segments:", f);
                 return null;
            }

            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 shadow-sm border border-slate-200"
              >
                <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                  <div className="flex items-center gap-4 md:w-1/4">
                    <div className="w-12 h-12 shrink-0 relative flex items-center justify-center">
                      <img 
                         src={`https://pics.avs.io/150/150/${firstSegment.ac}.png`} 
                         onError={(e) => { e.target.onerror = null; e.target.style.display='none'; if(e.target.nextElementSibling) e.target.nextElementSibling.style.display='flex'; }} 
                         alt={firstSegment.aname} 
                         className="w-full h-full object-contain" 
                      />
                      <div className="w-full h-full bg-blue-600 rounded-lg hidden items-center justify-center text-white font-bold text-lg absolute inset-0">
                        {firstSegment.ac || "NA"}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">
                        {AIRLINE_MAP[firstSegment.ac?.toUpperCase()] || firstSegment.aname || "Airline"}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold uppercase">
                        {firstSegment.ac}-{firstSegment.fl} • {fare.cabin}
                        {segments.length > 1 && <span className="ml-1 text-orange-500">({segments.length - 1} stop)</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-3 items-center gap-4 w-full text-center">
                    <div>
                      <p className="text-2xl font-black text-slate-800">
                        {firstSegment.dd || "--:--"}
                      </p>
                      <p className="text-sm font-bold text-blue-600">
                        {firstSegment.dac || "---"}
                      </p>
                    </div>

                    <div className="flex flex-col items-center">
                      <p className="text-[10px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                        <FaClock /> {f.OD?.[0]?.tdu}
                      </p>
                      <div className="w-full flex items-center">
                        <div className="h-0.5 flex-1 bg-slate-200"></div>
                        <FaPlane className="mx-2 text-slate-300" />
                        <div className="h-0.5 flex-1 bg-slate-200"></div>
                      </div>
                    </div>

                    <div>
                      <p className="text-2xl font-black text-slate-800">
                        {lastSegment.ad || "--:--"}
                      </p>
                      <p className="text-sm font-bold text-blue-600">
                        {lastSegment.aac || "---"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-3 w-full md:w-auto">
                    <div className="text-left md:text-right">
                      <p className="text-2xl font-black text-blue-700">
                        ₹
                        {fare.totalFare?.TF
                          ? parseInt(fare.totalFare.TF).toLocaleString("en-IN")
                          : "0"}
                      </p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-green-100 text-green-700 uppercase">
                        {fare.refundable === "true"
                          ? "Refundable"
                          : "Non-Refundable"}
                      </span>
                    </div>
                    <button 
                      onClick={() => setExpandedFlightIdx(expandedFlightIdx === idx ? null : idx)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-all active:scale-95 shadow-md">
                      {expandedFlightIdx === idx ? "Hide Details" : "View Details"}
                    </button>
                  </div>
                </div>

                {/* Expanded Flight Details View */}
                {expandedFlightIdx === idx && (
                  <div className="mt-5 border-t border-slate-200 pt-5">
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Left side: Flight Segments */}
                      <div className="flex-1 lg:border-r border-slate-200 lg:pr-6 space-y-4">
                        <h4 className="font-bold text-slate-800 mb-3 text-lg">Flight Itinerary</h4>
                        {segments.map((seg, sIdx) => (
                          <div key={sIdx} className="flex gap-4 items-start relative pb-4">
                            {sIdx !== segments.length - 1 && (
                               <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-slate-300"></div>
                            )}
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 z-10 mt-0.5">
                              <FaPlane className="text-blue-600 text-[10px]" />
                            </div>
                            <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                              <div className="flex justify-between items-center mb-1">
                                <div className="text-left">
                                  <span className="font-black text-slate-800 text-base">{seg.dd}</span>
                                  <p className="text-xs font-bold text-blue-600">{seg.dac}</p>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                  <span className="text-[10px] text-slate-500 font-bold bg-slate-200 px-3 py-0.5 rounded-full">{seg.du}</span>
                                </div>
                                <div className="text-right">
                                  <span className="font-black text-slate-800 text-base">{seg.ad}</span>
                                  <p className="text-xs font-bold text-blue-600">{seg.aac}</p>
                                </div>
                              </div>
                              <p className="text-xs text-slate-600 font-medium mt-2">
                                {AIRLINE_MAP[seg.ac?.toUpperCase()] || seg.aname} • {seg.ac}-{seg.fl} • {seg.eq || "Aircraft Info N/A"} • {seg.dct} to {seg.act}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Right side: Fare Options */}
                      <div className="flex-1 space-y-4 lg:pl-2">
                        <h4 className="font-bold text-slate-800 mb-3 text-lg">Available Fares</h4>
                        {f.fares?.map((fareOption, fareIdx) => (
                          <div key={fareIdx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all bg-white gap-4">
                            <div className="flex-1">
                              <p className="font-bold text-slate-900 text-base">{fareOption.fcn || fareOption.cabin || "Economy"}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="text-[10px] px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-full font-bold">Cabin: {fareOption.cabin || "Economy"}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${fareOption.refundable === "true" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
                                  {fareOption.refundable === "true" ? "Refundable" : "Non-Refundable"}
                                </span>
                                {fareOption.paxWise?.O?.ADT?.bag?.value && (
                                  <span className="text-[10px] px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full font-bold">Bag: {fareOption.paxWise.O.ADT.bag.value}{fareOption.paxWise.O.ADT.bag.unit}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                              <p className="font-black text-blue-700 text-xl">
                                ₹{parseInt(fareOption.totalFare?.TF || 0).toLocaleString("en-IN")}
                              </p>
                              <button 
                                onClick={() => {
                                  const stateData = {
                                      pollingId: fareOption.pollId || f.pollId || pollingId,
                                      index: fareOption.index || f.index || f.flightId || String(idx + 1),
                                      paxData: paxData,
                                      departDate: departDate,
                                      flightDetails: f,
                                      fcn: fareOption.fcn || fareOption.cabin || "Economy"
                                  };
                                  handleBookClick(stateData);
                                }}
                                className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 px-6 rounded-lg transition-all active:scale-95 shadow-sm whitespace-nowrap">
                                Book This
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
            <FaPlane className="text-5xl text-slate-200 mb-4" />
            <h2 className="text-xl font-bold text-slate-700">
              {hasSearched ? "No Flights Found" : "Search to begin"}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {hasSearched
                ? "Try a different date or route."
                : "Enter your travel details above."}
            </p>
          </div>
        )}
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSuccess={(user) => {
          if (pendingBookingData) {
            navigate("/book-flight-details", { state: pendingBookingData });
          }
        }} 
      />
    </div>
  );
};
