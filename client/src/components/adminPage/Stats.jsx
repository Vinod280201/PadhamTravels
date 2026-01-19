import React from "react";
import { Plane, Users, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MdCardTravel } from "react-icons/md";

export const Stats = () => {
  const stats = [
    {
      title: "Total Bookings",
      value: "1,284",
      change: "+12.5%",
      icon: Plane,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Active Tours",
      value: "48",
      change: "+4.2%",
      icon: MdCardTravel,
      color: "text-sky-500",
      bgColor: "bg-sky-50",
    },
    {
      title: "Total Customers",
      value: "892",
      change: "+8.1%",
      icon: Users,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Revenue",
      value: "$124.5K",
      change: "+23.4%",
      icon: TrendingUp,
      color: "text-violet-500",
      bgColor: "bg-violet-50",
    },
  ];

  return (
    // UPDATED GRID LAYOUT:
    // grid-cols-2:       Shows 2 items per row on mobile/small devices.
    // lg:grid-cols-4:    Shows 4 items per row on large screens (Laptops/Desktops).
    // gap-3 md:gap-6:    Smaller gap on mobile to save space, larger gap on desktop.
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="border-slate-300 py-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          {/* Reduced padding on mobile (p-3) so the 2 columns fit nicely */}
          <CardContent className="p-3 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-5">
              <div
                className={`${stat.bgColor} ${stat.color} p-2 md:p-3 rounded-lg transition-colors`}
              >
                {/* Icon size reduced slightly for mobile */}
                <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-emerald-600 text-xs md:text-sm font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-full">
                {stat.change}
              </span>
            </div>

            <h3 className="text-slate-500 text-xs md:text-sm font-medium mb-1 md:mb-2 uppercase tracking-wide truncate">
              {stat.title}
            </h3>

            <p className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight">
              {stat.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
