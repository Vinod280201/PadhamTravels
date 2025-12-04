import { useState } from "react";
import { MdFlightClass } from "react-icons/md";

export const ClassSelector = () => {
  const [selectedClass, setSelectedClass] = useState("");

  const options = [
    { value: "", label: "Select Class" },
    { value: "Economy", label: "Economy" },
    { value: "Premium Economy", label: "Premium Economy" },
    { value: "Business", label: "Business" },
    { value: "First Class", label: "First Class" },
  ];

  return (
    <div className="flex border border-gray-400 rounded-sm px-2 py-2 mt-4 items-center">
      <div className="border-r border-r-gray-400 px-3">
        <MdFlightClass size={25} />
      </div>
      <select
        className="ml-2 p-0 pl-1 h-5 outline-none border-none text-sm bg-transparent w-full rounded-md focus-within:ring-0 focus-within:outline-none"
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <p className="text-sm font-medium text-yellow-600  mr-1 ml-2.5">Class</p>
    </div>
  );
};

{
  /*import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";

export const SelectDropDown = params => {
    const [isDropDownVisible, setIsDropDownVisible] = useState(false);

    const dropdownContent = (
        <div className="absolute z-10 w-full bg-neutral-300 rounded shadow-xl">
            {params.options.map(option => (
                <div className="px-3 py-2 cursor-pointer hover:bg-neutral-500 text-neutral-900">
                    {option}
                </div>
            ))}
        </div>
    )

  return (
    <div className='w-full h-full flex justify-center pt-4'>
        <div className="relative">
            <div onClick={() => setIsDropDownVisible(true)}
               className='border border-neutral-100 px-3 py-2 rounded-md h-8 w-60 flex 
               items-center text-neutral-900 shadow-xl justify-between'>
                SelectDropDown
                <FaCaretDown />
            </div>
            {isDropDownVisible && dropdownContent}
        </div>
    </div>
  )
}

{/*
    <div className='flex items-center border border-gray-300 rounded-sm px-3 py-2 mt-4 relative'>
      
 
      <div className='border-r border-r-gray-300 pr-3 mr-3'> {/* Reduced padding right and added margin right 
        <MdFlightClass size={25} /> 
      </div>
      
      
      <input 
        placeholder='Select Class' 
        className='h-5 outline-none border-none focus:outline-none focus:ring-0 text-sm w-[50%] flex-grow' // Use flex-grow for better sizing
        value={selectedClass} 
        readOnly 
      />
      
  
      <p className='text-sm text-gray-600 ml-2.5 mr-2 whitespace-nowrap'>Class</p> {/* Added whitespace-nowrap 
      
  
      <div 
        className='cursor-pointer text-gray-700 flex items-center justify-center p-1 rounded-sm'
        onClick={handleArrowClick}
      >
        <IoIosArrowDown size={20} />
      </div>

     
      <select 
        ref={selectRef} // Attach the ref to the select element
        className="
          absolute inset-0 w-full h-full opacity-0 cursor-pointer 
          // The following classes are effectively hidden by opacity:0 but kept for potential debugging/fallback
          // block appearance-none bg-white border border-gray-400 
          // hover:border-gray-500 px-4 pr-8 rounded shadow leading-tight 
          // focus:outline-none focus:shadow-outline
        "
        value={selectedClass} 
        onChange={handleSelectChange} 
      >
        <option>Economy Class</option>
        <option>Business Class</option>
        <option>First Class</option>
      </select>
    </div> 
*/
}
