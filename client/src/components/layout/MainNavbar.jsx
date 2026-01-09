import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LogoImg from "@/assets/logo.png";
import HomeIcon from "@/assets/FlightsSearchPage/Home.png";
import TravelIcon from "@/assets/FlightsSearchPage/travel1.png";
import FlightIcon from "@/assets/FlightsSearchPage/flight.png";
import BookingTermsIcon from "@/assets/FlightsSearchPage/terms1.png";
import AboutUsIcon from "@/assets/FlightsSearchPage/about-us.png";
import { IoPersonCircle } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { useAuthUser } from "@/hooks/useAuthUser";

const MainNavbar = () => {
  const { user, setUser } = useAuthUser();
  const navigate = useNavigate();
  const location = useLocation();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const handleLogout = async () => {
    try {
      await fetch(`${baseUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem("authUser");
      setUser(null);
      navigate("/", { replace: true });
    }
  };

  // Helper to determine if a link is active
  const isActive = (path) => location.pathname === path;

  // Dynamic class generator for Nav Links
  const linkClass = (path) =>
    `ml-1.5 pt-0.5 transition-all duration-200 hover:font-bold ${
      isActive(path) ? "font-bold border-b-2 border-yellow-500" : "font-medium"
    }`;

  return (
    <div className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm shadow-sm px-4 py-2">
      <div className="flex justify-between items-center max-w-[1440px] mx-auto">
        {/* Left: logo + nav links */}
        <div className="flex items-center">
          <div>
            <Link to="/home">
              <img
                src={LogoImg}
                alt="Padham Travels"
                className="w-15 lg:w-20 h-auto object-contain"
              />
            </Link>
          </div>

          {/* HOME */}
          <div className="flex items-center">
            <img
              src={HomeIcon}
              alt="Home"
              className="w-3 lg:ml-5 lg:w-5 h-auto object-contain"
            />
            <Link to="/home" className="flex whitespace-nowrap">
              <div className={linkClass("/home")}>
                <p className="text-slate-700">HOME</p>
              </div>
            </Link>
          </div>

          {/* FLIGHTS */}
          <div className="flex items-center">
            <img
              src={FlightIcon}
              alt="Flights"
              className="w-3 lg:ml-5 lg:w-6 h-auto object-contain"
            />
            <Link to="/flights" className="flex whitespace-nowrap">
              <div className={linkClass("/flights")}>
                <p className="text-slate-700">FLIGHTS</p>
              </div>
            </Link>
          </div>

          {/* TOURS & PACKAGES */}
          <div className="flex items-center">
            <img
              src={TravelIcon}
              alt="Tours"
              className="w-3 lg:ml-5 lg:w-6 h-auto object-contain"
            />
            <Link to="/tours-and-packages" className="flex whitespace-nowrap">
              <div className={linkClass("/tours-and-packages")}>
                <p className="text-slate-700">TOURS &amp; PACKAGES</p>
              </div>
            </Link>
          </div>

          {/* BOOKING TERMS */}
          <div className="flex items-center">
            <img
              src={BookingTermsIcon}
              alt="Terms&Conditions"
              className="w-3 lg:ml-5 lg:w-5 h-auto object-contain"
            />
            <Link to="/terms-and-conditions" className="flex whitespace-nowrap">
              <div className={linkClass("/terms-and-conditions")}>
                <p className="text-slate-700">BOOKING TERMS</p>
              </div>
            </Link>
          </div>

          {/* ABOUT US */}
          <div className="flex items-center">
            <img
              src={AboutUsIcon}
              alt="About-Us"
              className="w-3 lg:ml-5 lg:w-6 h-auto object-contain"
            />
            <Link to="/about-us" className="flex whitespace-nowrap">
              <div className={linkClass("/about-us")}>
                <p className="text-slate-700">ABOUT US</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Right: user + logout */}
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
    </div>
  );
};

export default MainNavbar;
