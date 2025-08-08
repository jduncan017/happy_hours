import Script from 'next/script';

interface StructuredDataProps {
  type?: 'website' | 'search';
}

export default function StructuredData({ type = 'website' }: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Happy Hour Hunt Denver",
    "description": "Find the best happy hour deals in Denver! Search 90+ restaurants and bars by location, time, and cuisine.",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?query={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "author": {
      "@type": "Person",
      "name": "Joshua Duncan"
    },
    "publisher": {
      "@type": "Organization",
      "name": "DigitalNova LLC"
    },
    "inLanguage": "en-US",
    "copyrightYear": new Date().getFullYear(),
    "genre": ["Food & Drink", "Nightlife", "Local Business"]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Happy Hour Hunt Denver",
    "description": "Your guide to Denver's best happy hour deals and drink specials",
    "url": baseUrl,
    "areaServed": {
      "@type": "City",
      "name": "Denver",
      "addressRegion": "CO",
      "addressCountry": "US"
    },
    "serviceType": "Restaurant and Bar Directory",
    "category": ["Food & Drink Guide", "Nightlife Directory"],
    "knowsAbout": [
      "Denver Happy Hours",
      "Restaurant Deals",
      "Bar Specials",
      "Downtown Denver Dining",
      "LoDo Bars",
      "RiNo Restaurants",
      "Capitol Hill Nightlife"
    ]
  };

  const breadcrumbSchema = type === 'search' ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem", 
        "position": 2,
        "name": "Search Happy Hours",
        "item": `${baseUrl}/search`
      }
    ]
  } : null;

  const combinedSchema = breadcrumbSchema 
    ? [websiteSchema, localBusinessSchema, breadcrumbSchema]
    : [websiteSchema, localBusinessSchema];

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(combinedSchema)
      }}
    />
  );
}