import Link from "next/link";
import type { Metadata } from "next";
import SiteButton from "./Components/SmallComponents/siteButton";
import { Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "We couldn't find that page. Try searching for a happy hour instead.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="NotFoundPage min-h-[calc(100vh-200px)] bg-stone-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-po1/10">
          <Compass className="w-8 h-8 text-po1" aria-hidden="true" />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold tracking-wider uppercase text-po1">
            404
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 leading-tight">
            Wrong turn.
          </h1>
          <p className="text-stone-600 text-lg">
            That page doesn&apos;t exist — but happy hour does. Pick where to
            go from here.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/search">
            <SiteButton text="Find a happy hour" variant="orange" size="lg" />
          </Link>
          <Link href="/">
            <SiteButton text="Back home" variant="white" size="lg" />
          </Link>
        </div>

        <p className="text-sm text-stone-500 pt-4">
          Think this is a bug?{" "}
          <Link
            href="/contact"
            className="text-po1 hover:underline font-medium"
          >
            Let us know
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
