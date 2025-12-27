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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="border-slate-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          data-testid={`stat-card-${stat.title
            .toLowerCase()
            .replace(/\s/g, "-")}`}
        >
          <CardContent>
            <div className="flex items-center justify-between mb-5">
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-emerald-600 text-sm font-semibold">
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-3">
              {stat.title}
            </h3>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
