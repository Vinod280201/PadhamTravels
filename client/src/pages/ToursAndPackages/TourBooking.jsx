import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  Star,
  Calendar,
  Users,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainNavbar from "@/components/layout/MainNavbar";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const TourBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tour } = location.state || {}; // Get tour data passed via navigate

  const [bookingData, setBookingData] = useState({
    startDate: "",
    guests: 1,
  });

  if (!tour)
    return (
      <div className="p-10 text-center">
        Tour not found. <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      <MainNavbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-slate-600"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Tours
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Tour Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl overflow-hidden h-[400px]">
              <img
                src={
                  tour.image
                    ? `${API_BASE}${tour.image}`
                    : "https://via.placeholder.com/800x400"
                }
                alt={tour.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-4xl font-bold text-slate-900">
                  {tour.name}
                </h1>
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-amber-700">
                    {tour.rating}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 text-slate-600 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <span>{tour.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span>{tour.duration}</span>
                </div>
              </div>

              <hr className="my-6 border-slate-100" />

              <h3 className="text-xl font-semibold mb-3">About this Tour</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Experience the beauty of {tour.destination} with our curated{" "}
                {tour.name} package. This trip includes top-rated
                accommodations, professional guides, and exclusive access to
                local landmarks.
              </p>

              <h3 className="text-xl font-semibold mb-3">Highlights</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tour.highlights?.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-slate-600"
                  >
                    <div className="w-2 h-2 bg-orange-400 rounded-full" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Booking Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-slate-200 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-6">
                  <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">
                    Price per person
                  </p>
                  <p className="text-3xl font-black text-slate-900">
                    {tour.price}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">
                      Select Start Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">
                      Number of Guests
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        min="1"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                        value={bookingData.guests}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            guests: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg mt-6">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Total Price</span>
                      <span>
                        ₹
                        {(
                          parseInt(tour.price.replace(/[^0-9]/g, "")) *
                          bookingData.guests
                        ).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      *Taxes and fees calculated at checkout
                    </p>
                  </div>

                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg font-bold shadow-md transition-transform active:scale-95">
                    Proceed to Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourBooking;
