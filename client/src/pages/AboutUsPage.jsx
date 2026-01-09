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
        // Timeout ensures the DOM is fully rendered before scrolling
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-background">
      <MainNavbar />
      {/* Hero Section */}
      <section className="relative py-10 md:py-16 bg-primary/10 mt-2">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            About Us
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A one-person mission to create unforgettable travel experiences that
            connect you with the world's most amazing destinations.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center">
                <CardContent className="p-6">
                  <stat.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                  <div className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* My Story Section */}
      <section className="py-10 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              My Story
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              What started as a passion for travel has grown into a dedicated
              service helping thousands of travelers explore the world. I
              personally handle every booking, every tour, and every detail to
              ensure you get the experience you deserve.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              With over 15 years of experience in the travel industry, I've
              built relationships with the best local guides, hotels, and
              service providers to bring you authentic, hassle-free adventures.
              When you book with me, you're not just a customer — you're part of
              my travel family.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            What I Promise
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                Personal Attention
              </h3>
              <p className="text-muted-foreground">
                Every trip is personally crafted and monitored by me to ensure
                perfection.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                Quality Service
              </h3>
              <p className="text-muted-foreground">
                I maintain the highest standards from planning to execution.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                24/7 Support
              </h3>
              <p className="text-muted-foreground">
                I'm always available to help you before, during, and after your
                trip.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-10 md:py-16 bg-primary/10">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Get In Touch
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center border-gray-300">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Phone
                </h3>
                <a
                  href="tel:+91 99442 29209"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +91 99442 29209
                </a>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-300">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Email
                </h3>
                <a
                  href="mailto:padhamtravel@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  padhamtravel@gmail.com
                </a>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-300">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Hours
                </h3>
                <p className="text-muted-foreground">Mon - Sun: 9AM - 9PM</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
