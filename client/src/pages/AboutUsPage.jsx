import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Award, Heart, MapPin, Phone, Mail, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import MainNavbar from "@/components/layout/MainNavbar";

const stats = [
  { label: "Happy Travelers", value: "10,000+", icon: Users },
  { label: "Tours Completed", value: "500+", icon: MapPin },
  { label: "Years Experience", value: "15+", icon: Award },
  { label: "5-Star Reviews", value: "2,500+", icon: Heart },
];

const AboutUs = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash === "#contact") {
      const element = document.getElementById("contact");
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Top Main Navbar */}
      <MainNavbar />

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-2 block">
            ABOUT PADHAM TRAVELS
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4">
            Creating Unforgettable Experiences
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto font-normal">
            Dedicated to connecting you with the world's most amazing destinations through customized tour packages and expert travel guidance.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center bg-white border-slate-100 rounded-2xl shadow-xs">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4 border border-cyan-100">
                    <stat.icon size={24} />
                  </div>
                  <div className="font-serif text-3xl md:text-4xl font-extrabold text-slate-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* My Story Section */}
      <section className="py-12 md:py-16 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-2 block">
            OUR JOURNEY
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
            Our Story & Passion
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
            What started as a passion for travel has grown into a dedicated service helping thousands of travelers explore the world. We handle every booking, every tour, and every detail to ensure you get an unforgettable experience.
          </p>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            With over 15 years of experience in the travel industry, we have built relationships with top local guides, hotels, and transport providers to bring you authentic, hassle-free adventures.
          </p>
        </div>
      </section>

      {/* Promises Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-2 block">
              OUR COMMITMENT
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-slate-900">
              What We Promise
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
              <div className="w-14 h-14 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-100">
                <Heart size={28} />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                Personal Attention
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every trip is personally crafted and monitored by our travel experts to ensure perfection.
              </p>
            </div>
            <div className="text-center bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
              <div className="w-14 h-14 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-100">
                <Award size={28} />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                Quality Service
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We maintain the highest standards from itinerary planning to hotel check-ins and transfers.
              </p>
            </div>
            <div className="text-center bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
              <div className="w-14 h-14 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-100">
                <Clock size={28} />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                24/7 Dedicated Support
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We are always available on call and WhatsApp to assist you before, during, and after your trip.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 md:py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-2 block">
              REACH OUT
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-slate-900">
              Get In Touch With Us
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center border-slate-100 bg-[#f8fafc] rounded-2xl">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-cyan-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-xs">
                  <Phone size={22} />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">
                  Phone / WhatsApp
                </h3>
                <a
                  href="tel:+919944229209"
                  className="text-sm font-bold text-cyan-700 hover:underline"
                >
                  +91 99442 29209
                </a>
              </CardContent>
            </Card>

            <Card className="text-center border-slate-100 bg-[#f8fafc] rounded-2xl">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-cyan-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-xs">
                  <Mail size={22} />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">
                  Email Inquiry
                </h3>
                <a
                  href="mailto:info@padhamtravel.com"
                  className="text-sm font-bold text-cyan-700 hover:underline"
                >
                  info@padhamtravel.com
                </a>
              </CardContent>
            </Card>

            <Card className="text-center border-slate-100 bg-[#f8fafc] rounded-2xl">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-cyan-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-xs">
                  <Clock size={22} />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">
                  Working Hours
                </h3>
                <p className="text-xs text-slate-600 font-medium">Mon - Sun: 9AM - 9PM</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
