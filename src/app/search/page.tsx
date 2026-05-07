import { SearchPage } from "@/app/Components/searchPage";
import StructuredData from "@/app/Components/StructuredData";
import type { Metadata } from 'next';

// Since SearchPage uses "use client", we need to handle metadata differently
// The layout.tsx template will handle the title
export const metadata: Metadata = {
  title: "Happy Hour Finder",
  description:
    "Filter Denver happy hours by time, neighborhood, and cuisine. Find what's open right now across 90+ verified bars and restaurants.",
  alternates: {
    canonical: "/search",
  },
};

export default function Search() {
  return (
    <div className="Page">
      <SearchPage />
      <StructuredData type="search" />
    </div>
  );
}
