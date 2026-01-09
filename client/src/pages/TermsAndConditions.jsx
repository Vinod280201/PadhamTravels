import MainNavbar from "@/components/layout/MainNavbar";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Plane,
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
      icon: Plane,
      title: "Flight Bookings",
      terms: [
        "All flight bookings are subject to airline terms and conditions.",
        "Flight prices are not guaranteed until payment is completed.",
        "Name changes after booking may incur airline penalties or may not be permitted.",
        "Baggage allowances are as per airline policy and may vary.",
        "Flight schedules are subject to change by airlines without prior notice.",
        "Travel documents (passport, visa) are the responsibility of the traveler.",
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
        "We are not liable for delays, cancellations, or changes made by airlines, hotels, or tour operators.",
        "Travelers are responsible for ensuring valid travel documents and vaccinations.",
        "We recommend purchasing comprehensive travel insurance.",
        "Force majeure events may affect bookings without liability on our part.",
        "Any complaints must be reported within 7 days of service completion.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainNavbar />
      {/* Hero Section */}
      <section className="relative py-10 bg-primary/10 mt-2">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/15 rounded-full">
              <FileText className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Please read these booking terms and conditions carefully before
            making any reservations for tours, travel packages, or flight
            bookings.
          </p>
        </div>
      </section>

      {/* Last Updated */}
      <section className="py-6 border-b border-gray-300">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground text-center">
            Last updated: January 2026
          </p>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <Card key={index} className="overflow-hidden py-0">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-6 bg-muted border-b border-border">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <section.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {section.title}
                    </h2>
                  </div>
                  <ul className="p-6 space-y-3">
                    {section.terms.map((term, termIndex) => (
                      <li key={termIndex} className="flex items-start gap-3">
                        <span className="w-2 h-2 mt-2 bg-primary rounded-full shrink-0" />
                        <span className="text-muted-foreground">{term}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-muted">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Important Notice
                  </h3>
                  <p className="text-muted-foreground">
                    By making a booking with us, you acknowledge that you have
                    read, understood, and agreed to these terms and conditions.
                    These terms constitute a binding agreement between you and
                    our company. We reserve the right to modify these terms at
                    any time, and it is your responsibility to review them
                    periodically.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact for Questions */}
      <section className="pb-10 pt-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Have questions about our terms?{" "}
            <Link
              to="/about-us#contact" // Added hash here
              className="text-primary hover:underline font-medium"
            >
              Contact us
            </Link>{" "}
            for clarification.
          </p>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditions;
