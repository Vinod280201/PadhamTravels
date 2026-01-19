import React, { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plane,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CONSTANTS from "@/constants/AppConstants";

const { BOOKINGS } = CONSTANTS;

export const BookingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const bookingsData = useMemo(() => {
    const map = {};
    BOOKINGS.forEach((b, index) => {
      const key = b.date; // "2025-01-15"
      if (!map[key]) map[key] = [];
      map[key].push({
        id: index + 1,
        flight: b.flight,
        customer: b.customer,
        status: b.status,
      });
    });
    return map;
  }, []);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  // Shorten day names for mobile (Mon vs Monday) - already short, but good to keep clean
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getBookingsForDate = (day) => {
    if (!day) return [];
    const dateKey = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return bookingsData[dateKey] || [];
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="w-full bg-slate-50 p-3 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 md:mb-6">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-1 md:mb-2">
            Booking Calendar
          </h1>
          <p className="text-slate-500 text-sm md:text-lg">
            View flight bookings on a monthly calendar
          </p>
        </div>
      </div>

      {/* Calendar Card */}
      <Card
        className="border-slate-300 shadow-sm"
        data-testid="booking-calendar-card"
      >
        <CardHeader className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <CardTitle className="text-lg md:text-2xl flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 md:w-6 md:h-6 text-slate-700" />
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>

            {/* Navigation Buttons */}
            <div className="flex gap-2 w-full sm:w-auto justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(-1)}
                className="h-8 md:h-9"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
                className="h-8 md:h-9"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(1)}
                className="h-8 md:h-9"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <div className="border-b border-b-slate-300 mx-0 md:mx-5" />

        <CardContent className="p-2 md:p-6">
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {/* Day Headers */}
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-slate-800 py-1 text-xs md:text-sm uppercase tracking-wider"
              >
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {days.map((day, index) => {
              const bookings = getBookingsForDate(day);
              const hasBookings = bookings.length > 0;
              const isToday =
                day &&
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={index}
                  // Responsive height: smaller on mobile, larger on desktop
                  className={`
                    relative flex flex-col justify-start items-stretch
                    min-h-20 md:min-h-[120px] 
                    border rounded-lg p-1 md:p-2 
                    transition-all overflow-hidden
                    ${
                      !day
                        ? "bg-slate-50 border-slate-100" // Empty slot
                        : isToday
                        ? "bg-orange-50 border-orange-300"
                        : "bg-white border-slate-200 hover:border-orange-300 hover:shadow-sm"
                    }
                  `}
                >
                  {day && (
                    <>
                      {/* Day Number */}
                      <div
                        className={`text-right text-xs md:text-sm font-semibold mb-1 ${
                          isToday ? "text-orange-600" : "text-slate-900"
                        }`}
                      >
                        {day}
                      </div>

                      {/* CONTENT: Visible only if there are bookings */}
                      {hasBookings && (
                        <>
                          {/* MOBILE VIEW: Show simple dot or badge count */}
                          <div className="flex flex-col items-center justify-center h-full md:hidden gap-1">
                            <div className="w-2 h-2 rounded-full bg-sky-500 mb-1"></div>
                            <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-1.5 rounded-full">
                              {bookings.length}
                            </span>
                          </div>

                          {/* DESKTOP VIEW: Show detailed list */}
                          <div className="hidden md:flex flex-col gap-1">
                            {bookings.slice(0, 2).map((booking) => (
                              <div
                                key={booking.id}
                                className="bg-sky-50 border border-sky-200 rounded px-1.5 py-1 text-[10px] lg:text-xs"
                              >
                                <div className="flex items-center gap-1 mb-0.5">
                                  <Plane className="w-3 h-3 text-sky-600 shrink-0" />
                                  <span className="font-semibold text-sky-900 truncate">
                                    {booking.flight}
                                  </span>
                                </div>
                                <p className="text-slate-600 truncate leading-tight">
                                  {booking.customer}
                                </p>
                              </div>
                            ))}
                            {bookings.length > 2 && (
                              <p className="text-[10px] text-slate-500 font-bold px-1 text-center">
                                +{bookings.length - 2} more
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="border-slate-300">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-50 border-2 border-orange-300 rounded"></div>
              <span className="text-xs md:text-sm text-slate-600">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-sky-50 border border-sky-300 rounded"></div>
              <span className="text-xs md:text-sm text-slate-600">
                Has Bookings
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] md:text-xs"
              >
                Confirmed
              </Badge>
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] md:text-xs"
              >
                Pending
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingCalendar;
