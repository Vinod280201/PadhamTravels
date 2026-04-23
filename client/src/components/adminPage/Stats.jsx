import React, { useState } from "react";
import { Plane, Users, TrendingUp, X, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MdCardTravel } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export const Stats = ({ dashboardStats, commissionDetails = [], customerDetails = [] }) => {
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const navigate = useNavigate();

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };
  const stats = [
    {
      title: "Total Bookings",
      value: dashboardStats?.totalBookings || "0",
      change: "View Bookings",
      icon: Plane,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      breakdown: dashboardStats ? `${dashboardStats.adminBookingsCount} Admin | ${dashboardStats.userBookingsCount} User` : "",
      action: () => navigate("/admin/manage-bookings", { state: { clearFilters: true } }),
      isClickable: true,
    },
    {
      title: "Manage Requests",
      value: dashboardStats ? ((dashboardStats.activeCancellationsCount || 0) + (dashboardStats.activeReschedulesCount || 0)) : "0",
      change: (dashboardStats && ((dashboardStats.activeCancellationsCount || 0) > 0 || (dashboardStats.activeReschedulesCount || 0) > 0)) ? "Action Required" : "All Clear",
      icon: Clock,
      color: "text-red-500",
      bgColor: "bg-red-50",
      breakdown: dashboardStats ? `${dashboardStats.activeCancellationsCount || 0} Cancellation | ${dashboardStats.activeReschedulesCount || 0} Reschedule` : "",
      action: () => navigate("/admin/manage-requests"),
      isClickable: true,
    },
    {
      title: "Total Customers",
      value: dashboardStats?.totalCustomers || "0",
      change: "View Details",
      icon: Users,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      action: () => setShowCustomerModal(true),
      isClickable: true,
    },
    {
      title: "Revenue (Commission)",
      value: dashboardStats?.totalRevenue ? formatINR(dashboardStats.totalRevenue) : "₹0",
      change: "View Details",
      icon: TrendingUp,
      color: "text-violet-500",
      bgColor: "bg-violet-50",
      action: () => setShowRevenueModal(true),
      isClickable: true,
    },
  ];

  return (
    // UPDATED GRID LAYOUT:
    // grid-cols-2:       Shows 2 items per row on mobile/small devices.
    // lg:grid-cols-4:    Shows 4 items per row on large screens (Laptops/Desktops).
    // gap-3 md:gap-6:    Smaller gap on mobile to save space, larger gap on desktop.
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            onClick={() => stat.action && stat.action()}
            className={`border-slate-300 py-2 transition-all duration-300 ${stat.isClickable ? "cursor-pointer hover:shadow-xl hover:-translate-y-1 ring-2 ring-transparent hover:ring-violet-200" : "hover:shadow-lg hover:-translate-y-1"}`}
          >
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between mb-3 md:mb-5">
                <div
                  className={`${stat.bgColor} ${stat.color} p-2 md:p-3 rounded-lg transition-colors`}
                >
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className={`${stat.isClickable ? "text-violet-600 bg-violet-50 border border-violet-200" : "text-emerald-600 bg-emerald-50"} text-[10px] md:text-sm font-semibold px-2 py-0.5 rounded-full`}>
                  {stat.change}
                </span>
              </div>

              <h3 className="text-slate-500 text-xs md:text-sm font-medium mb-1 md:mb-2 uppercase tracking-wide truncate">
                {stat.title}
              </h3>

              <p className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight">
                {stat.value}
              </p>
              {stat.breakdown && (
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {stat.breakdown}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {showRevenueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="bg-violet-100 p-2 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                    Revenue Details
                  </h2>
                  <p className="text-slate-500 text-sm font-medium">
                    Total Commission Earned: <span className="text-violet-700 font-bold">{dashboardStats?.totalRevenue ? formatINR(dashboardStats.totalRevenue) : "₹0"}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRevenueModal(false)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-200 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body - Commission Table */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-100/50">
              {commissionDetails.length > 0 ? (
                <div className="space-y-3">
                  {commissionDetails.map((item, idx) => (
                    <div key={idx} className="bg-white border text-left border-slate-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-3">
                      {/* Left: Booking & Customer info */}
                      <div className="flex-1 min-w-[150px]">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-slate-800 text-sm md:text-base">{item.bookingRef}</span>
                          {item.bookedByAdmin ? (
                            <span className="text-[9px] uppercase font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">Admin</span>
                          ) : (
                            <span className="text-[9px] uppercase font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">User</span>
                          )}
                        </div>
                        <p className="text-slate-600 font-bold text-xs md:text-sm">{item.customerName}</p>
                        <p className="text-slate-400 text-[10px] md:text-xs mt-0.5 font-medium">{item.date}</p>
                      </div>

                      {/* Center: Flight Route in center */}
                      <div className="flex-1 text-center py-2 md:py-0 border-t md:border-t-0 md:border-x border-slate-100 px-2">
                        <p className="text-slate-700 font-black text-sm md:text-base tracking-wide uppercase">
                          {item.flight}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-widest">Flight Route</p>
                      </div>

                      {/* Right: Financials */}
                      <div className="flex-1 flex flex-row md:flex-col justify-between md:justify-center items-center gap-2 md:gap-1 min-w-[130px]">
                         <div className="text-right flex-1">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Total Fare</p>
                            <p className="font-bold text-slate-600 text-xs md:text-sm">{formatINR(item.amount)}</p>
                         </div>
                         <div className="bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg text-center flex-1 w-full">
                            <p className="text-[9px] text-emerald-600 font-black uppercase tracking-tight mb-0.5 leading-none">Commission</p>
                            <p className="text-base md:text-lg font-black text-emerald-700 leading-none">{formatINR(item.commissionAmount)}</p>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium text-lg">No commission data available yet.</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t bg-white flex justify-end">
              <button
                onClick={() => setShowRevenueModal(false)}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors"
                >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-xl">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                    Customer List
                  </h2>
                  <p className="text-slate-500 text-sm font-medium">
                    Important details of registered users
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCustomerModal(false)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-200 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body - Customer Table */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-100/50">
              {customerDetails.length > 0 ? (
                <div className="space-y-3">
                  {customerDetails.map((user, idx) => (
                    <div key={idx} className="bg-white border text-left border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900 text-lg">{user.name}</span>
                        </div>
                        <p className="text-slate-700 font-semibold">{user.email}</p>
                        <p className="text-slate-500 text-sm mt-1">Phone: {user.phone}</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-center min-w-[140px]">
                        <p className="text-xs text-slate-500 font-bold tracking-wider mb-1">Joined</p>
                        <p className="font-bold text-slate-800">{user.joinedDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium text-lg">No customers registered yet.</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t bg-white flex justify-end">
              <button
                onClick={() => setShowCustomerModal(false)}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors"
                >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
