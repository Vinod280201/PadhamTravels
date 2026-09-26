import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock } from "lucide-react";
import { formatPrice, getTourImageUrl } from "@/lib/utils";

export const TourCard = ({ tour, idx = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const whatsappPhone = import.meta.env.VITE_WHATSAPP_NUMBER || "919944229209";
  const imageUrl = getTourImageUrl(tour);

  return (
    <Card
      onClick={() => navigate(`/tours/${tour.id || tour._id}`, { state: { tour } })}
      className="overflow-hidden p-0 bg-white border-slate-100 rounded-2xl shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full group cursor-pointer"
    >
      {/* Package Banner Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-2xl bg-slate-100 shrink-0">
        {/* Placeholder Skeleton pulse while downloading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center z-10">
            <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-cyan-500 animate-spin" />
          </div>
        )}

        <img
          src={imageUrl}
          alt={tour.title || tour.name}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          } group-hover:scale-105 transition-transform`}
          loading="lazy"
          onError={(e) => {
            setImageLoaded(true);
            e.currentTarget.src = "https://via.placeholder.com/800x500?text=Tour+Package";
          }}
        />

        {/* Overlaid Category Pill Tag */}
        <span className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-md text-cyan-800 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs border border-slate-100">
          {tour.destination || "PACKAGE"}
        </span>
      </div>

      <CardContent className="p-5 flex flex-col grow">
        {/* Rating & Reviews */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-bold text-slate-900 text-sm">
              {tour.rating || 4.8}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            ({Number(tour.reviews || 124).toLocaleString()} reviews)
          </span>
        </div>

        {/* Tour Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-cyan-600 transition-colors">
          {tour.name || tour.title}
        </h3>

        {/* Destination & Duration */}
        <div className="space-y-1.5 mb-4 text-slate-600 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
            <span className="truncate">{tour.destination}</span>
          </div>
          {tour.duration && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
              <span>{tour.duration}</span>
            </div>
          )}
        </div>

        {/* Highlights Badges */}
        <div className="mb-4 grow">
          <div className="flex items-center gap-1.5 overflow-hidden flex-wrap">
            {(tour.highlights || [])
              .slice(0, 3)
              .map((highlight, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-cyan-50 text-cyan-700 border-cyan-200 text-[11px] font-medium"
                >
                  {highlight}
                </Badge>
              ))}
          </div>
        </div>

        {/* Price & Action Section */}
        <div className="flex flex-col pt-3 border-t border-slate-100 mt-auto space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-400">Starting from</p>
              <p className="text-xl font-extrabold text-slate-900">
                {formatPrice(tour.price, tour.currency)}
                <span className="text-xs text-slate-400 font-normal ml-1 capitalize">
                  /{tour.pricingUnit || "person"}
                </span>
              </p>
            </div>

            {tour.itinerary && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const pdfUrl = tour.itinerary.startsWith("http")
                    ? tour.itinerary
                    : `${getTourImageUrl({ image: tour.itinerary })}`;
                  window.open(pdfUrl, "_blank");
                }}
                className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 transition-colors border border-slate-200 cursor-pointer"
              >
                View PDF
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TourCard;
