import React from "react";
import { Users, Compass, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MdCardTravel } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export const Stats = ({ stats = {} }) => {
  const navigate = useNavigate();

  const statItems = [
    {
      title: "ACTIVE TOUR PACKAGES",
      value: stats?.activeTours ?? 0,
      change: "Manage Tours",
      icon: MdCardTravel,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50 border border-cyan-100",
      breakdown: "Published Tour Showcases",
      action: () => navigate("/admin/manage-tours"),
      isClickable: true,
    },
    {
      title: "CUSTOMER INQUIRIES",
      value: stats?.totalInquiries ?? 0,
      change: "View Leads",
      icon: MessageSquare,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 border border-emerald-100",
      breakdown: "Active Inquiry Submissions",
      action: () => navigate("/admin/manage-inquiries"),
      isClickable: true,
    },
    {
      title: "FEATURED DESTINATIONS",
      value: stats?.featuredTours ?? 0,
      change: "Showcased",
      icon: Compass,
      color: "text-amber-600",
      bgColor: "bg-amber-50 border border-amber-100",
      breakdown: "High Priority Hero Packages",
      action: () => navigate("/admin/manage-tours"),
      isClickable: true,
    },
    {
      title: "TOTAL CUSTOMERS",
      value: stats?.totalCustomers ?? 0,
      change: "Registered",
      icon: Users,
      color: "text-violet-600",
      bgColor: "bg-violet-50 border border-violet-100",
      breakdown: "User Profiles",
      action: () => navigate("/admin/manage-inquiries"),
      isClickable: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statItems.map((stat, index) => (
        <Card
          key={index}
          onClick={() => stat.action && stat.action()}
          className={`bg-white border-slate-200/80 rounded-2xl shadow-xs py-1 transition-all duration-300 ${
            stat.isClickable
              ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-cyan-300"
              : "hover:shadow-sm"
          }`}
        >
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`${stat.bgColor} ${stat.color} p-3 rounded-xl transition-colors shrink-0`}
              >
                <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                {stat.change}
              </span>
            </div>

            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
              {stat.title}
            </h3>

            <p className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
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
  );
};

export default Stats;
