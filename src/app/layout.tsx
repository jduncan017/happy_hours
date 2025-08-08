import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

import NavBar from "./Components/nav";
import Footer from "./Components/footer";
import { ModalProvider } from "../contexts/ModalContext";
import { QueryProvider } from "../providers/QueryProvider";

if (!process.env.NEXT_PUBLIC_BASE_URL) {
  throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
}

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL),
  title: "Denver Happy Hours!",
  keywords:
    "Denver happy hours, happy hour deals, Denver bars, Denver restaurants, happy hour specials, Denver nightlife, community events, local happy hours",
  authors: { name: "Joshua Duncan" },
  creator: "Joshua Duncan",
  publisher: "WebSavvy, LLC",
  description:
    "Discover the best happy hour deals in Denver! Currently in Beta.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/opengraph.png`,
        width: 1200,
        height: 630,
      },
    ],
    title: "Denver Happy Hours!",
    description:
      "Discover the best happy hour deals in Denver! Currently in Beta.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    locale: "en_US",
    type: "website",
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
            </div>
          </ModalProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
