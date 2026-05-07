"use client";
import HeroSection from "./Components/hero";
import LandingPage from "./Components/landing/LandingPage";
import StructuredData from "./Components/StructuredData";

export default function Home() {
  return (
    <div className="Page">
      <HeroSection />
      <LandingPage />
      <StructuredData type="landing" />
    </div>
  );
}
