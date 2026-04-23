import React, { useRef, useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

function Row({ title, subtitle, value, onChange, min = 0 }) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(value + 1);

  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="font-semibold text-sm text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <div className="flex items-center ml-5 gap-4">
        <button
          type="button"
          onClick={dec}
          className="w-6 h-6 flex items-center justify-center pb-1 rounded-full text-xl bg-gray-100 font-semibold text-yellow-600 hover:bg-gray-200"
        >
          –
        </button>
        <span className="w-4 text-center text-sm font-medium">{value}</span>
        <button
          type="button"
          onClick={inc}
          className="w-6 h-6 flex items-center justify-center pb-1 rounded-full text-xl bg-gray-100 font-semibold text-yellow-600 hover:bg-gray-200"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function TravellerCounter({
  value,
  onChange,
  className,
  direction = "down",
  relativePosition = true, // New prop to control positioning context
}) {
  const [open, setOpen] = useState(false);
  const totalPax = value.adult + value.child + value.infant;
  const pluralize = (count, singular, plural) =>
    count === 1 ? singular : plural;

  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (next) => onChange(next);

  return (
    // If relativePosition is false, we use 'static'. This allows the absolute popup
    // to position itself relative to a higher-up parent (the CustomInputRow).
    <div
      className={`w-full h-full ${relativePosition ? "relative" : "static"}`}
      ref={wrapperRef}
    >
      {/* Trigger field */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full h-10 px-0 bg-transparent text-black font-semibold text-left flex items-center justify-between outline-none ${
          className || ""
        }`}
      >
        <span className="font-bold text-gray-800 text-sm truncate">
          {totalPax} {pluralize(totalPax, "Passenger", "Passengers")}
        </span>

        {/* Arrow pushed to the far right */}
        <FaChevronDown className="text-gray-600 text-xs pointer-events-none shrink-0 ml-2" />
      </button>

      {/* Popup */}
      {open && (
        <div
          // Added 'left-0' to align with the parent row (when relativePosition is false)
          // w-[100%] or fixed width can be used. using w-72 or w-80 ensures good size.
          // 'mx-auto' helps center if we use left-0 right-0, but here we center on the row.
          className={`absolute z-50 left-0 -translate-x-3.5 w-72 md:w-80 text-black bg-white rounded-xl shadow-2xl border border-gray-300 p-4 
            ${direction === "up" ? "bottom-full mb-2" : "top-full mt-2"}
          `}
          // If we are static, 'left-1/2' refers to the CustomInputRow's width, centering the popup on the form row.
        >
          <Row
            title={pluralize(value.adult, "Adult", "Adults")}
            subtitle="12 Yrs & Above"
            value={value.adult}
            min={1}
            onChange={(v) => handleChange({ ...value, adult: v })}
          />
          <Row
            title={pluralize(value.child, "Child", "Children")}
            subtitle="2 - 12 Yrs"
            value={value.child}
            onChange={(v) => handleChange({ ...value, child: v })}
          />
          <Row
            title={pluralize(value.infant, "Infant", "Infants")}
            subtitle="Under 2 Yrs"
            value={value.infant}
            onChange={(v) => handleChange({ ...value, infant: v })}
          />

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-md font-bold text-sm transition-colors"
          >
            DONE
          </button>
        </div>
      )}
    </div>
  );
}
