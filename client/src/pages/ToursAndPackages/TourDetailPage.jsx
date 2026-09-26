import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { apiGet } from "@/apiClient";
import { formatPrice, getTourImageUrl } from "@/lib/utils";
import MainNavbar from "@/components/layout/MainNavbar";
import {
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  XCircle,
  FileText,
  MessageCircle,
  Send,
  ArrowLeft,
  Calendar,
  Phone,
  User,
} from "lucide-react";
import Button from "@/components/common/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const TourDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const whatsappPhone = import.meta.env.VITE_WHATSAPP_NUMBER || "919944229209";

  const [tour, setTour] = useState(location.state?.tour || null);
  const [loading, setLoading] = useState(!location.state?.tour);
  const [error, setError] = useState(null);

  const [countryCode, setCountryCode] = useState("+91");
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    phone: "",
    email: "",
    travelDate: "",
    travelers: 2,
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!tour && id) {
      const fetchSingleTour = async () => {
        try {
          setLoading(true);
          const res = await apiGet(`/tours/${id}`);
          if (!res.ok) throw new Error("Tour not found");
          const data = await res.json();
          setTour(data);
        } catch (err) {
          setError(err.message || "Failed to load tour details.");
        } finally {
          setLoading(false);
        }
      };
      fetchSingleTour();
    }
  }, [id, tour]);

  const handleWhatsAppClick = () => {
    const packageName = tour?.name || tour?.title || "Tour Package";
    const travelerCount = inquiryForm.travelers || 2;
    const msg = encodeURIComponent(
      `Hi Padham Travels, I am interested in booking the "${packageName}" package for ${travelerCount} traveler(s).`
    );
    window.open(`https://wa.me/${whatsappPhone}?text=${msg}`, "_blank");
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.phone) {
      alert("Please provide your name and phone number.");
      return;
    }

    const fullPhone = `${countryCode} ${inquiryForm.phone.trim()}`;

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inquiryForm.name,
          phone: fullPhone,
          email: inquiryForm.email,
          travelDate: inquiryForm.travelDate,
          travelers: Number(inquiryForm.travelers) || 1,
          numberOfTravelers: Number(inquiryForm.travelers) || 1,
          message: inquiryForm.message,
          tourId: tour?._id || tour?.id,
          tourTitle: tour?.name || tour?.title,
          destination: tour?.destination,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Submission failed. Please try again or inquire via WhatsApp.");
      }
    } catch (err) {
      console.error("Inquiry error:", err);
      alert("Error submitting inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Top Main Navbar */}
      <MainNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate(-1)}
          className="mb-6 cursor-pointer"
        >
          Back to Tour Packages
        </Button>

        {loading ? (
          <div className="py-20 text-center text-slate-500 font-medium text-lg">
            Loading tour details...
          </div>
        ) : error || !tour ? (
          <div className="py-20 text-center text-red-500 font-semibold text-lg">
            {error || "Tour package not found."}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT 2 COLS: Tour Info & Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Clean Top Title Bar for the Detail Page */}
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-3 py-1 bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold rounded-full uppercase tracking-wider">
                    {tour.destination}
                  </span>
                  {tour.duration && (
                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                      <Clock size={14} className="text-slate-400" />
                      {tour.duration}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
                  {tour.title || tour.name}
                </h1>
              </div>

              {/* Uncropped Poster Image Showcase */}
              <div className="w-full bg-slate-900/5 rounded-3xl overflow-hidden border border-slate-200/80 flex items-center justify-center p-2 sm:p-4 shadow-sm">
                <img
                  src={getTourImageUrl(tour)}
                  alt={tour.title || tour.name}
                  className="w-full h-auto max-h-[650px] object-contain rounded-2xl block mx-auto transition-transform hover:scale-[1.01]"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/800x500?text=Tour+Package";
                  }}
                />
              </div>

              {/* Overview Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white rounded-2xl shadow-xs border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                    <Star size={20} className="fill-amber-400 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Rating</div>
                    <div className="font-bold text-slate-800 text-sm">{tour.rating || 4.8} / 5</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-xl">
                    <Clock size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Duration</div>
                    <div className="font-bold text-slate-800 text-sm">{tour.duration || "N/A"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Location</div>
                    <div className="font-bold text-slate-800 text-sm truncate">{tour.destination}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-xl">
                    <FileText size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Itinerary</div>
                    {tour.itinerary ? (
                      <a
                        href={tour.itinerary.startsWith("http") ? tour.itinerary : `${API_BASE}${tour.itinerary}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-cyan-600 hover:underline"
                      >
                        PDF Download
                      </a>
                    ) : (
                      <span className="text-xs text-slate-500">Available</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Highlights Section */}
              {tour.highlights && tour.highlights.length > 0 && (
                <Card className="border-slate-100 bg-white rounded-2xl shadow-xs">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Star className="text-amber-400 fill-amber-400" size={20} />
                      Package Highlights
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {tour.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-slate-700 font-medium text-sm">
                          <CheckCircle2 size={18} className="text-cyan-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inclusions */}
                <Card className="border-slate-100 bg-white rounded-2xl shadow-xs">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-emerald-700 mb-3 flex items-center gap-2">
                      <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                      <span>Package Inclusions</span>
                    </h3>
                    {tour.inclusions && tour.inclusions.length > 0 ? (
                      <ul className="space-y-2">
                        {tour.inclusions.map((inc, i) => (
                          <li key={i} className="text-sm text-slate-700 flex items-start gap-2.5">
                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span className="leading-snug">{inc}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500">
                        Accommodation, Daily Breakfast, Sightseeing Transfers, and Local Guide Support.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Exclusions */}
                <Card className="border-slate-100 bg-white rounded-2xl shadow-xs">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-red-700 mb-3 flex items-center gap-2">
                      <XCircle size={20} className="text-red-600 shrink-0" />
                      <span>Package Exclusions</span>
                    </h3>
                    {tour.exclusions && tour.exclusions.length > 0 ? (
                      <ul className="space-y-2">
                        {tour.exclusions.map((exc, i) => (
                          <li key={i} className="text-sm text-slate-700 flex items-start gap-2.5">
                            <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                            <span className="leading-snug">{exc}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500">
                        Personal Expenses, Airfare/Train Tickets unless specified, Extra Meal Services.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* RIGHT 1 COL: Pricing & Inquiry Card */}
            <div className="space-y-6">
              <Card className="border-slate-100 bg-white rounded-2xl shadow-lg sticky top-24">
                <CardContent className="p-6 space-y-6">
                  {/* Price Banner */}
                  <div className="pb-4 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Price Estimate
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-1 flex-wrap">
                      <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        {formatPrice(tour.price, tour.currency)}
                      </span>
                      <span className="text-slate-500 text-sm font-medium capitalize">
                        /{tour.pricingUnit || "person"}
                      </span>
                    </div>
                  </div>

                  {/* WhatsApp Action */}
                  <Button
                    variant="success"
                    size="md"
                    icon={MessageCircle}
                    onClick={handleWhatsAppClick}
                    className="w-full font-bold cursor-pointer"
                  >
                    Book via WhatsApp
                  </Button>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-3 text-xs uppercase font-bold text-slate-400">
                      OR SEND INQUIRY
                    </span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  {/* Form Inquiry */}
                  {submitted ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-800 font-semibold space-y-1">
                      <CheckCircle2 size={32} className="mx-auto text-emerald-600" />
                      <p>Inquiry Sent!</p>
                      <p className="text-xs font-normal text-slate-600">
                        Our travel expert will reach out to you shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User size={16} className="absolute left-3 top-3 text-slate-400" />
                          <Input
                            required
                            type="text"
                            placeholder="John Doe"
                            className="pl-9 bg-slate-50 border-slate-200 focus:border-cyan-500"
                            value={inquiryForm.name}
                            onChange={(e) =>
                              setInquiryForm({ ...inquiryForm, name: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">
                          Phone Number *
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:border-cyan-500 outline-none cursor-pointer shrink-0"
                          >
                            <option value="+91">+91 (IN)</option>
                            <option value="+1">+1 (US/CA)</option>
                            <option value="+44">+44 (UK)</option>
                            <option value="+971">+971 (UAE)</option>
                            <option value="+65">+65 (SG)</option>
                            <option value="+66">+66 (TH)</option>
                          </select>
                          <div className="relative flex-1">
                            <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                            <Input
                              required
                              type="tel"
                              placeholder="99442 29209"
                              className="pl-9 bg-slate-50 border-slate-200 focus:border-cyan-500"
                              value={inquiryForm.phone}
                              onChange={(e) =>
                                setInquiryForm({ ...inquiryForm, phone: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">
                            No. of Travelers *
                          </label>
                          <Input
                            type="number"
                            min="1"
                            required
                            placeholder="e.g. 2"
                            value={inquiryForm.travelers || ""}
                            onChange={(e) =>
                              setInquiryForm({ ...inquiryForm, travelers: e.target.value })
                            }
                            className="bg-slate-50 border-slate-200 focus:border-cyan-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">
                            Travel Date
                          </label>
                          <div className="relative">
                            <Calendar size={16} className="absolute left-3 top-3 text-slate-400" />
                            <Input
                              type="date"
                              className="pl-9 bg-slate-50 border-slate-200 focus:border-cyan-500"
                              value={inquiryForm.travelDate}
                              onChange={(e) =>
                                setInquiryForm({ ...inquiryForm, travelDate: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        isLoading={submitting}
                        className="w-full font-bold cursor-pointer"
                      >
                        Submit Lead Inquiry
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TourDetailPage;
