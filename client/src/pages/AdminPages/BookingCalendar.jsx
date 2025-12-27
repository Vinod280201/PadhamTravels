import { useMemo, useState } from "react";
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
    // NEW
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
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty slots for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add days of the month
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
    <div className="w-full bg-slate-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Booking Calendar
          </h1>
          <p className="text-slate-500 text-lg">
            View flight bookings on a monthly calendar
          </p>
        </div>
      </div>

      {/* Calendar Card */}
      <Card className="border-slate-300" data-testid="booking-calendar-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <CalendarIcon className="w-6 h-6" />
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(-1)}
                data-testid="prev-month-btn"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
                data-testid="today-btn"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(1)}
                data-testid="next-month-btn"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <div className="border-b border-b-slate-300 mx-5" />
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-slate-800 py-1 text-sm"
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
                  className={`min-h-[120px] border rounded-lg p-2 ${
                    !day
                      ? "bg-slate-50 border-slate-100"
                      : isToday
                      ? "bg-orange-50 border-orange-300 font-semibold"
                      : "bg-white border-slate-300 hover:border-orange-300 hover:shadow-sm"
                  } transition-all`}
                  data-testid={
                    day ? `calendar-day-${day}` : `calendar-empty-${index}`
                  }
                >
                  {day && (
                    <>
                      <div
                        className={`text-right text-sm font-semibold mb-2 ${
                          isToday ? "text-orange-600" : "text-slate-900"
                        }`}
                      >
                        {day}
                      </div>
                      {hasBookings && (
                        <div className="space-y-1">
                          {bookings.slice(0, 2).map((booking) => (
                            <div
                              key={booking.id}
                              className="bg-sky-50 border border-sky-300 rounded px-2 py-1 text-xs"
                              data-testid={`booking-${booking.id}-preview`}
                            >
                              <div className="flex items-center gap-1 mb-1">
                                <Plane className="w-3 h-3 text-sky-600" />
                                <span className="font-medium text-sky-900">
                                  {booking.flight}
                                </span>
                              </div>
                              <p className="text-slate-600 truncate">
                                {booking.customer}
                              </p>
                            </div>
                          ))}
                          {bookings.length > 2 && (
                            <p className="text-xs text-slate-500 font-medium px-2">
                              +{bookings.length - 2} more
                            </p>
                          )}
                        </div>
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
        <CardContent className="p-6">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-50 border-2 border-orange-300 rounded"></div>
              <span className="text-sm text-slate-600">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-sky-50 border border-sky-300 rounded"></div>
              <span className="text-sm text-slate-600">Has Bookings</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                Confirmed
              </Badge>
              <Badge className="bg-amber-50 text-amber-700 border-amber-200">
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
