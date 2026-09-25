import React from "react";
import MainNavbar from "@/components/layout/MainNavbar";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Package,
  MapPin,
  AlertCircle,
  CreditCard,
  Clock,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  const sections = [
    {
      icon: MapPin,
      title: "Tour Bookings",
      terms: [
        "All tour bookings are subject to availability and confirmation.",
        "A minimum deposit of 25% is required at the time of booking.",
        "Full payment must be received 14 days before the tour departure date.",
        "Tour itineraries may be subject to change due to weather, local conditions, or unforeseen circumstances.",
        "Minimum group sizes may apply for certain tours to operate.",
        "Personal travel insurance is strongly recommended for all tours.",
      ],
    },
    {
      icon: Package,
      title: "Package Bookings",
      terms: [
        "Package prices include accommodations, transfers, and activities as specified in the package details.",
        "A deposit of 30% is required to secure your package booking.",
        "Balance payment is due 21 days prior to departure.",
        "Package components cannot be modified once booking is confirmed without additional fees.",
        "Any unused portion of the package is non-refundable.",
        "Upgrades and add-ons are subject to availability and additional charges.",
      ],
    },
    {
      icon: CreditCard,
      title: "Payment Terms",
      terms: [
        "We accept major credit cards, debit cards, and bank transfers.",
        "All prices are quoted in the local currency unless otherwise specified.",
        "A processing fee may apply for credit card payments.",
        "Invoices will be issued upon receipt of payment.",
        "Late payments may result in booking cancellation.",
        "Promotional offers cannot be combined with other discounts.",
      ],
    },
    {
      icon: Clock,
      title: "Cancellation Policy",
      terms: [
        "Cancellations made 30+ days before departure: Full refund minus processing fee.",
        "Cancellations made 15-29 days before departure: 50% refund.",
        "Cancellations made 7-14 days before departure: 25% refund.",
        "Cancellations made less than 7 days before departure: No refund.",
        "No-shows will not be eligible for any refund.",
        "Refunds will be processed within 14 business days.",
      ],
    },
    {
      icon: Shield,
      title: "Liability & Responsibility",
      terms: [
        "We act as an intermediary between travelers and service providers.",
        "We are not liable for delays, cancellations, or changes made by third-party suppliers or weather conditions.",
        "Travelers are responsible for ensuring valid travel documents and vaccinations.",
        "We recommend purchasing comprehensive travel insurance.",
        "Force majeure events may affect bookings without liability on our part.",
        "Any complaints must be reported within 7 days of service completion.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Top Navbar */}
      <MainNavbar />

      {/* Hero Header */}
      <section className="bg-white border-b border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex p-3 bg-cyan-50 text-cyan-600 rounded-2xl mb-4 border border-cyan-100">
            <FileText size={32} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 block mb-2">
            LEGAL POLICIES
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Booking Terms & Conditions
          </h1>
          <p className="text-base text-slate-500 max-w-2xl mx-auto">
            Please review our booking guidelines and policies for tour packages and travel arrangements.
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={index} className="overflow-hidden border-slate-100 bg-white rounded-2xl shadow-xs">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 p-5 bg-slate-50 border-b border-slate-100">
                  <div className="p-2.5 bg-cyan-100 text-cyan-700 rounded-xl">
                    <section.icon size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {section.title}
                  </h2>
                </div>
                <ul className="p-6 space-y-3">
                  {section.terms.map((term, termIndex) => (
                    <li key={termIndex} className="flex items-start gap-3 text-sm text-slate-600">
                      <span className="w-2 h-2 mt-1.5 bg-cyan-500 rounded-full shrink-0" />
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Important Notice Box */}
        <Card className="border-amber-200 bg-amber-50/60 rounded-2xl shadow-xs">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-amber-500 text-white rounded-xl shrink-0 shadow-xs">
                <AlertCircle size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-900 mb-1">
                  Important Notice
                </h3>
                <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                  By confirming a booking with Padham Travels, you acknowledge that you have read, understood, and agreed to these terms and conditions. These terms constitute a binding agreement between you and our travel agency.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions Contact Link */}
        <div className="text-center pt-2">
          <p className="text-xs sm:text-sm text-slate-500">
            Have questions regarding booking policies?{" "}
            <Link
              to="/about-us#contact"
              className="text-cyan-600 hover:underline font-bold"
            >
              Contact our team
            </Link>{" "}
            for instant assistance.
          </p>
        </div>
      </main>
    </div>
  );
};

export default TermsAndConditions;
