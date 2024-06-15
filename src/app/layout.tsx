import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

import NavBar from "./Components/nav";
import Footer from "./Components/footer";
import { ModalProvider } from "../contexts/ModalContext";

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
    "Discover the best happy hour deals in Denver! Join the community to suggest and confirm happy hours, and explore the top spots for drinks and fun.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    images: {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/opengraph.png`,
      width: 1903,
      height: 997,
    },
    title: "Denver Happy Hours!",
    description:
      "Discover the best happy hour deals in Denver! Join the community to suggest and confirm happy hours, and explore the top spots for drinks and fun.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    locale: "en_US",
    type: "website",
    logo: "",
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
        <ModalProvider>
          <div className="Page -z-20 m-auto h-fit max-w-[1728px] overflow-hidden bg-stone-100">
            <NavBar />
            {children}
            <Footer />
            <Analytics />
          </div>
        </ModalProvider>
      </body>
    </html>
  );
}
