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
          className="w-6 h-6 flex items-center justify-center pb-1 rounded-full text-xl bg-gray-100 font-semibold text-yellow-600  hover:bg-gray-200"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function PassengerSelector({ value, onChange }) {
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
    <div className="relative" ref={wrapperRef}>
      {/* Trigger field */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full h-10.5 border rounded px-3 py-2 bg-white text-black border-slate-500 font-semibold text-left relative flex items-center justify-between"
      >
        <span className="font-semibold text-gray-900">
          {totalPax} {pluralize(totalPax, "Passenger", "Passengers")}
        </span>

        {/* icon fixed at end */}
        <FaChevronDown className="text-gray-600 text-xs pointer-events-none" />
      </button>

      {/* Popup */}
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-90 text-black bg-white rounded-xl shadow-xl border whitespace-nowrap p-4">
          <Row
            title={pluralize(value.adult, "Adult", "Adults")}
            subtitle="12 Yrs & Above on the Day of Travel"
            value={value.adult}
            min={1}
            onChange={(v) => handleChange({ ...value, adult: v })}
          />
          <Row
            title={pluralize(value.child, "Child", "Children")}
            subtitle="2 - 12 Yrs on the Day of Travel"
            value={value.child}
            onChange={(v) => handleChange({ ...value, child: v })}
          />
          <Row
            title={pluralize(value.infant, "Infant", "Infants")}
            subtitle="Under 2 Yrs on the Day of Travel"
            value={value.infant}
            onChange={(v) => handleChange({ ...value, infant: v })}
          />

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full mt-4 bg-yellow-500 text-black py-2 rounded-md font-semibold"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
