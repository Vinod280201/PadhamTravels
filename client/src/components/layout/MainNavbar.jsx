import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LogoImg from "@/assets/logo.png";

// Icons
import HomeIcon from "@/assets/FlightsSearchPage/Home.png";
import TravelIcon from "@/assets/FlightsSearchPage/travel1.png";
import FlightIcon from "@/assets/FlightsSearchPage/flight.png";
import BookingTermsIcon from "@/assets/FlightsSearchPage/terms1.png";
import AboutUsIcon from "@/assets/FlightsSearchPage/about-us.png";
import { IoPersonCircle } from "react-icons/io5";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi"; // Added Menu and X icons

import { useAuthUser } from "@/hooks/useAuthUser";

const MainNavbar = () => {
  const { user, setUser } = useAuthUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // Data for Navigation Links to reduce repetition
  const navLinks = [
    { path: "/home", label: "HOME", icon: HomeIcon },
    { path: "/flights", label: "FLIGHTS", icon: FlightIcon },
    {
      path: "/tours-and-packages",
      label: "TOURS & PACKAGES",
      icon: TravelIcon,
    },
    {
      path: "/terms-and-conditions",
      label: "BOOKING TERMS",
      icon: BookingTermsIcon,
    },
    { path: "/about-us", label: "ABOUT US", icon: AboutUsIcon },
  ];

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
      setIsMenuOpen(false);
    }
  };

  // Helper to determine if a link is active
  const isActive = (path) => location.pathname === path;

  // Toggle Mobile Menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-sm shadow-sm">
      <div className="flex justify-between items-center max-w-[1440px] mx-auto px-4 py-2">
        {/* --- LEFT: LOGO --- */}
        <div className="shrink-0">
          <Link to="/home">
            <img
              src={LogoImg}
              alt="Padham Travels"
              className="w-16 lg:w-20 h-auto object-contain"
            />
          </Link>
        </div>

        {/* --- CENTER: DESKTOP NAVIGATION (Hidden on Mobile/Tablet) --- */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <div
              key={link.path}
              className="flex items-center group cursor-pointer"
            >
              <img
                src={link.icon}
                alt={link.label}
                className="w-5 h-auto object-contain mr-2 group-hover:scale-110 transition-transform"
              />
              <Link to={link.path} className="flex whitespace-nowrap">
                <div
                  className={`pt-0.5 transition-all duration-200 hover:font-bold ${
                    isActive(link.path)
                      ? "font-bold border-b-2 border-yellow-500 text-black"
                      : "font-medium text-slate-700"
                  }`}
                >
                  {link.label}
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* --- RIGHT: USER & MOBILE TOGGLE --- */}
        <div className="flex items-center gap-3">
          {/* User Avatar - Visible on all screens */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 lg:h-9 lg:w-9 rounded-full bg-yellow-400 flex items-center justify-center text-slate-800 font-bold overflow-hidden shadow-sm">
              {user?.name ? (
                user.name[0]?.toUpperCase()
              ) : (
                <IoPersonCircle size={26} />
              )}
            </div>
            {/* User Name - Hidden on very small screens, visible on md+ */}
            <span className="font-medium text-sm text-slate-800 hidden md:block max-w-[100px] truncate">
              {user?.name || "Guest"}
            </span>
          </div>

          {/* Desktop Logout Button (Hidden on Mobile) */}
          {user && (
            <button
              onClick={handleLogout}
              className="hidden lg:flex items-center text-sm font-semibold h-9 px-3 rounded text-slate-700 border border-slate-800 bg-yellow-400 hover:bg-yellow-500 hover:font-bold transition"
            >
              Logout
              <FiLogOut size={18} className="ml-2" />
            </button>
          )}

          {/* Mobile Menu Toggle Button (Visible on Mobile/Tablet) */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-slate-800 focus:outline-none p-1"
          >
            {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE/TABLET MENU DROPDOWN --- */}
      {/* This div only renders when isMenuOpen is true */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-sm shadow-lg border-t border-gray-200 flex flex-col pb-3 px-4 animate-fade-in-down">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)} // Close menu on click
              className="flex items-center py-3.5 border-b border-gray-200 last:border-none hover:bg-gray-50 transition"
            >
              <img
                src={link.icon}
                alt={link.label}
                className="w-5 h-auto object-contain mx-3"
              />
              <span
                className={`text-base ${
                  isActive(link.path)
                    ? "font-bold text-yellow-600"
                    : "font-medium text-slate-700"
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}

          {/* Mobile Logout Button */}
          {user && (
            <div className="pt-2 border-t border-gray-300">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm text-gray-500">Logged in as:</span>
                <span className="font-bold text-slate-800">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center text-base font-bold h-10 px-4 rounded text-slate-800 bg-yellow-400 hover:bg-yellow-500 transition shadow-sm"
              >
                Logout
                <FiLogOut size={20} className="ml-2" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MainNavbar;
