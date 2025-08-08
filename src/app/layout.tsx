import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Footer from "./Components/footer";
import { ModalProvider } from "../contexts/ModalContext";
import { QueryProvider } from "../providers/QueryProvider";
import StructuredData from "./Components/StructuredData";

if (!process.env.NEXT_PUBLIC_BASE_URL) {
  throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
}

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL),
  title: {
    default: "HappyHourHunt Denver | Find Denver Happy Hours",
    template: "%s | HappyHourHunt Denver",
  },
  // Note: Meta keywords are ignored by modern search engines
  authors: [{ name: "Joshua Duncan" }],
  creator: "Joshua Duncan",
  publisher: "DigitalNova LLC",
  description:
    "Find the best happy hour deals in Denver! Search 90+ restaurants and bars by location, time, and cuisine. Currently featuring downtown, LoDo, RiNo, and Capitol Hill locations.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: 'your-google-verification-code', // Add when you set up Google Search Console
  },
  category: "food and drink",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "Happy Hour Hunt Denver",
    title: "Happy Hour Hunt Denver | Find Happy Hours & Drink Specials",
    description:
      "Find the best happy hour deals in Denver! Search 90+ restaurants and bars by location, time, and cuisine. Downtown, LoDo, RiNo, Capitol Hill & more.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/opengraph.png`,
        width: 1200,
        height: 630,
        alt: "Happy Hour Hunt Denver - Find the best happy hour deals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Happy Hour Hunt Denver | Find Happy Hours & Drink Specials",
    description:
      "Find the best happy hour deals in Denver! Search 90+ restaurants and bars by location, time, and cuisine.",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/opengraph.png`],
    creator: "@your_twitter_handle", // Add your Twitter handle
  },
  other: {
    "google-site-verification": "pending", // Add when you set up Google Search Console
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="Body h-fit overflow-x-hidden bg-black">
        {/* Skip navigation for screen readers and keyboard users */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <QueryProvider>
          <ModalProvider>
            <div className="Page -z-20 m-auto h-fit overflow-hidden bg-stone-100">
              <main id="main-content" tabIndex={-1}>
                {children}
              </main>
              <Footer />
              <Analytics />
              <StructuredData />
            </div>
          </ModalProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
