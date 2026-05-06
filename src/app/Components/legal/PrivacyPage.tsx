import Link from "next/link";
import MaxWidthContainer from "../Layout/MaxWidthContainer";
import CardWrapper from "../SmallComponents/CardWrapper";
import { Shield } from "lucide-react";

const lastUpdated = "May 6, 2026";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-stone-50 sm:p-20 p-6 flex flex-col items-center">
      <MaxWidthContainer className="py-8 space-y-10 text-left">
        <div className="max-w-3xl mx-auto space-y-10">
          <header className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-po1/10 rounded-2xl mb-2">
              <Shield className="w-8 h-8 text-po1" aria-hidden="true" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated}
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              HappyHourHunt Denver (&quot;we&quot;, &quot;us&quot;) helps people find
              happy hour deals in Denver, Colorado. This page explains what we
              collect, why, and how to control it.
            </p>
          </header>

          <CardWrapper padding="lg" className="space-y-8 text-gray-800">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Information we collect
              </h2>
              <p>
                <strong>Account data.</strong> If you create an account, we store
                the email address, password hash, and any profile fields you
                provide (display name, avatar, location preference). Auth is
                handled by Supabase.
              </p>
              <p>
                <strong>Content you submit.</strong> Restaurant submissions,
                reviews, ratings, edit suggestions, and contact-form messages
                are stored so we can review and publish them.
              </p>
              <p>
                <strong>Location.</strong> If you grant browser geolocation, we
                use your coordinates only to sort restaurants by distance in
                your current session. We do not store your location on our
                servers.
              </p>
              <p>
                <strong>Usage analytics.</strong> We use Vercel Analytics for
                aggregate, privacy-friendly traffic stats (page views, referrers,
                approximate region). It does not use cookies or fingerprinting,
                and we do not receive personally identifying data from it.
              </p>
              <p>
                <strong>Server logs.</strong> Our hosting provider logs IP
                addresses, user agents, and request paths for security and
                debugging. These rotate on a short retention window.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                How we use information
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To run the site &mdash; show listings, save your account,
                  process submissions and reviews.</li>
                <li>To prevent abuse and spam.</li>
                <li>To respond to messages you send us.</li>
                <li>To improve the product (which features people use, what
                  breaks).</li>
              </ul>
              <p>
                We do not sell personal information. We do not run third-party
                advertising on the site.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Third-party services
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Supabase</strong> &mdash; database, authentication, and
                  file storage.
                </li>
                <li>
                  <strong>Vercel</strong> &mdash; hosting and analytics.
                </li>
                <li>
                  <strong>Google Maps Platform</strong> &mdash; map tiles,
                  geocoding, and directions. Subject to Google&apos;s privacy
                  policy.
                </li>
                <li>
                  <strong>Formspark</strong> &mdash; processes contact-form
                  submissions.
                </li>
                <li>
                  <strong>Restaurant websites</strong> &mdash; we fetch the Open
                  Graph image and metadata from each restaurant&apos;s public
                  website to display a thumbnail.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Cookies and local storage
              </h2>
              <p>
                We use a small number of essential cookies and browser storage
                items: a session cookie to keep you signed in, and local storage
                to remember your filter preferences. We do not use advertising
                or cross-site tracking cookies.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Your choices
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You can browse without an account.</li>
                <li>You can edit or delete profile data from your profile
                  page.</li>
                <li>You can request account deletion by emailing us via the
                  contact page; we will delete your account and personal data
                  within 30 days, except where retention is required by law.</li>
                <li>You can deny location access at any time in your browser
                  settings.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">Children</h2>
              <p>
                The site is not directed at children under 13, and we do not
                knowingly collect data from them.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">Changes</h2>
              <p>
                We may update this policy as the site evolves. We&apos;ll bump
                the &quot;last updated&quot; date above and, for material
                changes, surface a notice on the site.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">Contact</h2>
              <p>
                Questions or requests? Reach us through the{" "}
                <Link
                  href="/contact"
                  className="text-po1 underline hover:text-po1/80"
                >
                  contact page
                </Link>
                .
              </p>
            </section>
          </CardWrapper>
        </div>
      </MaxWidthContainer>
    </div>
  );
}
