import React from "react";
import { BrandsScroller } from "@/components/landingPage/BrandsScroller";
import { Footer } from "@/components/landingPage/Footer";
import { Header } from "@/components/landingPage/Header";
import { HeaderNav } from "@/components/landingPage/HeaderNav";
import { Services } from "@/components/landingPage/Services";
import { TopBarContactUs } from "@/components/landingPage/TopBarContactUs";
import { ToursAndTrips } from "@/components/landingPage/ToursAndTrips";
import ReviewsCarousel from "@/components/landingPage/ReviewsCarousel";
import { StatSection } from "@/components/landingPage/StatSection";

export const LandingPage = () => {
  return (
    <div className="w-full h-screen box-border">
      <TopBarContactUs />
      {/* show nav only on small devices and keep it outside Header */}
      <div className="block lg:hidden">
        <HeaderNav />
      </div>
      <Header />
      <Services />
      <ToursAndTrips />
      <BrandsScroller />
      <ReviewsCarousel />
      <StatSection />
      <Footer />
    </div>
  );
};
