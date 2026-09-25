import { useState, useEffect, useMemo, useCallback } from "react";
import { MapPin, Clock, Star, Search, FileText, MessageCircle, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MainNavbar from "@/components/layout/MainNavbar";
import { apiGet } from "@/apiClient";
import { formatPrice, getTourImageUrl } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// Local Banner Image Fallbacks from TripsAndPackages/
import AndamanImg from "@/assets/TripsAndPackages/AndamanAndNicobar.jpeg";
import CharDhamImg from "@/assets/TripsAndPackages/CharDhamYatra.jpeg";
import DubaiImg from "@/assets/TripsAndPackages/Dubai.jpeg";
import KeralaImg from "@/assets/TripsAndPackages/Kerala.jpg";
import SikkimImg from "@/assets/TripsAndPackages/SikkimAndDarjeeling.jpg";
import SingaporeImg from "@/assets/TripsAndPackages/Singapore.jpeg";
import ThailandImg from "@/assets/TripsAndPackages/Thailand.jpeg";
import KashmirImg from "@/assets/kashmir.jpg";
import GoaImg from "@/assets/goa.jpg";
import ManaliImg from "@/assets/manali.jpg";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Helper array of fallback images for tours missing upload images
const fallbackImages = [
  KeralaImg,
  DubaiImg,
  ThailandImg,
  AndamanImg,
  SikkimImg,
  SingaporeImg,
  CharDhamImg,
  KashmirImg,
  GoaImg,
  ManaliImg,
];

const getTourImage = (tour) => {
  return getTourImageUrl(tour);
};

export const ToursDisplay = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const whatsappPhone = import.meta.env.VITE_WHATSAPP_NUMBER || "919944229209";

  const fetchTours = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) {
        setLoading(true);
      }
      setError(null);
      const res = await apiGet("/tours");
      const data = await res.json();
      setTours(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("LOAD TOURS ERROR", err);
      if (!isBackground) {
        setError(err.message || "Could not load tours.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTours(false);
  }, [fetchTours]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchTours(true);
    }, 30000);
    return () => clearInterval(intervalId);
  }, [fetchTours]);

  const filteredTours = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return tours;
    return tours.filter((tour) => {
      const name = (tour.name || "").toLowerCase();
      const destination = (tour.destination || "").toLowerCase();
      const highlights = (tour.highlights || []).map((h) => (h || "").toLowerCase());
      return (
        name.includes(term) ||
        destination.includes(term) ||
        highlights.some((h) => h.includes(term))
      );
    });
  }, [searchTerm, tours]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Top Navbar */}
      <MainNavbar />

      {/* Wanderlust Header Section */}
      <div className="bg-white border-b border-slate-100 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-600">
                CURATED TOUR CATALOGUE
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-slate-900">
                Explore Our Tour Packages
              </h1>
              <p className="text-slate-500 text-base sm:text-lg max-w-xl">
                Handcrafted itineraries for international holidays, domestic getaways, and spiritual yatras.
              </p>
            </div>

            {/* Floating Search Container */}
            <div className="md:col-span-5 w-full">
              <div className="relative flex items-center shadow-xs rounded-xl bg-white border border-slate-200">
                <Search className="w-5 h-5 text-cyan-600 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-medium"
                  placeholder="Search packages by destination or highlight..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <p className="mt-2 text-xs font-semibold text-slate-500 text-right">
                {loading
                  ? "Loading packages..."
                  : `Showing ${filteredTours.length} of ${tours.length} available packages`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tours Grid Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {loading ? (
          <div className="py-20 text-center text-slate-500 text-lg font-medium">
            Loading tour packages...
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-100 p-8 shadow-xs">
            <p className="text-slate-600 text-lg font-semibold mb-2">
              No tour packages found matching "{searchTerm}"
            </p>
            <p className="text-slate-400 text-sm">
              Try searching with another keyword or explore our full package listing.
            </p>
            <Button
              onClick={() => setSearchTerm("")}
              className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs"
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour, idx) => {
              const tourImgSrc = getTourImage(tour, idx);

              return (
                <Card
                  key={tour.id || tour._id}
                  className="overflow-hidden p-0 bg-white border-slate-100 rounded-2xl shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full group"
                >
                  {/* Package Banner Image */}
                  <div className="relative h-56 w-full overflow-hidden shrink-0 bg-slate-100">
                    <img
                      src={getTourImageUrl(tour)}
                      alt={tour.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/800x500?text=Tour+Package";
                      }}
                    />

                    {/* Overlaid Category Pill Tag */}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-cyan-800 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs border border-slate-100">
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
                      {tour.name}
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
                              window.open(
                                tour.itinerary.startsWith("http")
                                  ? tour.itinerary
                                  : `${API_BASE}${tour.itinerary}`,
                                "_blank"
                              );
                            }}
                            className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 transition-colors border border-slate-200 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-500" />
                            <span>Itinerary</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          className="w-full py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            const msg = encodeURIComponent(
                              `Hi Padham Travels, I am interested in booking the ${tour.name} package.`
                            );
                            window.open(`https://wa.me/${whatsappPhone}?text=${msg}`, "_blank");
                          }}
                        >
                          <MessageCircle size={14} className="fill-current" />
                          <span>WhatsApp</span>
                        </button>

                        <button
                          className="w-full py-2.5 rounded-xl font-bold text-white bg-cyan-600 hover:bg-cyan-700 transition-colors shadow-xs text-xs cursor-pointer"
                          onClick={() =>
                            navigate(`/tours/${tour.id || tour._id}`, {
                              state: { tour },
                            })
                          }
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default ToursDisplay;
