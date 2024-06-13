import "./globals.css";
// import { Analytics } from "@vercel/analytics/react";

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
    "brainspotting, holistic healing, holistic wellness, energy medicine, intuitive healing, integrative medicine, life coaching, transitions, grief, transformation, Oklahoma holistic healing, nationwide services",
  authors: { name: "Joshua Duncan" },
  creator: "Joshua Duncan",
  publisher: "WebSavvy, LLC",
  description:
    "Energy medicine, intuitive healing, and life coaching to help you clear limiting beliefs and create the life you want.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    images: {
      url: "/opengraph.webp",
      width: 1903,
      height: 997,
    },
    title: "LifeGuide Holistic Healing",
    description:
      "Energy medicine, intuitive healing, and life coaching to help you clear limiting beliefs and create the life you want.",
    url: "/",
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
      <body className="Body h-fit overflow-x-hidden bg-gray-700">
        <ModalProvider>
          <div className="Page -z-20 m-auto h-fit max-w-[1728px] overflow-hidden bg-gradient-to-b from-neutralLight to-neutralDark">
            <NavBar />
            {children}
            <Footer />
            {/* <Analytics /> */}
          </div>
        </ModalProvider>
      </body>
    </html>
  );
}
