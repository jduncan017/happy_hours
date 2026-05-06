import Link from "next/link";
import MaxWidthContainer from "../Layout/MaxWidthContainer";
import CardWrapper from "../SmallComponents/CardWrapper";
import { ScrollText } from "lucide-react";

const lastUpdated = "May 6, 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-stone-50 sm:p-20 p-6 flex flex-col items-center">
      <MaxWidthContainer className="py-8 space-y-10 text-left">
        <div className="max-w-3xl mx-auto space-y-10">
          <header className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-po1/10 rounded-2xl mb-2">
              <ScrollText className="w-8 h-8 text-po1" aria-hidden="true" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Terms of Service
            </h1>
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated}
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              By using HappyHourHunt Denver (the &quot;Service&quot;), you agree
              to these terms. If you do not agree, please do not use the
              Service.
            </p>
          </header>

          <CardWrapper padding="lg" className="space-y-8 text-gray-800">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Who we are
              </h2>
              <p>
                HappyHourHunt Denver is a free directory of happy hour deals
                operated by DigitalNova LLC. The Service is provided as-is, and
                we make no warranty that listings are complete or accurate at
                any given moment.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Accounts
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must be at least 13 years old (or the minimum age
                  required in your jurisdiction).</li>
                <li>You are responsible for keeping your password confidential
                  and for activity under your account.</li>
                <li>One person, one account. Don&apos;t impersonate others.</li>
                <li>We may suspend or remove accounts that violate these
                  terms.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Acceptable use
              </h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Submit false, misleading, or spam content (including fake
                  restaurants or reviews).</li>
                <li>Scrape, mirror, or republish the Service or its data
                  without written permission.</li>
                <li>Attempt to break, overload, or probe the Service for
                  vulnerabilities outside of a coordinated disclosure.</li>
                <li>Upload unlawful, infringing, harassing, or otherwise harmful
                  content.</li>
                <li>Use the Service to harass restaurant operators or their
                  staff.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                User-submitted content
              </h2>
              <p>
                When you submit a restaurant, review, photo, or edit suggestion,
                you grant us a non-exclusive, worldwide, royalty-free license to
                host, display, edit, and distribute that content as part of the
                Service. You represent that you have the right to grant this
                license, and that the content does not violate anyone&apos;s
                rights.
              </p>
              <p>
                We may edit, decline, or remove submissions for accuracy,
                quality, or policy reasons. We do not guarantee that submitted
                content will be published.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Restaurant information and pricing
              </h2>
              <p>
                Happy hour times, prices, and deals change. We make a good-faith
                effort to keep listings current, but you should confirm with
                the restaurant before relying on a specific deal. We are not
                responsible for stale, incorrect, or discontinued offers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Restaurant images
              </h2>
              <p>
                Thumbnail images are sourced from each restaurant&apos;s public
                Open Graph metadata (the same image their site shares to social
                media). If you operate a restaurant and want your image
                removed or replaced, contact us and we&apos;ll handle it.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Third-party services
              </h2>
              <p>
                The Service relies on third-party providers (Supabase, Vercel,
                Google Maps Platform, Formspark). Your use of features powered
                by those providers is also subject to their respective terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Disclaimers
              </h2>
              <p>
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
                AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
                IMPLIED, INCLUDING WITHOUT LIMITATION WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
                NON-INFRINGEMENT.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Limitation of liability
              </h2>
              <p>
                To the maximum extent permitted by law, DigitalNova LLC and its
                contributors are not liable for any indirect, incidental,
                special, consequential, or punitive damages, or for lost profits
                or revenues, arising out of your use of the Service. Our total
                liability for any claim relating to the Service is limited to
                the greater of $50 USD or what you paid us in the 12 months
                before the claim (which, since the Service is free, is $0).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Termination
              </h2>
              <p>
                You can stop using the Service at any time. We can suspend or
                terminate access if you violate these terms. Provisions that by
                their nature should survive termination (licenses you granted
                us, disclaimers, limitation of liability) will survive.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Governing law
              </h2>
              <p>
                These terms are governed by the laws of the State of Colorado,
                USA, without regard to its conflict-of-laws rules. Disputes
                will be resolved exclusively in the state or federal courts
                located in Denver County, Colorado.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">Changes</h2>
              <p>
                We may update these terms. Material changes will be reflected
                here with an updated date. Continued use of the Service after
                changes means you accept the revised terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">Contact</h2>
              <p>
                Questions? Reach us through the{" "}
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
