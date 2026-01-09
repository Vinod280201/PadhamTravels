import React from "react";
import MainNavbar from "@/components/layout/MainNavbar";
import { BrandsScroller } from "@/components/landingPage/BrandsScroller";
import { Footer } from "@/components/landingPage/Footer";
import { Services } from "@/components/landingPage/Services";
import { ToursAndTrips } from "@/components/landingPage/ToursAndTrips";
import { HeaderHome } from "@/components/landingPage/HeaderHome";
import ReviewsCarousel from "@/components/landingPage/ReviewsCarousel";
import { StatSection } from "@/components/landingPage/StatSection";

export const HomePage = () => {
  return (
    <div className="mt-0 w-full min-h-screen box-border">
      <MainNavbar />
      <HeaderHome />
      <Services />
      <ToursAndTrips />
      <BrandsScroller />
      <ReviewsCarousel />
      <StatSection />
      <Footer />
    </div>
  );
};
