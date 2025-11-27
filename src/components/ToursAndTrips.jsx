import React from 'react'
import TRIPS_AND_TOURS from '../constants/AppConstants.jsx'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const ToursAndTrips = () => {

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };

  return (

      <div className='h-[60%] p-20 bg-[#1a63a8]'>
          <p className='text-xs text-white text-center font-medium'>T O U R S &nbsp; &nbsp;&  &nbsp; &nbsp;P A C K A G E S</p>
          <p className=' text-white text-3xl text-center mt-1'>
              Places to
              <span className='text-white font-bold'> Explore</span>
          </p> 

         <div className='mt-20 px-10'>
          <Slider {...settings}>
            {
              TRIPS_AND_TOURS.map((trip) => {
                return (
                    <div key={`trips-packages-${trip.id}`} className='bg-white py-5 rounded-lg text-center shadow shadow-gray-600'>
                        <div className='flex justify-center items-center'>
                          <img src={trip.image} className='w-[250px] h-45 m-0 rounded-lg'/>
                        </div>
                        <p className='mt-3 font-semibold'>{trip.title}</p>
                        <p className='text-sm mt-1'>
                          <span className='text-gray-600'>Starting from</span> 
                          <span className='font-medium text-red-500'> {trip.amount}</span>
                        </p>
                        <div className='flex justify-center items-center'>
                          <button className='relative mt-5 px-4 py-2 rounded-md text-white font-bold bg-yellow-600
                            transition-all duration-300 hover:bg-yellow-400
                            cursor-pointer hover:text-gray-600'>CHECK OUT NOW</button>
                        </div>
                    </div>
                )
              })
            }
            </Slider>
        </div>
         

      </div>
  )
}

{/* }

{/* <div className='mt-20'> 
            <Slider {...settings}>
            {TRIPS_AND_TOURS.map((trip) =>(
              <div className='bg-white rounded-lg'>
                <div className='h-40 pt-4 rounded-t-lg flex justify-center items-center'>
                  <img src={trip.image} alt='' className='h-36 w-44 rounded-lg'/>
                </div>
                
                <div className='flex flex-col justify-center items-center gap-3 p-4'>
                  <p className='font-semibold'>{trip.title}</p>
                  <p  className='text-sm'>
                    <span className='text-gray-600'>Starting from</span> 
                    <span className='font-medium text-red-500'> {trip.amount}</span>
                  </p>
                  <button className='relative mt-5 px-4 py-2 rounded-md text-white font-bold
                   bg-yellow-600 transition-all duration-300 hover:bg-yellow-400 
                   cursor-pointer hover:text-gray-600'>
                        CHECK OUT NOW
                  </button>
                </div>
              </div>
            ) )}
            </Slider>
          </div>*/}