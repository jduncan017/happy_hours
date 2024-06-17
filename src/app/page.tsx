"use client";
import HeroSection from "./Components/hero";
import { SearchPage } from "./Components/searchPage";
import { useRef } from "react";

export default function Home() {
  const searchRef = useRef(null);

  function scrollToRef(ref: React.RefObject<HTMLDivElement>) {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="Page mb-12">
      <HeroSection scrollToRef={() => scrollToRef(searchRef)} />
      <SearchPage ref={searchRef} />
    </div>
  );
}
