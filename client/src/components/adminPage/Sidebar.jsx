import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LogoImg from "@/assets/logo.png";
import ProfileImg from "@/assets/Profile.png";
import {
  ChevronFirst,
  ChevronLast,
  MoreVerticalIcon,
  LayoutDashboard,
  Plane,
  SquareChartGantt,
  Calendar,
  Menu, // Added for mobile toggle
  X, // Added for mobile close
} from "lucide-react";
import { MdCardTravel } from "react-icons/md";

const SidebarContext = createContext();

export const Sidebar = () => {
  const [user, setUser] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false); // State for mobile drawer
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      icon: <LayoutDashboard size={20} />,
      text: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      icon: <Plane size={20} />,
      text: "Book Flights",
      path: "/admin/book-flights",
    },
    {
      icon: <SquareChartGantt size={20} />,
      text: "Manage Bookings",
      path: "/admin/manage-bookings",
    },
    {
      icon: <Calendar size={20} />,
      text: "Booking Calendar",
      alert: true,
      path: "/admin/booking-calendar",
    },
    {
      icon: <MdCardTravel size={20} />,
      text: "Manage Tours",
      path: "/admin/manage-tours",
    },
  ];

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const baseUrl =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/auth/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          console.log("ME not ok:", res.status);
          return;
        }

        const data = await res.json();
        if (data.status && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("SIDEBAR FETCH ME ERROR:", err);
      }
    };

    fetchMe();
  }, []);

  return (
    <>
      {/* --- MOBILE TOGGLE BUTTON --- */}
      {/* Visible only on small screens, fixed to top-left */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-4 z-40 p-2 bg-slate-700 text-white rounded-md shadow-lg md:hidden hover:bg-slate-800"
      >
        <Menu size={24} />
      </button>

      {/* --- MOBILE OVERLAY --- */}
      {/* Darkens background when sidebar is open on mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* --- SIDEBAR CONTAINER --- */}
      <aside
        className={`
          h-screen bg-slate-700 border-r shadow-sm transition-all duration-300 ease-in-out z-50
          fixed top-0 left-0 md:relative 
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
        `}
      >
        <nav className="h-full flex flex-col">
          {/* HEADER */}
          <div className="p-4 pb-2 flex justify-between items-center">
            <img
              src={LogoImg}
              className={`overflow-hidden transition-all ${
                expanded ? "w-22" : "w-0"
              }`}
              alt="Logo"
            />

            {/* Desktop: Collapse/Expand Button */}
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="hidden md:block p-1.5 rounded-lg bg-gray-50 hover:bg-gray-200 cursor-pointer"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>

            {/* Mobile: Close 'X' Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1.5 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* MENU ITEMS */}
          <SidebarContext.Provider value={{ expanded }}>
            <ul className={`flex-1 px-3 ${expanded ? "pt-2" : "pt-0"}`}>
              {items.map((item) => (
                <SidebarItem
                  key={item.text}
                  icon={item.icon}
                  text={item.text}
                  active={location.pathname === item.path}
                  alert={item.alert}
                  onClick={() => {
                    if (item.path) navigate(item.path);
                    setMobileOpen(false); // Close sidebar on mobile after click
                  }}
                />
              ))}
            </ul>
          </SidebarContext.Provider>

          {/* FOOTER (USER PROFILE) */}
          <div className="border-t border-slate-600 flex p-3">
            <img
              src={ProfileImg}
              className="w-10 h-10 rounded-full object-cover"
              alt="Profile"
            />
            <div
              className={`flex justify-between items-center overflow-hidden transition-all ${
                expanded ? "w-42 ml-3" : "w-0"
              }`}
            >
              <div className="leading-4">
                <h4 className="font-semibold text-white">
                  {user?.name || "Admin"}
                </h4>
                <span className="text-xs text-gray-300">
                  {user?.email || ""}
                </span>
              </div>
              <MoreVerticalIcon className="text-gray-300" size={20} />
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

export function SidebarItem({ icon, text, active, alert, onClick }) {
  const { expanded } = useContext(SidebarContext);
  return (
    <li
      onClick={onClick}
      className={`
        relative flex items-center my-1 rounded-md font-medium cursor-pointer transition-colors group
        ${
          active
            ? "bg-orange-500 text-white"
            : "text-gray-300 hover:bg-slate-200 hover:text-slate-800"
        }
      `}
    >
      <div className="flex items-center justify-center min-w-10 h-10">
        {icon}
      </div>
      <span
        className={`overflow-hidden transition-all whitespace-nowrap ${
          expanded ? "w-42 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-orange-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {/* Tooltip for collapsed state (Desktop only) */}
      {!expanded && (
        <div
          className={`
            absolute left-full rounded-md px-2 py-1 ml-6 
            bg-slate-600 text-white text-sm 
            invisible opacity-20 -translate-x-3 transition-all whitespace-nowrap 
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
            z-50
          `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
