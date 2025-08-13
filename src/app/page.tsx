"use client";
import HeroSection from "./Components/hero";
import LandingPage from "./Components/landing/LandingPage";

export default function Home() {
  return (
    <div className="Page">
      <HeroSection />
      <LandingPage />
    </div>
  );
}
