import React, { useState } from "react";
import { BiMenu, BiX } from "react-icons/bi";
import { IoPersonCircle } from "react-icons/io5";
import LogoImg from "@/assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "@/hooks/useAuthUser";

export const HeaderNav = () => {
  const [open, setOpen] = useState(false);
  const { user, setUser } = useAuthUser();
  console.log("HeaderNav user =", user);
  const navigate = useNavigate();
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
      console.log("🧹 CLEARED localStorage");
      setUser(null);
      console.log("👤 SET USER TO NULL");
      navigate("/", { replace: true });
    }
  };

  return (
    <header className="w-full px-4 lg:px-6 lg:pl-8 lg:pr-12 xl:pr-60 py-3 bg-transparent flex items-center justify-between z-50 relative">
      {/* left: logo */}
      <div className="flex items-center gap-3">
        <img
          src={LogoImg}
          alt="Padham Travels"
          className="w-15 ml-2 lg:ml-15 sm:ml-6 lg:w-30 h-auto object-contain"
        />
      </div>

      {/* desktop / tablet nav */}
      <nav className="hidden lg:flex items-center gap-5 flex-nowrap">
        <Link to="/home" className="whitespace-nowrap">
          <div className="hover:border-b-2 hover:border-b-yellow-400 hover:font-bold pb-1">
            <p className="text-white">HOME</p>
          </div>
        </Link>
        <Link to="/flights" className="ml-5 whitespace-nowrap">
          <div className="hover:border-b-2 hover:border-b-yellow-400 hover:font-bold pb-1">
            <p className="text-white">FLIGHTS</p>
          </div>
        </Link>
        <Link to="/tours-and-packages" className="ml-5 whitespace-nowrap">
          <div className="hover:border-b-2 hover:border-b-yellow-400 hover:font-bold pb-1">
            <p className="text-white">TOURS & PACKAGES</p>
          </div>
        </Link>
        <Link to="/about-us" className="ml-5 whitespace-nowrap">
          <div className="hover:border-b-2 hover:border-b-yellow-400 hover:font-bold pb-1">
            <p className="text-white">ABOUT US</p>
          </div>
        </Link>
        <Link to="/terms-and-conditions" className="ml-5 whitespace-nowrap">
          <div className="hover:border-b-2 hover:border-b-yellow-400 hover:font-bold pb-1">
            <p className="text-white">BOOKING TERMS</p>
          </div>
        </Link>

        {/* Sign In button — mobile color is blue, md+ overrides to yellow */}
        {/* RIGHT SIDE: auth area */}
        {!user && (
          <button
            className="flex items-center h-12 relative rounded-sm  px-4 py-1.5 font-bold 
              transition-all duration-300 border-2 ml-5
              lg:text-yellow-400 lg:border-white lg:hover:bg-yellow-400 lg:hover:text-gray-600
              cursor-pointer whitespace-nowrap"
          >
            <IoPersonCircle size={25} className="mr-2" />
            <Link to="/login">SIGN IN</Link>
          </button>
        )}
        {user && (
          <div className="flex items-center ml-5 gap-2 text-white whitespace-nowrap">
            <div className="h-9 w-9 rounded-full bg-yellow-400 flex items-center justify-center text-gray-800 font-bold">
              {user.name?.[0]?.toUpperCase() || <IoPersonCircle size={25} />}
            </div>
            <span className="font-medium">{user.name}</span>
            <button
              onClick={handleLogout}
              className="text-md font-semibold h-10 ml-5 px-3 py-1 rounded border border-white/60 hover:bg-white hover:text-gray-800 transition"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* mobile actions: menu icon + sign-in (optional small) */}
      <div className="flex justify-center items-center lg:hidden gap-2">
        {!user && (
          <button
            className="flex items-center mt-2 pl-1 pr-2 py-1 rounded-md border-2 text-sm font-medium border-gray-600 text-gray-600 bg-transparent 
          hover:bg-gray-600 hover:text-yellow-400 transition lg:hidden"
            onClick={() => {}}
            aria-label="Sign In (mobile)"
          >
            <IoPersonCircle size={18} className="mr-1" />
            <Link to="/login">SIGN IN</Link>
          </button>
        )}

        <button
          onClick={() => setOpen((v) => !v)}
          className="p-1.5 mt-1.5 rounded-md bg-black/40 text-white hover:bg-black/60 transition"
          aria-label="Toggle navigation"
        >
          {open ? <BiX size={20} /> : <BiMenu size={20} />}
        </button>
      </div>

      {/* mobile menu (slides down) */}
      <div
        className={`absolute left-10 right-10 top-full rounded-b-lg bg-black/80 text-white transform transition-all duration-200 ease-in-out lg:hidden z-40 ${
          open
            ? "max-h-[400px] opacity-100 py-4"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        {user && (
          <div className="flex text-sm items-center pb-2 ml-5 mt-1 gap-1 text-gray-700  whitespace-nowrap border-b border-white/40">
            <div className="w-8 h-8 bg-yellow-400 rounded-full font-bold text-center justify-center items-center pt-1.5">
              {user.name?.[0]?.toUpperCase() || <IoPersonCircle size={25} />}
            </div>
            <span className="p-1 text-white font-medium">{user.name}</span>
          </div>
        )}
        <div className="flex flex-col gap-3 px-6">
          <Link
            to="/home"
            onClick={() => setOpen(false)}
            className="py-2 border-b border-white/40 hover:font-medium hover:text-lg"
          >
            Home
          </Link>
          <Link
            to="/flights"
            onClick={() => setOpen(false)}
            className="py-2 border-b border-white/40 hover:font-medium"
          >
            Flights
          </Link>
          <Link
            to="/tours-and-packages"
            onClick={() => setOpen(false)}
            className="py-2 border-b border-white/40 hover:font-medium"
          >
            Tours & Packages
          </Link>
          <Link
            to="/about-us"
            onClick={() => setOpen(false)}
            className="py-2 border-b border-white/40 hover:font-medium"
          >
            About Us
          </Link>
          <Link
            to="#"
            onClick={() => setOpen(false)}
            className="py-2 border-b border-white/40 hover:font-medium"
          >
            Booking Terms
          </Link>
          {!user && (
            <button
              className="mt-2 px-3 py-2 rounded-md font-medium border-2 border-white text-yellow-400 
            bg-transparent hover:bg-yellow-400 hover:text-gray-600 hover:font-bold transition"
              onClick={() => setOpen(false)}
            >
              <Link to="/login">SIGN IN</Link>
            </button>
          )}
          {user && (
            <button
              onClick={handleLogout}
              className="mt-2 px-3 py-2 rounded-md font-medium border-2 border-white text-yellow-400 
            bg-transparent hover:bg-yellow-400 hover:text-gray-600 hover:font-bold transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

{
  /* 

  import { IoPersonCircle } from "react-icons/io5";
import LogoImage from '../assets/logo.png'

  export const HeaderNav = () => {
  return (
      <div className='flex ml-10 mb-3'>
        <div>
          <img src={LogoImage} className='w-28 h-21 ml-35 mt-3'/>
        </div>
        <div className='grid grid-cols-3 gap-2'>
          

          <div className='col-span-1 flex ml-12 py-5'>
            <button className='flex items-center h-12 relative rounded-sm  px-4 py-1.5 text-yellow-400 font-bold 
              transition-all duration-300 border-2 border-white hover:bg-yellow-400 
              cursor-pointer hover:text-gray-600'>
                <IoPersonCircle size={25} className='mr-2' />
                SIGN IN
            </button>
          </div>
        </div>
      </div>
  )
}
  */
}
