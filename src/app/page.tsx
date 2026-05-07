import HeroSection from "./Components/hero";
import LandingPage from "./Components/landing/LandingPage";
import StructuredData from "./Components/StructuredData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Denver Happy Hour Guide",
  description:
    "Every Denver happy hour, sorted by time and neighborhood. Verified weekly. Browse 90+ Denver bars and restaurants with current happy hour deals.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <div className="Page">
      <HeroSection />
      <LandingPage />
      <StructuredData type="landing" />
    </div>
  );
}
