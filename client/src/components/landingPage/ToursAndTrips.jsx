import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import CONSTANTS from "@/constants/AppConstants";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MessageCircle, ArrowRight } from "lucide-react";

export const ToursAndTrips = () => {
  const TRIPS_AND_TOURS = CONSTANTS.TOURS_AND_PACKAGES;
  const navigate = useNavigate();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback((emblaApi) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="w-full py-12 sm:py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER ROW */}
        <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs sm:text-sm font-bold tracking-widest text-cyan-600 uppercase mb-2 block">
              TOP DESTINATIONS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900">
              Where Will You <span className="text-cyan-600">Go Next?</span>
            </h2>
          </div>

          <button
            onClick={() => navigate("/tours-and-packages")}
            className="px-5 py-2.5 border-2 border-cyan-600 text-cyan-700 hover:bg-cyan-600 hover:text-white font-bold rounded-xl transition-all text-xs tracking-wider uppercase flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <span>VIEW ALL PACKAGES</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* CAROUSEL GRID */}
        <div className="relative group/carousel">
          <div className="embla overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex -ml-4">
              {TRIPS_AND_TOURS.map((trip) => (
                <div
                  key={trip.id}
                  className="embla__slide flex-[0_0_100%] pl-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%] min-w-0"
                >
                  <ToursAndTripsCard trip={trip} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {TRIPS_AND_TOURS.length > 0 && (
            <>
              <button
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className="hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full shadow-md transition-all z-10 bg-white border border-slate-200 text-slate-700 hover:bg-cyan-600 hover:text-white hover:border-cyan-600 disabled:opacity-30 cursor-pointer"
                aria-label="Previous slide"
              >
                <FiChevronLeft size={20} />
              </button>

              <button
                onClick={scrollNext}
                disabled={!canScrollNext}
                className="hidden sm:flex absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full shadow-md transition-all z-10 bg-white border border-slate-200 text-slate-700 hover:bg-cyan-600 hover:text-white hover:border-cyan-600 disabled:opacity-30 cursor-pointer"
                aria-label="Next slide"
              >
                <FiChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

const ToursAndTripsCard = ({ trip }) => {
  const navigate = useNavigate();
  const whatsappPhone = import.meta.env.VITE_WHATSAPP_NUMBER || "919944229209";

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const msg = encodeURIComponent(
      `Hi Padham Travels, I am interested in booking the ${trip.title} package.`
    );
    window.open(`https://wa.me/${whatsappPhone}?text=${msg}`, "_blank");
  };

  return (
    <div className="group/card h-full flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden p-3.5">
      {/* Image Banner */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-slate-100">
        <img
          src={trip.image}
          alt={trip.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
        />

        {/* Category Pill Tag */}
        <span className="absolute top-3 left-3 bg-cyan-50/95 backdrop-blur-md text-cyan-800 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs border border-cyan-200">
          {trip.isPopular ? "FEATURED" : "DESTINATION"}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col grow pt-3 px-1">
        <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-1 line-clamp-1 group-hover/card:text-cyan-600 transition-colors">
          {trip.title}
        </h3>

        <p className="text-xs text-slate-500 mb-3 line-clamp-1">
          Customized Tour & Sightseeing Package
        </p>

        {/* Price & Action Section */}
        <div className="mt-auto pt-3 border-t border-slate-100 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-500 font-medium">Starting from</span>
            <span className="text-base sm:text-lg font-bold text-slate-900">
              {trip.amount}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleWhatsApp}
              className="w-full py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <MessageCircle size={14} className="fill-current" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => navigate("/tours-and-packages")}
              className="w-full py-2 rounded-xl text-xs font-bold text-slate-800 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 transition-colors cursor-pointer"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
