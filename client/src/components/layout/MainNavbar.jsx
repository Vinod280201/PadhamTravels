import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LogoImg from "@/assets/logo.png";
import HomeIcon from "@/assets/FlightsSearchPage/Home.png";
import TravelIcon from "@/assets/FlightsSearchPage/travel1.png";
import FlightIcon from "@/assets/FlightsSearchPage/flight.png";
import BookingTermsIcon from "@/assets/FlightsSearchPage/terms1.png";
import { IoPersonCircle } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { useAuthUser } from "@/hooks/useAuthUser";

const MainNavbar = () => {
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const location = useLocation();
  const baseUrl = "http://localhost:3000";

  const handleLogout = async () => {
    try {
      await fetch(`${baseUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      // 1) clear auth info used by RequireAuth
      localStorage.removeItem("authUser");

      // 2) clear any React state you keep
      setUser(null);

      // 3) redirect to login (or landing)
      window.location.assign("/login"); // or navigate("/login")
    }
  };

  // 👇 check current path
  const isToursPage = location.pathname === "/tours-and-packages";
  const isFlightsPage = location.pathname === "/flights";

  return (
    <div className="flex justify-between bg-transparent mx-4 mb-4">
      {/* Left: logo + nav links */}
      <div className="flex items-center">
        <div>
          <Link to="/home">
            <img
              src={LogoImg}
              alt="Padham Travels"
              className="w-15 ml-2 lg:ml-10 sm:ml-6 lg:w-20 h-auto object-contain"
            />
          </Link>
        </div>

        <Link to="/home" className="flex ml-5 whitespace-nowrap">
          <img
            src={HomeIcon}
            alt="Home"
            className="w-3 lg:ml-7 lg:w-5 h-auto object-contain"
          />
          <div className="ml-1.5 hover:font-bold font-medium pt-0.5">
            <p className="text-slate-700">HOME</p>
          </div>
        </Link>

        {/* ✅ Only show TOURS & PACKAGES link when NOT on tours page */}
        {!isToursPage && (
          <Link
            to="/tours-and-packages"
            className="flex ml-1 whitespace-nowrap"
          >
            <img
              src={TravelIcon}
              alt="Tours"
              className="w-3 lg:ml-7 lg:w-6 h-auto object-contain"
            />
            <div className="ml-1.5 hover:font-bold font-medium pt-0.5">
              <p className="text-slate-700">TOURS &amp; PACKAGES</p>
            </div>
          </Link>
        )}

        {/* ✅ Always show Flights nav so you can go from tours → flights */}
        {!isFlightsPage && (
          <Link to="/flights" className="flex ml-1 whitespace-nowrap">
            <img
              src={FlightIcon}
              alt="Flights"
              className="w-3 lg:ml-7 lg:w-6 h-auto object-contain"
            />
            <div className="ml-1.5 hover:font-bold font-medium pt-0.5">
              <p className="text-slate-700">FLIGHTS</p>
            </div>
          </Link>
        )}

        <Link to="/home" className="flex ml-1 whitespace-nowrap">
          <img
            src={BookingTermsIcon}
            alt="Terms&Conditions"
            className="w-3 lg:ml-7 lg:w-5 h-auto object-contain"
          />
          <div className="ml-1 hover:font-bold font-medium pt-0.5">
            <p className="text-slate-700">BOOKING TERMS</p>
          </div>
        </Link>
      </div>

      {/* Right: user + logout (unchanged) */}
      <div className="flex items-center gap-3 mr-4">
        <div className="h-9 w-9 rounded-full bg-yellow-400 flex items-center justify-center text-slate-800 font-bold overflow-hidden">
          {user?.name ? (
            user.name[0]?.toUpperCase()
          ) : (
            <IoPersonCircle size={26} />
          )}
        </div>

        <span className="font-medium text-sm text-slate-800 md:text-base">
          {user?.name || "Guest"}
        </span>

        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center text-sm md:text-md font-semibold h-9 px-3 m-2 rounded text-slate-700 border border-slate-800 bg-yellow-400 hover:font-bold transition"
          >
            Logout
            <FiLogOut size={20} className="ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MainNavbar;
