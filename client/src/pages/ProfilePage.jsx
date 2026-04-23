import React, { useState, useEffect } from "react";
import { useAuthUser } from "@/hooks/useAuthUser";
import MainNavbar from "@/components/layout/MainNavbar";
import { Footer } from "@/components/landingPage/Footer";
import { apiGet, apiPut } from "@/apiClient";
import { FaUserEdit, FaSuitcaseRolling, FaPhone, FaCalendarAlt, FaVenusMars, FaMapMarkerAlt, FaEnvelope, FaPlaneDeparture, FaGlobeAmericas, FaCompass, FaPlane } from "react-icons/fa";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";

export const ProfilePage = () => {
  const { user, setUser } = useAuthUser();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "personal";
  
  // Personal Details State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    address: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  // Bookings State
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingTab, setBookingTab] = useState("upcoming");

  useEffect(() => {
    // Populate form with user context
    if (user) {
      let code = "+91";
      let number = "";
      
      // Basic splitting if phone contains spaces or standard formatting
      if (user.phone) {
         if (user.phone.includes(" ")) {
           const parts = user.phone.split(" ");
           code = parts[0];
           number = parts.slice(1).join(" ");
         } else {
           // If they saved without space like +919999999999
           if (user.phone.startsWith("+")) {
             // assuming first 3 chars is country code like +91
             code = user.phone.substring(0, 3);
             number = user.phone.substring(3);
           } else {
             number = user.phone;
           }
         }
      }

      setFormData({
        name: user.name || "",
        email: user.email || "",
        countryCode: code,
        phoneNumber: number,
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
        gender: user.gender || "",
        address: user.address || ""
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "bookings") {
      fetchMyBookings();
    }
  }, [activeTab]);

  const fetchMyBookings = async () => {
    setLoadingBookings(true);
    try {
      const response = await apiGet("/bookings/my-bookings");
      const data = await response.json();
      if (data.status) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      toast.error("Failed to load your booking history");
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Combine phone code and number before sending
    const combinedPhone = `${formData.countryCode} ${formData.phoneNumber}`;
    // Exclude countryCode and phoneNumber from payload directly, replace with 'phone'
    const payload = {
      ...formData,
      phone: combinedPhone
    };
    delete payload.countryCode;
    delete payload.phoneNumber;

    try {
      const response = await apiPut("/auth/update-profile", payload);
      const data = await response.json();
      if (data.status) {
        toast.success("Profile Updated Successfully");
        setUser(data.user);
        
        // Update local storage so the next reload retains auth token info
        const storedUser = JSON.parse(localStorage.getItem("authUser")) || {};
        const updatedLocalUser = { ...storedUser, ...data.user };
        localStorage.setItem("authUser", JSON.stringify(updatedLocalUser));
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while saving profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewTicket = (booking) => {
    const stateData = {
       searchId: booking.searchId,
       priceId: booking.priceId,
       bookRef: booking.bookingRef
    };
    navigate("/flight-ticket", { state: stateData });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <MainNavbar />
      
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-[#242c5c] rounded-2xl p-6 sm:p-10 mb-8 shadow-xl relative overflow-hidden flex items-center gap-6">
          {/* Decorative Gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2"></div>
          
          {/* Custom Decorative Travel Vectors (Freepik-style outlines) */}
          
          {/* Airplane & Flight Path */}
          <div className="absolute top-6 right-16 opacity-30 pointer-events-none -rotate-12">
            <svg width="250" height="150" viewBox="0 0 250 150" className="absolute -left-52 top-8">
               <path d="M 0,140 Q 80,160 150,80 T 240,40" stroke="white" strokeWidth="2.5" strokeDasharray="8 8" fill="none" opacity="0.6" />
            </svg>
            <FaPlane className="text-[100px] text-white rotate-45 transform filter drop-shadow-md" />
            <svg width="100" height="50" viewBox="0 0 100 50" className="absolute -left-10 -bottom-10 opacity-40">
               <path d="M 20,30 a 10,10 0 0,1 20,0 a 12,12 0 0,1 20,0 a 10,10 0 0,1 -40,0 z" fill="white" stroke="none"/>
            </svg>
          </div>

          {/* Earth Globe */}
          <FaGlobeAmericas className="absolute -bottom-14 right-[25%] text-[200px] text-white opacity-10 pointer-events-none" />

          {/* Folded Map & Pin */}
          <svg width="150" height="150" viewBox="0 0 100 100" className="absolute -top-5 left-[40%] opacity-20 rotate-12 pointer-events-none fill-none stroke-white" strokeWidth="1.2">
            <path d="M 20,40 L 40,30 L 60,40 L 80,30 L 80,80 L 60,90 L 40,80 L 20,90 Z" opacity="0.7" />
            <path d="M 40,30 L 40,80 M 60,40 L 60,90" opacity="0.7" />
            <path d="M 50,8 C 38,8 38,30 50,45 C 62,30 62,8 50,8 Z" fill="white" opacity="0.5" stroke="none" />
            <circle cx="50" cy="20" r="4" fill="#242c5c" stroke="none" />
            <path d="M 30,55 L 35,52 M 65,65 L 70,62" opacity="0.4" />
          </svg>

          {/* Vintage Compass - Resized and Repositioned */}
          <svg width="100" height="100" viewBox="0 0 100 100" className="absolute -bottom-6 left-[30%] opacity-20 rotate-[15deg] pointer-events-none fill-none stroke-white" strokeWidth="1.2">
            <circle cx="50" cy="50" r="40" strokeWidth="1.5" opacity="0.8" />
            <circle cx="50" cy="50" r="32" strokeDasharray="4 4" opacity="0.5" />
            <path d="M 50,15 L 60,50 L 50,85 L 40,50 Z" />
            <path d="M 15,50 L 50,60 L 85,50 L 50,40 Z" opacity="0.5" />
            <circle cx="50" cy="50" r="5" fill="white" stroke="none" opacity="0.8" />
            <path d="M 50,5 L 50,10 M 50,90 L 50,95 M 5,50 L 10,50 M 90,50 L 95,50" opacity="0.6" />
          </svg>

          <div className="w-20 h-20 sm:w-28 sm:h-28 bg-yellow-400 text-slate-900 rounded-full flex items-center justify-center text-4xl sm:text-5xl font-bold shadow-lg shrink-0 z-10 border-4 border-white">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="z-10 text-white">
            <h1 className="text-3xl sm:text-4xl font-black">{user?.name}</h1>
            <p className="text-blue-200 mt-1 font-medium">{user?.email}</p>
          </div>
        </div>

        {/* Desktop Layout configuration */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
              <button 
                onClick={() => setSearchParams({ tab: "personal" })}
                className={`w-full flex items-center gap-3 px-6 py-4 text-left font-bold transition-colors ${activeTab === 'personal' ? 'bg-yellow-50 text-yellow-600 border-l-4 border-yellow-500' : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'}`}
              >
                <FaUserEdit className="text-lg" /> Personal Details
              </button>
              <div className="h-px bg-slate-200 w-full"></div>
              <button 
                onClick={() => setSearchParams({ tab: "bookings" })}
                className={`w-full flex items-center gap-3 px-6 py-4 text-left font-bold transition-colors ${activeTab === 'bookings' ? 'bg-yellow-50 text-yellow-600 border-l-4 border-yellow-500' : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'}`}
              >
                <FaSuitcaseRolling className="text-lg" /> My Bookings
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            
            {/* Personal Details Tab */}
            {activeTab === "personal" && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 animate-fade-in-down">
                <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><FaUserEdit className="text-yellow-500" /> Edit Personal Information</h2>
                
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        required
                        value={formData.name} 
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><FaEnvelope className="text-slate-400"/> Email Address</label>
                      <input 
                        type="email" 
                        disabled
                        value={formData.email} 
                        className="w-full px-4 py-2 border border-slate-200 bg-slate-100 text-slate-500 rounded-lg outline-none cursor-not-allowed"
                      />
                      <p className="text-xs text-slate-400 mt-1">Email address cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><FaPhone className="text-slate-400"/> Phone Number</label>
                      <div className="flex gap-2 w-full">
                        <select
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleChange}
                          className="w-[100px] shrink-0 px-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all bg-white font-medium text-sm"
                        >
                          <option value="+91">+91 (IN)</option>
                          <option value="+1">+1 (US/CA)</option>
                          <option value="+44">+44 (UK)</option>
                          <option value="+61">+61 (AU)</option>
                          <option value="+971">+971 (AE)</option>
                          <option value="+65">+65 (SG)</option>
                        </select>
                        <input 
                          type="tel" 
                          name="phoneNumber" 
                          value={formData.phoneNumber} 
                          onChange={handleChange}
                          placeholder="Your mobile number"
                          className="flex-1 min-w-0 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><FaCalendarAlt className="text-slate-400"/> Date of Birth</label>
                      <input 
                        type="date" 
                        name="dateOfBirth" 
                        value={formData.dateOfBirth} 
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><FaVenusMars className="text-slate-400"/> Gender</label>
                      <select 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all bg-white"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><FaMapMarkerAlt className="text-slate-400"/> Address</label>
                      <textarea 
                        name="address" 
                        value={formData.address} 
                        onChange={handleChange}
                        rows="3"
                        placeholder="Enter your full address"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-8 py-3 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSaving ? "Saving Changes..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* My Bookings Tab */}
            {activeTab === "bookings" && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 animate-fade-in-down">
                <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><FaSuitcaseRolling className="text-yellow-500" /> Booking History</h2>
                
                {loadingBookings ? (
                  <div className="flex justify-center flex-col items-center py-12">
                     <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                     <p className="mt-4 text-slate-500 font-medium">Loading your bookings...</p>
                  </div>
                ) : bookings.length > 0 ? (
                  (() => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const upcomingBookings = bookings.filter(b => {
                      if (!b.date) return false;
                      const travelDate = new Date(b.date);
                      return travelDate >= today;
                    }).sort((a, b) => new Date(a.date) - new Date(b.date));

                    const completedBookings = bookings.filter(b => {
                      if (!b.date) return false;
                      const travelDate = new Date(b.date);
                      return travelDate < today;
                    }).sort((a, b) => new Date(b.date) - new Date(a.date));

                    return (
                      <div className="space-y-6">
                        <div className="flex gap-6 border-b border-slate-200">
                          <button
                            onClick={() => setBookingTab("upcoming")}
                            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${bookingTab === 'upcoming' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                          >
                            Upcoming
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{upcomingBookings.length}</span>
                          </button>
                          <button
                            onClick={() => setBookingTab("completed")}
                            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${bookingTab === 'completed' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                          >
                            Completed
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{completedBookings.length}</span>
                          </button>
                        </div>

                        {bookingTab === 'upcoming' && (
                          <div className="space-y-4">
                            {upcomingBookings.length > 0 ? (
                              upcomingBookings.map((booking) => (
                                <div key={booking._id} className="border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow bg-blue-50/30 border-l-4 border-l-blue-500">
                                  <div>
                                    <div className="flex items-center gap-3 mb-1">
                                       <h3 className="font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded text-sm">{booking.bookingRef}</h3>
                                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${
                                         booking.status === 'Cancelled' ? 'bg-red-500 text-white' : 
                                         booking.cancellation?.status === 'pending' || booking.cancellation?.status === 'quoted' ? 'bg-amber-500 text-white' :
                                         booking.cancellation?.status === 'confirmed' ? 'bg-orange-500 text-white' :
                                         'bg-[#008c5f] text-white'
                                       }`}>
                                         {booking.status === 'Cancelled' ? 'Cancelled' : 
                                          booking.cancellation?.status === 'pending' ? 'Cancel Pending' : 
                                          booking.cancellation?.status === 'quoted' ? 'Refund Quoted' : 
                                          booking.cancellation?.status === 'confirmed' ? 'Cancel Confirmed' :
                                          booking.status}
                                       </span>
                                    </div>
                                    <p className="text-sm font-semibold text-[#242c5c] mb-1 flex items-center gap-2">
                                       <FaPlaneDeparture className="text-blue-500" /> {booking.flight}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                                      <p>Travel Date: {booking.date}</p>
                                      <p>Amount: ₹{booking.amount}</p>
                                    </div>
                                  </div>
                                  <button 
                                    onClick={() => handleViewTicket(booking)}
                                    className="w-full sm:w-auto px-5 py-2.5 bg-[#242c5c] hover:bg-blue-900 text-white font-bold rounded-lg text-sm transition-colors shadow-sm"
                                  >
                                    View Ticket
                                  </button>
                                </div>
                              ))
                            ) : (
                              <p className="text-slate-500 py-6 text-center text-sm font-medium">No upcoming bookings found.</p>
                            )}
                          </div>
                        )}

                        {bookingTab === 'completed' && (
                          <div className="space-y-4">
                            {completedBookings.length > 0 ? (
                              completedBookings.map((booking) => (
                                <div key={booking._id} className="border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow bg-slate-50/80 opacity-90">
                                  <div>
                                    <div className="flex items-center gap-3 mb-1">
                                       <h3 className="font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded text-sm">{booking.bookingRef}</h3>
                                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${
                                         booking.status === 'Cancelled' ? 'bg-red-500 text-white' : 
                                         booking.status === 'Confirmed' ? 'bg-slate-500 text-white' : 
                                         'bg-orange-500 text-white'
                                       }`}>
                                         {booking.status === 'Cancelled' ? 'Cancelled' : 
                                          booking.status === 'Confirmed' ? 'Completed' : 
                                          booking.status}
                                       </span>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-600 mb-1 flex items-center gap-2">
                                       <FaPlaneDeparture className="text-slate-400" /> {booking.flight}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                                      <p>Travel Date: {booking.date}</p>
                                      <p>Amount: ₹{booking.amount}</p>
                                    </div>
                                  </div>
                                  <button 
                                    onClick={() => handleViewTicket(booking)}
                                    className="w-full sm:w-auto px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-sm transition-colors shadow-sm"
                                  >
                                    View Ticket
                                  </button>
                                </div>
                              ))
                            ) : (
                              <p className="text-slate-500 py-6 text-center text-sm font-medium">No completed bookings found.</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
                    <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 text-2xl">
                       <FaSuitcaseRolling />
                    </div>
                    <p className="text-lg font-bold text-slate-700">No bookings found</p>
                    <p className="text-slate-500 text-sm mt-1">Looks like you haven't booked any flights with us yet.</p>
                    <button onClick={() => navigate("/flights")} className="mt-6 font-bold text-blue-600 hover:text-blue-700 hover:underline">Start searching flights →</button>
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
