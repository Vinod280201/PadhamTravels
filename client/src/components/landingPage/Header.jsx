import LandingPageimg1 from "@/assets/LandingPageimg3.jpeg";
import { HeaderNav } from "./HeaderNav";
import { FlightBookingForm } from "./FlightBookingForm";

export const Header = () => {
  return (
    <div
      className="max-w-full h-[60%] md:h-[80%] bg-cover bg-no-repeat bg-center"
      style={{ backgroundImage: `url(${LandingPageimg1})` }}
    >
      {" "}
      {/*Background Image*/}
      {/* show only on md+ when nav is part of header */}
      <div className="hidden lg:block">
        <HeaderNav />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 h-[86.3%]">
        <div className="hidden md:flex p-5 mt-50 lg:mt-2 lg:ml-20 items-center flex-nowrap">
          <div>
            <p className="md:text-md xl:text-xl text-white whitespace-nowrap">
              PADHAM TRAVELS
            </p>
            <p className="md:text-3xl xl:text-5xl text-white whitespace-nowrap">
              We Are Very Reliable
            </p>
            <p className="md:text-3xl xl:text-5xl text-yellow-400 whitespace-nowrap">
              Professional, Experienced
            </p>
            <p className="md:text-xs xl:text-sm text-white mt-3">
              <span className="text-yellow-400">Padham Travels</span> is the
              versatile website emporing you
            </p>
            <p className="md:text-xs lg:text-sm text-white">
              full-service airline offering{" "}
              <span className="text-yellow-400">reduce fares.</span>
            </p>
            <div className="flex">
              <button
                className="relative mt-3 px-4 py-2 rounded-md text-gray-600 font-bold bg-yellow-400
              transition-all duration-300 hover:bg-white 
              cursor-pointer hover:text-yellow-600"
              >
                FIND FLIGHTS
              </button>
            </div>
          </div>
        </div>

        <div className="flex px-3 xl:ml-35 max-md:justify-center mt-15 md:mt-10 mb-5 h-[90%]">
          <FlightBookingForm />
        </div>
      </div>
    </div>
  );
};
