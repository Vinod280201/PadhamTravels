import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import ReviewCard from "./ReviewCards";

const reviews = [
  {
    id: 1,
    name: "Sarah Mitchell",
    location: "New York, USA",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    review:
      "Absolutely incredible experience! The tour was perfectly organized, and our guide knew every hidden gem in Bali. The sunset dinner was unforgettable. Will definitely book again!",
    serviceType: "tour",
    date: "2024-01-15",
  },
  {
    id: 2,
    name: "James Chen",
    location: "Toronto, Canada",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    review:
      "The complete travel package exceeded all expectations. From airport pickup to the luxury resort, everything was seamless. The team handled every detail perfectly.",
    serviceType: "package",
    date: "2024-01-10",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    location: "London, UK",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 4,
    review:
      "Best flight booking experience ever! Found amazing deals to Tokyo with excellent seats. The customer service team was incredibly helpful when I needed to reschedule.",
    serviceType: "flight",
    date: "2024-01-08",
  },
  {
    id: 4,
    name: "Marcus Johnson",
    location: "Sydney, Australia",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    review:
      "The hiking tour through the Swiss Alps was breathtaking. Small group, knowledgeable guide, and stunning views at every turn. Already planning my next adventure!",
    serviceType: "tour",
    date: "2024-01-05",
  },
  {
    id: 5,
    name: "Aisha Patel",
    location: "Dubai, UAE",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    review:
      "Our honeymoon package to Maldives was pure magic. The overwater villa, private dinners, and spa treatments were all arranged flawlessly. Truly a dream come true!",
    serviceType: "package",
    date: "2024-01-02",
  },
  {
    id: 6,
    name: "David Kim",
    location: "Seoul, South Korea",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    review:
      "The flight booking process was incredibly smooth. Found great business class deals to Paris and the seat selection was perfect. Customer support was available 24/7!",
    serviceType: "flight",
    date: "2023-12-28",
  },
  {
    id: 7,
    name: "Isabella Costa",
    location: "Rio de Janeiro, Brazil",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    review:
      "Our family tour to Japan was absolutely magical! The itinerary was perfectly balanced between cultural experiences and fun activities for the kids. Highly recommend!",
    serviceType: "tour",
    date: "2023-12-20",
  },
];

const ReviewsCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 640px)": { slidesPerView: 2 },
      "(min-width: 768px)": { slidesPerView: 3 },
      "(min-width: 1024px)": { slidesPerView: 3 } /* Only 3 */,
    },
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
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

  // Auto-play
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="py-6 md:py-8 bg-background">
      <div className="container mx-auto px-10">
        {/* Section Header */}
        <div className="text-center mb-5 md:mb-8">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Real stories from adventurers who trusted us with their journeys
          </p>
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-md font-medium mt-4">
            Reviews
          </span>
        </div>

        {/* Carousel */}
        <div className="relative px-4 md:px-8">
          <div className="embla reviews overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex h-full">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="embla__slide flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] p-2 md:p-4"
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 hidden md:flex bg-card border-border hover:bg-primary hover:text-primary-foreground shadow-card"
            disabled={!canScrollPrev}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 hidden md:flex bg-card border-border hover:bg-primary hover:text-primary-foreground shadow-card"
            disabled={!canScrollNext}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, index) => {
            const isActive = index === selectedIndex;
            return (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                  isActive
                    ? "bg-primary border-primary scale-125"
                    : "border-muted-foreground hover:bg-primary/20"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ReviewsCarousel;
