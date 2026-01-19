import { InputText } from "./InputText";
import { GiAirplaneDeparture, GiAirplaneArrival } from "react-icons/gi";
import { DatePickerComp } from "./DatePickerComp";
import TravellerCounter from "./TravellerCounter";
import { ClassSelector } from "./ClassSelector";

export const FlightBookingForm = () => {
  return (
    <div className="bg-white w-auto md:mr-15 xl:w-[22%] pb-1 rounded-4xl absolute md:-bottom-17 shadow shadow-gray-600 mx-4 overflow-x-hidden">
      <div className="flex justify-center mt-2 py-1">
        <p className="font-bold md:font-semibold text-2xl">Search Flight</p>
      </div>

      <div className="flex bg-black text-white justify-center mt-2 py-4 md:py-3">
        <div className="flex items-center">
          <input
            type="radio"
            id="oneway"
            name="triptype"
            value="1"
            className="form-radio h-3 w-3 border-2 border-gray-300 checked:border-yellow-400 checked:bg-yellow-400 focus:outline-none focus:ring-0 text-yellow-400"
          />
          <label htmlFor="oneway" className="text-sm ml-2">
            One Way
          </label>
        </div>
        <div className="flex items-center ml-5">
          <input
            type="radio"
            id="roundtrip"
            name="triptype"
            value="2"
            className="form-radio h-3 w-3 border-2 border-gray-300 checked:border-yellow-400 checked:bg-yellow-400 focus:outline-none focus:ring-0 text-yellow-400"
          />
          <label htmlFor="roundtrip" className="text-sm ml-1">
            Round Trip
          </label>
        </div>
      </div>

      <div className="p-5">
        <InputText
          image={<GiAirplaneDeparture size={25} />}
          placeholder={"Enter City/Airport"}
          label="Departure"
        />
        <InputText
          image={<GiAirplaneArrival size={25} />}
          placeholder={"Enter City/Airport"}
          label="Arrival"
          extrastyle={"mt-4"}
        />

        <DatePickerComp />

        <TravellerCounter />

        <ClassSelector />

        <div className="flex justify-center items-center">
          <button
            className="relative mt-6 px-4 py-2 rounded-md text-white font-bold bg-yellow-600
              transition-all duration-300 hover:bg-yellow-400
              cursor-pointer hover:text-gray-600"
          >
            SEARCH FLIGHTS
          </button>
        </div>
      </div>
    </div>
  );
};
