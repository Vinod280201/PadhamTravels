import React from "react";
import Indigo from "@/assets/indigo.png";
import SpiceJet from "@/assets/spicejet.jpeg";
import AirIndia from "@/assets/airindia.jpeg";
import AirIndiaExpress from "@/assets/airIndiaExpress.jpeg";
import Vistara from "@/assets/vistara.jpeg";

export const BrandsScroller = () => {
  const images = [Indigo, SpiceJet, AirIndia, AirIndiaExpress, Vistara];

  // Tripled array for seamless looping
  const scrollImages = [...images, ...images, ...images, ...images];

  return (
    <div className="w-full mt-6 md:mt-8 lg:mt-10 border-t border-gray-300 border-b bg-white overflow-hidden">
      <div className="mx-auto w-full px-4 md:px-8">
        <div
          className="relative flex overflow-hidden py-6 md:py-8 group"
          // Keep the edge fading if you like it, remove this style block if you don't.
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div className="flex w-max animate-infinite-scroll gap-8 md:gap-16 lg:gap-24 min-w-full">
            {scrollImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Brand Logo ${index}`}
                // REMOVED: grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300
                className="w-24 h-12 md:w-32 md:h-16 lg:w-40 lg:h-20 object-contain"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
