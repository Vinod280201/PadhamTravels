import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import TRIPS_AND_TOURS from '../constants/AppConstants.jsx';
import { useState } from 'react';

export const ToursAndTrips = () => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(1);

    const updateItemsToShow = () => {
      if (window.innerWidth >= 1024) {
        setItemsToShow(4);
      } else if (window.innerWidth >= 768) {
        setItemsToShow(3);
      } else if (window.innerWidth >= 640) {
        setItemsToShow(2);
      } else {
        setItemsToShow(1);
      }
    };

    useState(() => {
      updateItemsToShow();
      window.addEventListener('resize', updateItemsToShow);
      return () => window.removeEventListener('resize', updateItemsToShow);
    }, []);

    const nextSlide = () => {
      setCurrentIndex((prevIndex) => 
        prevIndex >= TRIPS_AND_TOURS.length - itemsToShow ? 0 : prevIndex + 1
      );
    }
    const prevSlide = () => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? TRIPS_AND_TOURS.length - itemsToShow : prevIndex - 1
      );
    }
    const visibleItems = TRIPS_AND_TOURS.slice(currentIndex, currentIndex + itemsToShow);

  return (

    <section className='h-[45%] md:h-[60%] max-w-full mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8 bg-[#1a63a8]'>
      <div className='p-6 sm:p-10'>
        <p className='text-xs text-white text-center font-medium'>T O U R S &nbsp; &nbsp;& &nbsp; &nbsp;P A C K A G E S</p>
        <p className=' text-white text-3xl text-center mt-1'>
          Places to <span className='text-white font-bold'> Explore</span>
        </p>
      </div>
       
      <div className='relative px-1 mx-1 lg:px-5 lg:mx-2 overflow-hidden'>
        {
          TRIPS_AND_TOURS.length > itemsToShow && (
            <>
            <button onClick={prevSlide}
              className='absolute left-1 top-1/2 -translate-y-1/2 bg-gray-200 rounded-full shadow-md p-1 sm:p-2 z-10 hover:scale-105 sm:hover:scale-110 hover:bg-white' aria-label='Previous tours'>
                <FiChevronLeft className='text-gray-700 text-lg sm:text-xl'/>
            </button>
            <button onClick={nextSlide}
              className='absolute right-1 top-1/2 -translate-y-1/2 bg-gray-200 rounded-full shadow-md p-1 sm:p-2 z-10 hover:scale-105 sm:hover:scale-110 hover:bg-white' aria-label='Previous tours'>
                <FiChevronRight className='text-gray-700 text-lg sm:text-xl'/>
            </button>
            </>
          )
        }
        <div className='grid p-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 transition-transform duration-300 overflow-hidden'>
          {visibleItems.map((trip) => (
            <ToursAndTripsCard key={trip.id} trip={trip} />
          ))}
        </div>    
      </div>
    </section>
  )
}

const ToursAndTripsCard = ({trip}) => {
  return (
    <div className='bg-white rounded-lg shadow-gray-600 shadow-md overflow-hidden hover:shadow-lg 
    transition-all starting:opacity-0 starting:translate-x-20 duration-600'>
        <div className='relative pb-[70%] overflow-hidden'>
          <img 
           src={trip.image} 
           alt={trip.title} 
           className='absolute pt-2.5 px-3.5 w-full h-full object-cover hover:scale-105 sm:hover:scale-110 transition-transform duration-500'/>
           {
            trip.isPopular && (
              <span className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-3xl'>
                POPULAR
              </span>
            )
           }
        </div>
        <div className='p-3 sm:p-4'>
          <h3 className='font-semibold text-base sm:text-lg mb-1 line-clamp-1'>
            {trip.title}
          </h3>
          <div className='text-sm sm:text-base text-gray-600'>
            <span className='text-gray-600'>Starting from</span> 
            <span className='font-medium text-red-500'> {trip.amount}</span>
          </div>
          <button className='w-full mt-4 px-4 py-2 rounded-md text-white font-bold bg-yellow-600
              transition-all duration-300 hover:bg-yellow-400
              cursor-pointer hover:text-gray-600 whitespace-nowrap'>CHECK OUT NOW</button>
        </div>
    </div>
  )
    
}