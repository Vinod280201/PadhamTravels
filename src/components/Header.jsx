import LandingPageimg1 from "../assets/LandingPageimg2.jpeg"
import { HeaderNav } from "./HeaderNav"
import { FlightBookingForm } from "./FlightBookingForm"

export const Header = () => {
  return (
    <div className='w-full h-[80%] bg-cover bg-no-repeat bg-center'
      style={{ backgroundImage: `url(${LandingPageimg1})` }}>             {/*Background Image*/}

      <HeaderNav />

      <div className='grid grid-cols-2 h-[86.3%]'>
        <div className='flex p-5 ml-20 items-center'>
          <div>
            <p className='text-xl text-white'>PADHAM TRAVELS</p>
            <p className='text-5xl text-white'>We Are Very Reliable</p>
            <p className='text-5xl text-yellow-400'>Professional, Experienced</p>
            <p className='text-sm text-white mt-3'>
              <span className='text-yellow-400'>Padham Travels</span> is the versatile website emporing you
            </p>
            <p className='text-sm text-white'>
              full-service airline offering <span className='text-yellow-400'>reduce fares.</span>
            </p>
            <div className='flex'>
              <button className='relative mt-3 px-4 py-2 rounded-md text-gray-600 font-bold bg-yellow-400
              transition-all duration-300 hover:bg-white 
              cursor-pointer hover:text-yellow-600'>FIND FLIGHTS</button>
            </div>
          </div>   
        </div>

        <div className='flex ml-35 mt-10 h-[90%]'>
          <FlightBookingForm />
        </div>
      </div>
    </div>
  )
}
