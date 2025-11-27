import React from 'react'
import { CgProfile } from "react-icons/cg";
import { IoPersonCircle } from "react-icons/io5";
import LogoImage from '../assets/logo.png'

export const HeaderNav = () => {
  return (
      <div className='flex ml-10 mb-3'>
        <div>
          <img src={LogoImage} className='w-28 h-21 ml-35 mt-3'/>
        </div>
        <div className='grid grid-cols-3 gap-2'>
          <div className='col-span-2 flex ml-30 mr-5 items-center'>
            <a href='index.html' className='ml-35'>
              <div className='hover:border-b-2 hover:border-b-yellow-400 hover:font-bold pb-1'>
                <p className='text-white'>HOME</p>
              </div>
            </a>
            <a href='index.html' className='ml-10'>
              <div className='hover:border-b-2 hover:border-b-yellow-400 hover:font-bold pb-1'>
                <p className='text-white'>ABOUT US</p>
              </div>
            </a>
            <a href='index.html' className='ml-10'>
              <div className='hover:border-b-2 hover:border-b-yellow-400 hover:font-bold pb-1'>
                <p className='text-white'>FLIGHTS</p>
              </div>
            </a>
            <a href='index.html' className='ml-10'>
              <div className='hover:border-b-2 hover:border-b-yellow-400 hover:font-bold pb-1'>
                <p className='text-white'>BOOKING TERMS</p>
              </div>
            </a>
            <a href='index.html' className='ml-10'>
              <div className='hover:border-b-2 hover:border-b-yellow-400 hover:font-bold pb-1'>
                <p className='text-white'>GET IN TOUCH</p>
              </div>
            </a>
          </div>

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
