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
  Star,
  Map,
  Smartphone,
  Bell,
  DollarSign,
  Search,
  PartyPopper,
  Zap,
  Users,
  Building2,
  Sparkles,
  CheckCircle,
} from "lucide-react";

const landingFAQs: FAQItem[] = [
  {
    question: "Is HappyHourHunt really free?",
    answer:
      "Yes! HappyHourHunt is completely free to use. No hidden fees, no subscriptions, no catches. Our mission is to help everyone discover great happy hour deals in Denver.",
  },
  {
    question: "How do you keep the information current?",
    answer:
      "We verify deals through restaurant websites, direct contact with establishments, and community feedback. Our team regularly updates listings, and we encourage users to report any changes they notice.",
  },
  {
    question: "Can I suggest restaurants that aren&apos;t listed?",
    answer:
      "Absolutely! We love community suggestions. Use our restaurant submission form to add new spots, and we&apos;ll review and add qualifying restaurants with active happy hour deals.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "You can browse and search without an account, but creating a free account lets you save favorite restaurants, leave reviews, and get personalized recommendations.",
  },
  {
    question: "What areas of Denver do you cover?",
    answer:
      "We cover the entire Denver metropolitan area including downtown, Capitol Hill, RiNo, LoHi, Cherry Creek, and surrounding neighborhoods. We&apos;re always expanding to new areas.",
  },
];

// Section Divider Component
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
      {/* Value Proposition Section */}
      <section className="IntroSection">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Never Miss Happy Hour Again
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover amazing deals, save money, and explore Denver&apos;s best
                restaurants and bars - all in one place
              </p>
            </div>

            {/* Three Pillars */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <CardWrapper className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Save Money
                </h3>
                <p className="text-gray-600">
                  Find the best deals in your neighborhood and stretch your
                  dining budget further
                </p>
              </CardWrapper>

              <CardWrapper className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Save Time
                </h3>
                <p className="text-gray-600">
                  Real-time updates so you never show up to expired deals or
                  call outdated numbers
                </p>
              </CardWrapper>

              <CardWrapper className="p-6 text-center">
                <div className="w-12 h-12 bg-po1/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-po1" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Discover
                </h3>
                <p className="text-gray-600">
                  Explore hidden gems and neighborhood favorites you never knew
                  existed
                </p>
              </CardWrapper>
            </div>

            {/* Imagery Placeholder */}
            {/* <div className="mt-12">
              <Image
                src="/photo-missing.jpg"
                alt="People enjoying happy hour in Denver"
                width={800}
                height={400}
                className="rounded-2xl mx-auto shadow-lg"
              />
              <p className="text-sm text-gray-500 mt-2">*Add hero image: Denver happy hour scene*</p>
            </div> */}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* How It Works Section */}
      <section className="py-16 lg:px-20 md:px-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Three Simple Steps to Your Perfect Happy Hour
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Finding your next great deal has never been easier
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-po1/10 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-po1" />
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-po1 text-white rounded-full flex items-center justify-center mx-auto text-sm font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Search
                  </h3>
                  <p className="text-gray-600">
                    Enter your location or browse by neighborhood to find nearby
                    happy hours
                  </p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-py1/10 rounded-full flex items-center justify-center mx-auto">
                  <Filter className="w-8 h-8 text-py1" />
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-py1 text-white rounded-full flex items-center justify-center mx-auto text-sm font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Filter
                  </h3>
                  <p className="text-gray-600">
                    Find exactly what you&apos;re craving with smart filters for
                    cuisine, price, and more
                  </p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <PartyPopper className="w-8 h-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto text-sm font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Enjoy</h3>
                  <p className="text-gray-600">
                    Show up and save with verified, up-to-date deals from
                    Denver&apos;s best spots
                  </p>
                </div>
              </div>
            </div>

            {/* Imagery Placeholder */}
            {/* <div className="mt-12">
              <Image
                src="/photo-missing.jpg"
                alt="Step-by-step happy hour discovery process"
                width={600}
                height={300}
                className="rounded-2xl mx-auto"
              />
              <p className="text-sm text-gray-500 mt-2">*Add process image: Screenshots or illustrated workflow*</p>
            </div> */}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Features Showcase */}
      <section className="py-16 lg:px-20 md:px-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Everything You Need to Find Your Perfect Spot
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Save your favorite restaurants, see who has happy hour when
                you&apos;re planning to dine out, leave reviews, and quickly view
                happy hours around Denver
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Heart className="w-6 h-6 text-red-500" />}
                title="Save Favorites"
                description="Bookmark your go-to spots and build your personal happy hour collection"
              />

              <FeatureCard
                icon={<Clock className="w-6 h-6 text-blue-500" />}
                title="Real-Time Schedules"
                description="See exactly when happy hour is happening at any restaurant, any day"
              />

              <FeatureCard
                icon={<Star className="w-6 h-6 text-yellow-500" />}
                title="Leave Reviews"
                description="Share your experiences and help other happy hour hunters discover great spots"
              />

              <FeatureCard
                icon={<Map className="w-6 h-6 text-green-500" />}
                title="Interactive Map"
                description="Visualize all nearby deals and explore new neighborhoods"
              />

              <FeatureCard
                icon={<Filter className="w-6 h-6 text-purple-500" />}
                title="Smart Filters"
                description="Find exactly what you want by cuisine, price range, area, and deal type"
              />

              <FeatureCard
                icon={<Smartphone className="w-6 h-6 text-indigo-500" />}
                title="Mobile Optimized"
                description="Perfect for discovering deals on the go, wherever you are in Denver"
              />
            </div>

            {/* Imagery Placeholder */}
            {/* <div className="mt-12">
              <Image
                src="/photo-missing.jpg"
                alt="HappyHourHunt app features showcase"
                width={800}
                height={500}
                className="rounded-2xl mx-auto shadow-lg"
              />
              <p className="text-sm text-gray-500 mt-2">*Add features image: App screenshots or mockups*</p>
            </div> */}
          </div>
        </div>
      </section>

      {/* CTA Section 1 */}
      <section className="py-16 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950">
        <div className="max-w-6xl mx-auto lg:px-20 md:px-10 px-4">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-po1">
                Ready to Start Saving?
              </h2>
              <p className="text-white/90 text-lg max-w-2xl mx-auto">
                Join thousands of Denver locals discovering the best happy hour
                deals in the city
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search">
                <SiteButton
                  text="Start Finding Deals"
                  variant="orange"
                  size="lg"
                />
              </Link>
              <Link href="/auth">
                <SiteButton
                  text="Create Free Account"
                  variant="outline"
                  size="lg"
                />
              </Link>
            </div>
            <p className="text-white/70 text-sm">
              No account required to start browsing • Create account to save
              favorites and leave reviews
            </p>
          </div>
        </div>
      </section>

      {/* Future Vision Section - Beta */}
      <section className="py-16 lg:px-20 md:px-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-12">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-py1/10 text-py1 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Currently in Beta
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Exciting Features Coming Soon
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We&apos;re just getting started! Here&apos;s what&apos;s coming to make your
                happy hour discovery even better
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FutureFeatureCard
                icon={<Bell className="w-6 h-6 text-orange-500" />}
                title="Personalized Alerts"
                description="Get notified when your favorite restaurants add new deals or when happy hour starts"
              />

              <FutureFeatureCard
                icon={<Zap className="w-6 h-6 text-yellow-500" />}
                title="AI Recommendations"
                description="Smart suggestions based on your preferences, location, and dining history"
              />

              <FutureFeatureCard
                icon={<Building2 className="w-6 h-6 text-blue-500" />}
                title="Restaurant Partnerships"
                description="Direct integration with restaurants for instant updates and exclusive member deals"
              />

              <FutureFeatureCard
                icon={<Users className="w-6 h-6 text-green-500" />}
                title="Social Features"
                description="Follow friends, share photos, and see what other happy hour enthusiasts recommend"
              />

              <FutureFeatureCard
                icon={<Star className="w-6 h-6 text-purple-500" />}
                title="Exclusive Deals"
                description="Member-only offers and early access to special events at partner restaurants"
              />

              <FutureFeatureCard
                icon={<MapPin className="w-6 h-6 text-red-500" />}
                title="Multi-City Expansion"
                description="Bringing HappyHourHunt to cities across Colorado and beyond"
              />
            </div>

            {/* Imagery Placeholder */}
            {/* <div className="mt-12">
              <Image
                src="/photo-missing.jpg"
                alt="Future vision of HappyHourHunt platform"
                width={700}
                height={400}
                className="rounded-2xl mx-auto"
              />
              <p className="text-sm text-gray-500 mt-2">*Add roadmap image: Future features visualization*</p>
            </div> */}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Trust & Safety Section */}
      <section className="py-16 bg-stone-50 lg:px-20 md:px-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Verified. Accurate. Trustworthy.
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We take data accuracy seriously so you can trust every deal you
                find
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <TrustCard
                icon={<CheckCircle className="w-6 h-6 text-green-500" />}
                title="Verified Information"
                description="Every restaurant and deal is verified through multiple sources"
              />

              <TrustCard
                icon={<Users className="w-6 h-6 text-blue-500" />}
                title="Community Driven"
                description="Real feedback from Denver locals keeps our information current"
              />

              <TrustCard
                icon={<Zap className="w-6 h-6 text-yellow-500" />}
                title="Regular Updates"
                description="Our team continuously monitors and updates restaurant information"
              />

              <TrustCard
                icon={<Building2 className="w-6 h-6 text-purple-500" />}
                title="Restaurant Partnerships"
                description="Direct relationships with restaurants ensure accuracy and special deals"
              />
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* FAQ Section */}
      <section className="py-16 lg:px-20 md:px-10 px-4">
        <div className="max-w-6xl mx-auto">
          <FAQSection
            title="Quick Answers"
            subtitle="Everything you need to know to get started"
            faqs={landingFAQs}
          />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950">
        <div className="max-w-6xl mx-auto lg:px-20 md:px-10 px-4">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-po1">
                Ready to Discover Denver&apos;s Best Happy Hours?
              </h2>
              <p className="text-white/90 text-lg max-w-2xl mx-auto">
                Join the community of Denver happy hour enthusiasts. It&apos;s
                completely free and always will be.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search">
                <SiteButton
                  text="Start Exploring Now"
                  variant="orange"
                  size="lg"
                />
              </Link>
              <Link href="/submit">
                <SiteButton
                  text="Add Your Restaurant"
                  variant="outline"
                  size="lg"
                />
              </Link>
            </div>

            <p className="text-white/70 text-sm">
              No account required to start browsing • Create account to save
              favorites and leave reviews
            </p>

            {/* Imagery Placeholder */}
            {/* <div className="mt-12">
              <Image
                src="/photo-missing.jpg"
                alt="Denver happy hour community"
                width={600}
                height={300}
                className="rounded-2xl mx-auto opacity-90"
              />
              <p className="text-white/60 text-sm mt-2">*Add community image: People enjoying Denver happy hours*</p>
            </div> */}
          </div>
        </div>
      </section>
    </div>
  );
}

// Feature Card Component
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
    <CardWrapper className="p-6 text-center hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 bg-gray-50">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </CardWrapper>
  );
}

// Future Feature Card Component
function FutureFeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <CardWrapper className="p-6 text-center border-dashed border-2 border-gray-200 hover:border-po1/30 transition-colors">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 bg-gray-50">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
      <div className="mt-3">
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-py1/10 text-py1">
          Coming Soon
        </span>
      </div>
    </CardWrapper>
  );
}

// Trust Card Component
function TrustCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center space-y-3">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto bg-white border border-gray-200">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
