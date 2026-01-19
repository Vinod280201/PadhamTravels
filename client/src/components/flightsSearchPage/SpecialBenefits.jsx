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
    <div className="mt-4">
      <p className="text-sm font-semibold text-slate-700 mb-3">
        Special Fares (Optional):
      </p>

      {/* UPDATED LAYOUT:
         - grid-cols-2: Keeps it 2 columns on small/medium devices (same as before).
         - lg:grid-cols-4: Forces 4 columns (single horizontal line) on large screens.
      */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {benefits.map((b) => {
          const isSelected = selected.includes(b.id);

          return (
            <label
              key={b.id}
              className={`
                flex items-center gap-3 p-2 rounded-md cursor-pointer select-none transition-all border relative
                ${
                  isSelected
                    ? "bg-yellow-50 border-yellow-400 shadow-sm"
                    : "bg-transparent border-transparent hover:bg-gray-50"
                }
              `}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggle(b.id)}
                className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-500 accent-yellow-500 cursor-pointer"
              />

              {/* Icon & Text */}
              <div className="flex items-center gap-3">
                <img
                  src={b.icon}
                  alt={b.label}
                  className="w-8 h-8 object-contain"
                />
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
          );
        })}
      </div>
    </div>
  );
};
