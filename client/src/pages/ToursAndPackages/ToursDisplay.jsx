import { useState, useEffect, useMemo, useCallback } from "react";
import { MapPin, Clock, Star, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MainNavbar from "@/components/layout/MainNavbar";
import { apiGet } from "@/apiClient";

export const ToursDisplay = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // shared fetch function
  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await apiGet("/tours");

      const data = await res.json();
      setTours(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("LOAD TOURS ERROR", err);
      setError(err.message || "Could not load tours.");
    } finally {
      setLoading(false);
    }
  }, []);

  // initial load
  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  // “Live” refresh when tab becomes active (e.g. after admin edits)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchTours();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchTours]);

  // filter list
  const filteredTours = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return tours;
    return tours.filter((tour) => {
      const name = (tour.name || "").toLowerCase();
      const destination = (tour.destination || "").toLowerCase();
      const highlights = (tour.highlights || []).map((h) =>
        (h || "").toLowerCase()
      );
      return (
        name.includes(term) ||
        destination.includes(term) ||
        highlights.some((h) => h.includes(term))
      );
    });
  }, [searchTerm, tours]);

  return (
    <div className="min-h-screen bg-slate-100">
      <MainNavbar />

      {/* Hero Section */}
      <div className="bg-linear-to-r from-slate-800 to-slate-700 text-white py-8 px-4 mt-3">
        <div className="max-w-7xl mx-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-2">
                Explore Our Tour Packages
              </h1>
              <p className="text-xl text-slate-200">
                Discover amazing destinations and create unforgettable memories
              </p>
            </div>

            {/* search bar */}
            <div className="w-full ml-30">
              <p className="text-sm uppercase tracking-wide text-slate-200 mb-2">
                Search tours &amp; packages
              </p>
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-500 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-white/20 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                  placeholder="Search tours by name, destination, or highlight..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm text-slate-200">
                {loading
                  ? "Loading packages..."
                  : `Showing ${filteredTours.length} of ${tours.length} packages`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {loading ? (
          <p className="text-slate-600 text-lg">Loading tours...</p>
        ) : filteredTours.length === 0 ? (
          <p className="text-slate-600 text-lg">
            No tours match “{searchTerm}”. Try a different keyword.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour) => (
              <Card
                key={tour.id || tour._id}
                className="border-slate-300 overflow-hidden py-3 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                data-testid={`tour-display-card-${tour.id || tour._id}`}
              >
                {/* Tour Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/800x400?text=Image+Unavailable";
                    }}
                  />
                  {tour.available === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge className="bg-red-500 text-white text-lg px-4 py-2">
                        Sold Out
                      </Badge>
                    </div>
                  )}
                  {tour.available > 0 && tour.available < 5 && (
                    <Badge className="absolute top-4 right-4 bg-orange-500 text-white">
                      Only {tour.available} left!
                    </Badge>
                  )}
                </div>

                <CardContent className="px-4 mb-3">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-slate-900">
                        {tour.rating}
                      </span>
                    </div>
                    <span className="text-sm text-slate-500">
                      ({Number(tour.reviews || 0).toLocaleString()} reviews)
                    </span>
                  </div>

                  {/* Tour Name */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {tour.name}
                  </h3>

                  {/* Tour Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{tour.destination}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{tour.duration}</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-700 mb-2">
                      Highlights:
                    </p>
                    <div className="flex items-center gap-2 overflow-hidden">
                      {(tour.highlights || [])
                        .slice(0, 3)
                        .map((highlight, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="bg-sky-50 text-sky-700 border-sky-200 text-xs whitespace-nowrap"
                          >
                            {highlight}
                          </Badge>
                        ))}
                      {tour.highlights && tour.highlights.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs whitespace-nowrap px-2 py-0.5"
                        >
                          +{tour.highlights.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div>
                      <p className="text-sm text-slate-500">Starting from</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {tour.price}
                      </p>
                    </div>
                    <Button
                      className={`${
                        tour.available === 0
                          ? "bg-slate-400 cursor-not-allowed"
                          : "bg-orange-500 hover:bg-orange-600"
                      } text-white font-semibold rounded-lg px-6 py-2`}
                      disabled={tour.available === 0}
                      data-testid={`book-tour-${tour.id || tour._id}-btn`}
                    >
                      {tour.available === 0 ? "Sold Out" : "Book Now"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToursDisplay;
