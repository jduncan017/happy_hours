"use client";

import MaxWidthContainer from "../Layout/MaxWidthContainer";
import CardWrapper from "../SmallComponents/CardWrapper";
import ContactForm from "./ContactForm";
import ContactFAQ from "./ContactFAQ";
import {
  MessageCircle,
  Mail,
  Clock,
  Users,
  Building2,
  Settings,
  HelpCircle,
  Star,
  AlertTriangle,
  Lightbulb,
  HeadphonesIcon,
} from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-stone-50 sm:p-20 p-6 flex flex-col items-center">
      <MaxWidthContainer className="py-8 space-y-12 text-center">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-po1/10 rounded-2xl mb-6">
              <MessageCircle className="w-8 h-8 text-po1" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
              Get in touch.
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Found a missing spot, a wrong time, or just want to say hi?
              Drop us a line.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Usually respond within a day or two</span>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="grid items-center gap-8">
            {/* Contact Form */}
            <CardWrapper className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-po1/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-po1" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Send a message
                  </h2>
                  <p className="text-gray-600">
                    Real humans read these.
                  </p>
                </div>
              </div>
              <ContactForm />
            </CardWrapper>

            {/* Contact Categories */}
            {/* <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-po1" />
                How Can We Help?
              </h2>

              <div className="space-y-4">
                <ContactCategory
                  icon={<Building2 className="w-5 h-5" />}
                  title="Missing Restaurant"
                  description="Report a restaurant that should be on our list"
                />
                <ContactCategory
                  icon={<Star className="w-5 h-5" />}
                  title="Suggest New Restaurant"
                  description="Know a great happy hour spot we should add?"
                />
                <ContactCategory
                  icon={<AlertTriangle className="w-5 h-5" />}
                  title="Report Incorrect Info"
                  description="Found outdated hours or wrong details?"
                />
                <ContactCategory
                  icon={<Settings className="w-5 h-5" />}
                  title="Technical Issues"
                  description="Experiencing bugs or website problems?"
                />
                <ContactCategory
                  icon={<Lightbulb className="w-5 h-5" />}
                  title="General Feedback"
                  description="Share your thoughts about the app"
                />
                <ContactCategory
                  icon={<Users className="w-5 h-5" />}
                  title="Business Inquiries"
                  description="Partnership or collaboration opportunities"
                />
              </div>
            </div> */}
          </div>

          {/* Restaurant Owners Section */}
          <CardWrapper className="p-8 bg-gradient-to-r from-po1/5 to-py1/5 border-po1/20">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-po1/10 rounded-2xl">
                <Building2 className="w-8 h-8 text-po1" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">
                Own a restaurant?
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                Send us your happy hour details and we&apos;ll get you listed.
                If your spot is already up and the info&apos;s wrong, let us
                know — we update by hand and we&apos;re fast about it.
              </p>
            </div>
          </CardWrapper>

          {/* FAQ Section */}
          <ContactFAQ />
        </div>
      </MaxWidthContainer>
    </div>
  );
}

// Contact Category Component
function ContactCategory({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-po1/30 hover:bg-po1/5 transition-all cursor-pointer">
      <div className="w-8 h-8 bg-po1/10 rounded-lg flex items-center justify-center text-po1 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
