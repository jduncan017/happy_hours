"use client";
import HeroSection from "./Components/hero";
import NavBar from "./Components/nav";

export default function Home() {
  return (
    <div className="Page mb-12">
              <NavBar />

      <HeroSection />
    </div>
  );
}
