import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import CONSTANTS from "@/constants/AppConstants";

export const ToursAndTrips = () => {
  const TRIPS_AND_TOURS = CONSTANTS.TOURS_AND_PACKAGES;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 640px)": { slidesPerView: 2 },
      "(min-width: 768px)": { slidesPerView: 3 },
      "(min-width: 1024px)": { slidesPerView: 4 },
    },
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="h-[40%] md:h-[55%] max-w-full mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8 bg-[#1a63a8]">
      <div className="p-6 sm:p-10">
        <p className="text-xs text-white text-center font-medium">
          T O U R S &nbsp; &nbsp;& &nbsp; &nbsp;P A C K A G E S
        </p>
        <p className="text-white text-3xl text-center mt-1">
          Places to <span className="text-white font-bold"> Explore</span>
        </p>
      </div>

      <div className="relative px-1 mx-1 lg:px-5 lg:mx-5">
        <div className="embla tours overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex h-full">
            {TRIPS_AND_TOURS.map((trip) => (
              <div
                key={trip.id}
                className="embla__slide flex-[0_0_100%] p-[--slide-spacing]"
              >
                <ToursAndTripsCard trip={trip} />
              </div>
            ))}
          </div>
        </div>

        {TRIPS_AND_TOURS.length > 4 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute -left-4 top-1/2 -translate-y-1/2 bg-gray-200 rounded-full shadow-md p-1 sm:p-2 z-10 hover:scale-105 sm:hover:scale-110 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!canScrollPrev}
              aria-label="Previous tours"
            >
              <FiChevronLeft className="text-gray-700 text-lg sm:text-xl" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute -right-4 top-1/2 -translate-y-1/2 bg-gray-200 rounded-full shadow-md p-1 sm:p-2 z-10 hover:scale-105 sm:hover:scale-110 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!canScrollNext}
              aria-label="Next tours"
            >
              <FiChevronRight className="text-gray-700 text-lg sm:text-xl" />
            </button>
          </>
        )}
      </div>
    </section>
  );
};

const ToursAndTripsCard = ({ trip }) => {
  return (
    <div className="w-full h-full bg-white rounded-lg shadow-gray-600 shadow-md overflow-hidden hover:shadow-lg transition-all starting:opacity-0 starting:translate-x-20 duration-600">
      <div className="relative pb-[70%] overflow-hidden">
        <img
          src={trip.image}
          alt={trip.title}
          className="absolute pt-2.5 px-3.5 w-full h-full object-cover hover:scale-105 sm:hover:scale-110 transition-transform duration-500"
        />
        {trip.isPopular && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-3xl">
            POPULAR
          </span>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-1">
          {trip.title}
        </h3>
        <div className="text-sm sm:text-base text-gray-600">
          <span className="text-gray-600">Starting from</span>
          <span className="font-medium text-red-500"> {trip.amount}</span>
        </div>
        <button className="w-full mt-4 px-4 py-2 rounded-md text-white font-bold bg-yellow-600 transition-all duration-300 hover:bg-yellow-400 cursor-pointer hover:text-gray-600 whitespace-nowrap">
          CHECK OUT NOW
        </button>
      </div>
    </div>
  );
};
