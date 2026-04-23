import React, { useEffect, useState } from "react";
import {
  Plane,
  Calendar,
  Clock,
  ArrowRight,
  AlertTriangle,
  Loader2,
  Tag,
} from "lucide-react";

export const FlightsDealsOffers = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await fetch(`${baseUrl}/deals`);
        if (res.ok) {
          const data = await res.json();
          setDeals(data);
        }
      } catch (error) {
        console.error("Error fetching deals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  if (loading) {
    return (
      <div className="h-60 flex items-center justify-center bg-slate-600 rounded-md my-3">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (deals.length === 0) return null;

  return (
    <div className="h-full p-6 my-3 bg-slate-600 rounded-md shadow-inner">
      <div className="text-3xl font-bold text-center mb-8">
        <span className="text-yellow-400">BEST DEALS</span>{" "}
        <span className="text-white">ON AIR TICKETS</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 md:px-6">
        {deals.map((deal) => (
          <div
            key={deal._id}
            className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col"
          >
            {/* ALERT BADGE (Top Right) */}
            {deal.alert && (
              <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10 animate-pulse flex items-center gap-1">
                <AlertTriangle size={12} />
                {deal.alert.toUpperCase()}
              </div>
            )}

            {/* DEAL NAME BANNER (New Feature) */}
            {deal.dealName && (
              <div className="bg-blue-50 py-1.5 px-5 border-b border-blue-100 flex items-center gap-2">
                <Tag size={14} className="text-blue-600" />
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                  {deal.dealName}
                </span>
              </div>
            )}

            <div className="p-5 flex flex-col grow">
              {/* Route Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-slate-800 uppercase">
                    {deal.origin}
                  </span>
                  <span className="text-xs text-slate-500 uppercase tracking-wider">
                    Origin
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center px-2">
                  <Plane className="text-yellow-500 rotate-90" size={24} />
                  <div className="w-16 h-px bg-slate-300 my-1 relative">
                    <div className="absolute left-1/2 -translate-x-1/2 -top-[3px] w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full mt-1 whitespace-nowrap">
                    {deal.type}
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-lg font-bold text-slate-800 uppercase">
                    {deal.destination}
                  </span>
                  <span className="text-xs text-slate-500 uppercase tracking-wider">
                    Dest
                  </span>
                </div>
              </div>

              {/* Date Info */}
              <div className="flex items-center gap-2 mb-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <Calendar className="text-slate-400" size={16} />
                <span className="text-sm font-medium text-slate-700">
                  {new Date(deal.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Price & Action */}
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">Starting from</span>
                  <span className="text-2xl font-bold text-slate-800 flex items-start">
                    <span className="text-sm mt-1 mr-0.5">Rs.</span>
                    {deal.price.toLocaleString("en-IN")}
                  </span>
                </div>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-2 px-4 rounded-lg shadow-md transition-colors flex items-center gap-1">
                  Book <ArrowRight size={16} />
                </button>
              </div>

              {/* Footer Validity */}
              {deal.validity && (
                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-red-500 bg-red-50 py-1.5 rounded text-center">
                  <Clock size={12} />
                  {deal.validity}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
