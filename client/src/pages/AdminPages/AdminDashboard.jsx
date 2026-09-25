import React, { useState, useEffect } from "react";
import { Stats } from "@/components/adminPage/Stats";
import { apiGet } from "@/apiClient";
import { Sparkles, MessageSquare, ArrowRight, Phone } from "lucide-react";
import { MdCardTravel } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    activeTours: 0,
    totalInquiries: 0,
    featuredTours: 0,
    totalCustomers: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await apiGet("/admin/dashboard-stats");
        const data = await res.json();
        if (data?.success) {
          setStats(data.stats || {
            activeTours: 0,
            totalInquiries: 0,
            featuredTours: 0,
            totalCustomers: 0,
          });
          setRecentInquiries(data.recentInquiries || []);
        }
      } catch (error) {
        console.error("Failed to load dashboard metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="w-full space-y-6 py-2 md:p-4">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles size={14} />
            <span>Tour Showcase Dashboard</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Padham Travels Management
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Real-time analytics and management for tour packages & leads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/manage-tours")}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <MdCardTravel size={18} />
            <span>Add New Tour</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC METRIC CARDS */}
      <Stats stats={stats} />

      {/* QUICK ACTIONS & RECENT LEADS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* RECENT INQUIRIES LEADS */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">
                Recent Customer Inquiries
              </h3>
              <p className="text-xs text-slate-500">
                Latest leads submitted via website packages
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/manage-inquiries")}
              className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10 text-slate-400 text-sm font-semibold">
              Loading recent inquiries...
            </div>
          ) : recentInquiries.length > 0 ? (
            <div className="space-y-3">
              {recentInquiries.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/60 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold shrink-0">
                      {item.name ? item.name[0]?.toUpperCase() : "C"}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-slate-900 truncate">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
                        <span className="flex items-center gap-1">
                          <Phone size={12} className="text-emerald-600" />
                          {item.phone}
                        </span>
                        <span>•</span>
                        <span className="truncate">{item.tourTitle || item.destination || "General Inquiry"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 block mb-1">
                      {item.status || "Pending"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm font-medium">
              No inquiries received yet.
            </div>
          )}
        </div>

        {/* QUICK NAVIGATION PANEL */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 mb-1">
              Quick Management
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Direct shortcuts for tour operations
            </p>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/admin/manage-tours")}
                className="w-full flex items-center justify-between p-3.5 bg-cyan-50/60 hover:bg-cyan-100/70 border border-cyan-100 rounded-xl transition text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-600 text-white">
                    <MdCardTravel size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">
                      Manage Tour Packages
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Create, edit or delete tours
                    </p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-cyan-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/admin/manage-inquiries")}
                className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-white">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">
                      Customer Leads & Inquiries
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Review lead submissions
                    </p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-cyan-50/40 rounded-xl border border-cyan-100 text-xs text-slate-600">
            <span className="font-bold text-cyan-800 block mb-1">💡 Showcase Tip:</span>
            Highlight your top package tours as "Featured" to display them on the landing page hero carousel.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
