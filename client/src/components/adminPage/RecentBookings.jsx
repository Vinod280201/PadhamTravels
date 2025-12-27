import React from "react";
import { Plane } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CONSTANTS from "@/constants/AppConstants";

const { BOOKINGS } = CONSTANTS;
const getRecentBookings = () => {
  return [...BOOKINGS]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);
};

export const RecentBookings = () => {
  const recentBookings = getRecentBookings();

  return (
    <Card
      className="lg:col-span-2 border-slate-300"
      data-testid="recent-bookings-card"
    >
      <CardHeader>
        <CardTitle className="text-2xl">Recent Bookings</CardTitle>
        <CardDescription>Latest flight bookings from customers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between py-3 px-4 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
              data-testid={`booking-item-${booking.id}`}
            >
              <div className="flex items-center gap-4">
                <div className="bg-orange-50 p-3 rounded-lg">
                  <Plane className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {booking.flight}
                  </p>
                  <p className="text-sm text-slate-500">
                    {booking.customer} • {booking.id}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">{booking.amount}</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === "Confirmed"
                      ? "bg-emerald-50 text-emerald-700"
                      : booking.status === "Pending"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
