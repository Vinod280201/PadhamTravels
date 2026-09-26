import React from "react";
import Indigo from "@/assets/indigo.png";
import SpiceJet from "@/assets/spicejet.jpeg";
import AirIndia from "@/assets/airindia.jpeg";
import AirIndiaExpress from "@/assets/airIndiaExpress.jpeg";
import Vistara from "@/assets/vistara.jpeg";

export const BrandsScroller = () => {
  const brands = [
    { src: Indigo, alt: "IndiGo Airlines" },
    { src: SpiceJet, alt: "SpiceJet" },
    { src: AirIndia, alt: "Air India" },
    { src: AirIndiaExpress, alt: "Air India Express" },
    { src: Vistara, alt: "Vistara Airlines" },
  ];

  // Tripled array for seamless infinite looping
  const scrollBrands = [...brands, ...brands, ...brands, ...brands];

  return (
    <section className="w-full py-8 bg-slate-50/50 border-y border-slate-100 overflow-hidden">
      {/* Context Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6">
        <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-600 mb-1 block">
          Flight Bookings & Ticketing
        </span>
        <h2 className="text-base sm:text-lg font-semibold text-slate-800">
          Fly With Leading Domestic & International Airlines
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-lg mx-auto">
          Assisted flight reservations, group ticketing, and smooth connections for your tour packages.
        </p>
      </div>

      {/* Logo Marquee Container */}
      <div className="mx-auto w-full px-4 md:px-8">
        <div
          className="relative flex overflow-hidden py-4 group"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div className="flex w-max animate-infinite-scroll gap-8 md:gap-16 lg:gap-24 min-w-full items-center">
            {scrollBrands.map((brand, index) => (
              <img
                key={index}
                src={brand.src}
                alt={brand.alt}
                className="w-24 h-12 md:w-32 md:h-16 lg:w-40 lg:h-20 object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandsScroller;
