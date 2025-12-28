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
} from "lucide-react";
import { MdCardTravel } from "react-icons/md";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SidebarContext = createContext();

export const Sidebar = () => {
  const [user, setUser] = useState(null);
  const [expanded, setExpanded] = useState(true);
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
        const res = await fetch(
          "https://padham-travels-api.onrender.com/api/auth/me",
          {
            credentials: "include", // send cookie
          }
        );

        if (!res.ok) {
          console.log("ME not ok:", res.status);
          return;
        } // 401 when not logged in etc.

        const data = await res.json();
        console.log("Sidebar /me data:", data);
        if (data.status && data.user) {
          setUser(data.user); // { id, name, email, role }
        }
      } catch (err) {
        console.error("SIDEBAR FETCH ME ERROR:", err);
      }
    };

    fetchMe();
  }, []);
  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-slate-700 border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src={LogoImg}
            className={`overflow-hidden transition-all ${
              expanded ? "w-22" : "w-0"
            }`}
            alt="Logo"
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-200 cursor-pointer"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className={`flex-1 px-3 ${expanded ? "pt-2" : "pt-0"}`}>
            {items.map((item) => (
              <SidebarItem
                key={item.text}
                icon={item.icon}
                text={item.text}
                active={location.pathname === item.path}
                alert={item.alert}
                onClick={() => item.path && navigate(item.path)}
              />
            ))}
          </ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <img src={ProfileImg} className="w-10 h-10" />
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${
              expanded ? "w-42 ml-3" : "w-0"
            }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold text-white">
                {user?.name || "Admin"}
              </h4>
              <span className="text-xs text-gray-300">{user?.email || ""}</span>
            </div>
            <MoreVerticalIcon className="text-gray-300" />
          </div>
        </div>
      </nav>
    </aside>
  );
};

export function SidebarItem({ icon, text, active, alert, onClick }) {
  const { expanded } = useContext(SidebarContext);
  return (
    <li
      onClick={onClick}
      className={`relative flex items-center my-1 rounded-md font-medium cursor-pointer transition-colors group
      ${
        active
          ? "bg-orange-500 text-white"
          : "text-gray-300 hover:bg-slate-200 hover:text-slate-800"
      }
    `}
    >
      <div className="flex items-center justify-center w-10 h-10 ">{icon}</div>
      <span
        className={`overflow-hidden transition-all ${
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

      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-slate-600 text-white text-sm invisible opacity-20 -translate-x-3 transition-all whitespace-nowrap group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div> // when collapsed, show tooltip on hover
      )}
    </li>
  );
}
