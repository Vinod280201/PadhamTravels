import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaPhone, FaEnvelope, FaPlane, FaCheckCircle, FaExclamationCircle, FaClock } from "react-icons/fa";
import { apiPost } from "@/apiClient";
import MainNavbar from "@/components/layout/MainNavbar";
import { AIRLINE_MAP, AIRPORT_MAP } from "@/constants/AppConstants";
import { useAuthUser } from "@/hooks/useAuthUser";

export const FlightBookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  const isAdminRoute = location.pathname.startsWith("/admin");
  
  console.log("✈️ FlightBookingDetails Mounted! Received location.state:", state);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data retrieved from /review
  const [priceSummary, setPriceSummary] = useState(null);
  const [flightDetails, setFlightDetails] = useState(null);
  
  // Forms
  const { user } = useAuthUser();
  const [paxDetails, setPaxDetails] = useState({});
  const [contact, setContact] = useState({ email: "", mobile: "", isd: "91" });
  const [bookingStatus, setBookingStatus] = useState(null);

  useEffect(() => {
    if (user) {
      setContact(prev => ({
        ...prev,
        email: user.email || prev.email,
        mobile: user.phone ? user.phone.replace(/^\+\d+\s*/, '') : prev.mobile
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!state || !state.pollingId || !state.index) {
      setError("Missing flight selection data. Please search again.");
      setLoading(false);
      return;
    }

    const fetchReviewData = async () => {
      try {
        const response = await apiPost("/flights/review", {
          pollingId: state.pollingId,
          index: state.index,
        });
        const resData = await response.json();

        if (resData.status) {
          setPriceSummary(resData.priceSummary);
          setFlightDetails(resData.flightDetails);
          
          // Initialize passenger details based on the count passed from search
          const initialPaxDetails = {
            adt: {},
            chd: {},
            inf: {}
          };
          
          const adt = state.paxData?.adult ?? state.paxData?.adt ?? 1;
          const chd = state.paxData?.child ?? state.paxData?.chd ?? 0;
          const inf = state.paxData?.infant ?? state.paxData?.inf ?? 0;
          
          for (let i = 1; i <= adt; i++) {
            initialPaxDetails.adt[`adt${i}`] = { title: "Mr", firstName: "", lastName: "", dob: "" };
          }
          for (let i = 1; i <= chd; i++) {
            initialPaxDetails.chd[`chd${i}`] = { title: "Mstr", firstName: "", lastName: "", dob: "" };
          }
          for (let i = 1; i <= inf; i++) {
            initialPaxDetails.inf[`inf${i}`] = { title: "Mstr", firstName: "", lastName: "", dob: "" };
          }
          
          setPaxDetails(initialPaxDetails);
        } else {
          setError(resData.message || "Failed to retrieve live prices.");
        }
      } catch (err) {
        setError(err.message || "An error occurred fetching review data.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();
  }, [state]);

  const handlePaxChange = (type, paxKey, field, value) => {
    setPaxDetails(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [paxKey]: {
          ...prev[type][paxKey],
          [field]: value
        }
      }
    }));
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setBookingStatus({ loading: true, success: false, error: null });

    // Format pax payload as expected by API
    const formattedPax = {};
    Object.keys(paxDetails).forEach(type => {
      Object.keys(paxDetails[type]).forEach(paxKey => {
        const pax = { ...paxDetails[type][paxKey] };
        
        // Handle Passport data if present
        if (pax.passportNo) {
          pax.passport = {
            number: pax.passportNo,
            expiry: pax.passportExpiry,
            nationalityCode: pax.nationality || "IN",
            issuedCode: pax.issuedCountry || "IN"
          };
        }
        
        // Clean up temporary fields before sending
        delete pax.passportNo;
        delete pax.passportExpiry;
        delete pax.nationality;
        delete pax.issuedCountry;
        
        // Only send DOB if it's provided (removing empty ones)
        if (!pax.dob) {
           delete pax.dob;
        }

        formattedPax[paxKey] = pax;
      });
    });

    try {
      // --- Failsafe Financial Extraction ---
      // We look in priceSummary, flightDetails, and nested fltSchedule for paxWiseFare
      const scheduleObj = flightDetails?.fltSchedule ? Object.values(flightDetails.fltSchedule)[0] : null;
      const paxWise = priceSummary?.paxWiseFare || scheduleObj?.paxWiseFare || flightDetails?.paxWiseFare;
      
      // 1. Commission Extraction
      // Primary: comsn.totalCmsn; Fallbacks: totalFare.CMSN, etc.
      let extractedComm = priceSummary.comsn?.totalCmsn 
                       || priceSummary.totalFare?.CMSN 
                       || priceSummary.CMSN 
                       || priceSummary.commissionAmount 
                       || priceSummary.comsn 
                       || 0;
      
      // Secondary fallback for commission from paxWiseFare (handles multiple passengers)
      if ((!extractedComm || parseFloat(extractedComm) === 0 || typeof extractedComm === 'object') && paxWise) {
        let tempComm = 0;
        Object.keys(paxWise).forEach(pType => {
          // Map ADT/CHD/INF to adult/child/infant in state.paxData
          const mappedKey = pType === 'ADT' ? 'adult' : pType === 'CHD' ? 'child' : pType === 'INF' ? 'infant' : pType.toLowerCase();
          const typeCount = state.paxData?.[mappedKey] || state.paxData?.[pType.toLowerCase()] || (pType === 'ADT' ? 1 : 0);
          
          const pComm = paxWise[pType]?.comsn?.totalCmsn || paxWise[pType]?.totalCmsn || 0;
          tempComm += parseFloat(pComm) * typeCount;
        });
        if (tempComm > 0) extractedComm = tempComm;
      }

      // Final Rounding for precision
      if (extractedComm > 0) extractedComm = Math.round(extractedComm * 100) / 100;

      // 2. Total Fare Extraction
      let extractedFare = priceSummary.ntf || priceSummary.amount || priceSummary.totalFare?.TF || priceSummary.totalFare?.totalFare || 0;
      
      // Failsafe for total fare from paxWiseFare (summing up TF per passenger)
      if ((!extractedFare || parseFloat(extractedFare) === 0) && paxWise) {
        let tempFare = 0;
        Object.keys(paxWise).forEach(pType => {
          const mappedKey = pType === 'ADT' ? 'adult' : pType === 'CHD' ? 'child' : pType === 'INF' ? 'infant' : pType.toLowerCase();
          const typeCount = state.paxData?.[mappedKey] || state.paxData?.[pType.toLowerCase()] || (pType === 'ADT' ? 1 : 0);
          
          const pTF = paxWise[pType]?.fare?.TF || paxWise[pType]?.TF || 0;
          tempFare += parseFloat(pTF) * typeCount;
        });
        if (tempFare > 0) extractedFare = tempFare;
      }

      const requestPayload = {
        searchId: priceSummary.searchId,
        priceId: priceSummary.priceId,
        pmode: "cp",
        totalFare: extractedFare,
        commissionAmount: extractedComm,
        travelDate: state.departDate || flightSegments[0]?.ddt || flightDetails?.trip?.dDate, // Fallback chain ensures date is caught
        flightDetails: `${flightSegments[0]?.ac ? flightSegments[0].ac + (flightSegments[0].fl ? '-' + flightSegments[0].fl : '') + ' ' : ''}${flightDetails?.trip?.origin || flightSegments[0]?.dac || "ORG"} → ${flightDetails?.trip?.destination || flightSegments[flightSegments.length - 1]?.aac || "DST"}`.trim(), // Pass readable flight route with airline code
        departureTime: flightSegments[0]?.dd || "00:00",
        arrivalTime: flightSegments[flightSegments.length - 1]?.ad || "00:00",
        fcn: state.fcn || "SAVER (REGULAR)", // The selected fare option identifier
        details: {
          pax: formattedPax,
          contact: {
            email: contact.email,
            isd: contact.isd,
            mobile: contact.mobile
          }
        }
      };

      console.log("✈️ [FRONTEND] Booking Request Payload:", JSON.stringify(requestPayload, null, 2));

      const response = await apiPost("/flights/book", requestPayload);
      
      const resData = await response.json();
      console.log("✈️ [FRONTEND] Booking Response Data:", JSON.stringify(resData, null, 2));
      
      if (resData.status) {
        setBookingStatus({ loading: false, success: true, error: null, ref: resData.bookRef || resData.data?.bookRef });
      } else {
        setBookingStatus({ loading: false, success: false, error: resData.message || "Booking failed." });
      }
      
    } catch (err) {
      setBookingStatus({ loading: false, success: false, error: err.message || "An unexpected error occurred." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-600 font-semibold animate-pulse">Finalizing live prices and rules...</p>
      </div>
    );
  }

  if (error && !priceSummary) {
    const isSessionExpired = error.toLowerCase().includes("expir");
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50 p-4">
        <div className={`p-8 rounded-2xl shadow-lg max-w-md w-full text-center border-t-4 ${isSessionExpired ? 'bg-white border-orange-500' : 'bg-red-50 border-red-500 text-red-700'}`}>
          {isSessionExpired ? (
            <FaClock className="mx-auto text-5xl text-orange-500 mb-5 animate-pulse" />
          ) : (
            <FaExclamationCircle className="mx-auto text-5xl mb-5" />
          )}
          <h2 className="text-2xl font-black mb-3 text-slate-800">
             {isSessionExpired ? "Session Expired" : "Error"}
          </h2>
          <p className="text-slate-600 font-medium mb-8 leading-relaxed">
             {isSessionExpired ? "This search session has expired. Kindly click on the OK button to search again." : error}
          </p>
          <button 
             onClick={() => navigate(isAdminRoute ? "/admin/book-flights" : "/flights", { state: { clearSearch: true } })} 
             className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition-all ${isSessionExpired ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-600 hover:bg-red-700'}`}
          >
             {isSessionExpired ? "OK" : "Go Back"}
          </button>
        </div>
      </div>
    );
  }

  const adt = state.paxData?.adult ?? state.paxData?.adt ?? 1;
  const chd = state.paxData?.child ?? state.paxData?.chd ?? 0;
  const inf = state.paxData?.infant ?? state.paxData?.inf ?? 0;
  const scheduleObj = flightDetails?.fltSchedule ? Object.values(flightDetails.fltSchedule)[0] : null;
  const isRefundable = scheduleObj?.penalty !== "Non-Refundable" && scheduleObj?.penalty !== undefined;
  
  const flightSegments = scheduleObj?.OD?.[0]?.FS || [];



  const checkMandate = (val) => val === true || String(val).toLowerCase() === "true" || String(val).toUpperCase() === "Y" || String(val).toLowerCase() === "yes";
  const passPortMandate = checkMandate(flightDetails?.passPortMandate);
  const adtDOBMandate = checkMandate(flightDetails?.adtDOBMandate);
  const chdDOBMandate = checkMandate(flightDetails?.chdDOBMandate);
  const infDOBMandate = checkMandate(flightDetails?.infDOBMandate);

  if (bookingStatus?.success) {
    // Automatically redirect to the ticket page
    setTimeout(() => {
      navigate(isAdminRoute ? "/admin/flight-ticket" : "/flight-ticket", {
        state: {
          searchId: priceSummary.searchId,
          priceId: priceSummary.priceId,
          bookRef: bookingStatus.ref
        },
        replace: true // Prevent going back to this form
      });
    }, 1500);

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-xl w-full text-center">
          <FaCheckCircle className="text-green-500 text-7xl mx-auto mb-6 animate-bounce" />
          <h1 className="text-3xl font-black text-slate-800 mb-2">Booking Confirmed!</h1>
          <p className="text-slate-600 font-medium mb-6">Redirecting to your ticket...</p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-center">
            <p className="text-sm font-bold text-green-700 uppercase tracking-wide mb-1">Booking Reference</p>
            <p className="text-2xl font-black text-green-800">{bookingStatus.ref || "REF-XXXXXX"}</p>
          </div>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {!isAdminRoute && <MainNavbar />}
      <div className="py-10 px-4 md:px-8">
        <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Forms */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
             <button type="button" onClick={() => navigate(-1)} className="text-slate-700 hover:text-blue-600 hover:text-3xl text-2xl transition px-2 pb-1 py-0.5 bg-white rounded-full shadow-sm hover:shadow-lg">←</button>
             <h1 className="text-2xl font-black text-slate-800">Review & Complete Booking</h1>
          </div>

          {/* Flight Details Header */}
          {flightSegments.length > 0 && (
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                   <FaPlane className="text-blue-600" /> Flight Itinerary
                </h2>
                <div className="space-y-4">
                   {flightSegments.map((seg, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 border-b border-slate-100 last:border-0 gap-4">
                         <div className="flex items-center gap-4 md:w-1/3">
                            <div className="w-12 h-12 bg-blue-100 text-blue-700 font-bold rounded-xl flex items-center justify-center text-sm shrink-0">
                               {seg.ac}
                            </div>
                            <div>
                               <p className="font-bold text-slate-800">{AIRLINE_MAP[seg.ac?.toUpperCase()] || seg.aname || "Airline"}</p>
                               <p className="text-xs text-slate-500 font-semibold uppercase">{seg.ac}-{seg.fl} • {seg.cabin || "Economy"}</p>
                            </div>
                         </div>
                         <div className="flex-1 flex justify-between items-center w-full px-2">
                            <div className="text-center">
                               <p className="font-black text-xl text-slate-800">{seg.dd}</p>
                               <p className="text-xs font-bold text-blue-600">{seg.dac}</p>
                               <p className="text-[10px] font-medium text-slate-500 mt-1 max-w-[120px] leading-tight mx-auto">{AIRPORT_MAP[seg.dac] || "Airport"}</p>
                            </div>
                            <div className="flex flex-col items-center px-4 w-full max-w-[120px]">
                               <p className="text-[10px] text-slate-500 font-bold mb-1">{seg.du}</p>
                               <div className="w-full h-px bg-slate-300 relative">
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400 bg-white px-1">
                                     <FaPlane className="text-[10px]" />
                                  </div>
                               </div>
                            </div>
                            <div className="text-center">
                               <p className="font-black text-xl text-slate-800">{seg.ad}</p>
                               <p className="text-xs font-bold text-blue-600">{seg.aac}</p>
                               <p className="text-[10px] font-medium text-slate-500 mt-1 max-w-[120px] leading-tight mx-auto">{AIRPORT_MAP[seg.aac] || "Airport"}</p>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          <form onSubmit={submitBooking} className="space-y-6">
            
            {/* Passenger Forms */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
               <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <FaUser className="text-blue-600" /> Passenger Details
               </h2>
               
               {/* ADULTS */}
               {Object.keys(paxDetails.adt || {}).map((paxKey, i) => (
                  <div key={paxKey} className="mb-6 pb-6 border-b border-slate-100 last:border-0">
                     <p className="font-bold text-slate-700 mb-3 uppercase text-xs tracking-wider">Adult {i+1}</p>
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Title <span className="text-red-500">*</span></label>
                          <select required value={paxDetails.adt[paxKey].title} onChange={(e) => handlePaxChange('adt', paxKey, 'title', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium">
                            <option value="Mr">Mr</option>
                            <option value="Mrs">Mrs</option>
                            <option value="Ms">Ms</option>
                          </select>
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-xs font-bold text-slate-500 mb-1">First Name <span className="text-red-500">*</span></label>
                          <input type="text" required placeholder="First Name" value={paxDetails.adt[paxKey].firstName} onChange={(e) => handlePaxChange('adt', paxKey, 'firstName', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-xs font-bold text-slate-500 mb-1">Last Name <span className="text-red-500">*</span></label>
                          <input type="text" required placeholder="Last Name" value={paxDetails.adt[paxKey].lastName} onChange={(e) => handlePaxChange('adt', paxKey, 'lastName', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-xs font-bold text-slate-500 mb-1">Date of Birth {adtDOBMandate && <span className="text-red-500">*</span>}</label>
                          <input type="date" required={adtDOBMandate} value={paxDetails.adt[paxKey].dob} onChange={(e) => handlePaxChange('adt', paxKey, 'dob', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-700" />
                        </div>
                     </div>
                     {passPortMandate && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                           <div className="md:col-span-1">
                             <label className="block text-xs font-bold text-slate-500 mb-1">Passport Number <span className="text-red-500">*</span></label>
                             <input type="text" required={passPortMandate} placeholder="Passport Number" value={paxDetails.adt[paxKey].passportNo || ""} onChange={(e) => handlePaxChange('adt', paxKey, 'passportNo', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                           </div>
                           <div className="md:col-span-1">
                             <label className="block text-xs font-bold text-slate-500 mb-1">Passport Expiry <span className="text-red-500">*</span></label>
                             <input type="date" required={passPortMandate} value={paxDetails.adt[paxKey].passportExpiry || ""} onChange={(e) => handlePaxChange('adt', paxKey, 'passportExpiry', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-700" />
                           </div>
                        </div>
                     )}
                  </div>
               ))}

               {/* CHILDREN */}
               {Object.keys(paxDetails.chd || {}).map((paxKey, i) => (
                  <div key={paxKey} className="mb-6 pb-6 border-b border-slate-100 last:border-0">
                     <p className="font-bold text-slate-700 mb-3 uppercase text-xs tracking-wider">Child {i+1}</p>
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Title <span className="text-red-500">*</span></label>
                          <select required value={paxDetails.chd[paxKey].title} onChange={(e) => handlePaxChange('chd', paxKey, 'title', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium">
                            <option value="Mstr">Mstr</option>
                            <option value="Miss">Miss</option>
                          </select>
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-xs font-bold text-slate-500 mb-1">First Name <span className="text-red-500">*</span></label>
                          <input type="text" required placeholder="First Name" value={paxDetails.chd[paxKey].firstName} onChange={(e) => handlePaxChange('chd', paxKey, 'firstName', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-xs font-bold text-slate-500 mb-1">Last Name <span className="text-red-500">*</span></label>
                          <input type="text" required placeholder="Last Name" value={paxDetails.chd[paxKey].lastName} onChange={(e) => handlePaxChange('chd', paxKey, 'lastName', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-xs font-bold text-slate-500 mb-1">Date of Birth {chdDOBMandate && <span className="text-red-500">*</span>}</label>
                          <input type="date" required={chdDOBMandate} value={paxDetails.chd[paxKey].dob} onChange={(e) => handlePaxChange('chd', paxKey, 'dob', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-700" />
                        </div>
                     </div>
                     {passPortMandate && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                           <div className="md:col-span-1">
                             <label className="block text-xs font-bold text-slate-500 mb-1">Passport Number <span className="text-red-500">*</span></label>
                             <input type="text" required={passPortMandate} placeholder="Passport Number" value={paxDetails.chd[paxKey].passportNo || ""} onChange={(e) => handlePaxChange('chd', paxKey, 'passportNo', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                           </div>
                           <div className="md:col-span-1">
                             <label className="block text-xs font-bold text-slate-500 mb-1">Passport Expiry <span className="text-red-500">*</span></label>
                             <input type="date" required={passPortMandate} value={paxDetails.chd[paxKey].passportExpiry || ""} onChange={(e) => handlePaxChange('chd', paxKey, 'passportExpiry', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-700" />
                           </div>
                        </div>
                     )}
                  </div>
               ))}

               {/* INFANTS */}
               {Object.keys(paxDetails.inf || {}).map((paxKey, i) => (
                  <div key={paxKey} className="mb-6 pb-6 border-b border-slate-100 last:border-0">
                     <p className="font-bold text-slate-700 mb-3 uppercase text-xs tracking-wider">Infant {i+1}</p>
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Title <span className="text-red-500">*</span></label>
                          <select required value={paxDetails.inf[paxKey].title} onChange={(e) => handlePaxChange('inf', paxKey, 'title', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium">
                            <option value="Mstr">Mstr</option>
                            <option value="Miss">Miss</option>
                          </select>
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-xs font-bold text-slate-500 mb-1">First Name <span className="text-red-500">*</span></label>
                          <input type="text" required placeholder="First Name" value={paxDetails.inf[paxKey].firstName} onChange={(e) => handlePaxChange('inf', paxKey, 'firstName', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-xs font-bold text-slate-500 mb-1">Last Name <span className="text-red-500">*</span></label>
                          <input type="text" required placeholder="Last Name" value={paxDetails.inf[paxKey].lastName} onChange={(e) => handlePaxChange('inf', paxKey, 'lastName', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-xs font-bold text-slate-500 mb-1">Date of Birth {infDOBMandate && <span className="text-red-500">*</span>}</label>
                          <input type="date" required={infDOBMandate} value={paxDetails.inf[paxKey].dob} onChange={(e) => handlePaxChange('inf', paxKey, 'dob', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-700" />
                        </div>
                     </div>
                     {passPortMandate && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                           <div className="md:col-span-1">
                             <label className="block text-xs font-bold text-slate-500 mb-1">Passport Number <span className="text-red-500">*</span></label>
                             <input type="text" required={passPortMandate} placeholder="Passport Number" value={paxDetails.inf[paxKey].passportNo || ""} onChange={(e) => handlePaxChange('inf', paxKey, 'passportNo', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                           </div>
                           <div className="md:col-span-1">
                             <label className="block text-xs font-bold text-slate-500 mb-1">Passport Expiry <span className="text-red-500">*</span></label>
                             <input type="date" required={passPortMandate} value={paxDetails.inf[paxKey].passportExpiry || ""} onChange={(e) => handlePaxChange('inf', paxKey, 'passportExpiry', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-700" />
                           </div>
                        </div>
                     )}
                  </div>
               ))}
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
               <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <FaPhone className="text-blue-600" /> Contact Details
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Email Address <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="email" autoComplete="email" required placeholder="Email Address" value={contact.email} onChange={(e) => setContact(p => ({ ...p, email: e.target.value }))} className="w-full pl-10 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                       <select value={contact.isd} onChange={(e) => setContact(p => ({ ...p, isd: e.target.value }))} className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold cursor-pointer">
                         <option value="91">+91 (IN)</option>
                         <option value="1">+1 (US/CA)</option>
                         <option value="44">+44 (UK)</option>
                         <option value="61">+61 (AU)</option>
                         <option value="971">+971 (AE)</option>
                         <option value="65">+65 (SG)</option>
                         {/* Add more as needed */}
                       </select>
                       <input type="tel" autoComplete="tel-national" required placeholder="Mobile Number" value={contact.mobile} onChange={(e) => setContact(p => ({ ...p, mobile: e.target.value.replace(/\D/g, '') }))} className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                 </div>
               </div>
            </div>

            {bookingStatus?.error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200 font-medium text-sm flex gap-3 text-left">
                 <FaExclamationCircle className="shrink-0 mt-0.5" /> 
                 <span>{bookingStatus.error}</span>
              </div>
            )}

            <button type="submit" disabled={bookingStatus?.loading} className="w-full bg-orange-500 hover:bg-orange-600 py-4 px-6 rounded-xl text-white font-black text-lg transition-all shadow-md flex justify-center items-center h-14 disabled:opacity-70">
              {bookingStatus?.loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Confirm & Book Flight"}
            </button>

          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-6">
              <h2 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-4 mb-4">Fare Summary</h2>
              
              <div className="flex justify-between items-center mb-4">
                 <p className="font-bold text-slate-600">Base Fare</p>
                 <p className="font-bold text-slate-800">
                   ₹{priceSummary?.amount ? parseInt(priceSummary.amount).toLocaleString('en-IN') : "0"}
                 </p>
              </div>
              <div className="flex justify-between items-center mb-6">
                 <p className="font-bold text-slate-600">Taxes & Fees</p>
                 <p className="font-bold text-slate-800">Included</p>
              </div>

              <div className="h-px bg-slate-200 w-full mb-6"></div>

              <div className="flex justify-between items-end mb-6">
                 <div>
                   <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Total Amount</p>
                   <p className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded uppercase"> {isRefundable ? "Refundable" : "Non-Refundable"} </p>
                 </div>
                 <p className="text-3xl font-black text-blue-700">
                    ₹{priceSummary?.ntf ? parseInt(priceSummary.ntf).toLocaleString('en-IN') : "0"}
                 </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800 flex gap-2">
                 <FaPlane className="mt-0.5 shrink-0" />
                 <p>By proceeding, you agree to our terms and conditions and the airline's rules.</p>
              </div>
           </div>
        </div>

      </div>
    </div>
    </div>
  );
};
