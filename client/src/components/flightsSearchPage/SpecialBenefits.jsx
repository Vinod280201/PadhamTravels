import React from "react";
import student from "@/assets/FlightsSearchPage/Student.png";
import senior from "@/assets/FlightsSearchPage/SeniorCitizen.png";
import armed from "@/assets/FlightsSearchPage/ArmedForce.png";
import medical from "@/assets/FlightsSearchPage/Doctor.png";

const benefits = [
  { id: "student", label: "Student", sub: "Extra Baggage", icon: student },
  {
    id: "senior",
    label: "Senior Citizen",
    sub: "Exclusive Discounts",
    icon: senior,
  },
  {
    id: "armed",
    label: "Armed Forces",
    sub: "Exclusive Discounts",
    icon: armed,
  },
  {
    id: "medical",
    label: "Doctors & Nurses",
    sub: "Exclusive Discounts",
    icon: medical,
  },
];

export const SpecialBenefits = ({ selected, setSelected }) => {
  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex gap-8 mt-4">
      {benefits.map((b) => (
        <label
          key={b.id}
          className="flex items-center gap-1 text-left cursor-pointer select-none"
          onClick={() => toggle(b.id)}
        >
          <input
            type="checkbox"
            checked={selected.includes(b.id)}
            onChange={() => toggle(b.id)}
            className="w-4 h-4 ml-6"
          />

          <div className="flex items-center gap-1.5">
            <img src={b.icon} alt={b.label} className="w-7 h-7" />
            <div className="leading-tight">
              <div className="font-semibold text-sm text-gray-800 whitespace-nowrap">
                {b.label}
              </div>
              <div className="text-xs text-gray-500 whitespace-nowrap">
                {b.sub}
              </div>
            </div>
          </div>
        </label>
      ))}
    </div>
  );
};
