import Script from "next/script";

interface StructuredDataProps {
  type?: "website" | "search" | "landing";
}

interface FaqEntry {
  question: string;
  answer: string;
}

const landingFaqEntries: FaqEntry[] = [
  {
    question: "How do you keep this current?",
    answer:
      "We verify happy hour times against each restaurant's website weekly, and Denverites can flag stale info from any listing.",
  },
  {
    question: "Why isn't my favorite spot listed?",
    answer:
      "We add restaurants on request. Submit one through the contact form — if it has a real, recurring happy hour, it'll show up after a quick review.",
  },
  {
    question: "Do happy hours really change that often?",
    answer:
      "More than you'd think. Times shift seasonally, deals get rotated, and pandemic-era schedules linger online. Each card shows when we last checked.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No — search and browse without one. An account just lets you save favorites so you don't have to re-find them.",
  },
];

export default function StructuredData({
  type = "website",
}: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  // Always-included: site identity + the search-action that lets Google
  // surface our /search page directly in their search box.
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "HappyHourHunt Denver",
    alternateName: "Happy Hour Hunt Denver",
    description:
      "Every Denver happy hour, sorted by time and neighborhood. Verified weekly.",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?query={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "DigitalNova LLC",
      url: baseUrl,
    },
    inLanguage: "en-US",
  };

  // Organization rather than LocalBusiness — we're a directory, not a
  // single brick-and-mortar venue. LocalBusiness would mislead Google
  // into looking for hours/address/phone we don't have.
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HappyHourHunt Denver",
    description: "A directory of Denver happy hour deals.",
    url: baseUrl,
    logo: `${baseUrl}/h3-logo-full.png`,
    areaServed: {
      "@type": "City",
      name: "Denver",
      addressRegion: "CO",
      addressCountry: "US",
    },
    knowsAbout: [
      "Denver happy hour",
      "Denver restaurants",
      "Denver bars",
      "LoDo",
      "RiNo",
      "Capitol Hill",
      "LoHi",
      "Cherry Creek",
    ],
  };

  // Search-page breadcrumb helps Google build the breadcrumb trail.
  const breadcrumbSchema =
    type === "search"
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: baseUrl,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Search",
              item: `${baseUrl}/search`,
            },
          ],
        }
      : null;

  // Landing-only: FAQ rich result. Eligible for People-Also-Ask boxes.
  const faqSchema =
    type === "landing"
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: landingFaqEntries.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer,
            },
          })),
        }
      : null;

  const combined = [
    websiteSchema,
    organizationSchema,
    breadcrumbSchema,
    faqSchema,
  ].filter(Boolean);

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(combined) }}
    />
  );
}
