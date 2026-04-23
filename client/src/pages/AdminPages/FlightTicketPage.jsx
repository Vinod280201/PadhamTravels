import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiPost } from "@/apiClient";
import MainNavbar from "@/components/layout/MainNavbar";
import logo from "@/assets/logo.png";
import { FaPlane, FaCheckCircle, FaExclamationCircle, FaDownload, FaMapMarkerAlt, FaCalendarAlt, FaListAlt, FaUser, FaBox, FaChevronDown, FaPlaneDeparture, FaPlaneArrival, FaRegClock, FaArrowRight, FaArrowLeft, FaTimesCircle, FaSuitcase } from "react-icons/fa";
import { AIRLINE_MAP, AIRPORT_MAP } from "@/constants/AppConstants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const FlightTicketPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  const isAdminRoute = location.pathname.startsWith("/admin");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketData, setTicketData] = useState(null);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [isRescheduling, setIsRescheduling] = useState(false);

  useEffect(() => {
    if (!state || !state.searchId || !state.priceId || !state.bookRef) {
      setError("Missing booking reference data. Please try again from your bookings page.");
      setLoading(false);
      return;
    }

    const fetchTicketData = async () => {
      try {
        const response = await apiPost("/flights/fetch-book", {
          searchId: state.searchId,
          priceId: state.priceId,
          bookRef: state.bookRef
        });
        const resData = await response.json();

        if (resData.status) {
          // The API structure returned from /air/fetch/book
          setTicketData(resData);
          setError(null); // Clear any previous error
        } else if (!resData.status && resData.localData) {
          // Even if B2B Provider API failed, if we have local database fallback metadata, render the ticket anyway!
          console.warn("B2B API Fetch Failed. Falling back to local MongoDB ticket data:", resData.message);
          setTicketData(resData);
          setError(null); // Clear errors since we have a fallback
        } else {
          setError(resData.message || "Failed to retrieve ticket details.");
        }
      } catch (err) {
        setError(err.message || "An error occurred fetching the ticket.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [state]);

  const handlePrint = () => {
    window.print();
  };

  const handleRequestCancellation = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    setIsCancelling(true);
    try {
      const response = await apiPost(`/bookings/request-cancellation/${local._id}`, { reason: cancelReason });
      const data = await response.json();
      if (data.status) {
        toast.success("Cancellation request submitted successfully");
        setIsCancelModalOpen(false);
        setCancelReason("");
        // Refresh ticket data to show updated status
        window.location.reload(); 
      } else {
        toast.error(data.message || "Failed to submit request");
      }
    } catch (err) {
      toast.error("An error occurred while submitting the request");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleRequestReschedule = async () => {
    if (!rescheduleDate || !rescheduleReason.trim()) {
      toast.error("Please provide a new date and reason for rescheduling");
      return;
    }

    setIsRescheduling(true);
    try {
      const response = await apiPost(`/bookings/request-reschedule/${local._id}`, { 
        preferredDate: rescheduleDate, 
        reason: rescheduleReason 
      });
      const data = await response.json();
      if (data.status) {
        toast.success("Reschedule request submitted successfully");
        setIsRescheduleModalOpen(false);
        setRescheduleDate("");
        setRescheduleReason("");
        window.location.reload(); 
      } else {
        toast.error(data.message || "Failed to submit request");
      }
    } catch (err) {
      toast.error("An error occurred while submitting the request");
    } finally {
      setIsRescheduling(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-600 font-semibold animate-pulse">Generating your flight ticket...</p>
      </div>
    );
  }

  if (error && !ticketData) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="bg-red-50 text-red-600 p-8 rounded-xl border border-red-200 shadow-sm max-w-md text-center">
          <FaExclamationCircle className="mx-auto text-4xl mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Ticket</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition">Go Back</button>
        </div>
      </div>
    );
  }

  // Handle data parsing. The `ticketData` structure from backend is `{ b2bTicket: {...}, localData: {...} }`
  const b2b = ticketData?.ticket || ticketData?.data || ticketData || {};
  const local = ticketData?.localData || {};
  
  const bookRef = b2b.bookRef || local.bookingRef || state.bookRef || "REF-XXX";
  const bookingStatus = b2b.bookingStatus || local.status || "Confirmed";

  const bd = b2b.bookingDetails || {};
  const itinerary = b2b.itineraries?.[0] || {};
  
  // Extract schedule & segments
  const od = itinerary.OD?.[0] || {};
  let segments = od.FS || [];

  // Helper to safely format local DB travel date ignoring UTC strip
  const formatTravelDate = (dateString) => {
     if (!dateString) return "Date N/A";
     try {
       const d = new Date(dateString);
       return d.toLocaleDateString('en-CA'); // Gets YYYY-MM-DD in local time
     } catch {
       return dateString.split('T')[0];
     }
  };

  let trip = {
     origin: bd.origin || local.flightDetails?.split("→")[0]?.trim() || "ORG",
     destination: bd.destination || local.flightDetails?.split("→")[1]?.trim() || "DST",
     dDate: bd.travelStartDate || (local.travelDate ? formatTravelDate(local.travelDate) : "Date N/A"),
     cabin: segments[0]?.cabin || "Economy"
  };

  // Fallback for segments if API doesn't provide them but localDB has flight text
  // The local flightDetails text format is like "AI-202 DEL -> BLR" or sometimes includes time
  // If we lack true segments from B2B, just display generic placeholders with the travelDate
  if (segments.length === 0 && local.flightDetails) {
     segments = [{
       ac: "N/A", aname: "Flight", fl: "TBA",
       dd: local.departureTime || "00:00", 
       ad: local.arrivalTime || "TBA",
       dac: trip.origin, aac: trip.destination,
       du: "TBA", cabin: "Economy"
     }];
  }

  // 2. Fetch Passenger Information
  let passengerList = [];
  const paxDetails = itinerary.paxDetails || [];
  
  if (paxDetails.length > 0) {
      paxDetails.forEach(p => passengerList.push({
          t: p.title || "",
          fn: p.fn || "",
          ln: p.ln || "",
          type: p.type || "Passenger",
          seat: (typeof p.seat === 'object' ? p.seat?.code : p.seat) || "N/A",
          pnr: (typeof p.airlinePnr === 'string' ? p.airlinePnr : null) || (typeof p.gdsPnr === 'string' ? p.gdsPnr : "") || "",
          gdsPnr: (typeof p.gdsPnr === 'string' ? p.gdsPnr : "") || "",
          tktn: (typeof p.tktn === 'string' ? p.tktn : "") || "",
          meal: (Array.isArray(p.meal) && p.meal.length > 0) ? p.meal.join(', ') : "N/A"
      }));
  } else if (local.customerName) {
      // Fallback to local DB customer name if B2B pax details are empty
      passengerList.push({ t: "Primary", fn: local.customerName, ln: "", type: "Adult", seat: "N/A", pnr: "", gdsPnr: "", tktn: "", meal: "N/A" });
  }

  let totalPaxCount = passengerList.length || local.passengers || 0;
  
  // Extract Fares
  const totalFare = itinerary?.totalFare?.TF || bd?.bookingAmount || local?.amount || 0;
  const baseFare = itinerary?.totalFare?.BF || 0;
  const taxes = itinerary?.totalFare?.TX || 0;

  // Extract Baggage & Fare Rules
  const adtFare = itinerary?.paxWiseFare?.ADT || {};
  const bagAllow = adtFare?.bag ? `${adtFare.bag.value} ${adtFare.bag.unit}` : "15 Kilograms";
  const rules = adtFare?.farerule || {};
  const cxFee = rules?.cancel || "Airline Standard";
  const chFee = rules?.change || "Airline Standard";
  
  const penalty = itinerary?.penalty || bd?.penalty || "Refundable";
  const isRefundable = typeof penalty === 'string' ? penalty.toLowerCase() !== "non-refundable" : true;
  


  // Terminal and Airports
  const originAirportName = segments[0]?.dan || AIRPORT_MAP[trip.origin] || "Origin Airport";
  const destAirportName = segments[segments.length - 1]?.aan || AIRPORT_MAP[trip.destination] || "Destination Airport";
  const originTerminal = segments[0]?.dct || "TBA";
  const destTerminal = segments[segments.length - 1]?.act || "TBA";

  const today = new Date();
  today.setHours(0,0,0,0);
  let isCompleted = false;
  const rawDateStr = bd.travelStartDate || local.travelDate;
  if (rawDateStr) {
     const tDate = new Date(rawDateStr);
     if (!isNaN(tDate) && tDate < today) {
        isCompleted = true;
     }
  }

  console.log("✈️ Ticket Data:", JSON.stringify(ticketData, null, 2));

  return (
    <div className="min-h-screen bg-slate-50 pb-10 print:bg-white print:pb-0">
      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
        }
        @keyframes pulse-custom {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          50% { transform: scale(1.02); box-shadow: 0 0 15px 5px rgba(59, 130, 246, 0.4); }
        }
        .animate-pulse-custom {
          animation: pulse-custom 2s infinite ease-in-out;
        }
      `}</style>
      
      {!isAdminRoute && <div className="print:hidden"><MainNavbar /></div>}
      
      {/* Header Banner */}
      <div className={`${
        bookingStatus === 'Cancelled' ? 'bg-slate-700' :
        local.cancellation?.status === 'pending' ? 'bg-amber-600' : 
        isCompleted ? 'bg-slate-600' :
        'bg-blue-600'
      } text-white py-8 px-4 print:bg-slate-600 print:text-white print:py-6`}>
        <div className="max-w-full mx-auto flex flex-col md:flex-row justify-between items-center z-10">
           <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
             <button 
               onClick={() => navigate(-1)} 
               className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-bold border border-white/20 backdrop-blur-sm transition-all flex items-center justify-center gap-2 text-sm print:hidden shrink-0"
               title="Go Back"
             >
               <FaArrowLeft /> Back
             </button>
             <div className="flex ml-5 items-center gap-3">
               {bookingStatus === 'Cancelled' ? (
                 <FaTimesCircle className="text-4xl text-slate-400 hidden sm:block" />
               ) : local.cancellation?.status === 'pending' ? (
                 <FaRegClock className="text-4xl text-amber-200 animate-pulse hidden sm:block" />
               ) : isCompleted ? (
                 <FaCheckCircle className="text-4xl text-slate-300 hidden sm:block" />
               ) : (
                 <FaCheckCircle className="text-4xl text-green-400 print:text-green-600 hidden sm:block" />
               )}
               <div>
                 <h1 className="text-2xl md:text-3xl font-black flex items-center gap-2">
                   {bookingStatus === 'Cancelled' ? (
                     <>
                       <FaTimesCircle className="text-2xl text-slate-400 sm:hidden" />
                       Booking Cancelled
                     </>
                   ) : local.cancellation?.status === 'pending' ? (
                     <>
                       <FaRegClock className="text-2xl text-amber-200 sm:hidden" />
                       Cancellation Requested
                     </>
                   ) : (
                     <>
                       <FaCheckCircle className={`text-2xl ${isCompleted ? 'text-slate-300' : 'text-green-400 print:text-green-600'} sm:hidden`} />
                       {isCompleted ? 'Trip Completed' : 'Booking Confirmed!'}
                     </>
                   )}
                 </h1>
                 <p className="text-blue-100 font-medium print:text-slate-600 text-sm md:text-base hidden sm:block">
                   {bookingStatus === 'Cancelled' ? 'This booking is no longer valid for travel.' :
                    local.cancellation?.status === 'pending' ? 'Our team will contact you on your registered mobile number shortly.' : 
                    isCompleted ? 'We hope you had a pleasant journey with Padham Travels.' :
                    'Your E-Ticket has been generated successfully.'}
                 </p>
               </div>
             </div>
           </div>
           
           <div className="flex flex-wrap justify-center gap-3 md:mt-0 print:hidden w-full md:w-auto">
              <button onClick={() => navigate(isAdminRoute ? "/admin/book-flights" : "/flights")} className="px-5 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-bold border border-white/30 backdrop-blur-sm transition-all text-sm flex-1 sm:flex-none min-w-[150px]">
                Book Another
              </button>
              {bookingStatus !== 'Cancelled' && (!local.cancellation || !local.cancellation.status || local.cancellation.status === 'declined') && (
                <button 
                  onClick={handlePrint} 
                  className={`px-5 py-2 rounded-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2 text-sm w-full sm:w-auto text-white ${isCompleted ? 'bg-slate-500 hover:bg-slate-600' : 'bg-orange-500 hover:bg-orange-600'}`}
                  title={isCompleted ? "Download Past Receipt" : "Download Ticket"}
                >
                  <FaDownload /> {isCompleted ? "Past Receipt" : "Download Ticket"}
                </button>
              )}
              {!isCompleted && bookingStatus !== 'Cancelled' && (!local.cancellation || !local.cancellation.status || local.cancellation.status === 'declined') && local.reschedule?.status !== 'pending' && (
                <button onClick={() => setIsCancelModalOpen(true)} className="px-5 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2 text-sm w-full sm:w-auto text-white">
                  <FaTimesCircle /> Cancel Ticket
                </button>
              )}
              {!isCompleted && bookingStatus !== 'Cancelled' && (!local.reschedule || !local.reschedule.status || local.reschedule.status === 'declined' || local.reschedule.status === 'processed') && local.cancellation?.status !== 'pending' && (
                <button onClick={() => setIsRescheduleModalOpen(true)} className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2 text-sm w-full sm:w-auto text-white">
                  <FaCalendarAlt /> Reschedule Flight
                </button>
              )}
           </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 -mt-4 print:mt-0 print:px-0 relative z-20">
        
        {/* Print-Only Header Logo */}
        <div className="hidden print:flex justify-between items-end mb-6 pb-4 border-b-2 border-slate-800">
           <div className="flex items-center gap-4">
              <img src={logo} alt="Padham Travels Logo" className="h-12 w-auto object-contain" />
              <div className="flex flex-col justify-center h-full pt-1">
                 <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase leading-none">Padham Travels</h1>
                 <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-[0.2em]">E-Ticket / Flight Itinerary</p>
              </div>
           </div>
           <div className="text-right text-xs text-slate-600 font-medium">
              <p className="font-bold text-slate-800 text-sm mb-1 uppercase tracking-wide">Contact Us</p>
              <p>📞 +91 98765 43210</p>
              <p>✉️ info@padhamtravel.com</p>
              <p>🌐 www.padhamtravel.com</p>
           </div>
        </div>

        {/* Main Ticket Layout */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden print:overflow-visible print:shadow-none print:border-slate-300 print:rounded-none">
           
           {/* Booking Status & Ref */}
           <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Booking Reference ID</p>
                 <p className="text-2xl font-black text-slate-800 tracking-wider bg-slate-200 px-3 py-1 rounded inline-block">{(typeof bookRef === 'string' ? bookRef : null) || (typeof state.bookRef === 'string' ? state.bookRef : null) || "REF-XXX"}</p>
              </div>
              <div className="text-right">
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Status</p>
                 <p className={`text-lg font-black uppercase border-2 px-4 py-1 rounded-full text-center ${
                   bookingStatus === 'Cancelled' ? 'text-red-600 border-red-200 bg-red-50' : 
                   local.cancellation?.status === 'pending' ? 'text-amber-600 border-amber-200 bg-amber-50' :
                   isCompleted ? 'text-slate-600 border-slate-200 bg-slate-100' :
                   'text-green-600 border-green-200 bg-green-50'
                 }`}>
                     {local.cancellation?.status === 'pending' ? 'CANCEL PENDING' : 
                     isCompleted ? 'COMPLETED' :
                     bookingStatus}
                 </p>
              </div>
           </div>

           {/* Cancellation Workflow Banners */}
           {local.cancellation?.status === 'pending' && (
             <div className="mx-6 mt-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                <div className="flex items-center gap-3">
                   <FaRegClock className="text-amber-500 text-xl" />
                   <div>
                      <h4 className="text-amber-800 font-bold">Cancellation Request Received</h4>
                      <p className="text-amber-700 text-sm">Our team will contact you on your registered mobile number shortly to discuss refund details.</p>
                   </div>
                </div>
             </div>
           )}

           {local.cancellation?.status === 'declined' && (
             <div className="mx-6 mt-6 bg-slate-100 border-l-4 border-slate-400 p-4 rounded-r-lg">
                <div className="flex items-center gap-3">
                   <FaTimesCircle className="text-slate-500 text-xl" />
                   <div>
                      <h4 className="text-slate-800 font-bold">Cancellation Declined</h4>
                      <p className="text-slate-600 text-sm">Your previous request was declined. You may re-request if circumstances have changed.</p>
                   </div>
                </div>
             </div>
           )}

           {bookingStatus === 'Cancelled' && local.cancellation?.refundAmount > 0 && (
             <div className="mx-6 mt-6 bg-green-50 border-2 border-green-500 p-6 rounded-xl shadow-md">
                <div className="flex items-start gap-4">
                   <div className="bg-green-500 p-2 rounded-full mt-1 shrink-0">
                      <FaCheckCircle className="text-white text-xl md:text-2xl" />
                   </div>
                   <div>
                      <h4 className="text-green-800 font-black text-lg md:text-xl mb-1">Refund Processed</h4>
                      <p className="text-green-700 text-sm md:text-base leading-relaxed">
                        Your booking is successfully cancelled. A refund of <strong className="font-black text-green-900">₹{local.cancellation.refundAmount}</strong> has been credited towards your account or original payment method. 
                      </p>
                   </div>
                </div>
             </div>
           )}

           {local.reschedule?.status === 'pending' && (
             <div className="mx-6 mt-6 bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg">
                <div className="flex items-center gap-3">
                   <FaRegClock className="text-indigo-500 text-xl animate-pulse" />
                   <div>
                      <h4 className="text-indigo-800 font-bold">Reschedule Request Received</h4>
                      <p className="text-indigo-700 text-sm">Our team will call you to confirm the new flight availability and fare difference.</p>
                   </div>
                </div>
             </div>
           )}

           {/* Itinerary Summary (High Level) */}
           <div className="p-6 md:p-8">
              {/* Exact Flight Segments Header */}
              <div className="bg-slate-200 px-4 py-3 flex items-center justify-between border-b-2 border-blue-400 rounded-t-lg">
                <div className="flex items-center flex-wrap gap-2 text-[#242c5c]">
                  <h2 className="text-lg md:text-xl font-medium tracking-wide">
                     {AIRPORT_MAP[trip.origin]?.split(',')[1]?.trim() || trip.origin} <FaArrowRight className="inline text-sm mx-1 opacity-70"/> {AIRPORT_MAP[trip.destination]?.split(',')[1]?.trim() || trip.destination}
                  </h2>
                  <span className="text-sm font-bold ml-2">{trip.dDate}</span>
                  <span className="text-xs ml-2 flex items-center gap-1"><FaRegClock className="opacity-70"/> {segments[0]?.dd || "00:00"}</span>
                  <span className={`text-white text-xs font-bold px-2 py-0.5 rounded ml-3 uppercase tracking-wider ${
                    bookingStatus === 'Cancelled' ? "bg-red-500" :
                    local.cancellation?.status === 'pending' ? "bg-amber-500" : 
                    isCompleted ? "bg-slate-500" :
                    "bg-[#008c5f]"
                  }`}>
                     {local.cancellation?.status === 'pending' ? 'CANCEL PENDING' : 
                     isCompleted ? 'COMPLETED' :
                     bookingStatus}
                  </span>
                </div>
              </div>

              {/* Exact Flight Segments Body */}
              {segments.length > 0 ? segments.map((seg, idx) => (
                <div key={idx} className="border border-slate-200 border-t-0 p-5 bg-white rounded-b-lg flex flex-col lg:flex-row items-center justify-between gap-6 print:border-slate-300">
                  
                  {/* Airline Branding */}
                  <div className="flex items-center gap-4 w-full lg:w-1/4">
                    <img src={`https://pics.avs.io/150/150/${seg.ac}.png`} onError={(e) => { e.target.onerror = null; e.target.style.display='none'; if(e.target.nextElementSibling) e.target.nextElementSibling.style.display='flex'; }} alt={seg.aname} className="w-12 h-12 object-contain hidden sm:block" />
                    <div className="w-12 h-12 bg-blue-100 text-blue-700 font-bold rounded flex items-center justify-center text-sm shrink-0 sm:hidden">{seg.ac}</div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm md:text-base">{AIRLINE_MAP[seg.ac?.toUpperCase()] || seg.aname || "Airline"}</p>
                      <p className="text-[10px] md:text-xs text-slate-500">{seg.ac}-{seg.fl}</p>
                      <p className="text-[10px] md:text-xs text-slate-500">{seg.eq || `Airbus A320`}</p>
                      <p className="text-[10px] md:text-xs text-slate-500">{seg.cabin || trip.cabin || "Economy"}</p>
                    </div>
                  </div>

                  {/* Flight Timeline Grid */}
                  <div className="flex-1 flex justify-between items-center w-full lg:w-auto px-4 gap-4">
                    
                    {/* Departure Area */}
                    <div className="text-right w-1/3">
                      <p className="font-bold text-lg md:text-xl text-slate-800 flex items-center justify-end gap-1"><FaPlaneDeparture className="text-sm md:text-base opacity-70"/>{seg.dac} {seg.dd}</p>
                      <p className="text-[10px] md:text-xs text-slate-500 mt-1">{trip.dDate}</p>
                      <p className="text-[10px] md:text-xs text-slate-500">{AIRPORT_MAP[seg.dac]?.split(',')[1]?.trim() || seg.dac}</p>
                      <p className="text-[10px] md:text-xs text-slate-500">{AIRPORT_MAP[seg.dac]?.split(',')[0]?.trim() || "Departure Airport"}</p>
                      <p className="text-[10px] md:text-xs font-semibold text-blue-600 mt-0.5">Terminal: {seg.dct || "T-NA"}</p>
                    </div>

                    {/* Duration / Arrow Area */}
                    <div className="flex flex-col items-center justify-center max-w-[100px] w-full mt-[-15px]">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 mb-1"><FaRegClock className="opacity-70"/> {seg.du}</span>
                      <div className="w-full h-px border-t border-dashed border-slate-300 relative">
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1"><FaPlane className="text-slate-400 rotate-90 text-[8px]"/> {seg.fl}</span>
                    </div>

                    {/* Arrival Area */}
                    <div className="text-left w-1/3">
                      <p className="font-bold text-lg md:text-xl text-slate-800 flex items-center gap-1">{seg.ad} {seg.aac} <FaPlaneArrival className="text-sm md:text-base opacity-70"/></p>
                      <p className="text-[10px] md:text-xs text-slate-500 mt-1">{trip.dDate}</p>
                      <p className="text-[10px] md:text-xs text-slate-500">{AIRPORT_MAP[seg.aac]?.split(',')[1]?.trim() || seg.aac}</p>
                      <p className="text-[10px] md:text-xs text-slate-500">{AIRPORT_MAP[seg.aac]?.split(',')[0]?.trim() || "Arrival Airport"}</p>
                      <p className="text-[10px] md:text-xs font-semibold text-blue-600 mt-0.5">Terminal: {seg.act || "T-NA"}</p>
                    </div>

                  </div>

                  {/* Class Info & Tags */}
                  <div className="flex flex-col justify-between h-full w-full lg:w-1/4 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] md:text-xs font-semibold text-slate-600">Airline PNR: <span className="font-bold text-[#242c5c] pl-1">{local.airlinePnr && local.airlinePnr !== "N/A" ? local.airlinePnr : (typeof bd?.airlinePnr === 'string' ? bd.airlinePnr : null) || (typeof bd?.gdsPnr === 'string' ? bd.gdsPnr : null) || (typeof seg.airlinePnr === 'string' ? seg.airlinePnr : null) || "TBA"}</span></p>
                      <p className="text-[10px] md:text-xs font-semibold text-slate-600">Cabin: <span className="font-bold text-[#242c5c] pl-1">{typeof seg.cabin === 'string' ? seg.cabin : (typeof trip.cabin === 'string' ? trip.cabin : "Economy")}</span></p>
                      <p className="text-[10px] md:text-xs font-semibold text-slate-600">Class: <span className="font-bold text-[#242c5c] pl-1">{typeof seg.class === 'string' ? seg.class : "E"}</span></p>
                    </div>
                    
                    <div className="flex flex-col items-end mr-2">
                       <span className={`${isRefundable ? "bg-[#008c5f]" : "bg-red-500"} text-white text-[10px] font-bold px-2 py-0.5 rounded-sm lowercase tracking-wide shadow-sm`}>{typeof penalty === 'string' ? penalty : "Refundable"}</span>
                       <span className="text-[#242c5c] font-bold text-xs mt-1">
                          <span className="text-slate-500 mr-1 font-semibold text-[10px]">FARE:</span>
                          <span className="underline decoration-dashed underline-offset-2 uppercase tracking-wide">
                             {typeof seg?.fcn === 'string' ? seg.fcn : (itinerary?.fcn || adtFare?.fcn || bd?.fcn || local?.fcn || (typeof seg?.fareFamily === 'string' ? seg.fareFamily : "SAVER (REGULAR)"))}
                          </span>
                       </span>
                    </div>
                  </div>
                </div>
              )) : (
                 <div className="border border-slate-200 border-t-0 p-5 bg-white rounded-b-lg text-sm text-slate-500 italic">No flight segments available right now.</div>
              )}

              {/* Ledger Details & Passenger Details exact screenshot replication */}
              {/* Passenger Details Panel */}
              <div className="mt-8 border border-slate-200 rounded-lg overflow-hidden print:overflow-visible bg-white print:border-slate-300">
                <div className="bg-slate-200 px-4 py-3 flex items-center gap-2 border-b-2 border-blue-400">
                  <FaUser className="text-slate-600" />
                  <h3 className="text-sm font-bold text-[#242c5c]">Passenger Details</h3>
                </div>

                {passengerList.length > 0 ? passengerList.map((pax, idx) => (
                  <div key={idx} className="flex flex-col xl:flex-row border-b border-slate-200 last:border-0">
                    
                    {/* Passenger Info Grid (Left) */}
                    <div className="flex-1 p-4 grid grid-cols-2 lg:grid-cols-5 gap-y-6 gap-x-4 text-xs">
                      
                      {/* Row 1 */}
                      <div className="col-span-2 lg:col-span-1 border border-indigo-50 bg-[#f4f6ff] rounded px-3 py-2">
                        <p className="text-slate-500 font-semibold mb-1 text-[10px] md:text-xs">Title/First Name/Last Name</p>
                        <div className="font-bold text-[#242c5c] text-xs md:text-sm">
                           {idx + 1}. {pax.t && pax.t !== "Primary" ? `${pax.t}/ ` : ""}{pax.fn} {pax.ln ? `/${pax.ln}` : ""} <span className="bg-slate-500 text-white text-[9px] px-1.5 py-0.5 rounded ml-1 tracking-wider uppercase">{pax.type}</span>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-1 font-semibold flex items-center gap-1"><FaBox className="text-slate-400"/> {bagAllow}</p>
                      </div>
                      
                      <div>
                         <p className="text-slate-500 font-semibold mb-1 text-[10px] md:text-xs">Status</p>
                         <p className={`font-bold text-xs md:text-sm ${
                           bookingStatus === 'Cancelled' ? 'text-red-600' :
                           local.cancellation?.status === 'pending' ? 'text-amber-600' :
                           isCompleted ? 'text-slate-600' :
                           'text-teal-600'
                         }`}>
                           {local.cancellation?.status === 'pending' ? 'Cancel Pending' : 
                            isCompleted ? 'Completed' :
                            bookingStatus}
                         </p>
                      </div>
                      <div>
                         <p className="text-slate-500 font-semibold mb-1 text-[10px] md:text-xs">Airline PNR</p>
                         <p className="font-bold text-[#242c5c] text-xs md:text-sm">{local.airlinePnr && local.airlinePnr !== "N/A" ? local.airlinePnr : pax.pnr || (typeof bd?.airlinePnr === 'string' ? bd.airlinePnr : null) || "N/A"}</p>
                      </div>
                      <div>
                         <p className="text-slate-500 font-semibold mb-1 text-[10px] md:text-xs">GDS PNR</p>
                         <p className="font-bold text-[#242c5c] text-xs md:text-sm">{pax.gdsPnr || (typeof bd?.gdsPnr === 'string' ? bd.gdsPnr : null) || pax.pnr || "N/A"}</p>
                      </div>
                      <div>
                         <p className="text-slate-500 font-semibold mb-1 text-[10px] md:text-xs">Ticket No</p>
                         <p className="font-bold text-[#242c5c] text-xs md:text-sm">{pax.tktn || "N/A"}</p>
                      </div>

                      {/* Row 2 */}
                      <div>
                         <p className="text-slate-500 font-semibold mb-1 text-[10px] md:text-xs">Meal</p>
                         <p className="font-bold text-[#242c5c] text-xs md:text-sm">{pax.meal || "N/A"}</p>
                      </div>
                      <div>
                         <p className="text-slate-500 font-semibold mb-1 text-[10px] md:text-xs">Baggage</p>
                         <p className="font-bold text-[#242c5c] text-xs md:text-sm">N/A</p>
                      </div>
                      <div>
                         <p className="text-slate-500 font-semibold mb-1 text-[10px] md:text-xs">Seat</p>
                         <p className="font-bold text-[#242c5c] text-xs md:text-sm">{pax.seat}</p>
                      </div>
                      <div className="print:hidden">
                         <p className="text-slate-500 font-semibold mb-1 text-[10px] md:text-xs">Your Markup</p>
                         <p className="font-bold text-[#242c5c] text-xs md:text-sm">₹0.00</p>
                      </div>
                      <div className="print:hidden">
                         <p className="text-slate-500 font-semibold mb-1 text-[10px] md:text-xs">E-ticket Markup</p>
                         <p className="font-bold text-[#242c5c] text-xs md:text-sm">₹0.00</p>
                      </div>

                      {/* Row 3 */}
                      <div>
                         <p className="text-slate-500 font-semibold mb-1 text-[10px] md:text-xs">Passport Number</p>
                         <p className="font-bold text-[#242c5c] text-xs md:text-sm">-</p>
                      </div>
                      <div>
                         <p className="text-slate-500 font-semibold mb-1 text-[10px] md:text-xs">Passport Issue Date</p>
                         <p className="font-bold text-[#242c5c] text-xs md:text-sm">-</p>
                      </div>
                      <div>
                         <p className="text-slate-500 font-semibold mb-1 text-[10px] md:text-xs">Passport Issued Country</p>
                         <p className="font-bold text-[#242c5c] text-xs md:text-sm">-</p>
                      </div>
                      <div>
                         <p className="text-slate-500 font-semibold mb-1 text-[10px] md:text-xs">Nationality</p>
                         <p className="font-bold text-[#242c5c] text-xs md:text-sm">-</p>
                      </div>
                      <div className="hidden lg:block"></div> {/* Spacer */}

                      {/* Row 4 */}
                      <div>
                         <p className="text-slate-500 font-semibold mb-1 text-[10px] md:text-xs">Frequent Flyer Number</p>
                         <p className="font-bold text-[#242c5c] text-xs md:text-sm">-</p>
                      </div>
                      <div>
                         <p className="text-slate-500 font-semibold mb-1 text-[10px] md:text-xs">Document type</p>
                         <p className="font-bold text-[#242c5c] text-xs md:text-sm">-</p>
                      </div>
                      <div>
                         <p className="text-slate-500 font-semibold mb-1 text-[10px] md:text-xs">Document Value</p>
                         <p className="font-bold text-[#242c5c] text-xs md:text-sm">-</p>
                      </div>
                    </div>

                    {/* Fare Breakdown (Right) */}
                    <div className="w-full xl:w-72 bg-[#f8f9fa] border-t xl:border-t-0 xl:border-l border-slate-200 p-5 shrink-0 flex flex-col justify-between text-xs">
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between font-bold text-[#242c5c]">
                          <span>Base Fare</span>
                          <span>₹{(parseFloat(baseFare)/totalPaxCount || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Fuel Surcharges</span>
                          <span>₹0.00</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Other Charges</span>
                          <span>₹0.00</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Tax & Fees</span>
                          <span>₹{(parseFloat(taxes)/totalPaxCount || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Amendment Charges</span>
                          <span>₹0.00</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Meal</span>
                          <span>₹0.00</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Seat</span>
                          <span>₹0.00</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Baggage</span>
                          <span>₹0.00</span>
                        </div>
                      </div>
                      <div className="bg-[#242c5c] text-white px-3 py-2 flex justify-between rounded items-center font-bold text-sm">
                        <span>Gross Fare</span>
                        <span className="flex items-center gap-2 tracking-wide">₹{(parseFloat(totalFare)/totalPaxCount || 0).toFixed(2)} <FaChevronDown className="text-[10px] opacity-70"/></span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="p-4 text-sm text-slate-500 italic">No passenger details available right now.</div>
                )}
              </div>

              {/* Ledger Details */}
              <div className="mt-8 border border-slate-200 rounded-lg overflow-hidden print:hidden bg-white mb-8">
                 <div className="bg-slate-200 px-4 py-3 flex items-center gap-2 border-b-2 border-blue-400">
                   <FaListAlt className="text-[#242c5c]" /> 
                   <h3 className="text-sm font-bold text-[#242c5c]">Ledger Details</h3>
                 </div>
                 <div className="w-full overflow-x-auto">
                   <table className="w-full text-left border-collapse min-w-[700px]">
                     <thead>
                       <tr className="border-b border-slate-200 bg-white text-[10px] md:text-xs text-slate-800 font-bold uppercase tracking-wider">
                         <th className="p-4 w-1/5">Reference Number</th>
                         <th className="p-4 w-1/5">Date Time</th>
                         <th className="p-4 w-2/5">Description</th>
                         <th className="p-4 w-1/10 text-right">Debit</th>
                         <th className="p-4 w-1/10 text-right">Credit</th>
                       </tr>
                     </thead>
                     <tbody className="text-xs text-slate-700">
                       <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                         <td className="p-4 font-medium">{bookRef || "N/A"}</td>
                         <td className="p-4 text-slate-600">{bd?.bookingDate || trip.dDate || "N/A"}</td>
                         <td className="p-4 text-slate-600">Domestic Flight Booking Created {passengerList[0]?.fn} {passengerList[0]?.ln} * {totalPaxCount} {trip.origin}-{trip.destination} {segments[0]?.ac}{segments[0]?.fl} {trip.dDate} by {(local.customerName ? "API" : segments[0]?.ac)}</td>
                         <td className="p-4 font-semibold text-right">₹{parseFloat(totalFare).toFixed(2)}</td>
                         <td className="p-4 text-right">₹0.00</td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
              </div>

           </div>
           
           {/* Footer */}
           <div className="bg-slate-800 text-slate-300 text-xs p-4 text-center print:bg-white print:text-slate-800 print:border-t-2 print:border-slate-800 print:mt-6 print:text-left print:p-6 print:rounded-b-2xl">
              <div className="hidden print:block mb-4 space-y-1">
                 <h4 className="font-bold text-sm uppercase mb-2 tracking-wide text-slate-900">Important Terms & Conditions</h4>
                 <p className="text-[10px] text-slate-600">1. Passengers must report at the airline check-in counter at least 2 hours prior to scheduled departure time.</p>
                 <p className="text-[10px] text-slate-600">2. A valid Government-issued photo ID is mandatory for airport entry and boarding.</p>
                 <p className="text-[10px] text-slate-600">3. Baggage allowance is as per airline rules shown. Excess baggage is subject to additional fees at the airport.</p>
                 <p className="text-[10px] text-slate-600">4. Refund, Cancellation, and Date Change policies apply strictly as per standard airline terms and conditions.</p>
              </div>
              <p className="print:text-center print:text-[10px] font-bold print:mt-6 print:text-slate-500">
                 © {new Date().getFullYear()} Padham Travels. Valid for travel on specific flight dates only.
              </p>
           </div>
        </div>

      </div>

      {/* Cancel Ticket Modal */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <FaTimesCircle /> Cancel Ticket
            </DialogTitle>
            <div className="flex flex-col space-y-3 mt-2">
              <DialogDescription>
                We're sorry to see you cancel your flight. Please let us know the reason for your cancellation.
              </DialogDescription>
              {local.cancellation?.status === 'declined' && (
                <div className="bg-amber-50 text-amber-800 border-[1px] border-amber-300 p-3 text-xs md:text-sm rounded-md mb-2">
                  <p className="font-bold mb-1">Notice regarding re-submission:</p>
                  <p>You have previously requested a cancellation for this trip which was declined. If you are re-submitting, please note that our team reviews requests manually. Please allow 2-4 hours for a response before contacting support.</p>
                </div>
              )}
            </div>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="Tell us why you are cancelling..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" disabled={isCancelling} onClick={() => setIsCancelModalOpen(false)}>Close</Button>
            <Button 
              variant="destructive" 
              disabled={isCancelling}
              onClick={handleRequestCancellation}
            >
              {isCancelling ? "Submitting..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Ticket Modal */}
      <Dialog open={isRescheduleModalOpen} onOpenChange={setIsRescheduleModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-indigo-600 flex items-center gap-2">
              <FaCalendarAlt /> Reschedule Flight
            </DialogTitle>
            <div className="flex flex-col space-y-3 mt-2">
              <DialogDescription>
                Need to change your travel plans? Tell us your preferred new date and the reason for the change.
              </DialogDescription>
              {local.reschedule?.status === 'declined' && (
                <div className="bg-amber-50 text-amber-800 border-[1px] border-amber-300 p-3 text-xs md:text-sm rounded-md mb-2">
                  <p className="font-bold mb-1">Notice regarding re-submission:</p>
                  <p>You have previously requested a reschedule for this trip which was declined by the Admin. If you are re-submitting, please provide more clarity on your preference. Our team reviews requests manually; allow 2-4 hours for a response.</p>
                </div>
              )}
            </div>
          </DialogHeader>
          <div className="py-2 flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">New Departure Date</label>
              <Input 
                type="date" 
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]} 
                className="w-full h-10"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Reason / Prefered Timing</label>
              <Textarea 
                placeholder="E.g., I'd prefer a morning flight around 10 AM..."
                value={rescheduleReason}
                onChange={(e) => setRescheduleReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" disabled={isRescheduling} onClick={() => setIsRescheduleModalOpen(false)}>Close</Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isRescheduling}
              onClick={handleRequestReschedule}
            >
              {isRescheduling ? "Submitting..." : "Confirm Reschedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
