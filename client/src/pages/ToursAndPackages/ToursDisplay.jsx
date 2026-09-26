import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import MainNavbar from "@/components/layout/MainNavbar";
import { apiGet } from "@/apiClient";
import { useNavigate } from "react-router-dom";
import TourCard from "@/components/TourCard";
import TourCardSkeleton from "@/components/TourCardSkeleton";

export const ToursDisplay = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
      const name = (tour.name || tour.title || "").toLowerCase();
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
            </div>
          </div>
        </div>
      </div>

      {/* Tours Grid Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Active Filter & Results Status Bar */}
        {!error && !loading && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-200/80">
            <p className="text-sm font-medium text-slate-600">
              Showing <span className="font-bold text-slate-900">{filteredTours.length}</span> of{" "}
              <span className="font-bold text-slate-900">{tours.length}</span> available packages
            </p>

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 underline underline-offset-2 self-start sm:self-auto cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
        {/* Error State */}
        {error ? (
          <div className="max-w-md mx-auto my-12 p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center shadow-xs">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-500">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">
              Unable to load tour packages
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Something went wrong while connecting to our services. Please try again.
            </p>
            <button
              onClick={() => fetchTours(false)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <TourCardSkeleton key={i} />
            ))}
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
            {filteredTours.map((tour, idx) => (
              <TourCard key={tour.id || tour._id} tour={tour} idx={idx} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ToursDisplay;
