import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsCalendar2Week } from "react-icons/bs";

export const DatePickerComp = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div>
      <div className="flex border border-gray-400 rounded-sm py-2 mt-4">
        <BsCalendar2Week size={23} className="ml-5.5 " />
        <div className="border-r border-r-gray-400 px-2"></div>
        <div className="flex">
          <DatePicker
            showPopperArrow={false}
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
            placeholderText="Select a Date"
            fixedHeight
            closeOnScroll
            popperPlacement="top-center"
            className="ml-3.5 h-5 px-0 mt-0.5 outline-none border-none focus:outline-none focus:ring-0 text-sm w-[95%]"
          />
        </div>
        <p className="text-sm font-medium text-yellow-600 mt-0.5 ml-12 mr-2 text-end">
          Calendar
        </p>
      </div>
    </div>
  );
};

{
  /* 
        <div className='flex border border-gray-300 rounded-sm px-3 py-2 mt-4'>
            <div className='border-r border-r-gray-300 px-3'>
            <BsCalendar2Week size={23}/>
            </div>
            <input placeholder='Enter Date' className='h-5 mt-0.5 outline-none border-none focus:outline-none focus:ring-0 text-sm w-full' />
            <p className='text-sm text-gray-600 mt-0.5 mr-1 ml-2.5'>Calendar</p>
        </div>
*/
}
