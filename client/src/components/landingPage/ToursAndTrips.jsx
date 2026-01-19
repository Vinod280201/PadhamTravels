import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import CONSTANTS from "@/constants/AppConstants";

export const ToursAndTrips = () => {
  const TRIPS_AND_TOURS = CONSTANTS.TOURS_AND_PACKAGES;

  // Embla options
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start", // Aligns slides to start for clean grid on desktop
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onInit = useCallback((emblaApi) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("reInit", onInit);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  return (
    <section className="w-full h-auto py-8 sm:py-12 bg-[#1a63a8]">
      {/* CONTAINER PADDING UPDATE:
         - Increased lg/xl padding (px-12/px-20) to make room for the arrows 
           which are now pushed further outside the slides.
      */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12 text-center">
          <p className="text-xs sm:text-sm text-gray-200 font-medium tracking-[0.2em] uppercase mb-2">
            Tours & Packages
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white font-light">
            Places to <span className="font-bold">Explore</span>
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          <div className="embla overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex m-4 md:-ml-4">
              {TRIPS_AND_TOURS.map((trip) => (
                <div
                  key={trip.id}
                  // RESPONSIVE LAYOUT UPDATE:
                  // Mobile: flex-[0_0_100%] px-8 -> Single small card
                  // Tablet (sm): flex-[0_0_50%] -> 2 cards
                  // Laptop/Desktop (lg): flex-[0_0_25%] -> Exactly 4 cards fully visible
                  className="embla__slide flex-[0_0_100%] px-8 sm:px-0 sm:pl-4 sm:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0"
                >
                  <ToursAndTripsCard trip={trip} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons (Desktop/Tablet Only) */}
          {TRIPS_AND_TOURS.length > 0 && (
            <>
              {/* Previous Button - Pushed further left (lg:-left-12) */}
              <button
                onClick={scrollPrev}
                className="hidden sm:flex absolute -left-4 lg:-left-12 xl:-left-16 top-1/2 -translate-y-1/2 
                  w-10 h-10 lg:w-12 lg:h-12 items-center justify-center rounded-full 
                  shadow-lg transition-all duration-300 z-10
                  bg-white text-gray-800 hover:bg-yellow-500 hover:text-white cursor-pointer"
                aria-label="Previous slide"
              >
                <FiChevronLeft size={24} />
              </button>

              {/* Next Button - Pushed further right (lg:-right-12) */}
              <button
                onClick={scrollNext}
                className="hidden sm:flex absolute -right-4 lg:-right-12 xl:-right-16 top-1/2 -translate-y-1/2 
                  w-10 h-10 lg:w-12 lg:h-12 items-center justify-center rounded-full 
                  shadow-lg transition-all duration-300 z-10
                  bg-white text-gray-800 hover:bg-yellow-500 hover:text-white cursor-pointer"
                aria-label="Next slide"
              >
                <FiChevronRight size={24} />
              </button>
            </>
          )}

          {/* Pagination Dots (Mobile Only) */}
          <div className="flex sm:hidden justify-center mt-6 gap-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === selectedIndex
                    ? "w-8 h-2 bg-white"
                    : "w-2 h-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ToursAndTripsCard = ({ trip }) => {
  return (
    // CARD: Padded white border (p-3) + Rounded Corners
    <div className="group/card h-full flex flex-col bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-3 p-3">
      {/* IMAGE: Rounded to fit inside the white border */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl">
        <img
          src={trip.image}
          alt={trip.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
        />

        {/* Popular Badge */}
        {trip.isPopular && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
            POPULAR
          </span>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col grow pt-4 px-1">
        <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-2 line-clamp-1 group-hover/card:text-[#1a63a8] transition-colors">
          {trip.title}
        </h3>

        {/* Price Section */}
        <div className="mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-xs sm:text-sm text-gray-500 font-medium">
              Starting from
            </span>
            <span className="text-lg sm:text-xl font-bold text-red-600">
              {trip.amount}
            </span>
          </div>

          <button className="w-full py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-bold text-white bg-yellow-500 hover:bg-[#1a63a8] transition-colors duration-300 shadow-sm active:scale-95">
            CHECK OUT NOW
          </button>
        </div>
      </div>
    </div>
  );
};
