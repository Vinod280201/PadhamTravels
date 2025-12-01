import TRIPS_AND_TOURS from '../constants/AppConstants.jsx'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const ToursAndTrips = () => {

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Default for large screens
    slidesToScroll: 1,
    // --- Add the responsive array here ---
    responsive: [
      {
        // Settings for screens up to 640px (mobile/small devices)
        breakpoint: 640,
        settings: {
          slidesToShow: 1, // Show only 1 slide on mobile
          slidesToScroll: 1,
          dots: true,
          arrows: false, // Optionally hide arrows on mobile
        }
      },
      {
        // Settings for screens between 641px and 1024px (tablet/medium devices)
        breakpoint: 1024,
        settings: {
          slidesToShow: 2, // Show 2 slides on tablets
          slidesToScroll: 1,
        }
      },
      // You can add more breakpoints if needed
    ]
  };

  return (
        // 1. Parent container cleanup (using py-10 for vertical padding)
        <div className='h-[60%] py-10 sm:py-20 bg-[#1a63a8]'>
            
            {/* Title Block */}
            <div className='px-10 mb-15 sm:px-0'>
                <p className='text-xs text-white text-center font-medium'>T O U R S &nbsp; &nbsp;& &nbsp; &nbsp;P A C K A G E S</p>
                <p className=' text-white text-3xl text-center mt-1'>
                    Places to <span className='text-white font-bold'> Explore</span>
                </p>
            </div>

            {/* 2. CRITICAL FIX: The Slider Wrapper */}
            {/* The outer div must have overflow-hidden to clip slick's negative margins. */}
            {/* We also use px-4 for a little breathing room on the sides. */}
            <div className='mt-10 px-5 sm:px-15 md:px-20 overflow-hidden pb-12'> 
                <Slider {...settings}>
                    {/* Your map function content remains here */}
                    {
                        TRIPS_AND_TOURS.map((trip) => {
                            return (
                                <div key={`trips-packages-${trip.id}`} className='bg-white py-5 rounded-lg text-center shadow shadow-gray-600'>
                                    <div className='flex justify-center items-center'>
                                      {/* Keeping image fluid */}
                                      <img src={trip.image} className='w-[80%] h-45 rounded-lg max-w-[250px] block'/>
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