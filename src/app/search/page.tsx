import { SearchPage } from "@/app/Components/searchPage";
import StructuredData from "@/app/Components/StructuredData";
import type { Metadata } from 'next';

// Since SearchPage uses "use client", we need to handle metadata differently
// The layout.tsx template will handle the title
export const metadata: Metadata = {
  title: "Search Happy Hours",
  description:
    "Search and filter Denver's best happy hour deals. Find restaurants and bars by current time, today's specials, location, and cuisine type. 90+ venues to explore!",
  alternates: {
    canonical: '/search',
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
