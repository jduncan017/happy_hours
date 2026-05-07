"use client";

import Link from "next/link";
import CardWrapper from "../SmallComponents/CardWrapper";
import SiteButton from "../SmallComponents/siteButton";
import { FAQSection, FAQItem } from "../contact/ContactFAQ";
import {
  MapPin,
  Clock,
  Filter,
  Heart,
  Search,
  CheckCircle,
} from "lucide-react";

const landingFAQs: FAQItem[] = [
  {
    question: "How do you keep this current?",
    answer:
      "We verify happy hour times against each restaurant's website weekly, and Denverites can flag stale info from any listing. Restaurants change their hours — we keep up.",
  },
  {
    question: "Why isn't my favorite spot listed?",
    answer:
      "We add restaurants on request. Submit one through the contact form — if it has a real, recurring happy hour, it'll show up after a quick review.",
  },
  {
    question: "Do happy hours really change that often?",
    answer:
      "More than you'd think. Times shift seasonally, deals get rotated, and pandemic-era schedules linger online. Each card shows when we last checked, so you know what to trust.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No — search and browse without one. An account just lets you save favorites so you don't have to re-find them.",
  },
];

function SectionDivider() {
  return (
    <div className="flex justify-center">
      <div className="h-px w-[90%] bg-gray-300"></div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="pageContent flex flex-col lg:gap-20 md:gap-16 gap-10 px-0 lg:pt-20 md:pt-10 pt-6 bg-stone-50">
      {/* Intro */}
      <section className="IntroSection lg:px-20 md:px-10 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
            Denver happy hours, sorted.
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Filter every Denver happy hour by what&apos;s running right now,
            or what&apos;ll be running when you want to go. Verified weekly.
            Free, no signup, no markup.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link href="/search">
              <SiteButton text="Find a happy hour" variant="orange" size="lg" />
            </Link>
            <Link href="/submit">
              <SiteButton text="Submit a spot" variant="white" size="lg" />
            </Link>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* How It Works */}
      <section className="py-12 lg:px-20 md:px-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-10">
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                How it works
              </h2>
              <p className="text-base text-gray-600 max-w-xl mx-auto">
                Three steps. No app. No account.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Step
                number={1}
                icon={<Search className="w-6 h-6 text-po1" />}
                title="Search"
                description="Pick a neighborhood or a time you want to go."
              />
              <Step
                number={2}
                icon={<Filter className="w-6 h-6 text-po1" />}
                title="Filter"
                description="Narrow by cuisine, price, or what's running right now."
              />
              <Step
                number={3}
                icon={<MapPin className="w-6 h-6 text-po1" />}
                title="Go"
                description="Tap directions, head out, save the markup for your next round."
              />
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* What you get */}
      <section className="py-12 lg:px-20 md:px-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-10">
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                Made for planning, not browsing.
              </h2>
              <p className="text-base text-gray-600 max-w-xl mx-auto">
                Most listing sites bury the useful stuff under reviews and
                ads. Here&apos;s what you get instead.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              <FeatureCard
                icon={<Clock className="w-5 h-5 text-po1" />}
                title="Real schedules"
                description="See the exact days and times happy hour runs at each spot."
              />
              <FeatureCard
                icon={<MapPin className="w-5 h-5 text-po1" />}
                title="Map view"
                description="Every result, plotted, so you can see what's near where you'll be."
              />
              <FeatureCard
                icon={<Heart className="w-5 h-5 text-po1" />}
                title="Save favorites"
                description="Build a quick-access list of your reliable spots."
              />
              <FeatureCard
                icon={<CheckCircle className="w-5 h-5 text-po1" />}
                title="Verified weekly"
                description="We re-check every listing against the restaurant's site so you don't show up to outdated deals."
              />
              <FeatureCard
                icon={<Filter className="w-5 h-5 text-po1" />}
                title="Useful filters"
                description="Time, area, cuisine — the dimensions that actually narrow your decision."
              />
              <FeatureCard
                icon={<Search className="w-5 h-5 text-po1" />}
                title="Search what matters"
                description="Find by name, neighborhood, or what's served. No SEO sludge in the way."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950">
        <div className="max-w-4xl mx-auto lg:px-20 md:px-10 px-4">
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-po1">
              Find tonight&apos;s spot.
            </h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              Pick a time, pick a neighborhood, head out.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/search">
                <SiteButton text="Browse happy hours" variant="orange" size="lg" />
              </Link>
              <Link href="/auth/signup">
                <SiteButton text="Save favorites" variant="outline" size="lg" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* FAQ */}
      <section className="py-12 lg:px-20 md:px-10 px-4">
        <div className="max-w-3xl mx-auto">
          <FAQSection
            title="Common questions"
            subtitle="Quick answers before you click around."
            faqs={landingFAQs}
          />
        </div>
      </section>
    </div>
  );
}

function Step({
  number,
  icon,
  title,
  description,
}: {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center space-y-3">
      <div className="relative w-14 h-14 mx-auto">
        <div className="absolute inset-0 bg-po1/10 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-po1 text-white rounded-full flex items-center justify-center text-xs font-bold shadow">
          {number}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600 text-sm max-w-xs mx-auto">{description}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <CardWrapper className="p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 shrink-0 rounded-lg bg-po1/10 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </CardWrapper>
  );
}
