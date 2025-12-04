import React, { useState } from "react";
import { BiMenu, BiX } from "react-icons/bi";
import { IoPersonCircle } from "react-icons/io5";
import LogoImg from "../assets/logo.png"; // adjust path if needed

export const HeaderNav = () => {
  const [open, setOpen] = useState(false);

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
        <a href='index.html' className="whitespace-nowrap">
          <div className='hover:border-b-2 hover:border-b-yellow-400 hover:font-bold pb-1'>
            <p className='text-white'>HOME</p>
          </div>
        </a>
        <a href='index.html' className='ml-5 whitespace-nowrap'>
          <div className='hover:border-b-2 hover:border-b-yellow-400 hover:font-bold pb-1'>
            <p className='text-white'>ABOUT US</p>
          </div>
        </a>
        <a href='index.html' className='ml-5 whitespace-nowrap'>
          <div className='hover:border-b-2 hover:border-b-yellow-400 hover:font-bold pb-1'>
            <p className='text-white'>FLIGHTS</p>
          </div>
        </a>
        <a href='index.html' className='ml-5 whitespace-nowrap'>
          <div className='hover:border-b-2 hover:border-b-yellow-400 hover:font-bold pb-1'>
            <p className='text-white'>BOOKING TERMS</p>
          </div>
        </a>
        <a href='index.html' className='ml-5 whitespace-nowrap'>
          <div className='hover:border-b-2 hover:border-b-yellow-400 hover:font-bold pb-1'>
            <p className='text-white'>GET IN TOUCH</p>
          </div>
        </a>

        {/* Sign In button — mobile color is blue, md+ overrides to yellow */}
        <button className='flex items-center h-12 relative rounded-sm  px-4 py-1.5 font-bold 
              transition-all duration-300 border-2 ml-5
              lg:text-yellow-400 lg:border-white lg:hover:bg-yellow-400 lg:hover:text-gray-600
              cursor-pointer whitespace-nowrap'>
                <IoPersonCircle size={25} className='mr-2'/>
                SIGN IN
        </button>
      </nav>

      {/* mobile actions: menu icon + sign-in (optional small) */}
      <div className="flex justify-center items-center px-5 lg:hidden gap-2">
        <button
          className="flex items-center mt-2 pl-1 pr-2 py-1 rounded-md border-2 text-sm font-medium border-gray-600 text-gray-600 bg-transparent 
          hover:bg-gray-600 hover:text-yellow-400 transition lg:hidden"
          onClick={() => {}}
          aria-label="Sign In (mobile)"
        >
         <IoPersonCircle size={18} className='mr-1'/>
          SIGN IN
        </button>

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
          open ? "max-h-[400px] opacity-100 py-4" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col gap-3 px-6">
          <a href="#" onClick={() => setOpen(false)} className="py-2 border-b border-white/40 hover:font-medium hover:text-lg">Home</a>
          <a href="#" onClick={() => setOpen(false)} className="py-2 border-b border-white/40 hover:font-medium">About Us</a>
          <a href="#" onClick={() => setOpen(false)} className="py-2 border-b border-white/40 hover:font-medium">Flights</a>
          <a href="#" onClick={() => setOpen(false)} className="py-2 border-b border-white/40 hover:font-medium">Booking Terms</a>
          <a href="#" onClick={() => setOpen(false)} className="py-2 border-b border-white/40 hover:font-medium">Get In Touch</a>
          <button
            className="mt-2 px-3 py-2 rounded-md font-medium border-2 border-white text-yellow-400 
            bg-transparent hover:bg-yellow-400 hover:text-gray-600 hover:font-bold transition"
            onClick={() => setOpen(false)}
          >
            SIGN IN
          </button>
        </div>
      </div>
    </header>
  );
};



{/* 

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
  */}
