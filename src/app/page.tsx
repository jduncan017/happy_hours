"use client";
import HeroSection from "./Components/hero";
import SearchPage from "./Components/searchPage";

export default function Home() {
  return (
    <div className="Page mb-12">
      <HeroSection />
      <SearchPage />
    </div>
  );
}
