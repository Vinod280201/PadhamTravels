import React from "react";
import { Calendar, Plane } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MdCardTravel } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card className="border-slate-300" data-testid="quick-actions-card">
      <CardHeader>
        <CardTitle className="text-2xl">Quick Actions</CardTitle>
        <CardDescription>Common tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <button
          className="w-full bg-slate-200 hover:bg-orange-500 border border-slate-400 text-slate-900 hover:text-white font-semibold rounded-lg px-6 py-3 shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
          data-testid="book-flight-btn"
          onClick={() => navigate("/admin/book-flights")}
        >
          <Plane className="w-5 h-5" />
          Book New Flight
        </button>
        <button
          className="w-full bg-slate-200 hover:bg-orange-500 border border-slate-400 text-slate-900 hover:text-white font-semibold rounded-lg px-6 py-3 shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
          data-testid="add-tour-btn"
          onClick={() => navigate("/admin/manage-tours")}
        >
          <MdCardTravel className="w-5 h-5" />
          Add New Tour
        </button>
        <button
          className="w-full bg-slate-200 hover:bg-orange-500 border border-slate-400 text-slate-900 hover:text-white font-semibold rounded-lg px-6 py-3 shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
          data-testid="view-calendar-btn"
          onClick={() => navigate("/admin/booking-calendar")}
        >
          <Calendar className="w-5 h-5" />
          View Calendar
        </button>
      </CardContent>
    </Card>
  );
};
