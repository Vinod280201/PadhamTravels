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
