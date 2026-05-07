import "./globals.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import Footer from "./Components/footer";
import { ModalProvider } from "../contexts/ModalContext";
import { UserProvider } from "../contexts/UserContext";
import { QueryProvider } from "../providers/QueryProvider";
import StructuredData from "./Components/StructuredData";
import Navbar from "./Components/nav";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

if (!process.env.NEXT_PUBLIC_BASE_URL) {
  throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
}

const siteDescription =
  "Every Denver happy hour, sorted by time, neighborhood, and what you're craving. Verified weekly. Free, no signup.";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL),
  title: {
    default: "HappyHourHunt Denver — Find Denver Happy Hours",
    template: "%s · HappyHourHunt Denver",
  },
  authors: [{ name: "Joshua Duncan" }],
  creator: "Joshua Duncan",
  publisher: "DigitalNova LLC",
  description: siteDescription,
  applicationName: "HappyHourHunt Denver",
  keywords: [
    "Denver happy hour",
    "happy hour Denver",
    "Denver bars",
    "Denver restaurants",
    "LoDo happy hour",
    "RiNo happy hour",
    "Capitol Hill happy hour",
    "drink specials Denver",
  ],
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
  category: "food and drink",
  icons: {
    icon: [
      { url: "/icons/icon-32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icons/icon-32-dark.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: [
      { url: "/apple-icon.png" },
      {
        url: "/icons/apple-icon-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "HappyHourHunt Denver",
    title: "HappyHourHunt Denver — Find Denver Happy Hours",
    description: siteDescription,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/opengraph.png`,
        width: 1200,
        height: 630,
        alt: "HappyHourHunt Denver — find the best happy hour deals in Denver",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HappyHourHunt Denver — Find Denver Happy Hours",
    description: siteDescription,
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/opengraph.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`bg-black ${inter.variable}`}>
      <body className="Body h-fit overflow-x-hidden bg-black font-sans">
        {/* Skip navigation for screen readers and keyboard users */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <QueryProvider>
          <UserProvider>
            <ModalProvider>
              <div className="Page -z-20 m-auto h-fit overflow-hidden bg-stone-100">
                <Navbar />
                <main id="main-content" tabIndex={-1}>
                  {children}
                </main>
                <Footer />
                <Analytics />
                <StructuredData />
                <Toaster
                  position="bottom-center"
                  containerStyle={{ bottom: "24px" }}
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: "#1c1917", // stone-900
                      color: "#fff9ee", // n2
                      border: "1px solid rgba(255, 249, 238, 0.1)",
                      borderRadius: "16px",
                      fontSize: "16px",
                    },
                    success: {
                      iconTheme: {
                        primary: "#ea580c", // po1
                        secondary: "#fff9ee", // n2
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: "#dc2626", // pr1
                        secondary: "#fff9ee", // n2
                      },
                    },
                  }}
                />
              </div>
            </ModalProvider>
          </UserProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
